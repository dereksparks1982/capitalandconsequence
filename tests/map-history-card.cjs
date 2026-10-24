'use strict';
/* Exercise historical/fictional cards without Electron or external networking. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const ctx={window:{}};vm.runInNewContext(read('city.js'),ctx,{filename:'city.js'});
const registry=ctx.window.FederalElectricCity;
const source=read('app.js');
const from=source.indexOf('function renderPlaceReference(');
const to=source.indexOf('function openTitleMapLocation(',from);
assert.ok(from>0&&to>from,'history card function is present in the game source');
function node(tag){
 const classes=new Set();
 return {tagName:tag,children:[],textContent:'',hidden:false,attributes:{},
  setAttribute(name,value){this.attributes[name]=value},
  classList:{toggle(name,on){if(on)classes.add(name);else classes.delete(name)},contains(name){return classes.has(name)}},
  appendChild(item){this.children.push(item);return item},
  replaceChildren(...items){this.children=[...items]},
 };
}
const nodes=Object.fromEntries(['titleMapLocationFact','cityRoomFact',
 'titleMapHistoricalReading','cityRoomHistoricalReading'].map(id=>[id,node('section')]));
const document={getElementById:id=>nodes[id]||null,createElement:node};
const render=new Function('document',source.slice(from,to)+'return renderPlaceReference;')(document);
const all=registry.listLocations();
const real=all.filter(p=>p.mapOrigin==='historical');
const invented=all.filter(p=>p.mapOrigin==='fictional');
assert.equal(real.length,16);assert.equal(invented.length,22);
for(const place of real){
 assert.ok(place.history&&place.history.summary&&place.history.query,place.id+' has real-world reading');
 for(const isMap of [true,false]){
  render(place,isMap);
  const badge=nodes[isMap?'titleMapLocationFact':'cityRoomFact'];
  const panel=nodes[isMap?'titleMapHistoricalReading':'cityRoomHistoricalReading'];
  assert.equal(badge.textContent,'Non-Fiction',place.id+' factual badge');
  assert.equal(panel.hidden,false,place.id+' visible reading panel');
  assert.equal(panel.children.length,1,place.id+' collapsible reading');
  const details=panel.children[0];
  assert.equal(details.tagName,'details');
  assert.equal(details.children[0].textContent,'Real History · Further Reading');
  assert.ok(details.children[1].textContent.length>25,place.id+' summary');
  assert.ok(details.children[2].textContent.includes('alternate timeline'));
  const links=details.children[3].children;
  assert.equal(links.length,2,place.id+' Wikipedia and LOC');
  assert.ok(links[0].href.startsWith('https://en.wikipedia.org/wiki/'),place.id+' Wikipedia link');
  assert.ok(links[1].href.startsWith('https://www.loc.gov/search/'),place.id+' LOC link');
  for(const link of links){
   assert.equal(link.target,'_blank');
   assert.equal(link.rel,'noopener noreferrer');
  }
 }
}
for(const place of invented){
 assert.equal(place.history,null,place.id+' has no documentary-history article');
 assert.ok(place.story&&place.story.length>35,place.id+' has a game-world backstory');
 render(place,true);render(place,false);
 for(const prefix of ['titleMap','cityRoom']){
  const badge=nodes[prefix==='titleMap'?'titleMapLocationFact':'cityRoomFact'];
  const panel=nodes[prefix==='titleMap'?'titleMapHistoricalReading':'cityRoomHistoricalReading'];
  assert.equal(badge.textContent,'Fiction',place.id+' visibly invented');
  assert.equal(panel.hidden,false,place.id+' shows its alternate-history story');
  assert.equal(panel.classList.contains('is-fiction-story'),true,place.id+' has blue fiction panel');
  assert.equal(panel.children.length,1,place.id+' presents one game-history story');
  const details=panel.children[0];
  assert.equal(details.open,true,place.id+' fiction story is immediately readable');
  assert.equal(details.children[0].textContent,'Our Alternate History · Fiction');
  assert.equal(details.children[1].textContent,place.story);
  assert.ok(details.children[2].textContent.includes('not a record of real Washington history'));
  assert.equal(details.children.length,3,place.id+' fiction should never contain Wikipedia or LOC links');
 }
}
console.log('PASS 38 card identities; 16 real history panels with reading links and 22 separate fictional world histories');
