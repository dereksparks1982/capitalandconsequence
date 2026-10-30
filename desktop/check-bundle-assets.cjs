'use strict';
// All playable media must be inside the source tree BEFORE packaging.
// This audit runs offline and never downloads anything for the player.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const staticSources=['app.js','index.html','styles.css','radio/radio-engine.js','radio/stations.js'];
const immutableMap='assets/artwork/maps/title-map-1938.jpg';
const immutableMapBlobSha='57ab4c66dccb151a4153864f2fdd9790065ec77d';
const required=[
 'assets/artwork/maps/title-map-1938.jpg',
 'assets/audio/title-day-ambience.wav',
 'assets/audio/freesound_community-street-at-night-with-cars-49378.mp3',
 'assets/audio/sunflower-slow-drag.ogg',
 'desktop/main.cjs','desktop/preload.cjs','desktop/save-store.cjs'
];
const mediaPattern=/assets\/(?:audio|artwork)\/[^"'`<>\s]*?\.(?:mp3|wav|ogg|ogx|png|jpg|jpeg|svg|webp|gif)(?=[?#"'`\s<>)\]]|$)/g;
function mediaRefs(text){return Array.from(text.matchAll(mediaPattern),m=>m[0]);}
function missingAssets(base=root){
 const errors=[],files=new Set(required);
 for(const src of staticSources){
  const filename=path.join(base,src);
  if(!fs.existsSync(filename)){errors.push('Missing source: '+src);continue;}
  for(const rel of mediaRefs(fs.readFileSync(filename,'utf8')))files.add(rel);
 }
 for(const rel of files){
  const full=path.resolve(base,rel);
  if(!full.startsWith(path.resolve(base)+path.sep)){errors.push('Unsafe asset path: '+rel);continue;}
  try{if(!fs.statSync(full).isFile()||!fs.statSync(full).size)errors.push('Empty asset: '+rel);}
  catch{errors.push('Missing asset: '+rel);}
 }
 // The user-approved 1938 Washington bitmap is immutable across every era and build.
 const imageFile=path.join(base,immutableMap);
 if(fs.existsSync(imageFile)){
  const image=fs.readFileSync(imageFile);
  const sha=crypto.createHash('sha1').update(Buffer.from('blob '+image.length+'\0')).update(image).digest('hex');
  if(sha!==immutableMapBlobSha)errors.push('Washington map bytes changed: '+immutableMap);
 }
 return errors;
}
if(require.main===module){
 const errors=missingAssets();
 if(errors.length){console.error('OFFLINE BUNDLE AUDIT FAILED\n'+errors.join('\n'));process.exitCode=1;}
 else console.log('Offline bundle audit passed: all '+required.length+' core files and referenced media are present; no downloading required.');
}
module.exports={mediaRefs,missingAssets};
