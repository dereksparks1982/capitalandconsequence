'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const os=require('node:os'),path=require('node:path');
const p=require('../package.json');
const build=require('../scripts/build-root-linux.cjs');
const name='capitalandconsequence';
assert.equal(p.build.linux.executableName,name);
assert.equal(p.build.directories.output,'.');
assert.equal(p.scripts['build:root:linux'],'node scripts/build-root-linux.cjs');
assert.equal(build.binaryName,name);
// Verify the actual packaged game can be opened by double-click, without a
// command-line --no-sandbox argument, sudo or a root-owned Chromium helper.
const mainSource=fs.readFileSync(path.join(__dirname,'../desktop/main.cjs'),'utf8');
assert.ok(mainSource.includes("process.platform === 'linux'"),'Rootless mode applies only to Linux');
assert.ok(mainSource.includes("app.commandLine.appendSwitch('no-sandbox')"),
 'Linux ELF must set the no-sandbox switch before Electron ready');
assert.ok(mainSource.indexOf("app.commandLine.appendSwitch('no-sandbox')") <
 mainSource.indexOf('app.whenReady()'),'Chromium sandbox compatibility is enabled before app ready');
assert.ok(mainSource.includes("process.env.CAPITAL_ENABLE_CHROMIUM_SANDBOX !== '1'"),
 'Experienced users may enable Chromium sandbox with a configured local policy');
const builderSource=fs.readFileSync(path.join(__dirname,'../scripts/build-root-linux.cjs'),'utf8');
assert.ok(builderSource.includes("execute(exe,['--smoke-test']"),
 'Smoke tests must launch the same actual root ELF that players double-click');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'capital-build-check-'));
try{
 assert.throws(()=>build.inspect(root),/real executable ELF/);
 const elf=path.join(root,name);
 fs.writeFileSync(elf,Buffer.from([127,69,76,70,0,0,0,0]),{mode:0o755});
 assert.equal(build.validElf(elf),true);
 assert.throws(()=>build.inspect(root),/resources\/app.asar/);
 fs.mkdirSync(path.join(root,'resources'));fs.mkdirSync(path.join(root,'locales'));
 fs.writeFileSync(path.join(root,'resources','app.asar'),Buffer.alloc(1024*1024+1));
 for(const item of ['icudtl.dat','resources.pak','v8_context_snapshot.bin'])
  fs.writeFileSync(path.join(root,item),'fixture');
 assert.equal(build.inspect(root,{publishable:true}).executable,elf);
 fs.truncateSync(elf,build.GITHUB_MAX_BLOB);
 assert.throws(()=>build.inspect(root,{publishable:true}),/GITHUB ZIP NOT READY/);
 assert.equal(build.inspect(root,{publishable:false}).oversize.length,1);
}finally{fs.rmSync(root,{recursive:true,force:true})}
console.log('PASS Linux root executable ELF/package/runtime and GitHub file-size rejection contracts');
