/* Recover Electron profile mirrors before the renderer starts a new autosave.
 * Valid local records take precedence. No fallback creates game events.
 */
(function(root){
 'use strict';
 const idValid=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(id);
 function gameRecord(raw){
  if(typeof raw!=='string')return false;
  try{
   const obj=JSON.parse(raw);
   return !!obj&&typeof obj==='object'&&!Array.isArray(obj)
    &&Number.isInteger(obj.version)&&typeof obj.gameDate==='string'
    &&/^\d{4}-\d{2}-\d{2}$/.test(obj.gameDate);
  }catch(_err){return false}
 }
 async function restore(storage,bridge,{indexKey,activeKey,keyFor,limit=4}={}){
  if(!storage||!bridge||typeof bridge.list!=='function'||typeof bridge.read!=='function')return {restored:[],reason:'unavailable'};
  if(typeof indexKey!=='string'||typeof activeKey!=='string'||typeof keyFor!=='function')throw Error('Missing recovery profile keys');
  let profiles=[];
  try{const parsed=JSON.parse(storage.getItem(indexKey)||'[]');if(Array.isArray(parsed))profiles=parsed.filter(p=>idValid(p?.id)).slice(0,limit)}
  catch(_err){/* A damaged profile directory can be reconstructed from mirrors. */}
  const listed=await bridge.list();
  const diskIds=Array.isArray(listed?.ids)?listed.ids.filter(id=>idValid(id)&&!id.startsWith('world_')&&!id.startsWith('map_')):[];
  const candidates=[...new Set([...profiles.map(p=>p.id),...diskIds])].slice(0,limit);
  const restored=[];
  for(const id of candidates){
   const key=keyFor(id);
   const old=storage.getItem(key);
   if(gameRecord(old)){
    if(!profiles.some(p=>p.id===id))profiles.push({id,name:'Recovered Profile',created:Date.now(),lastPlayed:Date.now()});
    continue;
   }
   let result;
   try{result=await bridge.read(id)}catch(_err){continue}
   if(!result?.ok||!gameRecord(result.json))continue;
   try{
    if(old!==null)storage.setItem(key+'-corrupt-'+Date.now(),old);
    storage.setItem(key,result.json);
    restored.push(id);
    if(!profiles.some(p=>p.id===id)){
     const route=JSON.parse(result.json).characterRoute||'industrialist';
     profiles.push({id,name:'Recovered '+String(route).slice(0,20),created:Date.now(),lastPlayed:Date.now()});
    }
   }catch(_err){/* Never silently delete a corrupt local record on quota failure. */}
  }
  if(profiles.length){
   storage.setItem(indexKey,JSON.stringify(profiles.slice(0,limit)));
   const active=storage.getItem(activeKey);
   if(!profiles.some(p=>p.id===active))storage.setItem(activeKey,profiles[0].id);
  }
  return {restored,profiles:profiles.length};
 }
 const api=Object.freeze({gameRecord,restore});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_PROFILE_DISK_RECOVERY=api;
})(typeof window!=='undefined'?window:globalThis);
