'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const pkg=require('../package.json');
const {consolidate}=require('../scripts/consolidate-linux-output.cjs');
assert.equal(pkg.build.directories.output,'.','Electron Builder must output into project root');
assert.equal(pkg.scripts['consolidate:linux:output'],'node scripts/consolidate-linux-output.cjs');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'capital-output-test-'));
try{
 const old=path.join(tmp,'dist');fs.mkdirSync(old);
 fs.writeFileSync(path.join(old,'Capital-and-Consequence-test.AppImage'),'appimage');
 fs.mkdirSync(path.join(old,'linux-unpacked'));fs.writeFileSync(path.join(old,'linux-unpacked','game'),'binary');
 assert.deepEqual(consolidate(tmp).sort(),['Capital-and-Consequence-test.AppImage','linux-unpacked'].sort());
 assert.equal(fs.existsSync(old),false,'dist folder must be removed when empty');
 assert.equal(fs.readFileSync(path.join(tmp,'Capital-and-Consequence-test.AppImage'),'utf8'),'appimage');
 assert.equal(fs.readFileSync(path.join(tmp,'linux-unpacked','game'),'utf8'),'binary');
 assert.deepEqual(consolidate(tmp),[],'a second run is harmless');
 fs.mkdirSync(old);fs.writeFileSync(path.join(old,'collision.txt'),'old');
 fs.writeFileSync(path.join(tmp,'collision.txt'),'keep');
 assert.throws(()=>consolidate(tmp),/Nothing moved/,'conflicting names must never overwrite');
 assert.equal(fs.readFileSync(path.join(tmp,'collision.txt'),'utf8'),'keep');
 assert.equal(fs.readFileSync(path.join(old,'collision.txt'),'utf8'),'old');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
console.log('Single project build output and safe consolidation: passed.');
