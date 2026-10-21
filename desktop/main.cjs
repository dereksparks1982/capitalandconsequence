const { app, BrowserWindow, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

app.setName('Federal Electric');

const APP_ROOT = path.resolve(__dirname, '..');
const SMOKE_TEST = process.argv.includes('--smoke-test');
let logFile = null;

function safeText(value) {
  if (value instanceof Error) return value.stack || value.message || String(value);
  if (typeof value === 'string') return value;
  try { return JSON.stringify(value); } catch (e) { return String(value); }
}

function writeLog(event, detail = '') {
  const line = new Date().toISOString() + ' [' + event + '] ' + safeText(detail) + '\n';
  try { if (logFile) fs.appendFileSync(logFile, line, 'utf8'); } catch (e) {}
  if (SMOKE_TEST) console.log(line.trim());
}

function initDiagnostics() {
  try {
    const dir = app.getPath('userData');
    fs.mkdirSync(dir, { recursive: true });
    logFile = path.join(dir, 'Federal-Electric.log');
    writeLog('startup', { version: app.getVersion(), platform: process.platform, arch: process.arch });
    writeLog('log-file', logFile);
  } catch (e) {
    console.error('FEDERAL_ELECTRIC_LOG_INIT_FAIL', e);
  }
}

process.on('uncaughtException', error => { writeLog('main-uncaught-exception', error); console.error(error); });
process.on('unhandledRejection', reason => { writeLog('main-unhandled-rejection', reason); console.error(reason); });

function isInsideApp(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'file:') return false;
    const target = path.resolve(fileURLToPath(url));
    return target === APP_ROOT || target.startsWith(APP_ROOT + path.sep);
  } catch (e) {
    return false;
  }
}

function secureWebContents(contents) {
  contents.setWindowOpenHandler(({ url }) => {
    if (isInsideApp(url)) {
      writeLog('local-window-open', url);
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          autoHideMenuBar: true,
          backgroundColor: '#111111',
          show: !SMOKE_TEST,
          webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
        }
      };
    }
    if (/^https?:\/\//i.test(url)) {
      writeLog('external-link', url);
      void shell.openExternal(url);
    } else {
      writeLog('blocked-window', url);
    }
    return { action: 'deny' };
  });

  contents.on('will-navigate', (event, url) => {
    if (isInsideApp(url)) return;
    event.preventDefault();
    if (/^https?:\/\//i.test(url)) {
      writeLog('external-navigation', url);
      void shell.openExternal(url);
    } else {
      writeLog('blocked-navigation', url);
    }
  });

  contents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    writeLog('renderer-load-failure', { errorCode, errorDescription, validatedURL, isMainFrame });
  });
  contents.on('render-process-gone', (_event, details) => writeLog('renderer-process-gone', details));
  contents.on('console-message', (_event, ...args) => {
    let level, message, line, sourceId;
    if (args.length === 1 && args[0] && typeof args[0] === 'object') {
      level=args[0].level; message=args[0].message; line=args[0].lineNumber; sourceId=args[0].sourceId;
    } else {
      [level,message,line,sourceId]=args;
    }
    const isError=level===3||level==='error'||/(?:^|\s)(?:error|uncaught|failed)(?:\s|:)/i.test(String(message||''));
    if(isError) writeLog('renderer-console-error',{level,message,line,sourceId});
  });
}

app.on('web-contents-created', (_event, contents) => secureWebContents(contents));

