'use strict';
// Produce one complete portable archive from the locally built Electron folder.
// Archive is installed only after gzip+tar validation; no network/Actions/branch.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),version=require('../package.json').version;
function run(binary,args){
 const result=cp.spawnSync(binary,args,{encoding:'utf8',timeout:600000,maxBuffer:8*1024*1024});
 if(result.error||result.status!==0)
  throw Error(binary+' failed: '+(result.error?.message||result.stderr||'exit '+result.status));
 return result.stdout||'';
}
function packagePortable(base=root,v=version){
 const dir=path.resolve(base),unpacked=path.join(dir,'linux-unpacked');
 const binary=path.join(unpacked,'capital-consequence');
 const stat=fs.statSync(binary);
 if(!stat.isFile()||(stat.mode&0o111)===0)throw Error('Built Linux executable is missing or not executable: '+binary);
 const name='Capital-and-Consequence-'+v+'-x64.tar.gz',out=path.join(dir,name);
 const pending=path.join(dir,'.'+name+'.pending-'+process.pid);
 try{
  run('tar',['-czf',pending,'-C',dir,'linux-unpacked']);
  if(fs.statSync(pending).size===0)throw Error('Portable archive was empty.');
  run('gzip',['-t',pending]);
  const listing=run('tar',['-tzf',pending]);
  if(!listing.split('\n').includes('linux-unpacked/capital-consequence'))
   throw Error('Portable archive did not contain the runnable game.');
  fs.renameSync(pending,out);
  return out;
 }finally{
  if(fs.existsSync(pending))fs.rmSync(pending,{force:true});
 }
}
if(require.main===module){
 try{console.log('Portable game archive integrity verified: '+packagePortable());}
 catch(error){console.error('Portable packaging FAILED; existing archive preserved: '+error.message);process.exitCode=1}
}
module.exports={packagePortable};
