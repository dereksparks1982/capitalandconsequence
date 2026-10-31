'use strict';
/* Behavioral test of the actual editor through its DOM event handlers.
 * Does not merely grep for the existence of a paint button.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../road-editor.js'),'utf8');
const listeners=new Map(),nodes=new Map(),drawn={blue:0,cleared:0};
function node(id){
 if(nodes.has(id))return nodes.get(id);
 const el={id,hidden:true,value:'road',textContent:'',attrs:{},style:{},clientWidth:900,clientHeight:500,
  addEventListener(type,fn){const key=id+':'+type;listeners.set(key,[...(listeners.get(key)||[]),fn]);},
  setAttribute(name,value){this.attrs[name]=String(value);},
  appendChild(child){this.child=child;},getBoundingClientRect(){return {left:0,top:0,width:900,height:500};},
  setPointerCapture(){},releasePointerCapture(){},classList:{toggle(){}}};
 nodes.set(id,el);return el;
}
const ctx=new Proxy({}, {get(o,key){
 if(key==='fillRect')return ()=>{drawn.blue++};
 if(key==='clearRect')return ()=>{drawn.cleared++};
 return key in o?o[key]:()=>{};
},set(o,k,v){o[k]=v;return true;}});
const document={
 getElementById:node,
 createElement(tag){
  assert.equal(tag,'canvas');
  return {style:{},getContext:kind=>{assert.equal(kind,'2d');return ctx;},
   width:0,height:0,setAttribute(){},remove(){}};
 }
};
let saved={customRoadLayout:null},persisted=0,loaded=null;
function sanitize(v){
 return {version:1,active:!!v?.active&&!!v?.segments?.length,
  segments:(v?.segments||[]).map(s=>({a:{...s.a},b:{...s.b}})),
  blocks:(v?.blocks||[]).map(b=>({...b}))};
}
const window={FE_ROAD_LAYOUT:{sanitize,load(v){loaded=v}},
 FE_CAPITAL_STREETS:{draftSegments:()=>[]},devicePixelRatio:1,confirm:()=>true};
vm.runInNewContext(source,{window,document,Math,JSON,Number,Blob,URL,FileReader:function(){}});
const editor=window.FE_ROAD_EDITOR;
assert.ok(editor?.mount&&editor?.getStatus,'Editor registered in browser');
const config={getSave:()=>saved,persist(){persisted++},
 refresh(){editor.sync();},getView:()=>({x:0,y:0,scale:1}),busy:()=>false,getPinEdit:()=>false};
assert.equal(editor.mount(config),true);
function event(id,type,data={}){
 const e={button:0,pointerId:2,clientX:300,clientY:180,
  preventDefault(){},stopPropagation(){},target:node(id),...data};
 for(const f of listeners.get(id+':'+type)||[])f(e);
}
event('titleMapRoadEdit','click');
assert.equal(editor.isEditing(),true);
assert.equal(node('titleMapRoadTools').hidden,false,'Editor controls are visible at once');
assert.equal(node('titleMapRoadEdit').attrs['aria-expanded'],'true');
node('titleMapRoadMode').value='paint';
event('titleMapRoadMode','change');
event('titleMapRoadCanvas','pointerdown');
event('titleMapRoadCanvas','pointermove',{clientX:415,clientY:200});
event('titleMapRoadCanvas','pointerup',{clientX:415,clientY:200});
assert.ok(saved.customRoadLayout.blocks.length>=5,'Dragging the brush creates multiple blue walk blockers');
assert.ok(drawn.blue>0,'Canvas actually filled building pixels');
assert.ok(persisted>0,'Blue building strokes autosave to profile');
assert.ok(loaded?.blocks?.length,'Street planner receives saved blue blocks');
const many=saved.customRoadLayout.blocks.length;
event('titleMapRoadUndo','click');
assert.equal(saved.customRoadLayout.blocks.length,0,'Undo reverses an entire brush stroke');
node('titleMapRoadMode').value='block';event('titleMapRoadMode','change');
event('titleMapRoadCanvas','pointerdown',{clientX:340,clientY:190});
event('titleMapRoadCanvas','pointerdown',{clientX:470,clientY:300});
assert.equal(saved.customRoadLayout.blocks.length,1,'Two-click building fills one rectangular obstacle');
const r=saved.customRoadLayout.blocks[0];
assert.ok(r.x0<r.x1&&r.y0<r.y1);
node('titleMapRoadMode').value='erase';event('titleMapRoadMode','change');
event('titleMapRoadCanvas','pointerdown',{clientX:400,clientY:240});
event('titleMapRoadCanvas','pointerup',{clientX:400,clientY:240});
assert.equal(saved.customRoadLayout.blocks.length,0,'Eraser removes blue building obstacle');
node('titleMapRoadMode').value='road';event('titleMapRoadMode','change');
event('titleMapRoadCanvas','pointerdown',{clientX:340,clientY:190});
event('titleMapRoadCanvas','pointerdown',{clientX:470,clientY:300});
assert.equal(saved.customRoadLayout.segments.length,1,'Two-click street route saves');
event('titleMapRoadEdit','click');
assert.equal(editor.isEditing(),false);
assert.equal(node('titleMapRoadEdit').attrs['aria-expanded'],'false');
event('titleMapRoadEdit','click');
assert.equal(editor.getStatus().streets,1,'Editor reloads existing streets');
assert.ok(node('titleMapRoadStatus').textContent.includes('Editor open'));
assert.equal(editor.getStatus().blocks,0);
console.log('PASS native Canvas2D road editor, brush ('+many+'), rectangle, erase, undo, street save, panel controls');
