'use strict';
/* Build the REAL Electron Linux folder, smoke-test its actual executable,
 * then move its runtime into THIS REPOSITORY ROOT. No AppImage, dist,
 * secondary checkout, GitHub Actions, or downloader posing as a game.
 *
 * This script MUST NOT report success when the runtime is absent.
 */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const binaryName='capitalandconsequence';
const runtime=['resources','locales'];
const GITHUB_MAX_BLOB=100*1024*1024;
function fail(message){throw Error(message)}
function validElf(filename){
 const f=fs.openSync(filename,'r'),head=Buffer.alloc(4);
 try{fs.readSync(f,head,0,4,0)}finally{fs.closeSync(f)}
 return head.equals(Buffer.from([127,69,76,70]));
}
function collect(dir){
 const results=[];
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const full=path.join(dir,entry.name);
  if(entry.isDirectory())results.push(...collect(full));
  else if(entry.isFile())results.push({path:full,size:fs.statSync(full).size});
  else if(entry.isSymbolicLink())results.push({path:full,size:0});
 }
 return results;
}
function inspect(dir,{publishable=false}={}){
 const executable=path.join(dir,binaryName);
 const archive=path.join(dir,'resources','app.asar');
 if(!fs.existsSync(executable)||!fs.statSync(executable).isFile()||
   !(fs.statSync(executable).mode&0o111)||!validElf(executable))
  fail('A real executable ELF named '+binaryName+' is required.');
 if(!fs.existsSync(archive)||fs.statSync(archive).size<1024*1024)
  fail('Complete packaged resources/app.asar is required.');
 for(const name of runtime)if(!fs.statSync(path.join(dir,name)).isDirectory())
  fail('Bundled Linux runtime is missing '+name+'/');
 for(const name of ['icudtl.dat','resources.pak','v8_context_snapshot.bin']){
  if(!fs.existsSync(path.join(dir,name)))fail('Bundled runtime file missing: '+name);
 }
 const all=collect(dir);
 const oversize=all.filter(f=>f.size>=GITHUB_MAX_BLOB);
 if(publishable&&oversize.length){
  fail('GITHUB ZIP NOT READY: GitHub refuses a blob at or over 100 MiB: '+
    oversize.map(f=>path.relative(dir,f.path)+' ('+Math.ceil(f.size/1048576)+' MiB)').join(', ')+
    '. A tested, smaller self-contained runtime is needed; do NOT claim the source ZIP is playable.');
 }
 return {executable,archive,files:all.length,bytes:all.reduce((a,f)=>a+f.size,0),
   oversize:oversize.map(f=>({name:path.relative(dir,f.path),size:f.size}))};
}
function execute(program,args,options={}){
 const r=cp.spawnSync(program,args,{cwd:root,encoding:'utf8',
  timeout:options.timeout||600000,maxBuffer:8*1024*1024,env:options.env||process.env});
 if(r.error||r.status!==0)
  fail(program+' failed: '+(r.error?.message||r.stderr||r.stdout||'exit '+r.status).slice(-2000));
 return (r.stdout||'')+'\n'+(r.stderr||'');
}
function smoke(dir){
 const exe=path.join(dir,binaryName);
 const env={...process.env};
 const os=require('node:os');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'capital-real-smoke-'));
 try{
  for(const [key,d] of [['HOME','home'],['XDG_CONFIG_HOME','config'],
    ['XDG_CACHE_HOME','cache'],['XDG_DATA_HOME','data']]){
   env[key]=path.join(temp,d);fs.mkdirSync(env[key],{recursive:true});
  }
  // No shell, network, or GitHub Actions.
  const out=execute(exe,['--smoke-test'],{timeout:180000,env});
  if(!out.includes('FEDERAL_ELECTRIC_SMOKE_OK'))
   fail('Real executable did not confirm Electron gameplay smoke test: '+out.slice(-1600));
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
}
function install(dir){
 const entries=fs.readdirSync(dir);
 if(!entries.includes(binaryName))fail('The executable is missing from build output.');
 const backup=path.join(root,'.capital-root-runtime-backup-'+process.pid);
 const replaced=[],installed=[];
 fs.mkdirSync(backup);
 try{
  for(const name of entries){
   if(name==='LICENSE'||name==='LICENSES.chromium.html')continue;
   const src=path.join(dir,name),dst=path.join(root,name);
   if(fs.existsSync(dst)){
    const save=path.join(backup,name);
    fs.renameSync(dst,save);replaced.push(name);
   }
   fs.renameSync(src,dst);installed.push(name);
  }
  inspect(root);
  fs.rmSync(backup,{recursive:true,force:true});
  fs.rmSync(dir,{recursive:true,force:true});
 }catch(err){
  for(const name of installed.reverse())fs.rmSync(path.join(root,name),{force:true,recursive:true});
  for(const name of replaced.reverse())fs.renameSync(path.join(backup,name),path.join(root,name));
  fs.rmSync(backup,{recursive:true,force:true});
  throw err;
 }
}
function run(){
 if(process.platform!=='linux'||process.arch!=='x64')
  fail('This packaging target is Linux x86_64 only.');
 const builder=path.join(root,'node_modules','.bin','electron-builder');
 if(!fs.existsSync(builder))fail('Electron builder is not installed locally. No build was produced.');
 execute(process.execPath,[path.join(root,'tests','run-all.cjs')],{timeout:600000});
 execute(builder,['--linux','dir','--x64','--publish','never'],{timeout:1200000});
 const dir=path.join(root,'linux-unpacked');
 if(!fs.existsSync(dir))fail('Electron builder did not produce linux-unpacked.');
 const test=inspect(dir);
 smoke(dir);
 install(dir);
 const final=inspect(root);
 console.log('LINUX EXECUTABLE BUILT AND SMOKE TESTED: '+final.executable);
 console.log('Game runtime now occupies the existing repository root. No AppImage or dist.');
 if(final.oversize.length){
  console.error('GITHUB ZIP NOT READY: '+final.oversize.map(x=>x.name+' '+Math.ceil(x.size/1048576)+' MiB').join('; '));
  console.error('GitHub does not accept blobs this large. Do not describe a source ZIP as playable.');
  process.exitCode=2;
 }else{
  console.log('GitHub individual-file size preflight PASSED. Publish all files to the repository and check the downloaded ZIP independently.');
 }
}
if(require.main===module){try{run()}catch(error){console.error('REAL BUILD FAILED: '+error.message);process.exitCode=1}}
module.exports={inspect,validElf,collect,install,GITHUB_MAX_BLOB,binaryName};
