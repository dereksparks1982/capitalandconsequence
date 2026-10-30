'use strict';
// A research hyperlink is not a gameplay network dependency.
// Renderer scripts, media and styles must nevertheless be able to start offline.
const fs=require('node:fs');
const path=require('node:path');
const {htmlResourceRefs,resourcePath}=require('./check-bundle-assets.cjs');
const root=path.resolve(__dirname,'..');
const runtimeTextFiles=[
 'app.js','city.js','boxing.js','racing.js','oval-racing.js','underworld.js',
 'poker.js','paper-doll.js','personal-effects.js','housing.js','venue-opportunities.js',
 'institution-ventures.js','character-routes.js','living-characters.js',
 'mobility.js','journey-planner.js','radio/radio-engine.js','radio/stations.js',
 'styles.css','boxing.css','racing.css','underworld.css'
];
const networkSinks=[
 ['fetch()',/\bfetch\s*\(/g],
 ['XMLHttpRequest',/\bXMLHttpRequest\b/g],
 ['WebSocket',/\bWebSocket\s*\(/g],
 ['EventSource',/\bEventSource\s*\(/g],
 ['sendBeacon()',/\bsendBeacon\s*\(/g],
 ['importScripts()',/\bimportScripts\s*\(/g],
 ['remote media assignment',/\.\s*(?:src|href)\s*=\s*['"\x60]\s*(?:https?:)?\/\//gi],
 ['remote Audio/Image constructor',/\bnew\s+(?:Audio|Image|Worker)\s*\(\s*['"\x60]\s*(?:https?:)?\/\//gi],
 ['remote CSS import',/@import\s+(?:url\s*\(\s*)?['"]?\s*(?:https?:)?\/\//gi],
 ['remote CSS url()',/\burl\s*\(\s*['"]?\s*(?:https?:)?\/\//gi]
];
function auditSource(rel,text){
 const errors=[];
 for(const [label,pattern] of networkSinks){
  pattern.lastIndex=0;
  if(pattern.test(text))errors.push(rel+': forbidden gameplay network operation: '+label);
 }
 return errors;
}
function auditHtml(html){
 const errors=[];
 for(const url of htmlResourceRefs(html)){
  try{resourcePath(url);}
  catch(e){errors.push('index.html: '+e.message);}
 }
 return errors;
}
function auditRuntime(base=root){
 const errors=[];
 for(const rel of runtimeTextFiles){
  const file=path.join(base,rel);
  try{errors.push(...auditSource(rel,fs.readFileSync(file,'utf8')));}
  catch(e){errors.push(rel+': cannot read local source: '+e.message);}
 }
 try{errors.push(...auditHtml(fs.readFileSync(path.join(base,'index.html'),'utf8')));}
 catch(e){errors.push('index.html: cannot read entrypoint: '+e.message);}
 return errors;
}
if(require.main===module){
 const errors=auditRuntime();
 if(errors.length){console.error('Offline runtime audit FAILED:\n'+errors.join('\n'));process.exitCode=1;}
 else console.log('Offline runtime audit passed: no remote scripts/media/styles or network APIs; historical research links are optional.');
}
module.exports={auditSource,auditHtml,auditRuntime};
