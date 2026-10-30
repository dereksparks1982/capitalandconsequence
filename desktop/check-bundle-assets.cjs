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
// Every HTML script, stylesheet, image and audio URL is an app dependency,
// not an optional decoration. An Electron package must include these exact files.
function htmlResourceRefs(html){
 const refs=[];
 const tags=html.match(/<(?:script|link|img|audio|source|video)\b[^>]*>/gi)||[];
 for(const tag of tags){
  const match=tag.match(/\b(?:src|href)\s*=\s*(["'])(.*?)\1/i);
  if(match)refs.push(match[2]);
 }
 return refs;
}
function resourcePath(value){
 const text=String(value||'').trim();
 if(!text||text.startsWith('#')||/^data:/i.test(text))return null;
 if(/^(?:https?:)?\/\//i.test(text))throw Error('Remote resource is not bundled: '+text);
 if(/^[a-z][a-z\d+.-]*:/i.test(text)||text.startsWith('/')||text.includes('\\'))throw Error('Nonrelative resource: '+text);
 let local;
 try{local=decodeURIComponent(text.split(/[?#]/)[0]).replace(/^(?:\.\/)+/,'');}
 catch(_){throw Error('Invalid resource encoding: '+text)}
 if(!local||local.split('/').includes('..')||local.split('/').includes(''))throw Error('Unsafe resource path: '+text);
 return local;
}
function missingAssets(base=root){
 const errors=[],files=new Set(required);
 for(const src of staticSources){
  const filename=path.join(base,src);
  if(!fs.existsSync(filename)){errors.push('Missing source: '+src);continue;}
  for(const rel of mediaRefs(fs.readFileSync(filename,'utf8')))files.add(rel);
 }
 // Check the real renderer entrypoint and every loaded CSS file.
 // Unlike selected source-string scans, this catches missing vendor scripts.
 const htmlPath=path.join(base,'index.html');
 if(fs.existsSync(htmlPath)){
  for(const url of htmlResourceRefs(fs.readFileSync(htmlPath,'utf8'))){
   try{const rel=resourcePath(url);if(rel)files.add(rel);}
   catch(error){errors.push(error.message);}
  }
 }else errors.push('Missing entrypoint: index.html');
 try{
  for(const css of fs.readdirSync(base).filter(name=>name.endsWith('.css'))){
   const content=fs.readFileSync(path.join(base,css),'utf8');
   for(const match of content.matchAll(/url\(\s*["']?([^)"']+)["']?\s*\)/gi)){
    try{const ref=resourcePath(match[1]);if(ref)files.add(ref);}
    catch(error){errors.push(css+': '+error.message);}
   }
  }
 }catch(error){errors.push('Cannot inspect stylesheets: '+error.message)}
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
module.exports={mediaRefs,htmlResourceRefs,resourcePath,missingAssets};
