'use strict';
// Developer-side startup/build check only. Never fetch art/audio at launch.
// Release players receive every needed asset within the AppImage.
const {missingAssets}=require('./check-bundle-assets.cjs');
const errors=missingAssets();
if(errors.length){
 console.error('Required bundled files are missing:\n'+errors.join('\n'));
 console.error('Use a complete official game download. No automatic network downloads are permitted.');
 process.exitCode=1;
}else{
 console.log('Offline runtime assets ready. No network downloads required.');
}
