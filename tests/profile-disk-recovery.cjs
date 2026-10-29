'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const disk=require('../desktop/save-store.cjs'),recovery=require('../profile-disk-recovery.js');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'cc-recovery-'));
const payload=(day)=>JSON.stringify({version:15,gameDate:day,characterRoute:'wardman',companyCash:42});
async function run(){
 try{
  assert.equal(disk.readSave(root,'p1').reason,'missing');
  disk.atomicSave(root,'p1',payload('1878-01-02'));
  disk.atomicSave(root,'p1',payload('1878-01-03'));
  fs.writeFileSync(path.join(root,'p1.json'),'{broken');
  const old=disk.readSave(root,'p1');
  assert.equal(old.ok,true);assert.equal(old.recovered,true);
  assert.equal(JSON.parse(old.json).gameDate,'1878-01-02');
  disk.atomicSave(root,'p1',payload('1878-01-04'));
  assert.equal(JSON.parse(disk.readSave(root,'p1').json).gameDate,'1878-01-04');
  fs.writeFileSync(path.join(root,'p1.json'),'{bad-again');
  assert.equal(JSON.parse(disk.readSave(root,'p1').json).gameDate,'1878-01-02','Never replace a healthy backup with corrupt current bytes');
  assert.deepEqual(disk.listSaves(root).ids,['p1']);
  const data=new Map();
  const storage={getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v))};
  const bridge={list:async()=>disk.listSaves(root),read:async id=>disk.readSave(root,id)};
  const opts={indexKey:'profiles',activeKey:'active',keyFor:id=>'profile_'+id};
  let result=await recovery.restore(storage,bridge,opts);
  assert.deepEqual(result.restored,['p1']);
  assert.equal(JSON.parse(storage.getItem('profile_p1')).gameDate,'1878-01-02');
  assert.equal(storage.getItem('active'),'p1');
  data.set('profile_p1',payload('1878-01-08'));
  result=await recovery.restore(storage,bridge,opts);
  assert.deepEqual(result.restored,[]);
  assert.equal(JSON.parse(storage.getItem('profile_p1')).gameDate,'1878-01-08','Valid newer local data wins');
  data.set('profile_p1','not-json');
  result=await recovery.restore(storage,bridge,opts);
  assert.deepEqual(result.restored,['p1']);
  assert([...data.keys()].some(k=>k.startsWith('profile_p1-corrupt-')));
  disk.deleteSave(root,'p1');
  assert.deepEqual(disk.listSaves(root).ids,[]);
  console.log('PASS Electron disk recovery, corrupt-primary fallback, prior-good backup preservation and profile restoration');
 }finally{fs.rmSync(root,{recursive:true,force:true})}
}
run().catch(e=>{console.error(e);process.exitCode=1});
