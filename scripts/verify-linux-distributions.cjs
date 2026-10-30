'use strict';
// Developer-only: verify two built executables in isolated profile folders.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist'),version=require('../package.json').version;
const prefix='Capital-and-Consequence-'+version+'-';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'capital-linux-qa-'));
let failed=0;
function run(cmd,args,opts={}){
 return cp.spawnSync(cmd,args,{encoding:'utf8',timeout:180000,maxBuffer:8*1024*1024,...opts});
}
function check(label,execPath){
 try{
  const st=fs.statSync(execPath);
  if(!st.isFile()||(st.mode&0o111)===0)throw Error('Not executable: '+execPath);
  const base=path.join(temp,label);
  const env={...process.env};
  for(const [key,part] of [['HOME','home'],['XDG_CONFIG_HOME','config'],['XDG_CACHE_HOME','cache'],['XDG_DATA_HOME','data']]){
   env[key]=path.join(base,part);fs.mkdirSync(env[key],{recursive:true});
  }
  delete env.APPIMAGE_EXTRACT_AND_RUN;
  const result=run(execPath,['--smoke-test'],{env,cwd:path.dirname(execPath)});
  const log=String(result.stdout||'')+'\n'+String(result.stderr||'');
  if(result.error||result.status!==0||!log.includes('FEDERAL_ELECTRIC_SMOKE_OK'))
   throw Error((result.error?.message||'exit '+result.status)+' '+log.slice(-2000));
  console.log('PASS '+label+': packaged game smoke test');
 }catch(e){failed++;console.error('FAIL '+label+': '+e.message)}
}
try{
 if(process.platform!=='linux'||process.arch!=='x64')throw Error('Requires Linux x64');
 const image=path.join(dist,prefix+'x86_64.AppImage');
 check('appimage',image);
 const archives=fs.readdirSync(dist).filter(n=>n.startsWith(prefix)&&n.endsWith('.tar.gz'));
 if(archives.length!==1)throw Error('Expected exactly one portable tar.gz, found '+archives.length);
 const extracted=path.join(temp,'extracted');fs.mkdirSync(extracted,{recursive:true});
 const tar=run('tar',['-xzf',path.join(dist,archives[0]),'-C',extracted]);
 if(tar.error||tar.status!==0)throw Error('Portable extraction failed: '+(tar.error?.message||tar.stderr));
 const matches=[];
 function walk(dir,depth){
  if(depth>5)return;
  for(const item of fs.readdirSync(dir,{withFileTypes:true})){
   const p=path.join(dir,item.name);
   if(item.isDirectory())walk(p,depth+1);
   else if(item.isFile()&&item.name==='capital-consequence')matches.push(p);
  }
 }
 walk(extracted,0);
 if(matches.length!==1)throw Error('Expected one portable executable, found '+matches.length);
 check('portable',matches[0]);
}catch(e){failed++;console.error('FAIL distribution: '+e.message)}
finally{fs.rmSync(temp,{recursive:true,force:true})}
if(failed){console.error('Linux distribution QA RED ('+failed+' checks).');process.exitCode=1}
else console.log('Linux distribution QA GREEN on this host only.');
