/* In-game visual editor for the existing 32px Capital & Consequence artwork.
   Developer design state is deliberately separate from live career saves. */
(function(root){
'use strict';
const C=root.FE_ROOM_BUILDER_CORE,Kit=root.FE_ROOM_BUILDER_KIT;
if(!C||!Kit||typeof document==='undefined')return;
const SPRITES='assets/artwork/spritesheet.png';
let locationId='factory',roomId='executive-office',STORAGE=C.key(locationId,roomId);
let room=C.makeRoom(),mode='stamp',assetId='desk_oak',selectedId=null,preview=false;
let position={...room.spawns.player},dirty=false,zoom=1,grid=true,history=[],future=[];
let lastFocus=null,drag=null,dragLast='',loaded=false,testRoom=null;
const art=new Image();art.src=SPRITES;
const names={floors:'Floors',construction:'Walls / Doors',furniture:'Furniture',small_props:'Small Props',people:'People'};
const panel=document.createElement('section');
panel.id='roomBuilderEditor';panel.className='room-builder-editor';panel.hidden=true;
panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
panel.setAttribute('aria-label','DK Architect scene editor');
panel.innerHTML='<div class="rb-window"><header class="rb-head"><div><small>CAPITAL & CONSEQUENCE · DEVELOPER TOOLS</small><h2>DK ARCHITECT</h2><p id="rbSceneLabel">Federal Electric · Executive Office · 32×32 original artwork</p></div><button type="button" data-rb="close">Close ×</button></header>'+
'<nav class="rb-toolbar" aria-label="Editing tools"><button type="button" data-rb-mode="select">Select / Drag</button><button type="button" data-rb-mode="stamp">Place / Paint</button><button type="button" data-rb-mode="fill" title="Flood fill connected matching tiles">Bucket Fill</button><button type="button" data-rb-mode="rectangle" title="Drag a rectangle of floors or walls">Rectangle</button><button type="button" data-rb-mode="pick">Eyedropper</button><button type="button" data-rb-mode="clear-wall">Remove Walls</button><button type="button" data-rb-mode="erase">Erase</button><button type="button" data-rb-mode="spawn">Set Player Spawn</button><button type="button" data-rb="rotate">Rotate R</button><button type="button" data-rb="duplicate">Duplicate</button><button type="button" data-rb="delete">Delete</button><button type="button" data-rb="nudge-left" title="Move selected object left">←</button><button type="button" data-rb="nudge-up" title="Move selected object up">↑</button><button type="button" data-rb="nudge-down" title="Move selected object down">↓</button><button type="button" data-rb="nudge-right" title="Move selected object right">→</button><button type="button" data-rb="undo">Undo</button><button type="button" data-rb="redo">Redo</button><button type="button" data-rb="inspect">Check Room</button><button type="button" data-rb="test">Test Walk ▶</button></nav>'+
'<div class="rb-workarea"><aside class="rb-side"><h3>Art Catalog</h3><label>Category <select id="rbCategory"><option value="floors">Floors</option><option value="construction">Walls / Doors</option><option selected value="furniture">Furniture</option><option value="small_props">Small Props</option><option value="people">People</option></select></label><div id="rbPalette" class="rb-palette"></div><p>Choose an asset, then click the grid. Fill changes a connected region, Rectangle paints between two corners, Eyedropper selects existing art. Objects remain on their own layer.</p><dl id="rbInspector"></dl></aside>'+
'<main class="rb-main"><div class="rb-scene-selectors"><label>Location <select id="rbLocation"></select></label><label>Scene / Room <select id="rbRoom"></select></label><button type="button" data-rb="scene-open">Open Scene for Editing</button><small>Blueprint only. Selecting a different room never moves your character or advances game time.</small></div><div class="rb-canvas-tools"><label>Width <input id="rbWidth" type="number" min="8" max="40" value="16"></label><label>Height <input id="rbHeight" type="number" min="8" max="40" value="12"></label><button type="button" data-rb="resize">Resize Room</button><label>Zoom <input id="rbZoom" type="range" min="75" max="200" step="25" value="100"></label><label><input id="rbGrid" type="checkbox" checked> Grid</label><span id="rbDirty" aria-live="polite">Unsaved draft</span></div><div id="rbViewport" class="rb-viewport"><canvas id="rbCanvas" tabindex="0" aria-label="Room canvas. Choose an object or paint tool."></canvas></div><p class="rb-help">TEST: Arrow keys or WASD to walk. Click a nearby door to open/close it. Editor tests do not advance the game clock.</p></main></div>'+
'<footer class="rb-footer"><label class="rb-draft-field">Draft name <input id="rbDraftName" type="text" maxlength="50" placeholder="Office layout A"></label><button type="button" data-rb="draft-save">Save Named Draft</button><label class="rb-draft-field">Saved drafts <select id="rbDraftList"><option value="">No saved drafts</option></select></label><button type="button" data-rb="draft-load">Open Draft</button><button type="button" data-rb="draft-delete">Delete Draft</button><button type="button" data-rb="save">Save Layout</button><button type="button" data-rb="reload">Reopen Saved</button><button type="button" data-rb="backup">Restore Backup</button><button type="button" data-rb="export">Export JSON</button><label class="rb-import">Import JSON <input id="rbImport" type="file" accept=".json,application/json"></label><button type="button" data-rb="sample">Load Example Office</button><button type="button" data-rb="reset">New Empty Layout</button><output id="rbStatus" role="status" aria-live="polite">Choose an asset to begin.</output></footer></div>';
document.body.appendChild(panel);
const $=id=>panel.querySelector('#'+id),canvas=$('rbCanvas'),ctx=canvas.getContext('2d'),viewport=$('rbViewport');
const status=s=>{$('rbStatus').textContent=s};
function sceneLabel(){const place=root.FederalElectricCity?.getLocation?.(locationId);return (place?.name||locationId)+' / '+(place?.rooms?.find(v=>v.id===roomId)?.name||roomId)}
function allScenes(){return root.FederalElectricCity?.allLocations?.()||[]}
function populateScenes(location=locationId,whichRoom=roomId){
 const places=allScenes(),locationList=$('rbLocation'),roomList=$('rbRoom');
 locationList.replaceChildren();roomList.replaceChildren();
 for(const place of places){const opt=document.createElement('option');opt.value=place.id;opt.textContent=place.name;locationList.append(opt)}
 if(places.some(p=>p.id===location))locationList.value=location;
 const chosen=places.find(p=>p.id===locationList.value);
 for(const area of chosen?.rooms||[]){const opt=document.createElement('option');opt.value=area.id;opt.textContent=area.name;roomList.append(opt)}
 if((chosen?.rooms||[]).some(r=>r.id===whichRoom))roomList.value=whichRoom;
}
function selectScene(location,whichRoom){
 const nextLocation=String(location||'factory'),nextRoom=String(whichRoom||'executive-office');
 if(locationId===nextLocation&&roomId===nextRoom)return;
 locationId=nextLocation;roomId=nextRoom;STORAGE=C.key(locationId,roomId);
 room=C.makeRoom(locationId,roomId);dirty=false;loaded=false;selectedId=null;preview=false;testRoom=null;
 history=[];future=[];position={...room.spawns.player};
}
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
 if(result===false)status('Placement blocked: wall, furniture, outside room, or Player spawn.');
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
function drafts(){
 const list=$('rbDraftList'),selected=list.value;
 list.replaceChildren();
 const initial=document.createElement('option');initial.value='';initial.textContent='Select named layout';list.append(initial);
 try{
  for(const item of Kit.listDrafts(localStorage,locationId,roomId)){
   const option=document.createElement('option');option.value=item.name;option.textContent=item.name;
   list.append(option);
  }
  if(Array.from(list.options).some(o=>o.value===selected))list.value=selected;
 }catch(error){status('Draft library: '+error.message);}
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
function drawRoom(g,data,{showGrid=false,showSpawn=false,player=null,playerFacing='front',selected=null,playerSprite='charles'}={}){
 const w=data.widthTiles,h=data.heightTiles;g.imageSmoothingEnabled=false;
 g.fillStyle='#413b34';g.fillRect(0,0,w*C.TILE,h*C.TILE);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  drawSprite(g,C.asset(data.floor[y*w+x]),x,y);
  drawSprite(g,C.asset(data.walls[y*w+x]),x,y);
 }
 for(const o of data.objects)drawSprite(g,C.asset(o.spriteId),o.x,o.y,o.rotation);
 const pos=player||showSpawn&&data.spawns.player;
 if(pos){
   if(playerSprite)drawSprite(g,C.asset(playerSprite+'_'+(playerFacing||'front')),pos.x,pos.y);
   else{
    // Neutral placement cursor until a playable character's own sprites are approved.
    g.fillStyle='#e7c067';g.beginPath();g.arc((pos.x+.5)*C.TILE,(pos.y+.5)*C.TILE,10,0,Math.PI*2);g.fill();
    g.strokeStyle='#342a1a';g.lineWidth=2;g.stroke();
   }
  }
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
 $('rbWidth').value=room.widthTiles;$('rbHeight').value=room.heightTiles;
 const w=room.widthTiles*C.TILE,h=room.heightTiles*C.TILE;
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 canvas.style.width=(w*zoom)+'px';canvas.style.height=(h*zoom)+'px';
 drawRoom(ctx,preview&&testRoom?testRoom:room,{showGrid:grid&&!preview,showSpawn:!preview,player:preview?position:null,selected:selectedId,playerSprite:locationId==='factory'&&roomId==='executive-office'?'charles':null});
 for(const btn of panel.querySelectorAll('[data-rb-mode]'))btn.classList.toggle('active',btn.dataset.rbMode===mode&&!preview);
 for(const btn of panel.querySelectorAll('[data-rb]'))
  if(['rotate','duplicate','delete','nudge-left','nudge-right','nudge-up','nudge-down'].includes(btn.dataset.rb))
   btn.disabled=!selectedId||preview;
 panel.querySelector('[data-rb="test"]').textContent=preview?'Back to Edit ◀':'Test Walk ▶';
 $('rbDirty').textContent=dirty?'UNSAVED CHANGES':loaded?'Saved layout':'Unsaved starter template';$('rbDirty').classList.toggle('dirty',dirty);
 const sel=room.objects.find(o=>o.id===selectedId),s=sel&&C.asset(sel.spriteId),selectedSprite=C.asset(assetId);
 $('rbInspector').replaceChildren();
 const info=Kit.describe(sel?sel.spriteId:assetId);
 const values=sel?[['Selected',s?.name],['Grid',sel.x+', '+sel.y],['Rotation',sel.rotation*90+'°'],['Solid',s?.solid?'Yes':'No'],['Use',info?.kind],['Behavior',info?.hint]]:[
  ['Brush',selectedSprite?.name||'None'],['Layer',info?.category||'None'],['Function',info?.hint||''],['Player spawn',room.spawns.player.x+', '+room.spawns.player.y],['Room size',room.widthTiles+' × '+room.heightTiles]];
 for(const [name,value] of values){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=name;dd.textContent=value; $('rbInspector').append(dt,dd);}
}
function coords(e){
 const rect=canvas.getBoundingClientRect();
 const x=Math.floor((e.clientX-rect.left)/rect.width*room.widthTiles);
 const y=Math.floor((e.clientY-rect.top)/rect.height*room.heightTiles);
 return C.inBounds(room,x,y)?{x,y}:null;
}
function paintArea(tool,layer,id,p,other=p){
 let result=null;
 mutate(()=>{result=Kit.apply(room,tool,layer,id,p.x,p.y,other.x,other.y);return result.ok;});
 if(result&&!result.ok)status(result.reason);
 else if(result?.changes)status(result.changes+' '+layer+' tiles painted. Undo available.');
}
function paintAt(p){
 if(!p)return;
 if(mode==='spawn')mutate(()=>C.setSpawn(room,p.x,p.y));
 else if(mode==='erase')mutate(()=>C.erase(room,p.x,p.y));
 else if(mode==='clear-wall')paintArea('single','construction',null,p);
 else if(mode==='fill'){
  const sprite=C.asset(assetId);
  if(!sprite||!['floors','construction'].includes(sprite.category)){status('Choose a floor or construction sprite to use Bucket Fill.');return;}
  paintArea('fill',sprite.category,assetId,p);
 }
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
  if(testRoom&&Math.abs(p.x-position.x)+Math.abs(p.y-position.y)<=1&&C.toggleDoor(testRoom,p.x,p.y)){
   status('Door toggled for this test only. Your saved office remains unchanged.');render();
  }
  return;
 }
 if(mode==='pick'){
  const item=Kit.pick(room,p.x,p.y);
  if(!item){status('No tile to sample.');return;}
  assetId=item.spriteId;
  const sprite=C.asset(assetId);
  if(sprite)$('rbCategory').value=sprite.category;
  mode='stamp';palette();render();status('Eyedropper selected '+(sprite?.name||assetId)+'.');return;
 }
 if(mode==='rectangle'){
  if(!['floors','construction'].includes(C.asset(assetId)?.category)){status('Rectangle requires a floor or wall sprite.');return;}
  drag={mode:'rectangle',start:p};
  canvas.setPointerCapture?.(e.pointerId);
  status('Drag to the opposite corner, then release to paint the rectangle.');return;
 }
 if(mode==='fill'){paintAt(p);return;}
 if(mode==='select'){
  const obj=C.findObject(room,p.x,p.y);selectedId=obj?.id||null;
  drag=obj?{id:obj.id,offsetX:p.x-obj.x,offsetY:p.y-obj.y}:null;
  if(drag)canvas.setPointerCapture?.(e.pointerId);
  render();return;
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
 if(drag?.mode==='rectangle'&&!preview){
  const corner=coords(e),sprite=C.asset(assetId);
  if(corner&&sprite)paintArea('rectangle',sprite.category,assetId,drag.start,corner);
 }
 if(drag?.id&&!preview){const p=coords(e);if(p)mutate(()=>C.relocate(room,drag.id,p.x-drag.offsetX,p.y-drag.offsetY));}
 drag=null;dragLast='';
});
canvas.addEventListener('pointercancel',()=>{drag=null;dragLast='';});
function save(){
 try{
  const data=C.sanitize(room,locationId,roomId);data.updatedAt=new Date().toISOString();
  const serialized=JSON.stringify(data);
  const previous=localStorage.getItem(STORAGE);
  // Preserve an earlier valid revision before overwriting. Recoverable from
  // the editor rather than silently replacing the previous room design.
  if(previous&&previous!==serialized){
   try{C.sanitize(JSON.parse(previous),locationId,roomId);
    localStorage.setItem(STORAGE+':backup',previous);}
   catch(e){/* invalid source is left untouched; never back it up as valid */}
  }
  localStorage.setItem(STORAGE,serialized);
  room=data;dirty=false;loaded=true;render();
  status('Saved locally: '+sceneLabel()+'. Previous valid version kept as a backup.');
  root.FE_ROOM_BUILDER?.refreshScene?.();return true;
 }catch(e){status('Save failed: '+e.message);return false;}
}
function open(target){
 if(!panel.hidden)return;
 const current=root.FE_CITY?.currentLocation?.();
 const place=target&&typeof target.locationId==='string'&&typeof target.roomId==='string'?target:current;
 selectScene(place?.locationId||'factory',place?.roomId||'executive-office');
 populateScenes();
 lastFocus=document.activeElement;
 panel.querySelector('#rbSceneLabel').textContent=sceneLabel()+' · 32×32 tile artwork';
 panel.setAttribute('aria-label','DK Architect · '+sceneLabel());
 panel.querySelector('[data-rb="sample"]').hidden=!(locationId==='factory'&&roomId==='executive-office');
 if(!loaded)loadSaved();
 panel.hidden=false;preview=false;selectedId=null;position={...room.spawns.player};
 palette();drafts();render();panel.querySelector('[data-rb="close"]').focus();
}
function close(){
 if(dirty&&!root.confirm('Discard unsaved editor changes?'))return;
 if(dirty){if(!loadSaved())room=C.makeRoom(locationId,roomId);dirty=false;}
 panel.hidden=true;preview=false;lastFocus?.focus?.();
}
function rotate(){if(!selectedId)return;const o=room.objects.find(v=>v.id===selectedId);if(o)mutate(()=>C.relocate(room,o.id,o.x,o.y,(o.rotation+1)%4));}
function nudge(dx,dy){
 if(preview||!selectedId)return;
 const o=room.objects.find(v=>v.id===selectedId);
 if(o)mutate(()=>C.relocate(room,o.id,o.x+dx,o.y+dy));
}
function inspect(){
 const result=C.analyze(room),work=Kit.auditStations(room);
 const warning=work.inaccessible.length?
  ' UNREACHABLE FURNITURE: '+work.inaccessible.join(', ')+'.':'';
 const message='Room check: '+result.area+' tiles, '+result.furniture+' objects, '+
  result.reachableDoors+'/'+result.doors+' reachable doors; '+work.reachable+'/'+work.stations.length+
  ' work/storage/seating stations approachable. '+
  (result.errors.concat(result.warnings).join(' ')||'Charles can reach an open exit.')+warning;
 status(message);
 return {...result,stations:work};
}
function duplicate(){if(!selectedId)return;const o=room.objects.find(v=>v.id===selectedId);if(o)mutate(()=>{const a=C.relocate(room,o.id,o.x+1,o.y+1,o.rotation,true);if(a)selectedId=a.id;return a;});}
function del(){if(!selectedId)return;mutate(()=>C.remove(room,selectedId));selectedId=null;render();}
function download(){
 const text=JSON.stringify(C.sanitize(room,locationId,roomId),null,2),blob=new Blob([text],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='dk-architect-'+locationId+'-'+roomId+'.room.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);status('Exported layout JSON. No game files or career saves changed.');
}
$('rbLocation').addEventListener('change',()=>{populateScenes($('rbLocation').value,'');status('Choose the room and press Open Scene for Editing.');});
panel.addEventListener('click',e=>{
 const button=e.target.closest('button');if(!button)return;
 const action=button.dataset.rb,tool=button.dataset.rbMode;
 if(tool){preview=false;mode=tool;render();return;}
 if(action==='close')close();
 if(action==='scene-open'){
  const place=$('rbLocation').value,which=$('rbRoom').value;
  const target=allScenes().find(v=>v.id===place);
  if(!target?.rooms?.some(v=>v.id===which)){status('Choose a registered room.');return;}
  if(locationId===place&&roomId===which){status('Already editing this scene.');return;}
  if(dirty&&!root.confirm('Discard unsaved DK Architect changes to open another scene? The saved layout stays intact.'))return;
  selectScene(place,which);populateScenes();
  panel.querySelector('#rbSceneLabel').textContent=sceneLabel()+' · 32×32 tile artwork';
  panel.setAttribute('aria-label','DK Architect · '+sceneLabel());
  panel.querySelector('[data-rb="sample"]').hidden=!(locationId==='factory'&&roomId==='executive-office');
  loadSaved();position={...room.spawns.player};palette();drafts();render();
  status('Editing '+sceneLabel()+'. Your character has not moved.');
  return;
 }
 if(action==='resize'){
  const w=Number($('rbWidth').value),h=Number($('rbHeight').value);
  const next=C.resize(room,w,h);
  if(next){mutate(()=>{room=next;return true;});status('Room dimensions: '+w+' × '+h+' tiles. Boundary walls rebuilt; interior furniture preserved.');}
  else{status('Cannot resize: dimensions must be 8–40, and furniture / Charles must remain inside an unblocked room.');}
 }
 if(action==='undo')undo();if(action==='redo')redo();
 if(action==='rotate')rotate();if(action==='duplicate')duplicate();if(action==='delete')del();
 if(action==='nudge-left')nudge(-1,0);if(action==='nudge-right')nudge(1,0);
 if(action==='nudge-up')nudge(0,-1);if(action==='nudge-down')nudge(0,1);
 if(action==='inspect')inspect();
 if(action==='save')save();
 if(action==='draft-save'){
  try{
   const title=$('rbDraftName').value.trim();
   if(Kit.listDrafts(localStorage,locationId,roomId).some(v=>v.name.toLowerCase()===title.toLowerCase())&&
      !root.confirm('Replace the existing named draft '+title+'?'))return;
   Kit.saveDraft(localStorage,room,title);
   drafts();$('rbDraftList').value=title;
   status('Named draft "'+title+'" stored separately. The active room design was not overwritten.');
  }catch(error){status('Draft save failed: '+error.message);}
 }
 if(action==='draft-load'){
  const name=$('rbDraftList').value;
  if(!name){status('Select a named draft first.');return;}
  if(dirty&&!root.confirm('Replace unsaved edits with the selected named draft?'))return;
  try{
   const next=Kit.openDraft(localStorage,locationId,roomId,name);
   snapshot();room=next;selectedId=null;testRoom=null;preview=false;dirty=true;
   render();status('Opened "'+name+'" as an unsaved draft. Save Layout to apply.');
  }catch(error){status('Cannot open draft: '+error.message);}
 }
 if(action==='draft-delete'){
  const name=$('rbDraftList').value;
  if(!name||!root.confirm('Delete the named blueprint "'+name+'"? This does not change the active room.'))return;
  try{Kit.deleteDraft(localStorage,locationId,roomId,name);drafts();status('Deleted named draft "'+name+'". Active room unchanged.');}
  catch(error){status('Cannot delete draft: '+error.message);}
 }
 if(action==='backup'){
  if(dirty&&!root.confirm('Discard current unsaved changes and load the earlier saved room design?'))return;
  try{
   const raw=localStorage.getItem(STORAGE+':backup');
   if(!raw){status('No earlier saved layout is available.');return;}
   const older=C.sanitize(JSON.parse(raw),locationId,roomId);
   snapshot();room=older;dirty=true;selectedId=null;preview=false;testRoom=null;
   render();status('Previous design loaded as an UNSAVED draft. Choose Save to replace the active version.');
  }catch(e){status('Backup unreadable; the current saved layout has not changed. '+e.message);}
 }
 if(action==='test'){
  if(!preview){const outcome=inspect();
   if(outcome.errors.length){status('Fix room errors before testing: '+outcome.errors.join(' '));return;}
   testRoom=C.clone(room);preview=true;position={...room.spawns.player};
  }else{preview=false;testRoom=null;position={...room.spawns.player};}
  status(preview?'Testing an isolated copy. Walk with WASD / arrows; doors may be toggled.':'Back in editor. No test changes saved.');
  render();canvas.focus();
 }
 if(action==='export')download();
 if(action==='reload'){
  if(dirty&&!root.confirm('Replace the unsaved draft with the last saved layout?'))return;
  if(loadSaved()){dirty=false;history=[];future=[];position={...room.spawns.player};render();status('Saved layout reopened.');}
  else status('No valid saved layout found.');
 }
 if(action==='sample'&&locationId==='factory'&&roomId==='executive-office'&&root.confirm('Load the crude demonstration office? This only replaces your unsaved draft; your last saved layout stays intact until you Save.')){
  snapshot();room=C.sampleOffice();selectedId=null;preview=false;testRoom=null;dirty=true;
  render();status('Example office draft loaded. This is not a final approved layout. Use Save only if you want it.');
 }
 if(action==='reset'&&root.confirm('Start a fresh layout for '+sceneLabel()+'? Your saved layout remains until you press Save.')){
  snapshot();room=C.makeRoom(locationId,roomId);selectedId=null;dirty=true;preview=false;render();status('New empty room draft. Save to replace the previous design for '+sceneLabel()+'.');
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
 const next=C.walk(testRoom||room,position,dx,dy);
 if(next===position){status('Blocked. Furniture and walls are solid.');return;}
 position=next;render();
 if((testRoom||room).walls[C.index(testRoom||room,position.x,position.y)]==='door_open')status('At doorway. Game travel continues to use the real room/location system.');
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
 if(!preview&&!ctrl&&['arrowup','arrowdown','arrowleft','arrowright'].includes(k)&&selectedId){
  e.preventDefault();const dirs={arrowup:[0,-1],arrowdown:[0,1],arrowleft:[-1,0],arrowright:[1,0]};
  nudge(...dirs[k]);return;
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
  btn.textContent='DK Architect';btn.title='Open 32×32 scene editor for the current playable room';
  btn.addEventListener('click',open);body.appendChild(btn);
 }
}
attach();
root.FE_ROOM_BUILDER={open,refreshScene:()=>{},loadSaved,drawRoom,getSaved:(location=locationId,whichRoom=roomId)=>{
 try{const x=localStorage.getItem(C.key(location,whichRoom));return x?C.sanitize(JSON.parse(x),location,whichRoom):null;}
 catch(e){return null;}
}};
})(window);
