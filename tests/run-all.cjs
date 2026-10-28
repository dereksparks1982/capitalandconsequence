'use strict';
// Run every source regression locally; report all failures, never fail fast.
// No network access, GitHub Actions, artifact uploads, or child process shells.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const dir=__dirname;
const tests=fs.readdirSync(dir).filter(x=>x.endsWith('.cjs')&&x!=='run-all.cjs').sort();
let passed=0,failed=0;
const failures=[];
console.log('Capital & Consequence offline source suite: '+tests.length+' files');
for(const file of tests){
 const r=cp.spawnSync(process.execPath,[path.join(dir,file)],{encoding:'utf8',timeout:120000,maxBuffer:8*1024*1024});
 const ok=r.status===0&&!r.error;
 if(ok){passed++;console.log('PASS '+file)}
 else{
  failed++;const detail=[r.error?.message,r.stderr?.trim(),r.stdout?.trim()].filter(Boolean).join('\n');
  failures.push({file,detail});
  console.error('FAIL '+file+'\n'+detail.slice(0,3000));
 }
}
console.log('\nSource regression results: '+passed+' passed, '+failed+' failed, '+tests.length+' total.');
if(failures.length)console.log('Failures: '+failures.map(x=>x.file).join(', '));
process.exitCode=failed?1:0;
