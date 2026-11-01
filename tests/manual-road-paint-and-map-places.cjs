'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const app=fs.readFileSync(path.join(base,'app.js'),'utf8');
const roadSrc=fs.readFileSync(path.join(base,'road-editor.js'),'utf8');
const layoutSrc=fs.readFileSync(path.join(base,'road-layout.js'),'utf8');
const citySrc=fs.readFileSync(path.join(base,'city.js'),'utf8');
assert.match(app,/if\(e\.button!==2\)return; \/\/ The LEFT mouse button belongs/);
assert.match(app,/viewport\.addEventListener\('contextmenu',e=>\{/);
assert.doesNotMatch(html,/id="titleMapRoadSeed"|id="titleMapRoadScan"|id="titleMapRoadAccept"/);
assert.doesNotMatch(roadSrc,/function scan\(|function suggest\(|function accept\(/);
assert.match(html,/id="titleMapRoadPaint"/);
assert.match(html,/id="titleMapRoadRoad"/);
assert.match(html,/id="titleMapRoadBrush"/);
assert.match(html,/RIGHT DRAG pans/);
assert.match(layoutSrc,/MAX_ROADS=8000,MAX_BLOCKS=4000/);
assert.match(roadSrc,/img\?\.getBoundingClientRect/,'image rectangle, not changing viewport size, is point authority');
const docNodes=new Map(),events={};
const create=id=>{
 const target={id,hidden:false,value:id==='titleMapRoadBrush'?'12':'road',
  style:{},children:[],attributes:{},
  classList:{toggle(){}},
  addEventListener(name,fn){(events[id]??={})[name]=fn},
  setAttribute(name,value){this.attributes[name]=value},
  appendChild(c){this.children.push(c);return c},remove(){},
  setPointerCapture(){},releasePointerCapture(){}
 };
 docNodes.set(id,target);return target;
};
for(const id of ['titleMapImage','titleMapViewport','titleMapRoadCanvas','titleMapRoadEdit','titleMapRoadTools',
 'titleMapRoadStatus','titleMapRoadMode','titleMapRoadBrush','titleMapLocationCard'])create(id);
docNodes.get('titleMapImage').getBoundingClientRect=()=>({left:304,top:290,width:1000,height:565});
Object.assign(docNodes.get('titleMapViewport'),{clientWidth:880,clientHeight:440});
const context2d={setTransform(){},clearRect(){},beginPath(){},stroke(){},fill(){},moveTo(){},
 lineTo(){},arc(){},fillRect(){},strokeRect(){}};
const doc={getElementById:id=>docNodes.get(id)||null,createElement:tag=>{
 const n=create('new-'+tag);n.getContext=()=>context2d;return n
}};
let saved=0;
const save={},win={devicePixelRatio:1};
win.FE_ROAD_LAYOUT={sanitize(value){
 const data=value||{version:1,active:false,segments:[],blocks:[]};
 return JSON.parse(JSON.stringify(data))
},load(){}};
vm.runInNewContext(roadSrc,{window:win,document:doc,console});
const editor=win.FE_ROAD_EDITOR;
assert.ok(editor.mount({getSave:()=>save,persist:()=>saved++,refresh(){},
 getView:()=>({x:-190,y:68,scale:1.23})}));
assert.equal(editor.toggle(),true);
const send=(type,clientX,clientY,button=0)=>events.titleMapRoadCanvas[type]({
 button,pointerId:18,clientX,clientY,preventDefault(){},stopPropagation(){}
});
send('pointerdown',504,403);
send('pointermove',604,403);
send('pointermove',704,403);
send('pointerup',704,403);
assert.ok(save.customRoadLayout.segments.length>15,'freehand must create continuous connected sections');
assert.ok(Math.abs(save.customRoadLayout.segments[0].a.x-.2)<.00001,'road starts precisely at the mouse position');
assert.ok(Math.abs(save.customRoadLayout.segments[0].a.y-.2)<.00001);
assert.ok(Math.abs(save.customRoadLayout.segments.at(-1).b.x-.4)<.007);
const before=save.customRoadLayout.segments.length;
send('pointerdown',804,459,2);send('pointermove',854,459,2);send('pointerup',854,459,2);
assert.equal(save.customRoadLayout.segments.length,before,'right-drag belongs to the map and must never paint');
editor.selectMode('paint');
send('pointerdown',804,459);send('pointermove',854,459);send('pointerup',854,459);
assert.ok(save.customRoadLayout.blocks.length>=3,'blue building brush draws continuously');
editor.selectMode('erase');
const count=save.customRoadLayout.blocks.length;
send('pointerdown',804,459);send('pointerup',804,459);
assert.ok(save.customRoadLayout.blocks.length<count,'blue building paint can be erased');
editor.selectMode('line');
send('pointerdown',504,403);send('pointerdown',504,516);
assert.ok(save.customRoadLayout.segments.length>before);
assert.equal(editor.getStatus().editing,true);
assert.ok(saved>0,'manual roads and building marks are persisted');
const window={};vm.runInNewContext(citySrc,{window});
const city=window.FederalElectricCity,places=city.listLocations();
assert.equal(places.filter(x=>x.map).length,42);
const ford=city.getLocation('fordsTheatre');
assert.equal(ford.map.n,41);
assert.equal(city.getLocation('centerMarket').map.n,42,'Center Market is independently numbered and visitable');
assert.ok(ford.rooms.some(r=>r.id==='theatre-lobby'));
for(const p of places.filter(p=>p.map)){
 if(p.id==='washingtonFairgrounds')assert.equal(p.availableFrom,'1878-10-01','owner-approved late-1878 fair event gate');
 else assert.equal(p.availableFrom,undefined,'Other mapped locations retain year-independent visits');
 assert.equal(p.availableUntil,undefined,'Map locations are not hidden by historical closing years');
}
assert.doesNotMatch(app,/if\(entry\.availableFrom&&S\.gameDate/);
assert.doesNotMatch(app,/if\(entry\.availableUntil&&S\.gameDate/);
console.log('PASS right pan, manual drawing, Ford’s Theatre #41 and the protected late-1878 Fair story date');
