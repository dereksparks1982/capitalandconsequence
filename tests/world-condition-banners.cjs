'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const get=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const b=get('world-banner.js'),css=get('world-banner.css'),ui=get('character-needs-ui.js'),html=get('index.html');
for(const key of ['health','hunger','thirst','energy']){
 assert.match(b,new RegExp("'"+key+"'"));
 assert.match(ui,new RegExp("'"+key+"'"));
}
assert.match(b,/className='cc-world-condition'/);
assert.match(b,/primaryFields=new Set\(\['phaseName','businessDate','dayClock','washingtonSky'\]\)/,'Time and weather share first status row');
assert.match(b,/primaryFields\.has\(id\)\?topRow:bottomRow/,'Exchange and money use second status row');
assert.match(b,/bottomRow\.appendChild\(pause\)/,'Pause control is on the second row');
assert.match(b,/rows\.append\(topRow,bottomRow\)/,'Exactly two intentionally ordered rows');
assert.match(css,/cc-world-banner-rows\{display:grid;grid-template-rows:auto auto\}/);
assert.match(css,/title-map-card \.cc-world-banner-row--primary\{padding-right:60px/,'Leave clearance for map close X');
assert.match(b,/original=\$\('condition-'\+key\)/);
assert.match(b,/panel\.needs\[key\]/);
assert.doesNotMatch(b,/setInterval\(|setTimeout\(/);
assert.match(html,/world-banner\.js\?v=20261101-v0759-medbook/);
assert.match(html,/world-banner\.css\?v=20261101-v0758-two-rows/);
console.log('PASS persistent two-row map/room status with condition HUD mirroring and no extra clock');
