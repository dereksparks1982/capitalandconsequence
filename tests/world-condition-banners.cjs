'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const get=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const b=get('world-banner.js'),ui=get('character-needs-ui.js'),html=get('index.html');
for(const key of ['health','hunger','thirst','energy']){
 assert.match(b,new RegExp("'"+key+"'"));
 assert.match(ui,new RegExp("'"+key+"'"));
}
assert.match(b,/className='cc-world-condition'/);
assert.match(b,/original=\$\('condition-'\+key\)/);
assert.match(b,/panel\.needs\[key\]/);
assert.doesNotMatch(b,/setInterval\(|setTimeout\(/);
assert.match(html,/world-banner\.js\?v=20261101-v0753-condition/);
console.log('PASS persistent map/room condition HUD mirroring with no extra simulation clock');
