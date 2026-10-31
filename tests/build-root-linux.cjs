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
