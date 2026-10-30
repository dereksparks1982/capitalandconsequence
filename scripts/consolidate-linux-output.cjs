'use strict';
// Migrate historical Electron output into this existing project directory.
// No second project, no dist folder, and never overwrite an existing file.
const fs=require('node:fs'),path=require('node:path');
function consolidate(base=path.resolve(__dirname,'..')){
 const root=path.resolve(base);
 const source=path.join(root,'dist');
 if(!fs.existsSync(source))return [];
 if(!fs.statSync(source).isDirectory())throw Error('Expected a folder: '+source);
 const entries=fs.readdirSync(source);
 const collisions=entries.filter(name=>fs.existsSync(path.join(root,name)));
 if(collisions.length)throw Error('Nothing moved. Files already exist in project root: '+collisions.join(', '));
 const moved=[];
 for(const name of entries){
  fs.renameSync(path.join(source,name),path.join(root,name));
  moved.push(name);
 }
 fs.rmdirSync(source);
 return moved;
}
if(require.main===module){
 try{
  const moved=consolidate();
  if(moved.length)console.log('Moved to the existing Capital&Consequence project root:\n'+moved.join('\n'));
  else console.log('No old dist files to move. The project now builds to its main folder.');
 }catch(error){console.error('Build-output consolidation stopped: '+error.message);process.exitCode=1;}
}
module.exports={consolidate};
