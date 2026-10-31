/* Capital & Consequence: editable street and blue-building overlay.
 * Native offline Canvas2D, not a dependency on Konva. Nothing writes to
 * the approved Washington JPEG or moves its registered pins.
 */
(function(root){
'use strict';
const W=2048,H=1159,MAX_ROADS=2200,MAX_BLOCKS=1200,BRUSH=18;
let config=null,host=null,canvas=null,ctx=null,draft=null;
let editing=false,pending=null,mode='road',suggestions=[],painting=false,lastPaint=null,changed=false;
const undoStack=[];
const $=id=>document.getElementById(id);
const clamp=n=>Math.min(1,Math.max(0,n));
const info=s=>{const out=$('titleMapRoadStatus');if(out)out.textContent=s;};
const valid=()=>!!root.FE_ROAD_LAYOUT?.sanitize;
const clone=x=>JSON.parse(JSON.stringify(x));
function markSnapshot(){undoStack.push(clone(draft));if(undoStack.length>35)undoStack.shift();}
function reload(){
 if(!valid())return false;
 draft=root.FE_ROAD_LAYOUT.sanitize(config?.getSave?.()?.customRoadLayout);
 return true;
}
function persist(message){
 const s=config?.getSave?.();
 if(!s||!draft)return false;
 s.customRoadLayout=root.FE_ROAD_LAYOUT.sanitize(draft);
 draft=root.FE_ROAD_LAYOUT.sanitize(s.customRoadLayout);
 root.FE_ROAD_LAYOUT.load(s.customRoadLayout);
 config.persist?.();config.refresh?.();
 if(message)info(message+' · '+draft.segments.length+' streets · '+draft.blocks.length+
  ' blue marks · custom streets '+(draft.active?'ON':'OFF'));
 return true;
}
function screen(p,v){return {x:v.x+p.x*W*v.scale,y:v.y+p.y*H*v.scale};}
function coord(e){
 const v=config?.getView?.(),r=host?.getBoundingClientRect?.();
 if(!v||!r||!r.width||!r.height||!Number.isFinite(v.scale)||v.scale<=0)return null;
 return {x:clamp((e.clientX-r.left-v.x)/(W*v.scale)),
  y:clamp((e.clientY-r.top-v.y)/(H*v.scale))};
}
function brush(p){
 return {x0:clamp(p.x-BRUSH/(2*W)),y0:clamp(p.y-BRUSH/(2*H)),
  x1:clamp(p.x+BRUSH/(2*W)),y1:clamp(p.y+BRUSH/(2*H))};
}
function repaint(){
 if(!ctx||!host||!draft||!config)return;
 const v=config.getView?.(),vp=$('titleMapViewport');
 if(!v||!vp||!Number.isFinite(v.scale)||v.scale<=0)return;
 const width=Math.round(vp.clientWidth),height=Math.round(vp.clientHeight);
 if(width<1||height<1)return;
 const dpr=Math.min(2,Math.max(1,Number(root.devicePixelRatio)||1));
 const w=Math.round(width*dpr),h=Math.round(height*dpr);
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 canvas.style.width=width+'px';canvas.style.height=height+'px';
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
 const line=(obj,color,dash)=>{
  const a=screen(obj.a,v),b=screen(obj.b,v);
  ctx.beginPath();ctx.lineWidth=3;ctx.strokeStyle=color;ctx.setLineDash(dash?[7,5]:[]);
  ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);
 };
 for(const s of draft.segments)line(s,'#53d8aa',false);
 for(const s of suggestions)line(s,'#ffda59',true);
 for(const b of draft.blocks){
  const a=screen({x:b.x0,y:b.y0},v),z=screen({x:b.x1,y:b.y1},v);
  ctx.fillStyle='rgba(34,103,220,.65)';
  ctx.strokeStyle='#76caff';ctx.lineWidth=1;
  ctx.fillRect(a.x,a.y,z.x-a.x,z.y-a.y);
  ctx.strokeRect(a.x,a.y,z.x-a.x,z.y-a.y);
 }
 if(pending){
  const p=screen(pending,v);ctx.beginPath();ctx.arc(p.x,p.y,6,0,Math.PI*2);
  ctx.fillStyle='#ffd35e';ctx.strokeStyle='#382812';ctx.fill();ctx.stroke();
 }
}
function showOverlay(){
 if(!host||!draft)return;
 host.hidden=!editing&&!draft.blocks.length&&!draft.segments.length;
 host.classList.toggle('editing',editing);
 repaint();
}
function stroke(p){
 if(lastPaint&&Math.hypot((p.x-lastPaint.x)*W,(p.y-lastPaint.y)*H)<BRUSH*.5)return false;
 lastPaint=p;
 const b=brush(p);
 if(mode==='erase'){
  const n=draft.blocks.length;
  draft.blocks=draft.blocks.filter(v=>v.x1<b.x0||v.x0>b.x1||v.y1<b.y0||v.y0>b.y1);
  return draft.blocks.length!==n;
 }
 if(draft.blocks.length>=MAX_BLOCKS){info('Blue building limit reached. Undo or erase some markings.');return false;}
 if(b.x0>=b.x1||b.y0>=b.y1)return false;
 draft.blocks.push(b);return true;
}
function pointerDown(e){
 if(!editing||config?.busy?.()||!draft||e.button!==0)return;
 const p=coord(e);if(!p)return;
 e.preventDefault();e.stopPropagation();
 if(mode==='road'||mode==='block'){
  if(!pending){
   pending=p;info(mode==='road'?'Street start selected. Click its next corner.':
    'Building corner selected. Click its opposite corner to paint a blue rectangle.');
  }else{
   const a=pending;pending=null;
   if(mode==='road'&&draft.segments.length<MAX_ROADS&&
    Math.hypot((a.x-p.x)*W,(a.y-p.y)*H)>3){
    markSnapshot();draft.segments.push({a,b:p});persist('Street saved');
   }else if(mode==='block'&&draft.blocks.length<MAX_BLOCKS){
    const box={x0:Math.min(a.x,p.x),y0:Math.min(a.y,p.y),
     x1:Math.max(a.x,p.x),y1:Math.max(a.y,p.y)};
    if(box.x1-box.x0>.001&&box.y1-box.y0>.001){
     markSnapshot();draft.blocks.push(box);persist('Blue building saved');
    }
   }
  }
 }else{
  markSnapshot();painting=true;lastPaint=null;changed=false;
  changed=stroke(p)||changed;
  try{host.setPointerCapture?.(e.pointerId);}catch(_){}
 }
 repaint();
}
function pointerMove(e){
 if(!editing||!painting||!draft)return;
 const p=coord(e);if(!p)return;
 e.preventDefault();e.stopPropagation();
 if(lastPaint){
  const a=lastPaint,dist=Math.hypot((p.x-a.x)*W,(p.y-a.y)*H);
  const steps=Math.min(120,Math.ceil(dist/(BRUSH*.65)));
  for(let j=1;j<=steps;j++){
   const q={x:a.x+(p.x-a.x)*j/steps,y:a.y+(p.y-a.y)*j/steps};
   changed=stroke(q)||changed;
  }
 }else changed=stroke(p)||changed;
 repaint();
}
function pointerUp(e){
 if(!painting)return;
 painting=false;lastPaint=null;
 e.stopPropagation?.();
 try{host.releasePointerCapture?.(e.pointerId);}catch(_){}
 if(changed)persist(mode==='erase'?'Blue building erased':'Blue building painted');
 else undoStack.pop();
 changed=false;showOverlay();
}
function ensureCanvas(){
 if(ctx)return true;
 host=$('titleMapRoadCanvas');
 if(!host)return false;
 canvas=document.createElement('canvas');canvas.id='titleMapRoadBrushSurface';
 canvas.setAttribute('aria-hidden','true');
 canvas.style.cssText='display:block;pointer-events:none;width:100%;height:100%';
 host.appendChild(canvas);ctx=canvas.getContext('2d');
 if(!ctx){canvas.remove();canvas=null;info('Canvas2D was unavailable.');return false;}
 host.addEventListener('pointerdown',pointerDown);
 host.addEventListener('pointermove',pointerMove);
 host.addEventListener('pointerup',pointerUp);
 host.addEventListener('pointercancel',pointerUp);
 host.addEventListener('touchstart',e=>{if(editing)e.stopPropagation();},{passive:true});
 return true;
}
function sync(){
 if(!config)return;
 if(!editing)reload();
 showOverlay();
}
function toggle(){
 if(!config){info('Road editor has not initialized.');return false;}
 if(config.busy?.()){info('Finish the current journey first.');return false;}
 if(!editing&&config.getPinEdit?.()){
  info('Finish Edit Pins before painting streets or blue buildings.');return false;
 }
 if(!valid()){info('Local road routing module is unavailable.');return false;}
 if(!ensureCanvas())return false;
 editing=!editing;pending=null;painting=false;lastPaint=null;suggestions=[];
 reload();
 const controls=$('titleMapRoadTools'),button=$('titleMapRoadEdit');
 if(controls)controls.hidden=!editing;
 if(button){button.textContent=editing?'Finish Road Editor':'Road Editor';
  button.setAttribute('aria-pressed',String(editing));
  button.setAttribute('aria-expanded',String(editing));}
 const card=$('titleMapLocationCard');
 if(editing&&card)card.hidden=true;
 showOverlay();
 info(editing?'Editor open. Choose Street, Blue building rectangle, Paint blue building, or Erase. Paint with the mouse directly over the map.':
  'Editor closed. Blue markings remain visible and affect routing; street drawings are preserved.');
 return true;
}
function scan(){
 const img=$('titleMapImage');if(!img?.naturalWidth)return [];
 const c=document.createElement('canvas');c.width=256;c.height=145;
 const x=c.getContext('2d',{willReadFrequently:true});if(!x)return [];
 let data;
 try{x.drawImage(img,0,0,256,145);data=x.getImageData(0,0,256,145).data;}
 catch(_){return [];}
 const lum=new Float32Array(256*145);
 for(let i=0;i<lum.length;i++)lum[i]=data[i*4]*.299+data[i*4+1]*.587+data[i*4+2]*.114;
 const at=(x,y)=>lum[y*256+x];
 const found=[];
 for(const axis of ['h','v']){
  const outer=axis==='h'?145:256,inner=axis==='h'?256:145;
  for(let k=10;k<outer-10;k+=3){
   let start=-1,miss=0;
   const flush=end=>{
    if(start>=0&&end-start>=18&&found.length<320){
     const a=axis==='h'?{x:start/255,y:k/144}:{x:k/255,y:start/144};
     const b=axis==='h'?{x:end/255,y:k/144}:{x:k/255,y:end/144};
     found.push({a,b});
    }start=-1;miss=0;
   };
   for(let j=8;j<inner-8;j++){
    const xx=axis==='h'?j:k,yy=axis==='h'?k:j;
    if(xx<7||xx>248||yy<7||yy>137)continue;
    const v=at(xx,yy),a=axis==='h'?at(xx,yy-4):at(xx-4,yy),b=axis==='h'?at(xx,yy+4):at(xx+4,yy);
    if(v>=115&&v<=250&&v-Math.min(a,b)>13&&Math.abs(a-b)<75){if(start<0)start=j;miss=0;}
    else if(start>=0&&++miss>=3)flush(j-3);
   }flush(inner-8);
  }
 }
 return found;
}
function suggest(kind){
 if(!editing)return info('Open Road Editor before requesting suggestions.');
 pending=null;suggestions=(kind==='grid'?root.FE_CAPITAL_STREETS?.draftSegments?.():scan())||[];
 info(suggestions.length+' yellow street suggestions, NOT activated. Review and choose Accept Suggestions.');repaint();
}
function accept(){
 if(!editing||!draft||!suggestions.length)return;
 const space=MAX_ROADS-draft.segments.length,n=Math.min(space,suggestions.length);
 if(!n)return info('Maximum road count reached.');
 markSnapshot();draft.segments.push(...suggestions.slice(0,n).map(s=>({a:s.a,b:s.b})));
 suggestions=[];pending=null;
 persist(n+' proposed streets accepted. Review connectivity before Activate Custom Routes.');
}
function undo(){
 if(!editing||!draft)return;
 if(pending){pending=null;info('Pending point canceled.');repaint();return;}
 if(!undoStack.length){info('Nothing to undo.');return;}
 draft=undoStack.pop();persist('Last edit undone');showOverlay();
}
function activate(yes){
 if(!editing||!draft)return;
 if(yes&&draft.segments.length<2)return info('Draw or accept at least two street sections before activating custom routes.');
 markSnapshot();draft.active=yes;persist(yes?'Custom A* street routing enabled. Unconnected addresses cannot be reached.':
  'Original street routing restored. Blue buildings remain obstacles.');
}
function exportRoads(){
 if(!draft)return;
 const url=URL.createObjectURL(new Blob([JSON.stringify(root.FE_ROAD_LAYOUT.sanitize(draft),null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='capital-washington-roads.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 info('Exported streets and blue building outlines; Washington map artwork not included.');
}
function importRoads(file){
 if(!file)return;
 if(file.size>1500000)return info('Road file exceeds 1.5 MB.');
 const reader=new FileReader();
 reader.onload=()=>{try{
  const value=JSON.parse(reader.result);
  if(value?.version!==1||!Array.isArray(value.segments)||!Array.isArray(value.blocks))
   throw Error('Incorrect road-layout format');
  markSnapshot();draft=root.FE_ROAD_LAYOUT.sanitize(value);
  draft.active=false;suggestions=[];pending=null;
  persist('Imported roads and buildings. Custom street routing remains OFF until enabled.');
 }catch(error){info('Could not import: '+error.message);}};
 reader.onerror=()=>info('File read failed.');
 reader.readAsText(file);
}
function mount(args){
 if(config)return true;
 config=args;
 const on=(id,event,handler)=>$(id)?.addEventListener(event,handler);
 on('titleMapRoadEdit','click',toggle);
 on('titleMapRoadMode','change',e=>{
  mode=e.target.value;pending=null;painting=false;
  info(mode==='road'?'Click two street points.':
   mode==='block'?'Click opposite building corners to paint blue.':
   mode==='paint'?'Hold and drag to paint a blue building.':
    'Hold and drag to erase blue building marks.');
  repaint();
 });
 on('titleMapRoadFinish','click',()=>{pending=null;repaint();info('Pending street or building point cleared.');});
 on('titleMapRoadUndo','click',undo);
 on('titleMapRoadSeed','click',()=>suggest('grid'));
 on('titleMapRoadScan','click',()=>suggest('raster'));
 on('titleMapRoadAccept','click',accept);
 on('titleMapRoadEnable','click',()=>activate(true));
 on('titleMapRoadDisable','click',()=>activate(false));
 on('titleMapRoadExport','click',exportRoads);
 on('titleMapRoadImport','change',e=>{importRoads(e.target.files?.[0]);e.target.value='';});
 on('titleMapRoadClear','click',()=>{
  if(!root.confirm('Delete all custom streets and blue buildings for this profile?'))return;
  markSnapshot();draft={version:1,active:false,segments:[],blocks:[]};
  suggestions=[];pending=null;persist('Custom streets and blue buildings cleared.');showOverlay();
 });
 reload();ensureCanvas();showOverlay();
 return true;
}
root.FE_ROAD_EDITOR=Object.freeze({version:2,mount,sync,toggle,isEditing:()=>editing,
 scanRaster:scan,getStatus:()=>({editing,mode,streets:draft?.segments.length||0,blocks:draft?.blocks.length||0})});
root.FE_ROAD_EDITOR_SETUP?.();
})(typeof window!=='undefined'?window:globalThis);
