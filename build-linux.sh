#!/usr/bin/env bash
# Update the EXISTING local Linux game. No new launcher, dist, or QA checkout.
# Do not use set -e or ask for credentials.
if cd "$(dirname "$0")"; then
node <<'JS'
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),vm=require('node:vm');
async function main(){
 const root=process.cwd(),archive=path.join(root,'resources/app.asar');
 const launcher=path.join(root,'capital-consequence');
 if(process.platform!=='linux'||process.arch!=='x64')throw Error('Ubuntu/Linux x64 is required.');
 if(!fs.existsSync(launcher)||!(fs.statSync(launcher).mode&0o111))
  throw Error('Existing capital-consequence executable not found in project root.');
 if(!fs.existsSync(archive))throw Error('Existing resources/app.asar not found.');
 const asar=require('@electron/asar');
 const files=fs.readdirSync(root,{withFileTypes:true})
  .filter(x=>x.isFile()&&/\.(js|html|css)$/.test(x.name))
  .map(x=>x.name);
 files.push('package.json','LICENSE','LEGAL.md','THIRD-PARTY-NOTICES.md',
  'desktop/main.cjs','desktop/preload.cjs','desktop/save-store.cjs','desktop/npc-llm.cjs');
 const important=['index.html','app.js','city.js','main-story.js','peacock-story.js',
  'peacock-network.js','peacock-debts.js','wardman-escape.js',
  'wardman-custody.js','wardman-estate-police.js','wardman-inheritance.js',
  'asylum-story.js','personal-book-pages.js'];
 for(const file of important)if(!files.includes(file))throw Error('Missing game module '+file);
 for(const file of files){
  const p=path.join(root,file);
  if(!fs.existsSync(p))throw Error('Missing source '+file);
  if(/\.(js|cjs)$/.test(file))new vm.Script(fs.readFileSync(p,'utf8'),{filename:file});
 }
 const bundles=['assets','radio','vendor'];
 for(const folder of bundles)if(!fs.statSync(path.join(root,folder)).isDirectory())
  throw Error('Missing bundled resource folder '+folder);
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 let count=0;
 for(const m of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)){
  const src=m[1].split('?')[0];
  if(!src||/^(https?:|data:|\/\/)/i.test(src))continue;
  const resolved=path.resolve(root,src);
  if(!resolved.startsWith(root+path.sep)||!fs.existsSync(resolved))
   throw Error('Missing or invalid renderer script '+src);
  count++;
 }
 if(count<90)throw Error('Incomplete renderer manifest: '+count);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'capital-inplace-'));
 const dir=path.join(temp,'game'),candidate=path.join(root,'resources','.app.asar.next-'+process.pid);
 let updated=false;
 try{
  asar.extractAll(archive,dir);
  for(const file of files){
   const dst=path.join(dir,file);fs.mkdirSync(path.dirname(dst),{recursive:true});
   fs.copyFileSync(path.join(root,file),dst);
  }
  for(const folder of bundles)
   fs.cpSync(path.join(root,folder),path.join(dir,folder),{recursive:true,force:true});
  await asar.createPackage(dir,candidate);
  const sum=data=>crypto.createHash('sha256').update(data).digest('hex');
  for(const file of important.concat('styles.css','package.json')){
   if(sum(asar.extractFile(candidate,file))!==sum(fs.readFileSync(path.join(root,file))))
    throw Error('Candidate game is missing current '+file);
  }
  if(fs.statSync(candidate).size<1024*1024)throw Error('Candidate ASAR is too small.');
  fs.renameSync(candidate,archive);
  updated=true;
  console.log('Capital & Consequence updated INSIDE the existing executable.');
  console.log('Version: '+JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version);
  console.log('Launcher: '+launcher);
  console.log('Updated '+files.length+' root/runtime files and offline media; '+count+' scripts verified.');
  console.log('No new launcher, project folder, dist output or GitHub Actions.');
 }finally{
  if(fs.existsSync(candidate))fs.rmSync(candidate,{force:true});
  fs.rmSync(temp,{recursive:true,force:true});
  if(!updated)console.error('Update did not finish. Existing game resources were preserved.');
 }
}
main().catch(e=>{console.error('GAME UPDATE ERROR: '+e.message);process.exitCode=1});
JS
else
printf 'Could not enter game project folder.\n' >&2
fi
