/* In-game visual editor for the existing 32px Capital & Consequence artwork.
   Developer design state is deliberately separate from live career saves. */
(function(root){
'use strict';
const C=root.FE_ROOM_BUILDER_CORE;
if(!C||typeof document==='undefined')return;
const SPRITES='assets/artwork/spritesheet.png';
const locationId='factory',roomId='executive-office',STORAGE=C.key(locationId,roomId);
let room=C.makeRoom(),mode='stamp',assetId='desk_oak',selectedId=null,preview=false;
let position={...room.spawns.player},dirty=false,zoom=1,grid=true,history=[],future=[];
let lastFocus=null,drag=null,dragLast='',loaded=false;
const art=new Image();art.src=SPRITES;
const names={floors:'Floors',construction:'Walls / Doors',furniture:'Furniture',small_props:'Small Props',people:'People'};
const panel=document.createElement('section');
panel.id='roomBuilderEditor';panel.className='room-builder-editor';panel.hidden=true;
panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
panel.setAttribute('aria-label','Room Builder, Federal Electric Executive Office');
panel.innerHTML='<div class="rb-window"><header class="rb-head"><div><small>CAPITAL & CONSEQUENCE · DEVELOPER TOOLS</small><h2>ROOM BUILDER</h2><p>Federal Electric · Executive Office · 32×32 original artwork</p></div><button type="button" data-rb="close">Close ×</button></header>'+
'<nav class="rb-toolbar" aria-label="Editing tools"><button type="button" data-rb-mode="select">Select / Drag</button><button type="button" data-rb-mode="stamp">Place / Paint</button><button type="button" data-rb-mode="erase">Erase</button><button type="button" data-rb-mode="spawn">Set Charles Spawn</button><button type="button" data-rb="rotate">Rotate R</button><button type="button" data-rb="duplicate">Duplicate</button><button type="button" data-rb="delete">Delete</button><button type="button" data-rb="undo">Undo</button><button type="button" data-rb="redo">Redo</button><button type="button" data-rb="test">Test Walk ▶</button></nav>'+
'<div class="rb-workarea"><aside class="rb-side"><h3>Art Catalog</h3><label>Category <select id="rbCategory"><option value="floors">Floors</option><option value="construction">Walls / Doors</option><option selected value="furniture">Furniture</option><option value="small_props">Small Props</option><option value="people">People</option></select></label><div id="rbPalette" class="rb-palette"></div><p>Choose an asset, then click the grid. Select / Drag moves a placed object. Grid tiles are 32px.</p><dl id="rbInspector"></dl></aside>'+
'<main class="rb-main"><div class="rb-canvas-tools"><label>Zoom <input id="rbZoom" type="range" min="75" max="200" step="25" value="100"></label><label><input id="rbGrid" type="checkbox" checked> Grid</label><span id="rbDirty" aria-live="polite">Unsaved draft</span></div><div id="rbViewport" class="rb-viewport"><canvas id="rbCanvas" tabindex="0" aria-label="Room canvas. Choose an object or paint tool."></canvas></div><p class="rb-help">TEST: Arrow keys or WASD to walk. Click a nearby door to open/close it. Editor tests do not advance the game clock.</p></main></div>'+
'<footer class="rb-footer"><button type="button" data-rb="save">Save Layout</button><button type="button" data-rb="reload">Reopen Saved</button><button type="button" data-rb="export">Export JSON</button><label class="rb-import">Import JSON <input id="rbImport" type="file" accept=".json,application/json"></label><button type="button" data-rb="reset">New Empty Layout</button><output id="rbStatus" role="status" aria-live="polite">Choose an asset to begin.</output></footer></div>';
document.body.appendChild(panel);
const $=id=>panel.querySelector('#'+id),canvas=$('rbCanvas'),ctx=canvas.getContext('2d'),viewport=$('rbViewport');
const status=s=>{$('rbStatus').textContent=s};
function loadSaved(){
 let raw;try{raw=localStorage.getItem(STORAGE)}catch(e){status('Local storage unavailable. Use Export JSON to preserve layouts.');return false;}
 if(!raw)return false;
 try{room=C.sanitize(JSON.parse(raw),locationId,roomId);loaded=true;return true}
 catch(e){status('Saved layout invalid; kept untouched in storage. '+e.message);return false;}
}
function snapshot(){history.push(C.clone(room));if(history.length>60)history.shift();future=[];}
function mutate(fn){
 const old=C.clone(room),before=JSON.stringify(room),result=fn();
 if(JSON.stringify(room)!==before){history.push(old);if(history.length>60)history.shift();future=[];dirty=true;position={...room.spawns.player};render();return true;}
 if(result===false)status('Placement blocked: wall, furniture, outside room, or Charles spawn.');
 return false;
}
function undo(){if(!history.length)return;future.push(C.clone(room));room=history.pop();dirty=true;position={...room.spawns.player};render();}
function redo(){if(!future.length)return;history.push(C.clone(room));room=future.pop();dirty=true;position={...room.spawns.player};render();}
function thumb(canvas,sprite,scale=1){
 const p=canvas.getContext('2d');if(!p)return;
 p.clearRect(0,0,canvas.width,canvas.height);
 if(!art.complete||!art.naturalWidth)return;
 const [x,y,w,h]=sprite.atlas_rect,ratio=Math.min(canvas.width/w,canvas.height/h)*scale;
 p.imageSmoothingEnabled=false;p.drawImage(art,x,y,w,h,(canvas.width-w*ratio)/2,(canvas.height-h*ratio)/2,w*ratio,h*ratio);
}
function palette(){
 const cat=$('rbCategory').value,host=$('rbPalette');host.replaceChildren();
 for(const s of root.FE_ROOM_CATALOG.filter(a=>a.category===cat)){
  const button=document.createElement('button');button.type='button';button.title=s.name;
  button.dataset.sprite=s.id;button.className=s.id===assetId?'active':'';
  const picture=document.createElement('canvas');picture.width=48;picture.height=48;thumb(picture,s);
  const text=document.createElement('span');text.textContent=s.name;button.append(picture,text);
  button.addEventListener('click',()=>{assetId=s.id;mode='stamp';preview=false;palette();render();status('Selected '+s.name+'. Click the room to place it.');});
  host.appendChild(button);
 }
}
function drawSprite(g,s,x,y,rotation=0){
 if(!s||!art.complete||!art.naturalWidth)return;
 const [sx,sy,sw,sh]=s.atlas_rect,raw=s.footprint_tiles;
 if(!rotation){g.drawImage(art,sx,sy,sw,sh,x*C.TILE,y*C.TILE,raw[0]*C.TILE,raw[1]*C.TILE);return;}
 const [w,h]=C.dims(s,rotation);
 g.save();g.translate((x+w/2)*C.TILE,(y+h/2)*C.TILE);g.rotate(rotation*Math.PI/2);
 g.drawImage(art,sx,sy,sw,sh,-raw[0]*C.TILE/2,-raw[1]*C.TILE/2,raw[0]*C.TILE,raw[1]*C.TILE);g.restore();
}
function drawRoom(g,data,{showGrid=false,showSpawn=false,player=null,selected=null}={}){
 const w=data.widthTiles,h=data.heightTiles;g.imageSmoothingEnabled=false;
 g.fillStyle='#413b34';g.fillRect(0,0,w*C.TILE,h*C.TILE);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  drawSprite(g,C.asset(data.floor[y*w+x]),x,y);
  drawSprite(g,C.asset(data.walls[y*w+x]),x,y);
 }
 for(const o of data.objects)drawSprite(g,C.asset(o.spriteId),o.x,o.y,o.rotation);
 const pos=player||showSpawn&&data.spawns.player;
 if(pos)drawSprite(g,C.asset('charles_front'),pos.x,pos.y);
 if(showGrid){g.beginPath();g.strokeStyle='rgba(11,10,9,.25)';g.lineWidth=1;
  for(let x=0;x<=w;x++){g.moveTo(x*C.TILE+.5,0);g.lineTo(x*C.TILE+.5,h*C.TILE)}
  for(let y=0;y<=h;y++){g.moveTo(0,y*C.TILE+.5);g.lineTo(w*C.TILE,y*C.TILE+.5)}g.stroke();}
 if(selected&&!player){
  const o=data.objects.find(v=>v.id===selected);
  if(o){const [fw,fh]=C.dims(C.asset(o.spriteId),o.rotation);
   g.strokeStyle='#ffd060';g.lineWidth=3;g.strokeRect(o.x*C.TILE+1,o.y*C.TILE+1,fw*C.TILE-2,fh*C.TILE-2);}
 }
}
function render(){
 if(panel.hidden)return;
 const w=room.widthTiles*C.TILE,h=room.heightTiles*C.TILE;
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 canvas.style.width=(w*zoom)+'px';canvas.style.height=(h*zoom)+'px';
 drawRoom(ctx,room,{showGrid:grid&&!preview,showSpawn:!preview,player:preview?position:null,selected:selectedId});
 for(const btn of panel.querySelectorAll('[data-rb-mode]'))btn.classList.toggle('active',btn.dataset.rbMode===mode&&!preview);
 for(const btn of panel.querySelectorAll('[data-rb]'))if(['rotate','duplicate','delete'].includes(btn.dataset.rb))btn.disabled=!selectedId||preview;
 panel.querySelector('[data-rb="test"]').textContent=preview?'Back to Edit ◀':'Test Walk ▶';
 $('rbDirty').textContent=dirty?'UNSAVED CHANGES':'Saved layout';$('rbDirty').classList.toggle('dirty',dirty);
 const sel=room.objects.find(o=>o.id===selectedId),s=sel&&C.asset(sel.spriteId),selectedSprite=C.asset(assetId);
 $('rbInspector').replaceChildren();
 const values=sel?[['Selected',s?.name],['Grid',sel.x+', '+sel.y],['Rotation',sel.rotation*90+'°'],['Solid',s?.solid?'Yes':'No']]:[
  ['Brush',selectedSprite?.name||'None'],['Charles spawn',room.spawns.player.x+', '+room.spawns.player.y],['Room size',room.widthTiles+' × '+room.heightTiles]];
 for(const [name,value] of values){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=name;dd.textContent=value; $('rbInspector').append(dt,dd);}
}
function coords(e){
 const rect=canvas.getBoundingClientRect();
 const x=Math.floor((e.clientX-rect.left)/rect.width*room.widthTiles);
 const y=Math.floor((e.clientY-rect.top)/rect.height*room.heightTiles);
 return C.inBounds(room,x,y)?{x,y}:null;
}
function paintAt(p){
 if(!p)return;
 if(mode==='spawn')mutate(()=>C.setSpawn(room,p.x,p.y));
 else if(mode==='erase')mutate(()=>C.erase(room,p.x,p.y));
 else if(mode==='stamp'){
  const s=C.asset(assetId);if(!s)return;
  if(['floors','construction'].includes(s.category))mutate(()=>C.paint(room,p.x,p.y,assetId));
  else mutate(()=>C.place(room,assetId,p.x,p.y));
 }
}
canvas.addEventListener('pointerdown',e=>{
 if(e.button!==0)return;
 const p=coords(e);if(!p)return;
 canvas.focus();e.preventDefault();
 if(preview){
  if(Math.abs(p.x-position.x)+Math.abs(p.y-position.y)<=1&&C.toggleDoor(room,p.x,p.y)){dirty=true;render();}
  return;
 }
 if(mode==='select'){
  const obj=C.findObject(room,p.x,p.y);selectedId=obj?.id||null;
  drag=obj?{id:obj.id,start:p}:null;render();return;
 }
 drag={mode,stamp:assetId};dragLast='';paintAt(p);dragLast=p.x+','+p.y;
 canvas.setPointerCapture?.(e.pointerId);
});
canvas.addEventListener('pointermove',e=>{
 if(!drag||preview||drag.id||!['erase','stamp'].includes(drag.mode))return;
 if(drag.mode==='stamp'&&!['floors','construction'].includes(C.asset(drag.stamp)?.category))return;
 if(!(e.buttons&1))return;
 const p=coords(e);if(!p)return;const k=p.x+','+p.y;
 if(k===dragLast)return;dragLast=k;paintAt(p);
});
canvas.addEventListener('pointerup',e=>{
 if(drag?.id&&!preview){const p=coords(e);if(p)mutate(()=>C.relocate(room,drag.id,p.x,p.y));}
 drag=null;dragLast='';
});
canvas.addEventListener('pointercancel',()=>{drag=null;dragLast='';});
function save(){
 try{const data=C.sanitize(room,locationId,roomId);data.updatedAt=new Date().toISOString();
  localStorage.setItem(STORAGE,JSON.stringify(data));room=data;dirty=false;loaded=true;render();status('Saved locally: Federal Electric / Executive Office.');root.FE_ROOM_BUILDER?.refreshScene?.();return true;
 }catch(e){status('Save failed: '+e.message);return false;}
}
function open(){
 if(!panel.hidden)return;
 lastFocus=document.activeElement;
 if(!loaded)loadSaved();
 panel.hidden=false;preview=false;selectedId=null;position={...room.spawns.player};
 palette();render();panel.querySelector('[data-rb="close"]').focus();
}
function close(){
 if(dirty&&!root.confirm('Discard unsaved editor changes?'))return;
 if(dirty){if(!loadSaved())room=C.makeRoom();dirty=false;}
 panel.hidden=true;preview=false;lastFocus?.focus?.();
}
function rotate(){if(!selectedId)return;const o=room.objects.find(v=>v.id===selectedId);if(o)mutate(()=>C.relocate(room,o.id,o.x,o.y,(o.rotation+1)%4));}
function duplicate(){if(!selectedId)return;const o=room.objects.find(v=>v.id===selectedId);if(o)mutate(()=>{const a=C.relocate(room,o.id,o.x+1,o.y+1,o.rotation,true);if(a)selectedId=a.id;return a;});}
function del(){if(!selectedId)return;mutate(()=>C.remove(room,selectedId));selectedId=null;render();}
function download(){
 const text=JSON.stringify(C.sanitize(room,locationId,roomId),null,2),blob=new Blob([text],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='federal-electric-executive-office.room.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);status('Exported layout JSON. No game files or career saves changed.');
}
panel.addEventListener('click',e=>{
 const button=e.target.closest('button');if(!button)return;
 const action=button.dataset.rb,tool=button.dataset.rbMode;
 if(tool){preview=false;mode=tool;render();return;}
 if(action==='close')close();
 if(action==='undo')undo();if(action==='redo')redo();
 if(action==='rotate')rotate();if(action==='duplicate')duplicate();if(action==='delete')del();
 if(action==='save')save();
 if(action==='test'){preview=!preview;position={...room.spawns.player};status(preview?'Walk with WASD / arrows. Adjacent doors toggle by click.':'Back in editor.');render();canvas.focus();}
 if(action==='export')download();
 if(action==='reload'){
  if(dirty&&!root.confirm('Replace the unsaved draft with the last saved layout?'))return;
  if(loadSaved()){dirty=false;history=[];future=[];position={...room.spawns.player};render();status('Saved layout reopened.');}
  else status('No valid saved layout found.');
 }
 if(action==='reset'&&root.confirm('Start a fresh executive office layout? Your saved layout remains until you press Save.')){
  snapshot();room=C.makeRoom();selectedId=null;dirty=true;preview=false;render();status('New empty office draft. Save to replace the previous design.');
 }
});
$('rbCategory').addEventListener('change',()=>{const s=root.FE_ROOM_CATALOG.find(a=>a.category===$('rbCategory').value);assetId=s?.id||assetId;mode='stamp';palette();render();});
$('rbZoom').addEventListener('input',e=>{zoom=Number(e.target.value)/100;render();});
$('rbGrid').addEventListener('change',e=>{grid=e.target.checked;render();});
$('rbImport').addEventListener('change',async e=>{
 const f=e.target.files?.[0];e.target.value='';if(!f)return;
 if(f.size>128000){status('Import refused: file too large.');return;}
 try{const raw=JSON.parse(await f.text()),next=C.sanitize(raw,locationId,roomId);
  snapshot();room=next;dirty=true;selectedId=null;preview=false;render();status('Imported draft. Press Save to make it active.');}
 catch(err){status('Import refused: '+err.message);}
});
function movePlayer(dx,dy){
 const next=C.walk(room,position,dx,dy);
 if(next===position){status('Blocked. Furniture and walls are solid.');return;}
 position=next;render();
 if(room.walls[C.index(room,position.x,position.y)]==='door_open')status('At doorway. Use the existing Return to Map / room menu to travel.');
}
document.addEventListener('keydown',e=>{
 if(panel.hidden)return;
 const tag=e.target?.tagName?.toLowerCase(),typing=tag==='input'||tag==='select'||tag==='textarea';
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return;}
 if(typing)return;
 const k=e.key.toLowerCase(),ctrl=e.ctrlKey||e.metaKey;
 if(ctrl&&k==='z'){e.preventDefault();undo();return;}
 if(ctrl&&k==='y'){e.preventDefault();redo();return;}
 if(preview){
  const dirs={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};
  if(dirs[k]){e.preventDefault();movePlayer(...dirs[k]);}
  return;
 }
 if(k==='delete'||k==='backspace'){e.preventDefault();del();}
 if(k==='r'){e.preventDefault();rotate();}
 if(ctrl&&k==='d'){e.preventDefault();duplicate();}
},true);
art.addEventListener('load',()=>{if(!panel.hidden){palette();render();}});
art.addEventListener('error',()=>status('Spritesheet missing. Check assets/artwork/spritesheet.png'));
function attach(){
 const dev=document.getElementById('titleDevPanel'),body=dev?.querySelector('.title-dev-city-tools')||dev?.querySelector('.title-dev-panel-body');
 if(!body)return;
 if(!document.getElementById('roomBuilderLaunch')){
  const btn=document.createElement('button');btn.id='roomBuilderLaunch';btn.type='button';
  btn.textContent='Build / Decorate Rooms';btn.title='Open 32×32 visual editor for Charles\'s executive office';
  btn.addEventListener('click',open);body.appendChild(btn);
 }
}
attach();
root.FE_ROOM_BUILDER={open,refreshScene:()=>{},loadSaved,drawRoom,getSaved:()=>{
 try{const x=localStorage.getItem(STORAGE);return x?C.sanitize(JSON.parse(x),locationId,roomId):null;}
 catch(e){return null;}
}};
})(window);
