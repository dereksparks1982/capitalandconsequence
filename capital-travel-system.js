/* Capital & Consequence: Capital Travel System.
 * Pure street-style route model + a temporary map-viewport overlay.
 * Never edits the fixed Washington artwork, its pins, or saved coordinates.
 * The road-network corridors and doorstep access remain APPROXIMATIONS,
 * not surveyed streets or a guarantee that every building is avoided.
 */
(function(root){
'use strict';
const MODES=Object.freeze([
 Object.freeze({id:'walk',label:'Walking',symbol:'♟',minutes:30}),
 Object.freeze({id:'horse',label:'Horseback',symbol:'♞',minutes:20}),
 Object.freeze({id:'carriage',label:'Carriage',symbol:'▣',minutes:24})
]);
const clamp=n=>Math.min(1,Math.max(0,n));
function route(from,to){
 if(!from||!to||![from.x,from.y,to.x,to.y].every(Number.isFinite))return [];
 const a={x:clamp(from.x),y:clamp(from.y)},b={x:clamp(to.x),y:clamp(to.y)};
 if(a.x===b.x&&a.y===b.y)return [a];
 // Real graph edges first: piece moves down mapped block corridors and
 // modeled diagonal avenues, not one imaginary shortcut through buildings.
 const street=root.FE_CAPITAL_STREETS?.streetRoute?.(a,b);
 if(street?.points?.length>=2){
  const path=street.points;
  path.routeType=street.type;
  path.accessPixels=street.accessPixels;
  return path;
 }
 // Fallback only if the guide network cannot connect the destinations.
 // This path remains visibly flagged as an unverified approximation.
 const lane=clamp(Math.round(((a.y+b.y)/2)*18)/18);
 const pts=[a,{x:a.x,y:lane},{x:b.x,y:lane},b],out=[];
 for(const p of pts)if(!out.length||out.at(-1).x!==p.x||out.at(-1).y!==p.y)out.push(p);
 out.routeType='provisional-right-angle';out.accessPixels=null;
 return out;
}
function estimate(points,imageWidth=2048,imageHeight=1159){
 if(!Array.isArray(points)||points.length<2||!Number.isFinite(imageWidth)||
   !Number.isFinite(imageHeight)||imageWidth<=0||imageHeight<=0)
  return {guidePixels:0,estimatedMiles:null,minutes:{walk:0,horse:0,carriage:0}};
 let length=0;
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i];
  if(!a||!b||![a.x,a.y,b.x,b.y].every(Number.isFinite))
   return {guidePixels:0,estimatedMiles:null,minutes:{walk:0,horse:0,carriage:0}};
  length+=Math.hypot((a.x-b.x)*imageWidth,(a.y-b.y)*imageHeight);
 }
 // 300 pixels per 30 minutes is a *gameplay calibration*, NOT a claim
 // about physical scale or historic street speed. Surveyed distances later.
 const walking=Math.max(5,Math.min(120,Math.ceil(length/10)));
 return {guidePixels:Math.round(length),estimatedMiles:null,calibration:'provisional',
  minutes:{walk:walking,horse:Math.max(4,Math.ceil(walking*.65)),
   carriage:Math.max(5,Math.ceil(walking*.8))}};
}
function available(save,from,mode){
 if(!MODES.some(m=>m.id===mode))return {ok:false,reason:'Unrecognized travel method.'};
 if(mode==='walk')return {ok:true,mode:'walk',minutes:30};
 const assets=Array.isArray(save?.transport?.assets)?save.transport.assets:[];
 const good=a=>a&&a.locationId===from&&(a.owner==='personal'||a.owner==='rental')&&
  (a.status==='stabled'||a.status==='tethered');
 const horse=assets.find(a=>good(a)&&a.kind==='horse');
 if(!horse)return {ok:false,reason:'A horse must be in your custody at this location.'};
 if(mode==='horse')return {ok:true,mode,minutes:20,horseId:horse.id};
 const carriage=assets.find(a=>good(a)&&a.kind==='carriage');
 if(!carriage)return {ok:false,reason:'A carriage and horse must both be present.'};
 return {ok:true,mode,minutes:24,horseId:horse.id,carriageId:carriage.id};
}
const ns='http://www.w3.org/2000/svg';
let active=null;
function el(name,attrs){
 const n=document.createElementNS(ns,name);
 for(const [k,v] of Object.entries(attrs||{}))n.setAttribute(k,String(v));
 return n;
}
function clear(){
 if(!active)return;
 const a=active;active=null;
 if(a.frame!==null)cancelAnimationFrame(a.frame);
 a.svg.remove();
 a.resolve(false);
}
// A preview has no destination markers: only a temporary amber dashed route.
let preview=null;
function clearPreview(){
 if(preview){preview.svg.remove();preview=null}
}
function showPreview({viewport,points,project}={}){
 if(!viewport||!Array.isArray(points)||points.length<2||typeof project!=='function'){
  clearPreview();return false;
 }
 const pixels=points.map(project);
 if(pixels.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))){
  clearPreview();return false;
 }
 if(!preview||preview.viewport!==viewport){
  clearPreview();
  const svg=el('svg',{class:'capital-travel-preview','aria-hidden':'true'});
  svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;overflow:hidden';
  const border=el('polyline',{fill:'none',stroke:'#2c2010','stroke-width':6,
   'stroke-linejoin':'round','stroke-linecap':'round'});
  const line=el('polyline',{fill:'none',stroke:'#e7bd71','stroke-width':3,
   'stroke-linejoin':'round','stroke-linecap':'round','stroke-dasharray':'5 8'});
  svg.append(border,line);
  viewport.appendChild(svg);
  preview={viewport,svg,border,line};
 }
 const str=pixels.map(p=>p.x+','+p.y).join(' ');
 const bounds='0 0 '+Math.max(1,viewport.clientWidth)+' '+Math.max(1,viewport.clientHeight);
 preview.svg.setAttribute('viewBox',bounds);
 preview.border.setAttribute('points',str);
 preview.line.setAttribute('points',str);
 return true;
}
// Sample progress in ORIGINAL guide pixels, not on-screen dimensions.
// Zoom/pan can change while traveling without changing the journey's progress.
function positionAt(points,fraction,width=2048,height=1159){
 if(!Array.isArray(points)||!points.length||!Number.isFinite(fraction)||
  !Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0||
  points.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)))return null;
 const progress=Math.min(1,Math.max(0,fraction));
 if(points.length===1)return {x:points[0].x,y:points[0].y};
 const distances=[],total=points.slice(1).reduce((sum,p,i)=>{
  const prev=points[i],d=Math.hypot((p.x-prev.x)*width,(p.y-prev.y)*height);
  distances.push(d);return sum+d;
 },0);
 if(total<=1e-9)return {...points[0]};
 let left=progress*total;
 for(let i=0;i<distances.length;i++){
  const d=distances[i];
  if(left<=d||i===distances.length-1){
   const t=d?Math.min(1,Math.max(0,left/d)):0;
   return {x:points[i].x+(points[i+1].x-points[i].x)*t,
    y:points[i].y+(points[i+1].y-points[i].y)*t};
  }
  left-=d;
 }
 return {...points.at(-1)};
}
function animate({viewport,points,project,mode='walk',durationMs=null,onProgress=null,onFrame=null}){
 if(active)clear();
 if(!viewport||!Array.isArray(points)||points.length<2||typeof project!=='function')
  return Promise.resolve(false);
 const spec=MODES.find(m=>m.id===mode)||MODES[0];
 const reduce=!!root.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 const duration=reduce?180:Math.max(350,Math.min(8500,
  Number.isFinite(durationMs)?durationMs:mode==='walk'?2900:mode==='horse'?2050:2350));
 const svg=el('svg',{class:'capital-travel-overlay','aria-hidden':'true'});
 svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;overflow:hidden';
 const routeLine=el('polyline',{fill:'none',stroke:'#e9c887','stroke-width':3,
  'stroke-linejoin':'round','stroke-linecap':'round','stroke-dasharray':'3 9'});
 const outline=el('circle',{r:15,fill:'#241c14',stroke:'#f1d7a0','stroke-width':3});
 const token=el('text',{'text-anchor':'middle','dominant-baseline':'central','font-size':21,
  'font-weight':'bold',fill:'#ffe7b9'});
 token.textContent=spec.symbol;
 const group=el('g',{});group.append(outline,token);svg.append(routeLine,group);
 viewport.appendChild(svg);
 return new Promise(resolve=>{
  const state={svg,frame:null,resolve,started:null};active=state;
  function tick(now){
   if(active!==state)return;
   if(state.started===null)state.started=now;
   const progress=Math.min(1,(now-state.started)/duration);
   const raw=points.map(project);
   if(raw.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))){
    clear();return;
   }
   const dims={w:Math.max(1,viewport.clientWidth),h:Math.max(1,viewport.clientHeight)};
   svg.setAttribute('viewBox','0 0 '+dims.w+' '+dims.h);
   routeLine.setAttribute('points',raw.map(p=>p.x+','+p.y).join(' '));
   const local=positionAt(points,progress);
   // Allow a camera-follow callback to pan before drawing the token at its
   // new position, while preserving journey progress in map coordinates.
   if(local&&typeof onFrame==='function'){
    try{onFrame(local,progress)}catch(error){console.warn('Capital Travel map follow failed',error)}
   }
   const position=local&&project(local);
   if(!position||!Number.isFinite(position.x)||!Number.isFinite(position.y)){
    clear();return;
   }
   group.setAttribute('transform','translate('+position.x+' '+position.y+')');
   if(typeof onProgress==='function'){
    try{onProgress(progress)}catch(error){console.warn('Capital Travel progress notice failed',error)}
   }
   if(progress>=1){
    active=null;svg.remove();state.resolve(true);
   }else state.frame=requestAnimationFrame(tick);
  }
  state.frame=requestAnimationFrame(tick);
 });
}
const api=Object.freeze({version:4,modes:MODES,route,estimate,positionAt,available,animate,cancel:clear,showPreview,clearPreview,
 get active(){return !!active}});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CAPITAL_TRAVEL=api;
})(typeof window!=='undefined'?window:globalThis);
