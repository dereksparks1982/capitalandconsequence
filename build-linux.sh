#!/usr/bin/env bash
# In-place source update for the existing root-level capital-consequence launcher.
# No new executable, distribution folder, backup, or GitHub Actions.
set -euo pipefail
cd "$(dirname "$0")"
command -v node >/dev/null || { echo 'Node.js is required' >&2; exit 1; }
test -x ./capital-consequence || { echo 'Existing capital-consequence launcher missing' >&2; exit 1; }
test -f ./resources/app.asar || { echo 'Existing resources/app.asar missing' >&2; exit 1; }
npm run prepare:runtime
node <<'JS'
'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const asar=require('@electron/asar');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'capital-consequence-inplace-'));
const archive=path.resolve('resources/app.asar'),unpacked=path.join(temp,'unpacked');
const files=['app.js','city.js','index.html','styles.css','career-shell.js','map-pin-palette.js'];
(async()=>{
 try{
  asar.extractAll(archive,unpacked);
  for(const filename of files){
   const source=path.resolve(filename),target=path.join(unpacked,filename);
   if(!fs.existsSync(source)||!fs.existsSync(target))throw Error('Source or installed file missing: '+filename);
   fs.copyFileSync(source,target);
  }
  await asar.createPackage(unpacked,path.join(temp,'app.asar'));
  fs.copyFileSync(path.join(temp,'app.asar'),archive);
  console.log('UPDATED the existing capital-consequence launcher resources in place. No new executable or project directory.');
 }finally{
  fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(error=>{console.error(error);process.exitCode=1});
JS
