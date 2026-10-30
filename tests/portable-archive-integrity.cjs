'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const {packagePortable}=require('../scripts/package-linux-portable.cjs'),pkg=require('../package.json');
assert.ok(pkg.scripts['dist:linux:portable'].includes('electron-builder --linux dir'),'Portable packaging must use a fresh built folder');
assert.ok(pkg.scripts['dist:linux:portable'].includes('&& node scripts/package-linux-portable.cjs'),'Only archive a successful build');
const base=fs.mkdtempSync(path.join(os.tmpdir(),'capital-portable-archive-'));
try{
 const folder=path.join(base,'linux-unpacked');fs.mkdirSync(folder);
 const bin=path.join(folder,'capital-consequence');
 fs.writeFileSync(bin,'#!/bin/sh\nexit 0\n');fs.chmodSync(bin,0o755);
 fs.writeFileSync(path.join(folder,'sample-media.bin'),'sample');
 const output=packagePortable(base,'0.0.0');
 assert.equal(path.basename(output),'Capital-and-Consequence-0.0.0-x64.tar.gz');
 const check=cp.spawnSync('tar',['-tzf',output],{encoding:'utf8'});
 assert.equal(check.status,0);
 assert.ok(check.stdout.includes('linux-unpacked/capital-consequence'));
 const originalSize=fs.statSync(output).size;
 fs.rmSync(bin);
 assert.throws(()=>packagePortable(base,'0.0.0'),/ENOENT|missing|not executable/);
 assert.equal(fs.statSync(output).size,originalSize,'a failed rebuild keeps the last verified archive');
}finally{fs.rmSync(base,{recursive:true,force:true});}
console.log('Portable Linux archive creation, integrity and atomic replacement: passed.');
