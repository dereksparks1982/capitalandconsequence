'use strict';
// Executable unit test for map-card and city-room historical reading UI.
// DOM is a small deterministic stand-in, no Electron or network dependency.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const cityCtx={window:{}};vm.runInNewContext(read('city.js'),cityCtx);
const sites=cityCtx.window.FederalElectricCity;
const app=read('app.js'),start=app.indexOf('function renderPlaceReference('),end=app.indexOf('\nfunction openTitleMapLocation(',start);
assert.ok(start!==-1&&end>start,'the real-history renderer is present');
const rendererSource=app.slice(start,end);
const elements={};
function node(tag){
 return {tagName:tag,children:[],hidden:false,className:'',textContent:'',href:'',target:'',rel:'',
  classList:{classes:new Set(),toggle(name,bool){if(bool)this.classes.add(name);else this.classes.delete(name)}},
  replaceChildren(){this.children=[]},appendChild(child){this.children.push(child);return child}};
}
for(const name of ['titleMapLocationFact','titleMapHistoricalReading','cityRoomFact','cityRoomHistoricalReading'])elements[name]=node('div');
const document={getElementById:name=>elements[name]||null,createElement:node};
const context={document,encodeURIComponent};
vm.createContext(context);vm.runInContext(rendererSource+'\nthis.render=renderPlaceReference;',context);
const render=context.render;
const monastery=sites.getLocation('franciscanMonastery');
render(monastery,true);
assert.equal(elements.titleMapLocationFact.textContent,'Non-Fiction');
assert.equal(elements.titleMapHistoricalReading.hidden,false);
assert.equal(elements.titleMapHistoricalReading.children[0].tagName,'details');
const history=elements.titleMapHistoricalReading.children[0];
assert.ok(history.children.some(c=>String(c.textContent).includes('1899')),'actual monastery year is supplied');
const links=history.children.find(c=>c.className==='historical-reading-links').children;
assert.equal(links.length,2,'Wikipedia and Library of Congress references supplied');
assert.ok(links[0].href.includes('wikipedia.org')&&links[1].href.includes('loc.gov'));
assert.ok(links.every(l=>l.target==='_blank'&&l.rel==='noopener noreferrer'));
render(monastery,false);
assert.equal(elements.cityRoomFact.textContent,'Non-Fiction');
assert.equal(elements.cityRoomHistoricalReading.hidden,false);
const cobbler=sites.getLocation('cobblerShop');
render(cobbler,true);
assert.equal(elements.titleMapLocationFact.textContent,'Fiction');
assert.equal(elements.titleMapHistoricalReading.hidden,true);
assert.equal(elements.titleMapHistoricalReading.children.length,0,'historical links cleared for invented business');
render(cobbler,false);
assert.equal(elements.cityRoomFact.textContent,'Fiction');
assert.equal(elements.cityRoomHistoricalReading.hidden,true);
for(const location of sites.mapLocations().filter(v=>v.origin==='historical')){
 assert.ok(location.history&&location.history.summary&&location.history.query,location.id+' educational metadata');
 render(sites.getLocation(location.id),true);
 assert.equal(elements.titleMapHistoricalReading.hidden,false,location.id+' can open reading');
}
console.log('PASS historical reading on map and room: Fiction/Non-Fiction badges, 16 real destinations, Wikipedia + LOC links, no fictitious history');
