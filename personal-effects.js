/* v0.6.8: player-profile personal effects, location-bound empty storage.
   No items are fabricated, and no transfer/equipment action is enabled until
   item dimensions, capacities and acquisition rules are approved. */
(function(){
 'use strict';
 const CONTAINERS=Object.freeze({
  'left-pocket':{name:'Left Pocket',where:'person'},
  'right-pocket':{name:'Right Pocket',where:'person'},
  'home-storage':{name:'Household Storage',where:'home',room:'storage'},
  'office-storage':{name:'Executive Office Storage',where:'factory',room:'executive-office'}
 });
 function isAccessible(id){
  const c=CONTAINERS[id];
  if(!c||typeof activeProfileId!=='function'||!activeProfileId())return false;
  if(c.where==='person')return true;
  const current=currentCityLocation();
  return current.locationId===c.where&&current.roomId===c.room;
 }
 function list(id){
  if(!isAccessible(id))return [];
  return (Array.isArray(S.personalEffects?.items)?S.personalEffects.items:[])
   .filter(item=>item&&item.container===id)
   .map(item=>({id:item.id,name:item.name,kind:item.kind}));
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
 window.FE_PERSONAL_EFFECTS=Object.freeze({
  containers:CONTAINERS, list, isAccessible, renderRoomStorage
 });
})();
