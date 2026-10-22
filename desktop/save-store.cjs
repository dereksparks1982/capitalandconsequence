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
function fileFor(root,id){return path.join(root,validateId(id)+'.json')}
function atomicSave(root,id,json){
 validateJson(json);
 fs.mkdirSync(root,{recursive:true,mode:0o700});
 const target=fileFor(root,id),temp=target+'.tmp-'+process.pid+'-'+(++serial);
 try{
  fs.writeFileSync(temp,json,{encoding:'utf8',flag:'wx',mode:0o600});
  // Recovery copy is not selectable as an in-game rewind slot.
  if(fs.existsSync(target))fs.copyFileSync(target,target+'.recovery');
  fs.renameSync(temp,target);
 }finally{
  if(fs.existsSync(temp))fs.unlinkSync(temp);
 }
 return {ok:true,bytes:Buffer.byteLength(json,'utf8')};
}
function readSave(root,id){
 const target=fileFor(root,id);
 if(!fs.existsSync(target))return {ok:false,reason:'missing'};
 const json=fs.readFileSync(target,'utf8');
 try{validateJson(json);return {ok:true,json}}catch(_err){return {ok:false,reason:'corrupt'}}
}
function deleteSave(root,id){
 const target=fileFor(root,id);
 for(const name of [target,target+'.recovery'])if(fs.existsSync(name))fs.unlinkSync(name);
 return {ok:true};
}
module.exports={validateId,validateJson,atomicSave,readSave,deleteSave};
