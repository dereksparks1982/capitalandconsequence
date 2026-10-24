'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const oval=fs.readFileSync(path.join(__dirname,'../oval-racing.js'),'utf8');
const registry=fs.readFileSync(path.join(__dirname,'../city.js'),'utf8');
const cityCtx={window:{}};vm.runInNewContext(registry,cityCtx);
const city=cityCtx.window.FederalElectricCity;
assert.equal(city.getLocation('potomacKennelTrack').availableFrom,'1919-01-01');
assert.equal(city.getLocation('capitalSpeedway').availableFrom,'1933-01-01');
function run(date){
 const S={gameDate:date,phase:'day',dayRemaining:3600,personalCash:500,notes:[]};
 const document={hidden:true,getElementById:()=>null,addEventListener(){}};
 vm.runInNewContext(oval,{S,window:{},document,setInterval:()=>0,clearInterval(){},setTimeout:()=>0,
  save(){},clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),cash:n=>'$'+n,escapeHtml:String,displayDate:()=>date});
 return S;
}
const start=run('1878-01-02');
assert.equal(start.dogRacing,undefined);assert.equal(start.midgetCarRacing,undefined);
const middle=run('1920-01-02');
assert.equal(middle.dogRacing.roster.length,16);assert.equal(middle.midgetCarRacing,undefined);
const later=run('1938-01-02');
assert.equal(later.dogRacing.roster.length,16);
assert.equal(later.midgetCarRacing.roster.length,16);
assert.equal(later.midgetCarRacing.roster[0].driver,'Eddie Marsh');
console.log('PASS future-only dog/midget competitions and permanent unchanged map');
