/* Capital & Consequence: physical belongings, not a duplicate story journal.
 * Desk storage and carried pockets are distinct. Items are acquired only by
 * actual gameplay events; there are no free/test keys in a new game.
 */
(function(root){
 'use strict';
 const CONTAINERS=Object.freeze({
  'left-pocket':{name:'Left Pocket',where:'person'},
  'right-pocket':{name:'Right Pocket',where:'person'},
  'desk':{name:'Executive Desk',where:'factory',room:'executive-office'},
  'home-storage':{name:'Household Storage',where:'home',room:'storage'},
  'bedroom-chest':{name:'Bedroom Chest',where:'home',room:'bedroom'},
  'office-storage':{name:'Executive Office Storage',where:'factory',room:'executive-office'}
 });
 const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(+n)?+n:0));
 const profile=()=>typeof activeProfileId==='function'&&!!activeProfileId();
 function isAccessible(id){
  const c=CONTAINERS[id];
  if(!c||!profile())return false;
  if(c.where==='person')return true;
  const current=typeof currentCityLocation==='function'&&currentCityLocation();
  return current?.locationId===c.where&&current?.roomId===c.room;
 }
 function records(){
  if(!S.personalEffects||typeof S.personalEffects!=='object')S.personalEffects={version:1,items:[]};
  if(!Array.isArray(S.personalEffects.items))S.personalEffects.items=[];
  return S.personalEffects.items;
 }
 const view=v=>({id:v.id,name:v.name,kind:v.kind||'keepsake',
  description:v.description||'',container:v.container,
  x:clamp(v.x??.1),y:clamp(v.y??.5)});
 function list(id){
  if(!isAccessible(id))return [];
  return records().filter(item=>item&&item.container===id).map(view);
 }
 function carried(){
  if(!profile())return [];
  return records().filter(item=>item&&['left-pocket','right-pocket'].includes(item.container)).map(view);
 }
 function persist(){
  if(typeof save==='function')save(true);
  root.FE_DESK_COLLECTION?.refresh?.();
 }
 function acquire(item){
  if(!profile()||!item||typeof item!=='object')return {ok:false,reason:'No active player/item.'};
  const id=String(item.id||'').trim(),name=String(item.name||'').trim();
  if(!/^[a-zA-Z0-9_.:-]{1,90}$/.test(id)||!name||name.length>90)
   return {ok:false,reason:'Invalid physical item ID/name.'};
  const container=item.container||'left-pocket';
  if(!CONTAINERS[container]||!isAccessible(container))
   return {ok:false,reason:'Target container is unavailable.'};
  const all=records();
  if(all.some(v=>v.id===id))return {ok:false,reason:'Item already owned.'};
  if(all.length>=256)return {ok:false,reason:'Possessions register is full.'};
  const placed={id,name,kind:String(item.kind||'keepsake').slice(0,30),
   description:String(item.description||'').slice(0,600),container,
   x:clamp(item.x??.08),y:clamp(item.y??.5)};
  all.push(placed);persist();return {ok:true,item:view(placed)};
 }
 function transfer(id,destination){
  if(!CONTAINERS[destination]||!isAccessible(destination))
   return {ok:false,reason:'Destination is not accessible.'};
  const item=records().find(v=>v?.id===id);
  if(!item||!isAccessible(item.container))
   return {ok:false,reason:'That possession is not physically available.'};
  if(item.container===destination)return {ok:false,reason:'The item is already there.'};
  if(destination==='bedroom-chest'&&list('bedroom-chest').length>=64)
   return {ok:false,reason:'The bedroom chest is full (64 objects).'};
  if(destination==='desk'){
   const occupied=list('desk').length;
   if(occupied>=40)return {ok:false,reason:'No room for more desk objects.'};
   item.x=clamp(.08+(occupied%7)*.1);
   item.y=clamp(.15+Math.floor(occupied/7)*.18);
  }
  item.container=destination;persist();return {ok:true,item:view(item)};
 }
 function position(id,x,y){
  if(!isAccessible('desk'))return {ok:false,reason:'Not at the executive desk.'};
  const item=records().find(v=>v?.id===id&&v.container==='desk');
  if(!item)return {ok:false,reason:'Desk object not found.'};
  item.x=clamp(x);item.y=clamp(y);persist();return {ok:true,item:view(item)};
 }
 function renderRoomStorage(locationId,roomId){
  const section=document.getElementById('cityRoomPersonalStorage');
  const contents=document.getElementById('cityRoomPersonalStorageContents');
  if(!section||!contents)return;
  const atStorage=locationId==='home'&&roomId==='storage';
  section.hidden=!atStorage;
  if(!atStorage)return;
  contents.replaceChildren();
  const entries=list('home-storage');
  if(!entries.length){contents.textContent='No personal belongings stored here.';return}
  const ul=document.createElement('ul');
  for(const item of entries){const li=document.createElement('li');li.textContent=item.name;ul.appendChild(li)}
  contents.appendChild(ul);
 }
 root.FE_PERSONAL_EFFECTS=Object.freeze({
  containers:CONTAINERS,list,carried,acquire,transfer,position,
  isAccessible,renderRoomStorage
 });
})(window);
