'use strict';
// Run every source regression locally; report all failures, never fail fast.
// No network access, GitHub Actions, artifact uploads, or child process shells.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const dir=__dirname;
const present=fs.readdirSync(dir).filter(x=>x.endsWith('.cjs')&&x!=='run-all.cjs').sort();
const manifest=path.join(dir,'.github-managed-tests.json');
let tests=present;
if(fs.existsSync(manifest)){
 const listed=JSON.parse(fs.readFileSync(manifest,'utf8'));
 if(!Array.isArray(listed)||listed.length===0||
    listed.some(x=>typeof x!=='string'||!x.endsWith('.cjs')||x.includes('/')||x.includes('..')||x==='run-all.cjs'))
  throw Error('Invalid tracked source-test manifest.');
 const set=new Set(listed);
 if(set.size!==listed.length)throw Error('Duplicate tracked test names.');
 const missing=listed.filter(x=>!present.includes(x));
 if(missing.length)throw Error('Missing GitHub-tracked source test(s): '+missing.join(', '));
 const untracked=present.filter(x=>!set.has(x));
 if(untracked.length)console.log('Retained local-only tests not run: '+untracked.join(', '));
 tests=listed.slice().sort();
}
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
