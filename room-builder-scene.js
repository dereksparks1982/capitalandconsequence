/* Saved-room renderer for the existing registered Executive Office.
   Uses the same art and collision model as the editor, while preserving
   original city-room navigation, permissions, and game-state accounting. */
(function(root){
'use strict';
const api=root.FE_ROOM_BUILDER,C=root.FE_ROOM_BUILDER_CORE;
if(!api||!C||typeof document==='undefined')return;
const overlay=document.getElementById('cityRoomOverlay');
const name=document.getElementById('cityRoomName');
const description=document.getElementById('cityRoomDescription');
if(!overlay||!name||!description)return;
const section=document.createElement('section');section.id='roomBuilderLiveScene';
section.setAttribute('aria-label','Walkable Federal Electric executive office');
section.hidden=true;
section.innerHTML='<h4>Federal Electric · Executive Office Floorplan</h4>'+
 '<div class="rb-live-view"><canvas tabindex="0" aria-label="Walk Charles in the executive office with arrows or WASD"></canvas></div>'+
 '<p class="rb-scene-status" role="status">Click the room, then walk with WASD or arrow keys. Click adjacent doors to toggle them.</p>'+
 '<p class="rb-scene-help">Walk with arrows / WASD. Approach the desk and press E to use it. Existing travel rules handle other locations.</p>';
description.after(section);
const canvas=section.querySelector('canvas'),ctx=canvas.getContext('2d'),out=section.querySelector('.rb-scene-status');
let layout=null,pos=null,activeKey='',facing='front';
function nearObject(obj){
 if(!obj||!pos)return false;
 const [w,h]=C.dims(C.asset(obj.spriteId),obj.rotation);
 const dx=Math.max(obj.x-pos.x,0,pos.x-(obj.x+w-1));
 const dy=Math.max(obj.y-pos.y,0,pos.y-(obj.y+h-1));
 return dx+dy<=1;
}
function nearbyDesk(){
 return layout?.objects.find(o=>o.spriteId==='desk_oak'&&nearObject(o))||null;
}
function useDesk(){
 if(!nearbyDesk()){out.textContent='Approach the office desk first, then press E.';return false;}
 const ok=root.FE_ROOM_SCENE_ACTIONS?.useDesk?.()===true;
 if(!ok)out.textContent='You must be Charles in his actual office to use the executive desk.';
 return ok;
}
function isOffice(){
 return !overlay.hidden&&overlay.dataset.locationId==='factory'&&name.textContent.trim()==='Executive Office';
}
function draw(){
 if(!layout||!pos)return;
 canvas.width=layout.widthTiles*C.TILE;canvas.height=layout.heightTiles*C.TILE;
 api.drawRoom(ctx,layout,{player:pos,playerFacing:facing});
 if(nearbyDesk())out.textContent='Beside the executive desk. Press E to use it.';
}
function refresh(){
 if(!isOffice()){section.hidden=true;activeKey='';return;}
 const data=api.getSaved();
 if(!data){section.hidden=true;activeKey='';return;}
 const fingerprint=JSON.stringify(data);
 if(activeKey!==fingerprint){
  layout=data;pos={...data.spawns.player};activeKey=fingerprint;facing='front';
  out.textContent='Room loaded. Click the floorplan, then use arrows or WASD to walk.';
 }
 section.hidden=false;draw();
}
canvas.addEventListener('keydown',e=>{
 if(!layout||section.hidden)return;
 const dirs={arrowup:[0,-1,'back'],w:[0,-1,'back'],arrowdown:[0,1,'front'],s:[0,1,'front'],
  arrowleft:[-1,0,'left'],a:[-1,0,'left'],arrowright:[1,0,'right'],d:[1,0,'right']};
 if(e.key.toLowerCase()==='e'){e.preventDefault();useDesk();return;}
 const step=dirs[e.key.toLowerCase()];if(!step)return;
 e.preventDefault();
 facing=step[2];
 const next=C.walk(layout,pos,step[0],step[1]);
 if(next===pos)out.textContent='Blocked by a wall, door, or solid furniture.';
 else{
  pos=next;
  const tile=layout.walls[C.index(layout,pos.x,pos.y)];
  out.textContent=tile==='door_open'?
   'You reached an open doorway. Use the existing room directory or Return to Map to travel.':
   'Position: '+(pos.x+1)+', '+(pos.y+1)+'.';
 }
 draw();
});
canvas.addEventListener('click',e=>{
 if(!layout||section.hidden)return;
 canvas.focus();
 const r=canvas.getBoundingClientRect();
 const x=Math.floor((e.clientX-r.left)/r.width*layout.widthTiles);
 const y=Math.floor((e.clientY-r.top)/r.height*layout.heightTiles);
 const touched=C.findObject(layout,x,y);
 if(touched?.spriteId==='desk_oak'){
  useDesk();return;
 }
 if(Math.abs(pos.x-x)+Math.abs(pos.y-y)!==1)return;
 if(C.toggleDoor(layout,x,y)){out.textContent='Door '+(layout.walls[C.index(layout,x,y)]==='door_open'?'opened.':'closed.')+' Design unchanged on disk.';draw();}
});
root.FE_ROOM_BUILDER.refreshScene=refresh;
const observer=new MutationObserver(()=>queueMicrotask(refresh));
observer.observe(overlay,{attributes:true,attributeFilter:['hidden','data-location-id']});
observer.observe(name,{childList:true,characterData:true,subtree:true});
refresh();
})(window);
