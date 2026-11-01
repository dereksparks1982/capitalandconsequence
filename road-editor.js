/* Washington manual road and building painter. Canvas overlay ONLY:
 * never alters the approved printed map, its pins, or image coordinates.
 * Left drag paints. Right drag pans at every zoom (handled by app viewport).
 */
(function(root){
'use strict';
const W=2048,H=1159,MAX_ROADS=8000,MAX_BLOCKS=4000;
const $=id=>document.getElementById(id),clamp=v=>Math.max(0,Math.min(1,v));
let config=null,host=null,canvas=null,ctx=null,draft=null;
let editing=false,mode='road',pending=null,painting=false,activePointer=null;
let strokePoints=[],paintChanged=false,previous=null;
const undoStack=[];
function clone(value){return JSON.parse(JSON.stringify(value))}
function info(value){const out=$('titleMapRoadStatus');if(out)out.textContent=value}
function snapshot(){undoStack.push(clone(draft));if(undoStack.length>50)undoStack.shift()}
function restore(){
 if(!root.FE_ROAD_LAYOUT?.sanitize)return false;
 draft=root.FE_ROAD_LAYOUT.sanitize(config?.getSave?.()?.customRoadLayout);
 return true;
}
function persist(message){
 const save=config?.getSave?.();
 if(!save||!draft)return false;
 save.customRoadLayout=root.FE_ROAD_LAYOUT.sanitize(draft);
 draft=root.FE_ROAD_LAYOUT.sanitize(save.customRoadLayout);
 root.FE_ROAD_LAYOUT.load(save.customRoadLayout);
 config.persist?.();config.refresh?.();
 if(message)info(message+' · '+draft.segments.length+' road sections · '+draft.blocks.length+
  ' blue building marks · custom routes '+(draft.active?'ON':'OFF'));
 return true;
}
function screen(p,v){return {x:v.x+p.x*W*v.scale,y:v.y+p.y*H*v.scale}}
function coord(e){
 // The rendered image is the ONLY authority for this transformation. Using
 // an overlay or viewport offset alone misplaces the first cursor point when
 // the map is fitted, zoomed, panned or the surrounding toolbars wrap.
 const img=$('titleMapImage'),r=img?.getBoundingClientRect?.();
 if(!r||r.width<=0||r.height<=0)return null;
 const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
 if(x<0||x>1||y<0||y>1)return null;
 return {x:clamp(x),y:clamp(y)};
}
function distance(a,b){return Math.hypot((a.x-b.x)*W,(a.y-b.y)*H)}
function brushSize(){const v=Number($('titleMapRoadBrush')?.value);return [6,12,18,30,48].includes(v)?v:12}
function rect(p){const r=brushSize()/2;return {x0:clamp(p.x-r/W),y0:clamp(p.y-r/H),
 x1:clamp(p.x+r/W),y1:clamp(p.y+r/H)}}
function overlaps(a,b){return !(a.x1<b.x0||a.x0>b.x1||a.y1<b.y0||a.y0>b.y1)}
function closeToSegment(p,a,b,radius){
 const x=p.x*W,y=p.y*H,ax=a.x*W,ay=a.y*H,dx=(b.x-a.x)*W,dy=(b.y-a.y)*H;
 const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));
 return Math.hypot(x-ax-dx*t,y-ay-dy*t)<=radius;
}
function render(){
 if(!ctx||!canvas||!draft||!config)return;
 const v=config.getView?.(),vp=$('titleMapViewport');
 if(!v||!vp||!Number.isFinite(v.scale)||v.scale<=0)return;
 const w=vp.clientWidth,h=vp.clientHeight;if(!w||!h)return;
 const ratio=Math.min(2,Math.max(1,Number(root.devicePixelRatio)||1));
 canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
 canvas.style.width=w+'px';canvas.style.height=h+'px';
 ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
 function line(a,b,color,width=2){
  const pa=screen(a,v),pb=screen(b,v);ctx.beginPath();ctx.lineWidth=width;
  ctx.strokeStyle=color;ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();
 }
 for(const s of draft.segments)line(s.a,s.b,'#53d8aa',2.8);
 if(strokePoints.length>1)
  for(let i=1;i<strokePoints.length;i++)line(strokePoints[i-1],strokePoints[i],'#fff0a9',3.5);
 for(const b of draft.blocks){
  const a=screen({x:b.x0,y:b.y0},v),z=screen({x:b.x1,y:b.y1},v);
  ctx.fillStyle='rgba(34,103,220,.62)';ctx.strokeStyle='#7cc4ff';ctx.lineWidth=1;
  ctx.fillRect(a.x,a.y,z.x-a.x,z.y-a.y);ctx.strokeRect(a.x,a.y,z.x-a.x,z.y-a.y);
 }
 if(pending||strokePoints.length){
  const point=pending||strokePoints.at(-1),p=screen(point,v);
  ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);
  ctx.fillStyle='#ffde67';ctx.fill();
 }
}
function show(){
 if(!host||!draft)return;
 host.hidden=!editing&&!draft.segments.length&&!draft.blocks.length;
 host.classList.toggle('editing',editing);render();
}
function markAt(p){
 const b=rect(p);
 if(mode==='erase'){
  const n=draft.blocks.length;
  draft.blocks=draft.blocks.filter(v=>!overlaps(v,b));
  return n!==draft.blocks.length;
 }
 if(mode==='erase-road'){
  const n=draft.segments.length,r=brushSize()/2;
  draft.segments=draft.segments.filter(v=>!closeToSegment(p,v.a,v.b,r));
  return n!==draft.segments.length;
 }
 if(draft.blocks.length>=MAX_BLOCKS){info('Blue building mark limit reached. Use a larger brush.');return false}
 if(b.x0>=b.x1||b.y0>=b.y1)return false;
 draft.blocks.push(b);return true;
}
function along(from,to,fn,spacing){
 const distancePx=distance(from,to),steps=Math.max(1,Math.min(600,Math.ceil(distancePx/spacing)));
 for(let i=1;i<=steps;i++)fn({x:from.x+(to.x-from.x)*i/steps,y:from.y+(to.y-from.y)*i/steps});
}
function takeRoadPoint(p){
 const last=strokePoints.at(-1);
 if(!last||distance(last,p)>5)strokePoints.push(p);
}
function pointerDown(e){
 if(!editing||config?.busy?.()||!draft||e.button!==0)return; // right goes to map pan
 const p=coord(e);if(!p)return;
 e.stopPropagation();e.preventDefault();
 if(mode==='line'||mode==='block'){
  if(!pending){pending=p;info(mode==='line'?'First endpoint placed. Left-click the other endpoint.':
    'First building corner placed. Left-click the opposite corner.');render();return}
  const a=pending;pending=null;
  if(mode==='line'&&distance(a,p)>3&&draft.segments.length<MAX_ROADS){
   snapshot();draft.segments.push({a,b:p});persist('Precise road line saved.');
  }else if(mode==='block'){
   const b={x0:Math.min(a.x,p.x),y0:Math.min(a.y,p.y),
    x1:Math.max(a.x,p.x),y1:Math.max(a.y,p.y)};
   if((b.x1-b.x0)*W>=3&&(b.y1-b.y0)*H>=3&&draft.blocks.length<MAX_BLOCKS){
    snapshot();draft.blocks.push(b);persist('Blue building rectangle saved.');
   }
  }
  render();return;
 }
 painting=true;activePointer=e.pointerId;paintChanged=false;previous=p;
 strokePoints=mode==='road'?[p]:[];
 snapshot();
 if(mode!=='road')paintChanged=markAt(p)||paintChanged;
 try{host.setPointerCapture?.(e.pointerId)}catch(_){}
 render();
}
function pointerMove(e){
 if(!editing||!painting||activePointer!==e.pointerId||!draft)return;
 const p=coord(e);if(!p)return;
 e.stopPropagation();e.preventDefault();
 if(mode==='road'){
  along(previous||p,p,takeRoadPoint,5);
 }else{
  along(previous||p,p,q=>{paintChanged=markAt(q)||paintChanged},Math.max(3,brushSize()*.6));
 }
 previous=p;render();
}
function pointerUp(e){
 if(!painting||e.pointerId!==activePointer)return;
 e.stopPropagation?.();
 const p=coord(e);
 if(p&&mode==='road')takeRoadPoint(p);
 painting=false;activePointer=null;previous=null;
 try{host.releasePointerCapture?.(e.pointerId)}catch(_){}
 if(mode==='road'){
  // A stroke begins EXACTLY at the initial cursor point. Freehand samples
  // are joined to make one continuous usable route, with no diagonal jump.
  const points=strokePoints,available=Math.max(0,MAX_ROADS-draft.segments.length);
  if(points.length>=2&&available){
   for(let i=1;i<points.length&&i<=available;i++)
    draft.segments.push({a:points[i-1],b:points[i]});
   paintChanged=true;
  }
 }
 strokePoints=[];
 if(paintChanged)persist(mode==='road'?'Freehand road saved.':mode==='paint'?'Blue building painted.':'Map obstruction erased.');
 else undoStack.pop();
 paintChanged=false;show();
}
function ensureCanvas(){
 if(ctx)return true;
 host=$('titleMapRoadCanvas');if(!host)return false;
 canvas=document.createElement('canvas');canvas.id='titleMapRoadBrushSurface';
 canvas.setAttribute('aria-hidden','true');
 canvas.style.cssText='display:block;pointer-events:none;width:100%;height:100%';
 host.appendChild(canvas);ctx=canvas.getContext('2d');
 if(!ctx){canvas.remove();canvas=null;info('Canvas2D is unavailable.');return false}
 host.addEventListener('pointerdown',pointerDown);
 host.addEventListener('pointermove',pointerMove);
 host.addEventListener('pointerup',pointerUp);
 host.addEventListener('pointercancel',pointerUp);
 return true;
}
function sync(){if(!config)return;if(!editing)restore();show()}
function selectMode(value){
 const allowed=['road','line','block','paint','erase','erase-road'];
 if(!allowed.includes(value))return;
 mode=value;pending=null;strokePoints=[];painting=false;previous=null;
 const selector=$('titleMapRoadMode');if(selector)selector.value=mode;
 for(const id of ['road','paint','block','erase','erase-road']){
  const btn=$('titleMapRoad'+id[0].toUpperCase()+id.slice(1).replace('-road','Road'));
  if(btn)btn.setAttribute('aria-pressed',String(mode===id));
 }
 const hints={road:'FREEHAND STREET: LEFT-drag to draw. RIGHT-drag to pan. Wheel to zoom.',
  line:'PRECISE STREET: left-click two endpoints. RIGHT-drag to pan.',
  block:'BUILDING RECTANGLE: left-click two corners. Blue means impassable for pathfinding.',
  paint:'BLUE BUILDING BRUSH: LEFT-drag over building footprints. RIGHT-drag to pan.',
  erase:'ERASE BLUE BUILDINGS: LEFT-drag to clear obstacles.',
  'erase-road':'ERASE STREETS: LEFT-drag across an incorrect road section.'};
 info(hints[mode]);render();
}
function toggle(){
 if(!config)return false;
 if(config.busy?.()){info('Finish the current journey first.');return false}
 if(!editing&&(config.getPinEdit?.()||root.FE_RAIL_EDITOR?.isEditing?.())){
  info('Finish Edit Pins or Rail Editor before road painting.');return false;
 }
 if(!root.FE_ROAD_LAYOUT?.sanitize||!ensureCanvas()){info('Road editor is unavailable.');return false}
 editing=!editing;pending=null;painting=false;strokePoints=[];activePointer=null;previous=null;
 restore();
 const tools=$('titleMapRoadTools'),button=$('titleMapRoadEdit');
 if(tools)tools.hidden=!editing;
 if(button){button.textContent=editing?'Finish Road Editor':'Road Editor';button.setAttribute('aria-pressed',String(editing));button.setAttribute('aria-expanded',String(editing))}
 const card=$('titleMapLocationCard');if(editing&&card)card.hidden=true;
 show();
 if(editing)selectMode(mode);
 else info('Editor closed. Your manually drawn streets and blue building obstacles are saved.');
 return true;
}
function undo(){
 if(!editing||!draft)return;
 if(pending){pending=null;render();return info('First point canceled.')}
 if(!undoStack.length)return info('Nothing to undo.');
 draft=undoStack.pop();persist('Last manual map edit undone.');show();
}
function activate(yes){
 if(!editing||!draft)return;
 if(yes&&draft.segments.length<2)return info('Draw at least two connected street sections to activate manual routing.');
 snapshot();draft.active=yes;persist(yes?'Manual A* street routing enabled. Disconnected places are inaccessible.':
  'Original routing restored. Your manual drawing remains saved.');
}
function exportRoads(){
 if(!draft)return;
 const url=URL.createObjectURL(new Blob([JSON.stringify(root.FE_ROAD_LAYOUT.sanitize(draft),null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download='capital-washington-manual-roads.json';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);info('Exported manually painted streets and blue building obstacles.');
}
function importRoads(file){
 if(!file)return;if(file.size>1800000)return info('Map file is too large.');
 const reader=new FileReader();
 reader.onload=()=>{try{
  const value=JSON.parse(reader.result);
  if(value?.version!==1||!Array.isArray(value.segments)||!Array.isArray(value.blocks))throw Error('Incorrect road layout format');
  snapshot();draft=root.FE_ROAD_LAYOUT.sanitize(value);draft.active=false;pending=null;
  persist('Manual map imported. Activate Custom Routes when ready.');
 }catch(error){info('Could not import roads: '+error.message)}};
 reader.onerror=()=>info('File read failed.');reader.readAsText(file);
}
function mount(args){
 if(config)return true;config=args;
 const on=(id,event,handler)=>$(id)?.addEventListener(event,handler);
 on('titleMapRoadEdit','click',toggle);
 on('titleMapRoadMode','change',e=>selectMode(e.target.value));
 for(const [id,m] of [['titleMapRoadRoad','road'],['titleMapRoadPaint','paint'],
  ['titleMapRoadBlock','block'],['titleMapRoadErase','erase'],['titleMapRoadEraseRoad','erase-road']])
  on(id,'click',()=>selectMode(m));
 on('titleMapRoadBrush','change',()=>{info('Brush width '+brushSize()+' printed-map pixels.');render()});
 on('titleMapRoadFinish','click',()=>{pending=null;strokePoints=[];render();info('Line finished. Choose a new place to start.')});
 on('titleMapRoadUndo','click',undo);
 on('titleMapRoadEnable','click',()=>activate(true));
 on('titleMapRoadDisable','click',()=>activate(false));
 on('titleMapRoadExport','click',exportRoads);
 on('titleMapRoadImport','change',e=>{importRoads(e.target.files?.[0]);e.target.value=''});
 on('titleMapRoadClear','click',()=>{
  if(!root.confirm('Clear ALL manually drawn roads and blue building masks for this profile?'))return;
  snapshot();draft={version:1,active:false,segments:[],blocks:[]};pending=null;
  persist('Manual road map cleared; printed Washington artwork unchanged.');show();
 });
 restore();ensureCanvas();show();return true;
}
root.FE_ROAD_EDITOR=Object.freeze({version:3,mount,sync,toggle,selectMode,
 isEditing:()=>editing,getStatus:()=>({editing,mode,streets:draft?.segments.length||0,blocks:draft?.blocks.length||0}),
 cursorCoordinate:coord});
root.FE_ROAD_EDITOR_SETUP?.();
})(typeof window!=='undefined'?window:globalThis);