function waitForLoad(win) {
  return new Promise((resolve,reject) => {
    const ok=()=>{cleanup();resolve();};
    const bad=(_event,code,description,_url,isMainFrame)=>{if(!isMainFrame)return;cleanup();reject(new Error('Reload failed: '+code+' '+description));};
    const cleanup=()=>{win.webContents.removeListener('did-finish-load',ok);win.webContents.removeListener('did-fail-load',bad);};
    win.webContents.once('did-finish-load',ok);
    win.webContents.on('did-fail-load',bad);
  });
}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function runSmokeTest(win) {
  try {
    const structure=await win.webContents.executeJavaScript(`(() => ({
      title:document.title,
      city:!!window.FederalElectricCity,
      cityCount:window.FederalElectricCity?.listLocations?.().length||0,
      roomOverlay:!!document.getElementById('cityRoomOverlay'),
      mapTravel:!!document.getElementById('titleMapLocationTravel'),
      profileLabel:!!document.getElementById('activeProfileLabel')
    }))()`);
    if(structure.title!=='Federal Electric'||!structure.city||structure.cityCount<10||!structure.roomOverlay||!structure.mapTravel||!structure.profileLabel){
      throw new Error('DOM/city smoke check failed: '+JSON.stringify(structure));
    }

    await win.webContents.executeJavaScript(`localStorage.setItem('__federalElectricSmokePersistence','ok')`);
    const loaded=waitForLoad(win);
    win.reload();
    await loaded;
    const persisted=await win.webContents.executeJavaScript(`localStorage.getItem('__federalElectricSmokePersistence')`);
    if(persisted!=='ok') throw new Error('localStorage did not survive a full renderer reload');

    // Test actual map -> Go There -> room visibility and already-here guard
    // inside the packaged Electron renderer, not just existence of DOM nodes.
    // Verify the approved image is physically inside the package and its
    // actual renderer content loads. Test both keyboard routes, the X and
    // the separate left/right empty pocket containers without changing a save.
    const paperDollTest=await win.webContents.executeJavaScript(`(async () => {
      const oldProfile=localStorage.getItem('federalElectricActiveProfile');
      try{
        localStorage.setItem('federalElectricActiveProfile','__smoke-paper-doll');
        FE_PAPER_DOLL.open();
        const root=document.getElementById('fePaperDoll');
        const img=document.getElementById('fePaperDollArtwork');
        const pocket=document.getElementById('fePaperDollPocket');
        const imageReady=await new Promise(resolve=>{
          if(img.complete)return resolve(img.naturalWidth>0);
          const end=()=>resolve(img.naturalWidth>0);
          img.addEventListener('load',end,{once:true});
          img.addEventListener('error',()=>resolve(false),{once:true});
          setTimeout(()=>resolve(false),5000);
        });
        const out={imageReady,source:img.getAttribute('src'),open:!root.hidden};
        FE_PAPER_DOLL.openPocket('left');
        out.leftPocket=!pocket.hidden&&document.getElementById('fePaperDollPocketTitle').textContent==='Left Pocket';
        FE_PAPER_DOLL.openPocket('right');
        out.rightPocket=!pocket.hidden&&document.getElementById('fePaperDollPocketTitle').textContent==='Right Pocket';
        document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true,cancelable:true}));
        out.escapeClosed=root.hidden;
        document.dispatchEvent(new KeyboardEvent('keydown',{key:'p',code:'KeyP',bubbles:true,cancelable:true}));
        out.pOpens=!root.hidden;
        document.dispatchEvent(new KeyboardEvent('keydown',{key:'p',code:'KeyP',bubbles:true,cancelable:true}));
        out.pCloses=root.hidden;
        FE_PAPER_DOLL.open();
        document.getElementById('fePaperDollClose').click();
        out.xCloses=root.hidden;
        return out;
      }finally{
        FE_PAPER_DOLL.close();
        if(oldProfile===null)localStorage.removeItem('federalElectricActiveProfile');
        else localStorage.setItem('federalElectricActiveProfile',oldProfile);
      }
    })()`);
    if(!paperDollTest.imageReady||paperDollTest.source!=='assets/artwork/characters/paperdolls/paperdoll.png'||!paperDollTest.open||!paperDollTest.leftPocket||!paperDollTest.rightPocket||!paperDollTest.escapeClosed||!paperDollTest.pOpens||!paperDollTest.pCloses||!paperDollTest.xCloses){
      throw new Error('Paper doll artwork / controls smoke test failed: '+JSON.stringify(paperDollTest));
    }

    // Map key works at the office, inside a city room, and from hidden
    // gameplay. Closing it must never change the player's saved location.
    const mapKeyTest=await win.webContents.executeJavaScript(`(() => {
      const oldProfile=localStorage.getItem('federalElectricActiveProfile');
      const oldPlace=S.currentLocation?{...S.currentLocation}:null;
      const oldDeskBreak=titleScreenDeskBreak;
      const screen=document.getElementById('titleScreen');
      const room=document.getElementById('cityRoomOverlay');
      const map=document.getElementById('titleMapViewer');
      const oldScreenHidden=screen.hidden;
      const out={};
      const pressM=()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'m',code:'KeyM',bubbles:true,cancelable:true}));
      try{
        localStorage.setItem('federalElectricActiveProfile','__smoke-map-hotkey');
        closeCityRoom();closeTitleMap();screen.hidden=true;
        S.currentLocation={locationId:'factory',roomId:'executive-office'};
        pressM();
        out.openFromGame=!map.hidden;
        pressM();
        out.closeRestoresGame=map.hidden&&screen.hidden&&FE_CITY.currentLocation().locationId==='factory';
        screen.hidden=false;
        openCityRoom('home','bedroom',{source:'smoke',dev:false});
        out.atHome=FE_CITY.currentLocation().locationId==='home'&&FE_CITY.currentLocation().roomId==='bedroom';
        pressM();
        out.openFromHome=!map.hidden&&room.hidden;
        pressM();
        out.closeRestoresBedroom=map.hidden&&!room.hidden&&FE_CITY.currentLocation().roomId==='bedroom';
        returnCityRoomToOffice();
      }finally{
        closeTitleMap();closeCityRoom();screen.hidden=oldScreenHidden;
        S.currentLocation=oldPlace||{locationId:'factory',roomId:'executive-office'};
        titleScreenDeskBreak=oldDeskBreak;
        if(oldProfile===null)localStorage.removeItem('federalElectricActiveProfile');
        else localStorage.setItem('federalElectricActiveProfile',oldProfile);
        localStorage.removeItem('federalElectricProfile___smoke-map-hotkey');
      }
      return out;
    })()`);
    if(!mapKeyTest.openFromGame||!mapKeyTest.closeRestoresGame||!mapKeyTest.atHome||!mapKeyTest.openFromHome||!mapKeyTest.closeRestoresBedroom){
      throw new Error('M shortcut location regression: '+JSON.stringify(mapKeyTest));
    }

    // Check personal effects are empty by default, attached to the save,
    // and cannot be retrieved from another city location.
    const effectsTest=await win.webContents.executeJavaScript(`(() => {
      const original=S.personalEffects;
      const place=S.currentLocation?{...S.currentLocation}:null;
      const oldProfile=localStorage.getItem('federalElectricActiveProfile');
      const out={};
      try{
        localStorage.setItem('federalElectricActiveProfile','__smoke-effects');
        S.personalEffects={version:1,items:[]};
        S.currentLocation={locationId:'home',roomId:'storage'};
        out.emptyHome=FE_PERSONAL_EFFECTS.list('home-storage').length===0;
        out.canInspectHome=FE_PERSONAL_EFFECTS.isAccessible('home-storage');
        S.personalEffects.items.push({id:'__test',name:'Test Document',kind:'document',container:'home-storage'});
        out.storedAtHome=FE_PERSONAL_EFFECTS.list('home-storage').length===1;
        S.currentLocation={locationId:'home',roomId:'bedroom'};
        out.noRemoteStorage=!FE_PERSONAL_EFFECTS.isAccessible('home-storage')&&FE_PERSONAL_EFFECTS.list('home-storage').length===0;
        out.pocketsAccessible=FE_PERSONAL_EFFECTS.isAccessible('left-pocket')&&FE_PERSONAL_EFFECTS.isAccessible('right-pocket');
        out.itemRemainsInPlace=S.personalEffects.items[0].container==='home-storage';
        out.saveSchema=initial().personalEffects?.version===1&&initial().personalEffects.items.length===0;
      }finally{
        S.personalEffects=original;
        S.currentLocation=place;
        if(oldProfile===null)localStorage.removeItem('federalElectricActiveProfile');
        else localStorage.setItem('federalElectricActiveProfile',oldProfile);
      }
      return out;
    })()`);
    if(Object.entries(effectsTest).some(([,value])=>value!==true))throw new Error('Personal effects regression: '+JSON.stringify(effectsTest));

    const cityTravel=await win.webContents.executeJavaScript(`(() => {
      const room=document.getElementById('cityRoomOverlay');
      const title=document.getElementById('titleScreen');
      const map=document.getElementById('titleMapViewer');
      const go=document.getElementById('titleMapLocationTravel');
      const previousProfile=localStorage.getItem('federalElectricActiveProfile');
      const previousState=S.currentLocation ? {...S.currentLocation} : null;
      const previousDeskBreak=titleScreenDeskBreak;
      const before=window.FederalElectricCity.getLocation('oldChinatown');
      const context={hasRoom:!!before?.rooms?.length,previousProfile};
      try{
        localStorage.setItem('federalElectricActiveProfile','__smoke-navigation');
        title.hidden=false;
        openTitleMap();
        openTitleMapLocation('oldChinatown');
        context.beforeGoVisible=!go.hidden;
        travelFromTitleMap();
        context.savedLocation=window.FE_CITY.currentLocation().locationId;
        context.roomVisible=!room.hidden && getComputedStyle(room).display!=='none';
        context.roomAboveTitle=Number(getComputedStyle(room).zIndex)>Number(getComputedStyle(title).zIndex);
        context.mapClosed=map.hidden;
        returnCityRoomToMap();
        openTitleMapLocation('oldChinatown');
        context.sameLocationButtonHidden=go.hidden;
        context.mapReturned=!map.hidden;
        closeTitleMapOrReturnToLocation();
        context.mapCloseRestoresRoom=!room.hidden && window.FE_CITY.currentLocation().locationId==='oldChinatown';
        returnCityRoomToMap();
        openTitleMapLocation('russianTradeHall');
        travelFromTitleMap();
        context.secondDestination=window.FE_CITY.currentLocation().locationId;
        context.secondRoomVisible=!room.hidden && getComputedStyle(room).display!=='none';
        returnCityRoomToOffice();
        context.officeRestored=window.FE_CITY.currentLocation().locationId==='factory' && room.hidden;
      }finally{
        closeTitleMap();closeCityRoom();title.hidden=true;
        S.currentLocation=previousState||{locationId:'factory',roomId:'executive-office'};
        titleScreenDeskBreak=previousDeskBreak;
        if(previousProfile===null)localStorage.removeItem('federalElectricActiveProfile');
        else localStorage.setItem('federalElectricActiveProfile',previousProfile);
        localStorage.removeItem('federalElectricProfile___smoke-navigation');
      }
      return context;
    })()`);
    if(!cityTravel.hasRoom||!cityTravel.beforeGoVisible||cityTravel.savedLocation!=='oldChinatown'||!cityTravel.roomVisible||!cityTravel.roomAboveTitle||!cityTravel.mapClosed||!cityTravel.sameLocationButtonHidden||!cityTravel.mapReturned||!cityTravel.mapCloseRestoresRoom||cityTravel.secondDestination!=='russianTradeHall'||!cityTravel.secondRoomVisible||!cityTravel.officeRestored){
      throw new Error('Map navigation/room visibility regression: '+JSON.stringify(cityTravel));
    }

    const layout=await win.webContents.executeJavaScript(`(() => {
      const title=document.getElementById('titleScreen'); if(title) title.hidden=true;
      const day=document.querySelector('.daybar')?.getBoundingClientRect();
      const nav=document.querySelector('.primary-nav')?.getBoundingClientRect();
      return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,dayLeft:day?.left??0,dayRight:day?.right??0,navLeft:nav?.left??0,navRight:nav?.right??0};
    })()`);
    if(layout.scrollWidth>layout.viewport+4||layout.dayLeft<-2||layout.dayRight>layout.viewport+2||layout.navLeft<-2||layout.navRight>layout.viewport+2){
      throw new Error('Standalone layout overflow: '+JSON.stringify(layout));
    }

    await win.webContents.executeJavaScript(`window.open('poker.html?room=working&remaining=60','FE_SmokePoker','popup=yes,width=800,height=600,resizable=yes,scrollbars=yes'); true`);
    await sleep(800);
    const popup=BrowserWindow.getAllWindows().find(candidate=>candidate!==win&&candidate.webContents.getURL().includes('poker.html'));
    if(!popup) throw new Error('Local poker popup did not open through packaged Electron window policy');
    popup.destroy();

    await win.webContents.executeJavaScript(`localStorage.removeItem('__federalElectricSmokePersistence')`);
    writeLog('smoke-test',{result:'PASS',structure,layout,persistence:true,localPopup:true});
    console.log('FEDERAL_ELECTRIC_SMOKE_OK');
    setTimeout(()=>app.quit(),250);
  } catch(error) {
    writeLog('smoke-test',{result:'FAIL',error:safeText(error)});
    console.error('FEDERAL_ELECTRIC_SMOKE_FAIL',error);
    app.exit(1);
  }
}

function createMainWindow() {
  const win=new BrowserWindow({
    title:'Federal Electric',width:1440,height:900,minWidth:1100,minHeight:720,
    backgroundColor:'#111111',autoHideMenuBar:true,show:false,
    webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}
  });

  win.once('ready-to-show',()=>{if(!SMOKE_TEST)win.show();});
  win.webContents.once('did-finish-load',()=>{
    writeLog('main-window-loaded',win.webContents.getURL());
    if(SMOKE_TEST)void runSmokeTest(win);
  });
  void win.loadFile(path.join(APP_ROOT,'index.html')).catch(error=>{
    writeLog('main-window-load-failure',error);
    console.error('FEDERAL_ELECTRIC_LOAD_FAIL',error);
    if(SMOKE_TEST)app.exit(1);
  });
}

app.whenReady().then(()=>{
  initDiagnostics();
  createMainWindow();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createMainWindow();});
});
app.on('child-process-gone',(_event,details)=>writeLog('child-process-gone',details));
app.on('before-quit',()=>writeLog('before-quit'));
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
