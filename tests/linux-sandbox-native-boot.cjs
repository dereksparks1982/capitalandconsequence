'use strict';
/* Full native startup regression: execute the actual bundled ELF, not just
 * assert a no-sandbox string is present in Electron's main script.
 * /bin/echo acts as a harmless stand-in for the packaged Electron binary.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const os=require('node:os'),cp=require('node:child_process');
const build=require('../scripts/build-root-linux.cjs');
if(process.platform!=='linux'||process.arch!=='x64')
 throw Error('Linux native launcher tests require x86_64');
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'capital-native-sandbox-'));
try{
 const filename=path.join(directory,'capitalandconsequence');
 const runtime=path.join(directory,'capitalandconsequence-runtime');
 // Simulate electron-builder's actual unpacked output, then test the
 // EXACT post-packaging replacement used by the real Linux build process.
 fs.copyFileSync('/bin/echo',filename);fs.chmodSync(filename,0o755);
 build.prepareNativeLinuxEntrypoint(directory);
 assert.equal(build.validElf(filename),true,'Root-level game entry is a native ELF');
 assert.equal(build.validElf(runtime),true,'Complete Electron-style game binary is retained');
 assert.equal(fs.readFileSync(filename).compare(build.launcherBytes()),0,
  'Packager installs exactly the audited, checksum-verified native ELF');
 const run=env=>cp.spawnSync(filename,['--smoke-test'],{
  cwd:directory,env:{...process.env,...env},encoding:'utf8',timeout:5000});
 const normal=run({CAPITAL_ENABLE_CHROMIUM_SANDBOX:'0'});
 assert.equal(normal.status,0,normal.stderr||'Native launcher cannot exec the bundled runtime');
 assert.equal(normal.stdout.trim(),'--no-sandbox --smoke-test',
  'Chromium sandbox option MUST be injected before Electron starts, not from JS');
 const configured=run({CAPITAL_ENABLE_CHROMIUM_SANDBOX:'1'});
 assert.equal(configured.status,0,configured.stderr||'Cannot opt into configured Chromium sandbox');
 assert.equal(configured.stdout.trim(),'--smoke-test',
  'Explicitly configured sandbox must be respected');
 const withoutRuntime=path.join(directory,'missing');
 fs.renameSync(runtime,withoutRuntime);
 const missing=run({CAPITAL_ENABLE_CHROMIUM_SANDBOX:'0'});
 assert.equal(missing.status,127,'Missing runtime is an error, never a successful fake executable');
 assert.match(missing.stderr,/cannot start bundled game runtime/);
 console.log('PASS real Linux ELF bootstrap, before-Chromium no-sandbox argument, opt-in and missing-runtime failure');
}finally{fs.rmSync(directory,{recursive:true,force:true});}
