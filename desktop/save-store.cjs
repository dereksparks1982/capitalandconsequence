'use strict';
// Atomic, profile-scoped Electron file autosave mirror.
// During migration, existing localStorage remains the authoritative loading source.
const fs=require('fs');
const path=require('path');
let serial=0;
function validateId(id){
 if(typeof id!=='string'||!(/^[a-zA-Z0-9_-]{1,64}$/).test(id))throw new Error('Invalid Federal Electric profile ID');
 return id;
}
function validateJson(json){
 if(typeof json!=='string'||json.length>64*1024*1024)throw new Error('Save payload missing or too large');
 const parsed=JSON.parse(json);
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error('Save must contain a state object');
 return json;
}
function validateRecord(id,json){
 validateId(id);validateJson(json);
 const obj=JSON.parse(json);
 if(id.startsWith('world_')){
  if(obj.version!==1||!obj.id||!Number.isSafeInteger(obj.clock?.worldMinute)||!Array.isArray(obj.events))throw Error('Incomplete world record');
 }else if(id.startsWith('map_')){
  if(obj.version!==1||obj.profileId!==id.slice(4)||!obj.positions||typeof obj.positions!=='object')throw Error('Incomplete map layout');
 }else if(!Number.isInteger(obj.version)||typeof obj.gameDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(obj.gameDate))throw Error('Incomplete character save');
 return json;
}
function fileFor(root,id){return path.join(root,validateId(id)+'.json')}
function atomicSave(root,id,json){
 validateRecord(id,json);
 fs.mkdirSync(root,{recursive:true,mode:0o700});
 const target=fileFor(root,id),temp=target+'.tmp-'+process.pid+'-'+(++serial);
 try{
  fs.writeFileSync(temp,json,{encoding:'utf8',flag:'wx',mode:0o600});
  // Recovery copy is not selectable as an in-game rewind slot.
  // Never overwrite a known-good recovery with a corrupted current file.
  if(fs.existsSync(target)){
   try{validateRecord(id,fs.readFileSync(target,'utf8'));fs.copyFileSync(target,target+'.recovery')}
   catch(_err){/* Preserve the previous usable recovery, if any. */}
  }
  fs.renameSync(temp,target);
 }finally{
  if(fs.existsSync(temp))fs.unlinkSync(temp);
 }
 return {ok:true,bytes:Buffer.byteLength(json,'utf8')};
}
function readSave(root,id){
 const target=fileFor(root,id);
 let found=false;
 for(const file of [target,target+'.recovery']){
  if(!fs.existsSync(file))continue;
  found=true;
  try{
   const json=fs.readFileSync(file,'utf8');
   validateRecord(id,json);
   return {ok:true,json,recovered:file!==target};
  }catch(_err){/* Try the prior valid generation before reporting corruption. */}
 }
 return {ok:false,reason:found?'corrupt':'missing'};
}
function listSaves(root){
 if(!fs.existsSync(root))return {ok:true,ids:[]};
 const ids=new Set();
 for(const entry of fs.readdirSync(root)){
  const match=/^([a-zA-Z0-9_-]{1,64})\.json(?:\.recovery)?$/.exec(entry);
  if(match&&readSave(root,match[1]).ok)ids.add(match[1]);
 }
 return {ok:true,ids:[...ids].sort()};
}
function deleteSave(root,id){
 const target=fileFor(root,id);
 for(const name of [target,target+'.recovery'])if(fs.existsSync(name))fs.unlinkSync(name);
 return {ok:true};
}
module.exports={validateId,validateJson,validateRecord,atomicSave,readSave,listSaves,deleteSave};
