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
