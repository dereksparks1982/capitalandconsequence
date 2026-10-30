/* Capital & Consequence: Konva street editor over immutable Washington guide.
 * Suggestions from the existing approximate mesh and experimental raster scan
 * require acceptance; only the player's explicitly activated roads affect travel.
 */
(function(root){
'use strict';
const W=2048,H=1159,MAX_ROADS=2200,MAX_BLOCKS=500;
let config=null,stage=null,layer=null,host=null,draft=null;
let editing=false,pending=null,mode='road',suggestions=[];
const $=id=>document.getElementById(id);
const info=s=>{const out=$('titleMapRoadStatus');if(out)out.textContent=s};
const clamp=n=>Math.max(0,Math.min(1,n));
function validPoint(p){return {x:clamp(p.x),y:clamp(p.y)}}
function currentSave(){return config?.getSave?.()}
function reload(){
 const s=currentSave();
 draft=root.FE_ROAD_LAYOUT.sanitize(s?.customRoadLayout);
}
function persist(){
 const s=currentSave();if(!s||!draft)return;
 s.customRoadLayout=root.FE_ROAD_LAYOUT.sanitize(draft);
 draft=root.FE_ROAD_LAYOUT.sanitize(s.customRoadLayout);
 root.FE_ROAD_LAYOUT.load(s.customRoadLayout);
 config.persist?.();config.refresh?.();
}
function ensureCanvas(){
 if(stage)return true;
 const Konva=root.Konva,viewport=$('titleMapViewport');
 host=$('titleMapRoadCanvas');
 if(!Konva||!viewport||!host)return false;
 stage=new Konva.Stage({container:host,width:viewport.clientWidth,height:viewport.clientHeight});
 layer=new Konva.Layer();stage.add(layer);
 // Do not allow the map pan handler to interpret editing clicks as dragging.
 host.addEventListener('pointerdown',e=>{if(editing)e.stopPropagation()});
 host.addEventListener('touchstart',e=>{if(editing)e.stopPropagation()},{passive:true});
 stage.on('pointerdown',()=>{
  if(!editing||config?.busy?.()||!draft)return;
  const pos=stage.getPointerPosition(),v=config?.getView?.();
  if(!pos||!v||!Number.isFinite(v.scale)||v.scale<=0)return;
  const p=validPoint({x:(pos.x-v.x)/(W*v.scale),y:(pos.y-v.y)/(H*v.scale)});
  if(mode==='road'){
   if(pending&&draft.segments.length<MAX_ROADS&&
    Math.hypot((p.x-pending.x)*W,(p.y-pending.y)*H)>3){
    draft.segments.push({a:pending,b:p});persist();
   }
   pending=p;
  }else if(pending){
   const r={x0:Math.min(pending.x,p.x),y0:Math.min(pending.y,p.y),
    x1:Math.max(pending.x,p.x),y1:Math.max(pending.y,p.y)};
   if(r.x1-r.x0>.001&&r.y1-r.y0>.001&&draft.blocks.length<MAX_BLOCKS){
    draft.blocks.push(r);persist();
   }
   pending=null;
  }else pending=p;
  render();
 });
 return true;
}
function drawSegment(group,s,color,dashed){
 const Konva=root.Konva,v=config.getView();
 group.add(new Konva.Line({points:[s.a.x*W,s.a.y*H,s.b.x*W,s.b.y*H],
  stroke:color,strokeWidth:3/Math.max(.1,v.scale),dash:dashed?[7/v.scale,5/v.scale]:[],
  opacity:.82,listening:false}));
}
function render(){
 if(!stage||!config||!draft)return;
 const v=config.getView(),viewport=$('titleMapViewport');
 if(!v||!viewport)return;
 stage.width(viewport.clientWidth);stage.height(viewport.clientHeight);
 layer.destroyChildren();
 const group=new root.Konva.Group({x:v.x,y:v.y,scaleX:v.scale,scaleY:v.scale,listening:false});
 for(const s of draft.segments)drawSegment(group,s,'#61dfad',false);
 for(const s of suggestions)drawSegment(group,s,'#ffcc56',true);
 for(const r of draft.blocks)group.add(new root.Konva.Rect({
  x:r.x0*W,y:r.y0*H,width:(r.x1-r.x0)*W,height:(r.y1-r.y0)*H,
  stroke:'#f06d50',strokeWidth:2/v.scale,fill:'rgba(160,42,35,.27)',listening:false
 }));
 if(pending)group.add(new root.Konva.Circle({
  x:pending.x*W,y:pending.y*H,radius:6/v.scale,
  fill:'#ffcf61',stroke:'#513b25',strokeWidth:1/v.scale,listening:false
 }));
 layer.add(group);layer.draw();
}
function sync(){
 if(!config)return;
 const saved=currentSave()?.customRoadLayout;
 if(!editing)draft=root.FE_ROAD_LAYOUT.sanitize(saved);
 render();
}
function toggle(){
 if(!config||config.busy?.())return info('Finish the current trip before editing roads.');
 if(!editing&&(!root.Konva||!root.PF||!root.YUKA))
  return info('The locally bundled road editor libraries did not load.');
 if(!editing&&!ensureCanvas())return info('The map canvas is not available yet.');
 editing=!editing;pending=null;suggestions=[];
 reload();
 const control=$('titleMapRoadTools'),button=$('titleMapRoadEdit');
 if(control)control.hidden=!editing;
 if(host){host.hidden=!editing;host.classList.toggle('editing',editing)}
 if(button){button.textContent=editing?'Finish Road Editing':'Road Editor';button.setAttribute('aria-pressed',String(editing))}
 info(editing?
  'Click two or more points to join a street. Building tool marks two opposite corners. Suggested yellow roads require review.':
  'Editor closed. Your accepted street layer and building boundaries are saved separately.');
 render();
}
function scan(){
 const img=$('titleMapImage');
 if(!img?.naturalWidth)return [];
 const cv=document.createElement('canvas');cv.width=256;cv.height=145;
 const ctx=cv.getContext('2d',{willReadFrequently:true});
 if(!ctx)return [];
 let data;
 try{ctx.drawImage(img,0,0,256,145);data=ctx.getImageData(0,0,256,145).data}catch(e){return []}
 const lum=new Float32Array(256*145);
 for(let i=0;i<lum.length;i++){const k=i*4;lum[i]=data[k]*.299+data[k+1]*.587+data[k+2]*.114}
 const at=(x,y)=>lum[y*256+x];
 const likely=(x,y,axis)=>{
  if(x<7||x>248||y<7||y>137)return false;
  const c=at(x,y);if(c<115||c>250)return false;
  const a=axis==='h'?at(x,y-4):at(x-4,y),b=axis==='h'?at(x,y+4):at(x+4,y);
  return c-Math.min(a,b)>13&&Math.abs(a-b)<75;
 };
 const found=[];
 function sweep(axis){
  const maxOuter=axis==='h'?145:256,maxInner=axis==='h'?256:145;
  for(let k=10;k<maxOuter-10;k+=3){
   let start=-1,miss=0;
   const flush=end=>{
    if(start>=0&&end-start>=18&&found.length<320){
     const p=axis==='h'?{x:start/255,y:k/144}:{x:k/255,y:start/144};
     const q=axis==='h'?{x:end/255,y:k/144}:{x:k/255,y:end/144};
     found.push({a:p,b:q});
    }
    start=-1;miss=0;
   };
   for(let j=8;j<maxInner-8;j++){
    const x=axis==='h'?j:k,y=axis==='h'?k:j;
    if(likely(x,y,axis)){if(start<0)start=j;miss=0}
    else if(start>=0&&++miss>=3)flush(j-3);
   }
   flush(maxInner-8);
  }
 }
 sweep('h');sweep('v');
 return found;
}
function suggest(kind){
 if(!editing||!draft)return;
 pending=null;
 suggestions=kind==='grid'?(root.FE_CAPITAL_STREETS?.draftSegments?.()||[]):scan();
 info(suggestions.length?
  suggestions.length+' provisional '+(kind==='grid'?'existing-map corridors':'image-detected line fragments')+
  ' in yellow. Check placement before accepting. They are NOT surveyed streets.':
  'The printed-map scan found no reliable straight corridors. Try Suggest Current Streets, or draw roads.');
 render();
}
function accept(){
 if(!editing||!draft||!suggestions.length)return;
 const count=Math.min(suggestions.length,MAX_ROADS-draft.segments.length);
 draft.segments.push(...suggestions.slice(0,count));
 suggestions=[];pending=null;
 persist();render();
 info(count+' suggestions saved. Activate Custom Routes when you have checked the connections and building boundaries.');
}
function undo(){
 if(!editing||!draft)return;
 if(pending)pending=null;
 else if(mode==='block'&&draft.blocks.length)draft.blocks.pop();
 else if(draft.segments.length)draft.segments.pop();
 else if(draft.blocks.length)draft.blocks.pop();
 persist();render();info('Last drawing step removed.');
}
function activate(value){
 if(!editing||!draft)return;
 if(value&&draft.segments.length<2)return info('Draw or accept at least two streets before activating.');
 draft.active=value;persist();render();
 info(value?'CUSTOM A* ROUTING ACTIVE. Any unconnected address cannot be reached until you draw a road or restore the original network.':
  'Original approximate network restored. Your custom drawing remains saved.');
}
function exportRoads(){
 if(!draft)return;
 const json=JSON.stringify(root.FE_ROAD_LAYOUT.sanitize(draft),null,2);
 const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='capital-washington-roads.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
 info('Exported editable road layout JSON. Map artwork unchanged.');
}
function importRoads(file){
 if(!file)return;
 if(file.size>1500000)return info('Road file exceeds the 1.5 MB import limit.');
 const reader=new FileReader();
 reader.onload=()=>{try{
  const raw=JSON.parse(reader.result);
  if(raw?.version!==1||!Array.isArray(raw.segments)||!Array.isArray(raw.blocks))throw Error('Incorrect layout format');
  draft=root.FE_ROAD_LAYOUT.sanitize(raw);
  draft.active=false; // Never activate imported obstacles without review.
  suggestions=[];pending=null;persist();render();
  info('Imported '+draft.segments.length+' roads and '+draft.blocks.length+' blocks. Review and activate when ready.');
 }catch(err){info('Cannot import road map: '+err.message)}};
 reader.onerror=()=>info('File reading failed.');
 reader.readAsText(file);
}
function mount(args){
 if(config)return;
 config=args;
 const on=(id,event,handler)=>{const el=$(id);if(el)el.addEventListener(event,handler)};
 on('titleMapRoadEdit','click',toggle);
 on('titleMapRoadMode','change',e=>{mode=e.target.value;pending=null;render()});
 on('titleMapRoadFinish','click',()=>{pending=null;render();info('Street finished. Click to start another.')});
 on('titleMapRoadUndo','click',undo);
 on('titleMapRoadSeed','click',()=>suggest('grid'));
 on('titleMapRoadScan','click',()=>suggest('raster'));
 on('titleMapRoadAccept','click',accept);
 on('titleMapRoadEnable','click',()=>activate(true));
 on('titleMapRoadDisable','click',()=>activate(false));
 on('titleMapRoadExport','click',exportRoads);
 on('titleMapRoadImport','change',e=>{importRoads(e.target.files?.[0]);e.target.value=''});
 on('titleMapRoadClear','click',()=>{
  if(!root.confirm('Clear only your custom roads and blocked areas? Your printed map remains untouched.'))return;
  draft={version:1,active:false,segments:[],blocks:[]};
  suggestions=[];pending=null;persist();render();info('Custom layer cleared; original route network restored.');
 });
 reload();
}
root.FE_ROAD_EDITOR=Object.freeze({mount,sync,isEditing:()=>editing,scanRaster:scan});
})(typeof window!=='undefined'?window:globalThis);
