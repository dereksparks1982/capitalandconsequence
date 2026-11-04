'use strict';
/* Executable read-only route regression. Benjamin's atlas must never
 * initialize Charles Whitecomb's empire, even via forged finance controls. */
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'merchant-world-map.js'),'utf8');
const nav=require('../merchant-navigation.js');
const regions=require('../merchant-regions.js');
const camera=require('../merchant-chart-camera.js');
let financeCalls=0,closeButtons=0;
const host={
 id:'',hidden:true,className:'',innerHTML:'',
 setAttribute(){},addEventListener(type,fn){this.events[type]??=[];this.events[type].push(fn)},
 events:{},
 querySelector(selector){
  if(selector==='#merchantWorldSelection')return this.selected??=( {hidden:false} );
  if(selector==='#merchantWorldCommerce')return this.commerce??=( {hidden:true} );
  if(selector==='#merchantWorldStatus')return this.status??=( {textContent:''} );
  return null;
 }
};
const document={
 activeElement:null,createElement(){return host},
 body:{appendChild(){},classList:{add(){},remove(){}}}
};
const window={
 FE_MERCHANT_NAV:nav,FE_MERCHANT_REGIONS:regions,FE_MERCHANT_CAMERA:camera,
 FE_EMPIRE:{ensure(){financeCalls++;throw Error('Benjamin accessed Federal Electric')},
           advance(){financeCalls++;throw Error('Benjamin advanced Charles fleet')}},
 setInterval(){return 1},clearInterval(){},requestAnimationFrame(){},addEventListener(){},
 devicePixelRatio:1
};
const context={window,document,requestAnimationFrame(){},console};
vm.runInNewContext(source,context,{filename:'merchant-world-map.js',timeout:1500});
const save={characterRoute:'mariner',gameDate:'1878-09-04'};
const original=JSON.stringify(save);
assert.equal(window.FE_MERCHANT_MAP.open(save,()=>{}),true);
assert(host.innerHTML.includes('BENJAMIN LEACH · SALEM CHART ROOM'));
assert(host.innerHTML.includes(nav.MAP));
assert(host.innerHTML.includes('Salem Office Notes'));
assert(!host.innerHTML.includes('Buy Schooner'));
assert(!host.innerHTML.includes('Complete Local Sale'));
assert.equal(financeCalls,0);
assert.deepEqual(Object.keys(save).sort(),['characterRoute','gameDate','merchantMap'].sort());
assert.equal(regions.ensure(save).pins.length,0);
const fakeBuy={target:{closest(selector){
 return selector==='[data-ocean-action]'?{dataset:{oceanAction:'buy:schooner'}}:null;
}}};
for(const handler of host.events.click||[])handler(fakeBuy);
assert.equal(financeCalls,0,'Forged buy action must not reach Charles fleet');
assert(host.status.textContent.includes('Chart study only'));
window.FE_MERCHANT_MAP.close();
assert.equal(window.FE_MERCHANT_MAP.isOpen(),false);
assert.equal(financeCalls,0);
const unauthorized={characterRoute:'investigator',gameDate:'1878-09-04'};
assert.equal(window.FE_MERCHANT_MAP.open(unauthorized,()=>{}),false);
console.log('Benjamin atlas: true viewer opens, full-size map, no company borrowing, forged buys rejected');
