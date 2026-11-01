/* Capital & Consequence: original 32px room design model. No in-game clock/economy mutations. */
(function(root){
'use strict';
const TILE=32,MIN=8,MAX=40,MAX_OBJECTS=400;
const categories=['floors','construction','furniture','small_props','people'];
const clone=v=>JSON.parse(JSON.stringify(v));
const key=(location,room)=>'ccRoomLayoutV1:'+location+':'+room;
const integer=(n,fallback)=>Number.isSafeInteger(n)?n:fallback;
function catalog(){return root.FE_ROOM_CATALOG||[]}
function asset(id){return catalog().find(s=>s.id===id)||null}
function dims(item,rotation=0){const size=item?.footprint_tiles||[1,1];return rotation%2?[size[1],size[0]]:[size[0],size[1]]}
function cell(x,y){return x+','+y}
function index(room,x,y){return y*room.widthTiles+x}
function inBounds(room,x,y,w=1,h=1){return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x+w<=room.widthTiles&&y+h<=room.heightTiles}
function makeRoom(locationId='factory',roomId='executive-office',widthTiles=16,heightTiles=12){
 const w=Math.max(MIN,Math.min(MAX,integer(widthTiles,16)));
 const h=Math.max(MIN,Math.min(MAX,integer(heightTiles,12)));
 const floor=Array(w*h).fill('floor_planks'),walls=Array(w*h).fill(null);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  if(y===0||y===h-1)walls[y*w+x]='wall_horizontal';
  else if(x===0||x===w-1)walls[y*w+x]='wall_vertical';
 }
 walls[(h-1)*w+Math.floor(w/2)]='door_open';
 return {schemaVersion:1,locationId,roomId,widthTiles:w,heightTiles:h,floor,walls,objects:[],
  spawns:{player:{x:Math.floor(w/2),y:h-3}},updatedAt:null};
}
function sanitize(raw,locationId='factory',roomId='executive-office'){
 if(!raw||typeof raw!=='object'||raw.schemaVersion!==1||raw.locationId!==locationId||raw.roomId!==roomId)throw Error('Room identity/version mismatch');
 const room=makeRoom(locationId,roomId,raw.widthTiles,raw.heightTiles);
 if(room.widthTiles!==raw.widthTiles||room.heightTiles!==raw.heightTiles)throw Error('Invalid room dimensions');
 for(const [field,allowed] of [['floor',['floors']],['walls',['construction']]]){
  const values=raw[field];
  if(!Array.isArray(values)||values.length!==room.widthTiles*room.heightTiles)throw Error('Invalid tile grid');
  room[field]=values.map(id=>{
   if(id===null&&field==='walls')return null;
   const sprite=asset(id);
   if(!sprite||!allowed.includes(sprite.category))throw Error('Unknown tile: '+id);
   return id;
  });
 }
 room.objects=[];
 if(!Array.isArray(raw.objects)||raw.objects.length>MAX_OBJECTS)throw Error('Invalid object list');
 for(const obj of raw.objects){
  if(!obj||typeof obj.id!=='string'||!/^[a-zA-Z0-9_-]{1,50}$/.test(obj.id)||room.objects.some(o=>o.id===obj.id))throw Error('Invalid object ID');
  const sprite=asset(obj.spriteId),rot=obj.rotation;
  if(!sprite||!['furniture','small_props','people'].includes(sprite.category)||!Number.isInteger(rot)||rot<0||rot>3)throw Error('Unknown object sprite');
  const [w,h]=dims(sprite,rot);
  if(!inBounds(room,obj.x,obj.y,w,h))throw Error('Object outside room');
  if(sprite.solid&&overlapsSolid(room,obj.x,obj.y,w,h))throw Error('Objects overlap solids');
  room.objects.push({id:obj.id,spriteId:obj.spriteId,x:obj.x,y:obj.y,rotation:rot});
 }
 const pos=raw.spawns?.player;
 if(!pos||!inBounds(room,pos.x,pos.y)||blocked(room,pos.x,pos.y))throw Error('Player spawn is obstructed');
 room.spawns={player:{x:pos.x,y:pos.y}};
 room.updatedAt=typeof raw.updatedAt==='string'?raw.updatedAt:null;
 return room;
}
function solidAt(room,x,y,excludeId=null){
 if(!inBounds(room,x,y))return true;
 const wall=asset(room.walls[index(room,x,y)]);
 if(wall?.solid)return true;
 return room.objects.some(obj=>{
  if(obj.id===excludeId)return false;
  const a=asset(obj.spriteId);if(!a?.solid)return false;
  const [w,h]=dims(a,obj.rotation);
  return x>=obj.x&&x<obj.x+w&&y>=obj.y&&y<obj.y+h;
 });
}
function overlapsSolid(room,x,y,w,h,excludeId=null){
 for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(solidAt(room,i,j,excludeId))return true;
 return false;
}
function blocked(room,x,y){return solidAt(room,x,y)}
function contains(obj,x,y){const [w,h]=dims(asset(obj.spriteId),obj.rotation);return x>=obj.x&&x<obj.x+w&&y>=obj.y&&y<obj.y+h}
function findObject(room,x,y){return [...room.objects].reverse().find(o=>contains(o,x,y))||null}
function paint(room,x,y,id){
 if(!inBounds(room,x,y))return false;
 const s=asset(id),idx=index(room,x,y);
 if(!s||!['floors','construction'].includes(s.category))return false;
 if(s.category==='floors'){if(room.floor[idx]===id)return false;room.floor[idx]=id;return true;}
 if(room.walls[idx]===id)return false;
 if(s.solid&&(room.spawns.player.x===x&&room.spawns.player.y===y||
   room.objects.some(o=>asset(o.spriteId)?.solid&&contains(o,x,y))))return false;
 room.walls[idx]=id;return true;
}
function erase(room,x,y){
 if(!inBounds(room,x,y))return false;
 const obj=findObject(room,x,y);
 if(obj){room.objects.splice(room.objects.indexOf(obj),1);return true;}
 const idx=index(room,x,y);if(room.walls[idx]){room.walls[idx]=null;return true;}
 return false;
}
function place(room,id,x,y){return placeRotated(room,id,x,y,0);}
function relocate(room,id,x,y,rotation=null,duplicate=false){
 const obj=room.objects.find(o=>o.id===id);if(!obj)return null;
 const s=asset(obj.spriteId),r=rotation===null?obj.rotation:rotation;
 if(!Number.isInteger(r)||r<0||r>3)return null;
 const [w,h]=dims(s,r);
 if(!inBounds(room,x,y,w,h)||s.solid&&overlapsSolid(room,x,y,w,h,duplicate?null:id))return null;
 if(s.solid&&x<=room.spawns.player.x&&room.spawns.player.x<x+w&&y<=room.spawns.player.y&&room.spawns.player.y<y+h)return null;
 if(duplicate)return placeRotated(room,obj.spriteId,x,y,r);
 obj.x=x;obj.y=y;obj.rotation=r;return obj;
}
function placeRotated(room,spriteId,x,y,rotation){
 const s=asset(spriteId);
 if(!s||!['furniture','small_props','people'].includes(s.category)||room.objects.length>=MAX_OBJECTS||
  !Number.isInteger(rotation)||rotation<0||rotation>3)return null;
 const [w,h]=dims(s,rotation);
 if(!inBounds(room,x,y,w,h)||s.solid&&overlapsSolid(room,x,y,w,h))return null;
 if(s.solid&&x<=room.spawns.player.x&&room.spawns.player.x<x+w&&
  y<=room.spawns.player.y&&room.spawns.player.y<y+h)return null;
 const uid='obj_'+Math.random().toString(36).slice(2,10)+Date.now().toString(36);
 const obj={id:uid,spriteId,x,y,rotation};room.objects.push(obj);return obj;
}
function remove(room,id){const i=room.objects.findIndex(o=>o.id===id);if(i<0)return false;room.objects.splice(i,1);return true}
function setSpawn(room,x,y){if(blocked(room,x,y))return false;room.spawns.player={x,y};return true}
function walk(room,position,dx,dy){
 if(!Number.isInteger(dx)||!Number.isInteger(dy)||Math.abs(dx)+Math.abs(dy)!==1)return position;
 const x=position.x+dx,y=position.y+dy;
 return blocked(room,x,y)?position:{x,y};
}
function toggleDoor(room,x,y){
 if(!inBounds(room,x,y))return false;
 const i=index(room,x,y),id=room.walls[i];
 if(id==='door_closed'){room.walls[i]='door_open';return true;}
 if(id==='door_open'&&!(room.spawns.player.x===x&&room.spawns.player.y===y)&&!room.objects.some(o=>contains(o,x,y))){room.walls[i]='door_closed';return true;}
 return false;
}
const api={TILE,key,asset,dims,cell,index,inBounds,makeRoom,sanitize,blocked,findObject,paint,erase,place,relocate,remove,setSpawn,walk,toggleDoor,clone};
root.FE_ROOM_BUILDER_CORE=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
