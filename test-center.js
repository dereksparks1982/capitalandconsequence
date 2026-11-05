/* DK Architect Test Center: isolated, zero-animation playable room lab.
 * No career save keys, game clock, economic hooks, or third-party code. */
(function(root){
'use strict';
const C=root.FE_ROOM_BUILDER_CORE,K=root.FE_ROOM_BUILDER_KIT;
if(!C||!K||typeof document==='undefined')return;
const $=id=>document.getElementById(id),canvas=$('room'),g=canvas?.getContext('2d');
if(!g)return;
const KEY='dkSoftworks.testCenter.room.v1',LOC='test-center',ROOM='room-01';
const IMG=new Image();IMG.src='assets/artwork/spritesheet.png';
const THIRD_PARTY=new Map();
function imageFor(sprite){
 if(!sprite?.source_image)return IMG;
 if(THIRD_PARTY.has(sprite.source_image))return THIRD_PARTY.get(sprite.source_image);
 const image=new Image();THIRD_PARTY.set(sprite.source_image,image);
 image.addEventListener('load',()=>{palette();redraw()});
 image.addEventListener('error',()=>setStatus('Sprite failed to load: '+sprite.source_image));
 image.src=sprite.source_image;return image;
}
const labels={furniture:'Furniture',floors:'Floors',construction:'Walls & Doors',small_props:'Small Props',people:'People (static)'};
let room=null,player=null,facing='front',mode='walk',tool='place',category='furniture',spriteId='desk_oak';
let selected=null,corner=null,history=[],future=[],dirty=false,loaded=false;
function setStatus(message){$('status').textContent=message}
function clone(v){return C.clone(v)}
function starter(){
 const r=C.makeRoom(LOC,ROOM,16,16);
 for(let y=3;y<=8;y++)for(let x=5;x<=10;x++)C.paint(r,x,y,'floor_rug_red');
 for(const [id,x,y] of [['desk_oak',6,5],['chair_office',7,7],['file_cabinet',2,3],['bookshelf',12,2],['plant_small',12,10],['oil_lamp',9,5]])C.place(r,id,x,y);
 return r;
}
function canStand(x,y){
 return C.inBounds(room,x,y)&&!C.blocked(room,x,y)&&!room.objects.some(o=>{
  const a=C.asset(o.spriteId);if(a?.category!=='people')return false;
  const [w,h]=C.dims(a,o.rotation);
  return x>=o.x&&x<o.x+w&&y>=o.y&&y<o.y+h;
 });
}
function repairPlayer(){if(!canStand(player.x,player.y))player={...room.spawns.player}}
function mutate(action,description){
 const before=clone(room),original=JSON.stringify(room);
 const result=action();
 if(JSON.stringify(room)===original){
  setStatus(result?.reason||description+' could not be applied here. The room was not changed.');
  return false;
 }
 history.push(before);if(history.length>80)history.shift();future=[];dirty=true;repairPlayer();
 redraw();setStatus(description);return true;
}
function undo(){if(!history.length){setStatus('Nothing to undo.');return}future.push(clone(room));room=history.pop();selected=null;corner=null;dirty=true;repairPlayer();redraw();setStatus('Previous room edit restored.')}
function redo(){if(!future.length){setStatus('Nothing to redo.');return}history.push(clone(room));room=future.pop();selected=null;corner=null;dirty=true;repairPlayer();redraw();setStatus('Room edit restored.')}
function drawSprite(ctx,s,x,y,rotation=0){
 if(!s)return;
 const size=C.dims(s,rotation),dx=x*C.TILE,dy=y*C.TILE;
 const image=imageFor(s);
 if(!image.complete||!image.naturalWidth){
  ctx.fillStyle=s.category==='floors'?'#8e795d':s.category==='construction'?'#5e5449':s.category==='people'?'#e2c38c':'#8c7151';
  ctx.fillRect(dx,dy,size[0]*C.TILE,size[1]*C.TILE);return;
 }
 const [sx,sy,sw,sh]=s.atlas_rect,base=s.footprint_tiles||[1,1];
 if(!rotation){ctx.drawImage(image,sx,sy,sw,sh,dx,dy,size[0]*C.TILE,size[1]*C.TILE);return;}
 ctx.save();ctx.translate((x+size[0]/2)*C.TILE,(y+size[1]/2)*C.TILE);ctx.rotate(rotation*Math.PI/2);
 ctx.drawImage(image,sx,sy,sw,sh,-base[0]*C.TILE/2,-base[1]*C.TILE/2,base[0]*C.TILE,base[1]*C.TILE);ctx.restore();
}
function draw(){
 g.imageSmoothingEnabled=false;g.clearRect(0,0,canvas.width,canvas.height);
 g.fillStyle='#473c2c';g.fillRect(0,0,512,512);
 for(let y=0;y<16;y++)for(let x=0;x<16;x++)drawSprite(g,C.asset(room.floor[C.index(room,x,y)]),x,y);
 for(let y=0;y<16;y++)for(let x=0;x<16;x++)drawSprite(g,C.asset(room.walls[C.index(room,x,y)]),x,y);
 for(const o of room.objects)drawSprite(g,C.asset(o.spriteId),o.x,o.y,o.rotation);
 drawSprite(g,C.asset('charles_'+facing),player.x,player.y);
 if(mode==='edit'){
  g.strokeStyle='rgba(24,22,17,.26)';g.lineWidth=1;g.beginPath();
  for(let i=0;i<=16;i++){g.moveTo(i*32+.5,0);g.lineTo(i*32+.5,512);g.moveTo(0,i*32+.5);g.lineTo(512,i*32+.5)}g.stroke();
  if(selected){const obj=room.objects.find(o=>o.id===selected);if(obj){const [w,h]=C.dims(C.asset(obj.spriteId),obj.rotation);g.strokeStyle='#f8d66f';g.lineWidth=3;g.strokeRect(obj.x*32+1,obj.y*32+1,w*32-2,h*32-2)}}
  if(corner){g.strokeStyle='#fff2a0';g.lineWidth=3;g.strokeRect(corner.x*32+1,corner.y*32+1,30,30);}
 }
}
function redraw(){
 draw();$('position').textContent=(player.x+1)+', '+(player.y+1);
 $('objectCount').textContent=String(room.objects.length);
 $('saveState').textContent=dirty?'Unsaved edits':loaded?'Saved layout':'Sample layout';
 const obj=room.objects.find(o=>o.id===selected);
 $('itemInfo').textContent=obj?(C.asset(obj.spriteId)?.name||obj.spriteId)+' · '+(obj.x+1)+','+(obj.y+1):'None';
 $('selectionLabel').textContent=obj?'Selected':'';
 $('coordinates').textContent='16 × 16 tiles';
 $('modeLabel').textContent=mode==='walk'?'WALK MODE':'EDIT MODE';
 $('hint').textContent=mode==='walk'?'Four static facing sprites. No walking animation. Objects and walls block movement.':'Place tiles and props with the palette. Select an item to move, rotate or duplicate it.';
 for(const [name,button] of [['walk','walkMode'],['edit','editMode']]){
  $(button).classList.toggle('active',mode===name);$(button).setAttribute('aria-pressed',String(mode===name));
 }
 for(const id of ['rotate','duplicate','remove'])$(id).disabled=mode!=='edit'||!obj;
 $('undo').disabled=!history.length;$('redo').disabled=!future.length;
}
function thumb(s){
 const cv=document.createElement('canvas');cv.width=48;cv.height=48;
 const c=cv.getContext('2d');if(!c)return cv;c.imageSmoothingEnabled=false;
 c.fillStyle='#ab9671';c.fillRect(0,0,48,48);
 const image=imageFor(s);
 if(image.complete&&image.naturalWidth){
  const [sx,sy,sw,sh]=s.atlas_rect,scale=Math.min(42/sw,42/sh);
  c.drawImage(image,sx,sy,sw,sh,(48-sw*scale)/2,(48-sh*scale)/2,sw*scale,sh*scale);
 }
 return cv;
}
function palette(){
 const el=$('palette');el.replaceChildren();
 $('paletteTitle').textContent=labels[category];
 const pack=$('artPack').value;
 for(const s of root.FE_ROOM_CATALOG.filter(x=>x.category===category&&(pack==='all'||(x.third_party_pack||'original')===pack))){
  const b=document.createElement('button');b.type='button';b.dataset.sprite=s.id;b.title=s.name;
  b.className=s.id===spriteId?'active':'';b.append(thumb(s));
  const label=document.createElement('span');label.textContent=s.name;b.append(label);
  b.addEventListener('click',()=>{
   spriteId=s.id;category=s.category;$('category').value=category;
   tool='place';$('tool').value=tool;corner=null;setMode('edit');
   palette();setStatus('Selected '+s.name+'. Click a room tile to place it.');
  });el.append(b);
 }
}
function setMode(next){
 mode=next;selected=null;corner=null;canvas.focus({preventScroll:true});redraw();
 setStatus(mode==='walk'?'Walk with WASD or arrows, or click a reachable tile for an instant move.':'Edit room: choose an art item and click a tile.');
}
function coords(e){
 const rect=canvas.getBoundingClientRect();
 if(!rect.width||!rect.height)return null;
 const x=Math.floor((e.clientX-rect.left)*16/rect.width),y=Math.floor((e.clientY-rect.top)*16/rect.height);
 return C.inBounds(room,x,y)?{x,y}:null;
}
function step(dx,dy){
 const next=C.walk(room,player,dx,dy);
 if(next===player||!canStand(next.x,next.y)){setStatus('Blocked by a wall, closed door, piece of furniture or person.');return;}
 player=next;facing=dy<0?'back':dy>0?'front':dx<0?'left':'right';redraw();
 setStatus('Position '+(player.x+1)+', '+(player.y+1)+'. No walking animation.');
}
function walkTo(p){
 if(!canStand(p.x,p.y)){setStatus('That tile is occupied or blocked.');return;}
 const route=C.path(room,player,p);
 if(!route||route.some(node=>!canStand(node.x,node.y))){setStatus('No clear walking route to that tile.');return;}
 if(route.length){const last=route[route.length-1],prev=route.length>1?route[route.length-2]:player;
  facing=last.y<prev.y?'back':last.y>prev.y?'front':last.x<prev.x?'left':'right';
  player={x:p.x,y:p.y};
 }
 redraw();setStatus('Moved to '+(p.x+1)+', '+(p.y+1)+' using a checked path, instantly.');
}
function act(p){
 if(mode==='walk'){
  const tile=room.walls[C.index(room,p.x,p.y)];
  if((tile==='door_open'||tile==='door_closed')&&Math.abs(player.x-p.x)+Math.abs(player.y-p.y)<=1){
   if(player.x===p.x&&player.y===p.y){setStatus('Move out of the doorway before closing it.');return;}
   mutate(()=>C.toggleDoor(room,p.x,p.y),'Door changed.');return;
  }
  walkTo(p);return;
 }
 const at=C.findObject(room,p.x,p.y),def=C.asset(spriteId);
 if(tool==='select'){
  const existing=room.objects.find(o=>o.id===selected);
  if(at&&at.id!==selected){selected=at.id;redraw();setStatus('Selected '+C.asset(at.spriteId).name+'. Click another tile to move.');return;}
  if(existing){
   if(at?.id===selected){selected=null;redraw();setStatus('Selection cleared.');return;}
   const x=p.x,y=p.y;
   mutate(()=>C.relocate(room,existing.id,x,y,existing.rotation),'Moved '+C.asset(existing.spriteId).name+'.');
   return;
  }
  selected=at?.id||null;redraw();setStatus(selected?'Object selected.':'Click a placed object to select it.');return;
 }
 if(tool==='pick'){
  const found=K.pick(room,p.x,p.y);
  if(!found){setStatus('Nothing to sample.');return;}
  spriteId=found.spriteId;category=C.asset(spriteId).category;
  $('category').value=category;tool='place';$('tool').value=tool;corner=null;palette();redraw();
  setStatus('Eyedropper selected '+C.asset(spriteId).name+'.');return;
 }
 if(tool==='erase'){
  mutate(()=>C.erase(room,p.x,p.y),'Removed object or wall. Floors remain intact.');return;
 }
 if(tool==='spawn'){
  if(mutate(()=>C.setSpawn(room,p.x,p.y),'Player starting tile set.'))player={...room.spawns.player};
  redraw();return;
 }
 if(tool==='door'){
  if(player.x===p.x&&player.y===p.y&&room.walls[C.index(room,p.x,p.y)]==='door_open'){
   setStatus('Move out of the doorway before closing it.');return;
  }
  mutate(()=>C.toggleDoor(room,p.x,p.y),'Door toggled.');return;
 }
 if(tool==='fill'||tool==='rectangle'){
  if(!def||!['floors','construction'].includes(category)){setStatus('Choose Floors or Walls & Doors for this paint tool.');return;}
  if(tool==='rectangle'&&!corner){corner=p;redraw();setStatus('First corner selected. Click the opposite corner.');return;}
  const first=tool==='rectangle'?corner:p;corner=null;
  mutate(()=>K.apply(room,tool==='fill'?'fill':'rectangle',category,spriteId,first.x,first.y,p.x,p.y),tool==='fill'?'Region filled.':'Rectangle painted.');
  redraw();return;
 }
 if(tool==='place'){
  if(!def){setStatus('Select an item from the palette.');return;}
  if(['floors','construction'].includes(category))
   mutate(()=>K.apply(room,'single',category,spriteId,p.x,p.y),'Painted '+def.name+'.');
  else mutate(()=>C.place(room,spriteId,p.x,p.y),'Placed '+def.name+'.');
 }
}
function withSelected(action,label){
 if(mode!=='edit'){setStatus('Switch to Edit Room first.');return;}
 const obj=room.objects.find(o=>o.id===selected);
 if(!obj){setStatus('Select an object first.');return;}
 mutate(()=>action(obj),label);
}
function rotate(){withSelected(obj=>C.relocate(room,obj.id,obj.x,obj.y,(obj.rotation+1)%4),'Object rotated.')}
function duplicate(){
 withSelected(obj=>{
  for(const [dx,dy] of [[1,1],[2,0],[0,2],[-2,0],[0,-2],[2,2],[-2,-2]]){
   const copied=C.relocate(room,obj.id,obj.x+dx,obj.y+dy,obj.rotation,true);
   if(copied){selected=copied.id;return copied;}
  }return null;
 },'Object duplicated.');
}
function del(){withSelected(obj=>{const result=C.remove(room,obj.id);if(result)selected=null;return result;},'Selected object deleted.')}
function inspect(){
 const a=C.analyze(room),b=K.auditStations(room);
 const notes=[...a.errors,...a.warnings],inaccessible=b.inaccessible;
 setStatus('Room audit: '+a.reachableDoors+' reachable door(s), '+b.reachable+'/'+b.stations.length+' work areas reachable.'+(notes.length?' '+notes.join(' '):'')+(inaccessible.length?' Unreachable: '+inaccessible.join(', '):''));
}
function save(){
 try{
  const valid=C.sanitize(room,LOC,ROOM);
  valid.updatedAt=new Date().toISOString();
  localStorage.setItem(KEY,JSON.stringify(valid));
  room=valid;dirty=false;loaded=true;redraw();
  setStatus('Test room saved to its own isolated browser storage.');
 }catch(e){setStatus('Save failed: '+e.message)}
}
function load(){
 if(dirty&&!root.confirm('Discard unsaved room edits and reload the last saved test layout?'))return;
 let raw;try{raw=localStorage.getItem(KEY)}catch(e){setStatus('Browser storage unavailable: '+e.message);return;}
 if(!raw){setStatus('No saved test layout yet. Press Save Test Layout first.');return;}
 try{
  const parsed=C.sanitize(JSON.parse(raw),LOC,ROOM);
  room=parsed;player={...room.spawns.player};selected=null;corner=null;history=[];future=[];loaded=true;dirty=false;redraw();
  setStatus('Saved test layout reloaded.');
 }catch(e){setStatus('Saved test layout refused; data kept intact: '+e.message)}
}
function reset(){
 if(dirty&&!root.confirm('Discard unsaved edits and create a blank square room? The saved test layout will remain until you press Save.'))return;
 room=C.makeRoom(LOC,ROOM,16,16);player={...room.spawns.player};selected=null;corner=null;history=[];future=[];
 dirty=true;loaded=false;redraw();setStatus('New empty 16 × 16 test room. Previous saved layout is untouched.');
}
function exportJSON(){
 try{
  const data=JSON.stringify(C.sanitize(room,LOC,ROOM),null,2),blob=new Blob([data],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='dk-architect-test-room.json';document.body.appendChild(a);a.click();a.remove();
  root.setTimeout(()=>URL.revokeObjectURL(url),2000);setStatus('Test room JSON exported.');
 }catch(e){setStatus('Export failed: '+e.message)}
}
function importJSON(file){
 if(!file)return;
 if(file.size>2*1024*1024){setStatus('File too large (maximum 2 MiB).');return;}
 if(dirty&&!root.confirm('Discard unsaved edits and import a test-center layout?'))return;
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const parsed=C.sanitize(JSON.parse(String(reader.result)),LOC,ROOM);
   room=parsed;player={...room.spawns.player};selected=null;corner=null;history=[];future=[];dirty=true;loaded=false;
   redraw();setStatus('Valid test-room design imported. Press Save Test Layout to store it.');
  }catch(e){setStatus('Import rejected; original room retained: '+e.message)}
 };
 reader.onerror=()=>setStatus('Could not read that JSON file.');
 reader.readAsText(file);
}
function keys(e){
 const node=e.target,tag=node?.tagName?.toLowerCase();
 if(['input','textarea','select'].includes(tag)||node?.isContentEditable)return;
 const ctrl=e.ctrlKey||e.metaKey,k=e.key.toLowerCase();
 if(mode==='edit'&&ctrl&&k==='z'){e.preventDefault();undo();return;}
 if(mode==='edit'&&ctrl&&(k==='y'||k==='z'&&e.shiftKey)){e.preventDefault();redo();return;}
 if(ctrl||e.altKey)return;
 if(mode==='edit'){
  if(k==='r'){e.preventDefault();rotate();}
  else if(k==='delete'||k==='backspace'){e.preventDefault();del();}
  return;
 }
 const dirs={w:[0,-1],arrowup:[0,-1],s:[0,1],arrowdown:[0,1],a:[-1,0],arrowleft:[-1,0],d:[1,0],arrowright:[1,0]};
 if(dirs[k]){e.preventDefault();step(...dirs[k]);}
}
$('walkMode').addEventListener('click',()=>setMode('walk'));
$('editMode').addEventListener('click',()=>setMode('edit'));
$('category').addEventListener('change',e=>{
 category=e.target.value;const pack=$('artPack').value;
 spriteId=root.FE_ROOM_CATALOG.find(s=>s.category===category&&(pack==='all'||(s.third_party_pack||'original')===pack))?.id||'';
 palette();corner=null;redraw();setStatus('Choose an item from '+labels[category]+'.');
});
$('artPack').addEventListener('change',()=>{
 const pack=$('artPack').value,available=root.FE_ROOM_CATALOG.filter(s=>pack==='all'||(s.third_party_pack||'original')===pack);
 if(!available.some(s=>s.category===category)){category=available[0]?.category||'furniture';$('category').value=category;}
 spriteId=available.find(s=>s.category===category)?.id||'';
 palette();corner=null;selected=null;redraw();
 setStatus('Switched to '+$('artPack').selectedOptions[0].textContent+'. Select a sprite and click a tile.');
});
$('tool').addEventListener('change',e=>{tool=e.target.value;corner=null;selected=null;setMode('edit');});
canvas.addEventListener('click',e=>{const p=coords(e);if(p)act(p);canvas.focus({preventScroll:true});});
$('rotate').addEventListener('click',rotate);
$('duplicate').addEventListener('click',duplicate);
$('remove').addEventListener('click',del);
$('inspect').addEventListener('click',inspect);
$('undo').addEventListener('click',undo);
$('redo').addEventListener('click',redo);
$('save').addEventListener('click',save);
$('load').addEventListener('click',load);
$('new').addEventListener('click',reset);
$('export').addEventListener('click',exportJSON);
$('import').addEventListener('change',e=>{const file=e.target.files?.[0];importJSON(file);e.target.value='';});
root.addEventListener('keydown',keys);
IMG.addEventListener('load',()=>{palette();redraw();});
IMG.addEventListener('error',()=>setStatus('Spritesheet could not load. Open from the checked-out repository root to use original artwork.'));
room=starter();player={...room.spawns.player};
try{
 const saved=localStorage.getItem(KEY);
 if(saved){room=C.sanitize(JSON.parse(saved),LOC,ROOM);player={...room.spawns.player};loaded=true;}
}catch(e){setStatus('Saved test layout was invalid; sample room loaded without overwriting saved data. '+e.message)}
palette();redraw();
root.DK_TEST_CENTER=Object.freeze({
 isIsolated:true,storageKey:KEY,
 current:()=>({room:clone(room),player:{...player},mode}),
 inspect:()=>({room:C.analyze(room),stations:K.auditStations(room)})
});
})(window);
