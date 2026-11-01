/* Capital & Consequence: original room painter, inspired by generic open
 * tile-editor concepts. Written for this game, no third-party code/assets. */
(function(root){
 'use strict';
 const C=root.FE_ROOM_BUILDER_CORE;
 if(!C)return;
 const LIBRARY_KEY='ccRoomBlueprintLibraryV1';
 const MAX_DRAFTS=20;
 const clone=C.clone;
 const valid=(room,x,y)=>C.inBounds(room,x,y);
 function pick(room,x,y){
  if(!valid(room,x,y))return null;
  const obj=C.findObject(room,x,y);
  if(obj)return {layer:'objects',spriteId:obj.spriteId,objectId:obj.id};
  const wall=room.walls[C.index(room,x,y)];
  if(wall)return {layer:'construction',spriteId:wall};
  return {layer:'floors',spriteId:room.floor[C.index(room,x,y)]};
 }
 function tilesFor(room,tool,x,y,endX=x,endY=y,layer='floors'){
  if(!valid(room,x,y))return null;
  if(tool==='single')return [{x,y}];
  if(tool==='rectangle'){
   if(!valid(room,endX,endY))return null;
   const tiles=[];
   for(let yy=Math.min(y,endY);yy<=Math.max(y,endY);yy++)
    for(let xx=Math.min(x,endX);xx<=Math.max(x,endX);xx++)
     tiles.push({x:xx,y:yy});
   return tiles;
  }
  if(tool==='fill'){
   const field=layer==='construction'?'walls':'floor';
   const start=room[field][C.index(room,x,y)];
   const visited=new Set([C.cell(x,y)]),queue=[{x,y}];
   for(let at=0;at<queue.length;at++){
    const item=queue[at];
    for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){
     const nx=item.x+dx,ny=item.y+dy,k=C.cell(nx,ny);
     if(!valid(room,nx,ny)||visited.has(k)||room[field][C.index(room,nx,ny)]!==start)continue;
     visited.add(k);queue.push({x:nx,y:ny});
    }
   }
   return queue;
  }
  return null;
 }
 function apply(room,tool,layer,id,x,y,endX=x,endY=y){
  if(!room||!['floors','construction'].includes(layer))return {ok:false,reason:'Select a floor or construction tile.'};
  const sprite=id===null?null:C.asset(id);
  if(id!==null&&(!sprite||sprite.category!==layer))
   return {ok:false,reason:'That sprite does not belong to this painting layer.'};
  if(layer==='floors'&&id===null)return {ok:false,reason:'Floors must have a tile.'};
  if(!['single','fill','rectangle'].includes(tool))return {ok:false,reason:'Unknown paint tool.'};
  const tiles=tilesFor(room,tool,x,y,endX,endY,layer);
  if(!tiles)return {ok:false,reason:'Paint area is outside the room.'};
  const next=clone(room),field=layer==='floors'?'floor':'walls';
  let changes=0;
  for(const pos of tiles){
   const cellIndex=C.index(next,pos.x,pos.y);
   if(next[field][cellIndex]===id)continue;
   let ok=false;
   if(layer==='construction'&&id===null){
    next.walls[cellIndex]=null;ok=true;
   }else ok=C.paint(next,pos.x,pos.y,id);
   if(!ok)return {ok:false,reason:'Blocked at '+(pos.x+1)+', '+(pos.y+1)+'. No tiles were changed.'};
   changes++;
  }
  // Preserve the exact same object array identities. Only tile fields commit.
  if(changes){room.floor=next.floor;room.walls=next.walls;}
  return {ok:true,changes,count:tiles.length};
 }
 // Data-driven description is deliberately not a claim of live workplace AI.
 const BEHAVIORS=Object.freeze({
  desk_oak:Object.freeze({kind:'workstation',label:'Executive Desk',action:'use-executive-desk',hint:'Charles may use this desk in his actual executive office; the game checks permission and proximity.'}),
  chair_office:Object.freeze({kind:'seating',label:'Chair',hint:'Seating anchor for a later NPC work or rest assignment.'}),
  file_cabinet:Object.freeze({kind:'storage',label:'Records Cabinet',hint:'A potential record-storage anchor. Does not currently create inventory.'}),
  bookshelf:Object.freeze({kind:'storage',label:'Bookshelf',hint:'Furniture only until readable books are authored.'}),
  heating_stove:Object.freeze({kind:'utility',label:'Heating Stove',hint:'Heat needs and fuel consumption are not yet simulated.'}),
  oil_lamp:Object.freeze({kind:'light',label:'Oil Lamp',hint:'Static prop. Power and lighting simulation are not implemented.'}),
  door_open:Object.freeze({kind:'door',label:'Open Door',hint:'Passable opening.'}),
  door_closed:Object.freeze({kind:'door',label:'Closed Door',hint:'Blocks walking until opened.'})
 });
 function describe(id){
  const sprite=C.asset(id);
  if(!sprite)return null;
  const meta=BEHAVIORS[id]||{};
  const footprint=C.dims(sprite);
  return {spriteId:id,label:meta.label||sprite.name,kind:meta.kind||sprite.category,
   action:meta.action||null,hint:meta.hint||'Appearance and collision only; no simulated job has been assigned.',
   solid:!!sprite.solid,footprint:[footprint[0],footprint[1]],category:sprite.category};
 }
 function readLibrary(storage){
  let raw;
  try{raw=storage.getItem(LIBRARY_KEY)}catch(error){throw Error('Local draft storage unavailable');}
  if(!raw)return [];
  let parsed;
  try{parsed=JSON.parse(raw)}catch(e){throw Error('Draft library cannot be read; it was not overwritten.')}
  if(!Array.isArray(parsed)||parsed.length>MAX_DRAFTS)throw Error('Draft library structure invalid');
  const seen=new Set();
  return parsed.map(item=>{
   if(!item||typeof item.name!=='string'||item.name.length<1||item.name.length>50||
    !/^[\w .'-]+$/.test(item.name)||seen.has(item.name.toLowerCase()))throw Error('Draft library contains invalid names');
   const record=C.sanitize(item.layout,item.layout?.locationId,item.layout?.roomId);
   seen.add(item.name.toLowerCase());
   return {name:item.name,layout:record};
  });
 }
 function listDrafts(storage,locationId='factory',roomId='executive-office'){
  return readLibrary(storage).filter(v=>v.layout.locationId===locationId&&v.layout.roomId===roomId)
    .map(v=>({name:v.name,locationId:v.layout.locationId,roomId:v.layout.roomId}));
 }
 function saveDraft(storage,layout,name){
  const title=String(name||'').trim();
  if(title.length<1||title.length>50||!/^[\w .'-]+$/.test(title))throw Error('Name must be 1–50 letters, digits, spaces, dots, dashes or apostrophes.');
  const room=C.sanitize(layout,layout.locationId,layout.roomId);
  const all=readLibrary(storage);
  const existing=all.findIndex(d=>d.name.toLowerCase()===title.toLowerCase()&&d.layout.locationId===room.locationId&&d.layout.roomId===room.roomId);
  if(existing<0&&all.length>=MAX_DRAFTS)throw Error('Draft library is full (20 designs). Remove an old draft first.');
  const value={name:title,layout:room};
  if(existing>=0)all[existing]=value;else all.push(value);
  storage.setItem(LIBRARY_KEY,JSON.stringify(all));return title;
 }
 function openDraft(storage,locationId,roomId,name){
  const v=readLibrary(storage).find(v=>v.name===name&&v.layout.locationId===locationId&&v.layout.roomId===roomId);
  if(!v)throw Error('No matching blueprint exists for this room.');
  return clone(v.layout);
 }
 function deleteDraft(storage,locationId,roomId,name){
  const all=readLibrary(storage);
  const filtered=all.filter(v=>!(v.name===name&&v.layout.locationId===locationId&&v.layout.roomId===roomId));
  if(all.length===filtered.length)return false;
  storage.setItem(LIBRARY_KEY,JSON.stringify(filtered));
  return true;
 }
 const api=Object.freeze({pick,tilesFor,apply,describe,listDrafts,saveDraft,openDraft,deleteDraft,libraryKey:LIBRARY_KEY});
 root.FE_ROOM_BUILDER_KIT=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
