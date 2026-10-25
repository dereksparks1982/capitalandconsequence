'use strict';
const assert=require('node:assert/strict'),m=require('../map-pin-palette.js');
const table=[
 ['whiteHouse','government','government'],
 ['governmentHospital','institution','government'],
 ['blackwoodAsylum','government','government'],
 ['hillsdale','neighborhood','hillsdale'],
 ['hillsdale-bakery','commerce','hillsdale'],
 ['factory','company','industry'],
 ['star','social','entertainment'],
 ['secondNightclub','social','entertainment'],
 ['embassyPoker','gaming','entertainment'],
 ['oldChinatown','social','commerce'],
 ['easternMarket','commerce','commerce'],
 ['universityMaryland','education','green'],
 ['franciscanMonastery','religious','religion'],
 ['potomacFishingBank','leisure','water'],
 ['home','residence','housing']
];
for(const [id,category,expected] of table){
 for(const mapOrigin of ['historical','fictional']){
  assert.equal(m.purpose({id,category,mapOrigin}),expected,id+' / '+mapOrigin);
 }
}
assert.equal(Object.keys(m.themes).length,10);
for(const [id,item] of Object.entries(m.themes))assert.ok(item.name&&item.color&&item.foreground,id);
console.log('PASS ten functional marker colors independent of real/fictional labels');
