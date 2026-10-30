'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {mediaRefs,missingAssets}=require('../desktop/check-bundle-assets.cjs');
const src="const x='assets/audio/title-day-ambience.wav?v=offline1'; const y=\"assets/artwork/maps/title-map-1938.jpg\";";
assert.deepEqual(mediaRefs(src),['assets/audio/title-day-ambience.wav','assets/artwork/maps/title-map-1938.jpg']);

const {htmlResourceRefs,resourcePath}=require('../desktop/check-bundle-assets.cjs');
assert.deepEqual(htmlResourceRefs('<script src="vendor/test.js?v=1"></script><link href="styles.css"><img src="assets/x.png">'),['vendor/test.js?v=1','styles.css','assets/x.png']);
assert.equal(resourcePath('vendor/test.js?v=1'),'vendor/test.js');
assert.equal(resourcePath('./assets/artwork/maps/title-map-1938.jpg'),'assets/artwork/maps/title-map-1938.jpg');
assert.throws(()=>resourcePath('../outside.js'),/Unsafe resource path/);
assert.throws(()=>resourcePath('https://example.org/library.js'),/Remote resource/);
const index=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert.ok(htmlResourceRefs(index).length>=100,'load manifest checks all renderer dependencies');
assert.deepEqual(missingAssets(),[],'full source checkout must bundle all referenced media');
const folder=fs.mkdtempSync(path.join(os.tmpdir(),'capital-offline-assets-'));
try{
 assert.ok(missingAssets(folder).some(e=>e.includes('Missing source: app.js')));
}finally{fs.rmSync(folder,{recursive:true,force:true});}
assert.ok(require('../desktop/check-bundle-assets.cjs').missingAssets().length===0,'original map hash guard passes for the checked-in map');
console.log('Offline bundle asset audit: passed.');
