const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const runtimeTextFiles=['app.js','city.js','boxing.js','racing.js','oval-racing.js','underworld.js','poker.js','paper-doll.js','personal-effects.js','housing.js','venue-opportunities.js','institution-ventures.js','character-routes.js','radio/radio-engine.js','radio/stations.js','styles.css','boxing.css','racing.css','underworld.css'];
const failures=[];
for(const rel of runtimeTextFiles){
 const text=fs.readFileSync(path.join(root,rel),'utf8');
 const matches=text.match(/https?:\/\/[^\s"'\`<>]+/g)||[];
 if(matches.length)failures.push(rel+': '+[...new Set(matches)].join(', '));
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const runtimeTags=html.match(/<(?:script|img|audio|source|link)\b[^>]*(?:src|href)=["']https?:\/\/[^"']+["'][^>]*>/gi)||[];
if(runtimeTags.length)failures.push('index.html remote runtime resource: '+runtimeTags.join(' | '));
if(failures.length){
 console.error('Remote runtime dependency detected:\n'+failures.join('\n'));
 process.exit(1);
}
console.log('Offline runtime audit passed: gameplay runtime references are local. External research links are allowed.');
