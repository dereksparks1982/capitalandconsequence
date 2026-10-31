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
 // An activated custom road overlay is authoritative. Unreachable routes
 // must fail instead of cutting through an untraced building.
 if(root.FE_ROAD_LAYOUT?.isActive?.()){
  const edited=root.FE_ROAD_LAYOUT.route(a,b);
  return edited?.length>=2?edited:[];
 }
 // Real graph edges first: piece moves down mapped block corridors and
 // modeled diagonal avenues, not one imaginary shortcut through buildings.
 const street=root.FE_CAPITAL_STREETS?.streetRoute?.(a,b);
 if(street?.points?.length>=2){
  const path=street.points;
  path.routeType=street.type;
  path.accessPixels=street.accessPixels;
  path.turns=street.turns;
  path.namedRoads=street.namedRoads;
  return path;
 }
 // Never draw a fallback through user-painted blue buildings. A disconnected
 // street network must be fixed with the editor, not disguised as a shortcut.
 if(root.FE_CAPITAL_STREETS?.diagnostic?.()?.blueBuildings>0)return [];
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
// Weather modifies provisional game-time travel, never physical mileage.
// Every adjustment is computed from the saved Washington weather at departure.
function weatherKind(weather){
 const value=typeof weather==='string'?weather.toLowerCase():'';
 if(/ice|sleet|blizzard|heavy snow|snowstorm/.test(value))return 'ice';
 if(/snow/.test(value))return 'snow';
 if(/thunder|storm|downpour|heavy rain/.test(value))return 'storm';
 if(/rain|drizzle|shower/.test(value))return 'rain';
 if(/fog|mist/.test(value))return 'fog';
 return 'clear';
}
const WEATHER_FACTORS=Object.freeze({
 clear:Object.freeze({walk:1,horse:1,carriage:1}),
 rain:Object.freeze({walk:1.12,horse:1.16,carriage:1.08}),
 storm:Object.freeze({walk:1.24,horse:1.3,carriage:1.2}),
 snow:Object.freeze({walk:1.22,horse:1.28,carriage:1.2}),
 ice:Object.freeze({walk:1.36,horse:1.46,carriage:1.44}),
 fog:Object.freeze({walk:1.06,horse:1.18,carriage:1.18})
});
function weatherEstimate(points,weather){
 const base=estimate(points),kind=weatherKind(weather);
 const times=Object.fromEntries(Object.entries(base.minutes).map(([mode,n])=>
  [mode,n===0?0:Math.min(240,Math.max(n,Math.ceil(n*WEATHER_FACTORS[kind][mode])))]));
 const extra=Object.fromEntries(Object.keys(base.minutes).map(mode=>
  [mode,times[mode]-base.minutes[mode]]));
 return {...base,minutes:times,baseMinutes:base.minutes,weather:kind,
  weatherExtraMinutes:extra,calibration:'provisional-weather'};
}
// Screen-time pacing only. The WORLD CLOCK uses estimate(...).minutes;
 // this short animation duration must never become a second game-time debit.
function animationDuration(guidePixels,mode='walk'){
 if(!Number.isFinite(guidePixels)||guidePixels<0)return 2500;
 // Watchable on-screen pacing; actual paid Washington minutes stay unchanged.
 // Walking is unhurried, carriage intermediate, horseback brisk but readable.
 const speed=mode==='horse'?.54:mode==='carriage'?.72:1;
 const walkingMs=Math.min(22000,2500+Math.min(guidePixels,4000)*15);
 return Math.max(1350,Math.round(walkingMs*speed));
}
// Preview the saved Washington calendar without advancing it. Travel is
// still charged exactly once by the authoritative journey ledger on arrival.
function remainingMinutes(totalMinutes,fraction){
 if(!Number.isSafeInteger(totalMinutes)||totalMinutes<0||totalMinutes>1440||
  !Number.isFinite(fraction))return null;
 const progress=Math.max(0,Math.min(1,fraction));
 return Math.max(0,Math.ceil(totalMinutes*(1-progress)-1e-9));
}
function arrivalEstimate(iso,minutes){
 if(typeof iso!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(iso)||
  !Number.isSafeInteger(minutes)||minutes<0||minutes>1440)return null;
 const start=Date.parse(iso+':00Z');
 if(!Number.isFinite(start)||new Date(start).toISOString().slice(0,16)!==iso)return null;
 const at=new Date(start+minutes*60000);
 if(!Number.isFinite(+at))return null;
 const hour=at.getUTCHours(),minute=at.getUTCMinutes();
 return Object.freeze({iso:at.toISOString().slice(0,16),
  date:at.toISOString().slice(0,10),
  time:(hour%12||12)+':'+String(minute).padStart(2,'0')+(hour>=12?' PM':' AM'),
  nextDay:at.toISOString().slice(0,10)!==iso.slice(0,10)});
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
// Mode-specific miniature silhouettes are local SVG shapes, not extra
// map artwork, pin anchors, images, fonts or persistent decorations.
function travelFigurine(mode='walk'){
 const id=MODES.some(item=>item.id===mode)?mode:'walk';
 const g=el('g',{'class':'capital-travel-figurine capital-travel-'+id,
  'aria-hidden':'true'});
 const ink='#241b12',metal='#d6b77c',shadow='#65472d';
 function shape(tag,attrs){const item=el(tag,attrs);g.append(item);return item;}
 if(id==='walk'){
  // Top-hatted pedestrian, walking coat and separated legs.
  shape('path',{d:'M -5 -8 H 5 L 4 -13 H -4 Z',fill:ink,stroke:metal,'stroke-width':.8});
  shape('rect',{x:-6,y:-8,width:12,height:2,rx:.3,fill:metal});
  shape('circle',{cx:0,cy:-4,r:3,fill:ink,stroke:metal,'stroke-width':.7});
  shape('path',{d:'M -3 -1 Q 0 -2 3 -1 L 5 7 H -5 Z',fill:ink,stroke:metal,'stroke-width':.8});
  shape('path',{d:'M -3 6 L -6 12 M 3 6 L 6 12 M -4 1 L -8 6 M 4 1 L 8 5',
   fill:'none',stroke:metal,'stroke-width':2.1,'stroke-linecap':'round'});
 }else if(id==='horse'){
  // Horse's head/neck, standing legs and a rider on the saddle.
  shape('path',{d:'M -11 1 Q -9 -6 -2 -5 L 6 -5 L 10 -10 L 14 -9 L 13 -1 L 9 2 L 8 5 L -7 5 Z',
   fill:ink,stroke:metal,'stroke-width':1});
  shape('path',{d:'M -9 4 L -11 11 M -2 5 L -3 12 M 6 5 L 5 12 M 9 5 L 11 11',
   fill:'none',stroke:metal,'stroke-width':2,'stroke-linecap':'round'});
  shape('path',{d:'M -10 -1 L -15 -6',fill:'none',stroke:shadow,'stroke-width':2.5});
  shape('circle',{cx:-1,cy:-10,r:2.5,fill:metal});
  shape('path',{d:'M -3 -7 L 1 -7 L 4 1 L -6 1 Z',fill:shadow,stroke:metal,'stroke-width':.7});
  shape('path',{d:'M 0 -3 L 6 -2',fill:'none',stroke:metal,'stroke-width':1});
 }else{
  // Compact covered carriage with two spoked wheels and shafts.
  shape('path',{d:'M -13 -6 Q -8 -13 3 -12 Q 10 -10 11 -6 Z',fill:shadow,
   stroke:metal,'stroke-width':1});
  shape('path',{d:'M -12 -6 H 12 V 5 H -12 Z',fill:ink,stroke:metal,'stroke-width':1});
  shape('path',{d:'M -7 -5 H -2 V 0 H -7 Z M 2 -5 H 7 V 0 H 2 Z',fill:metal,opacity:.75});
  for(const x of [-8,8]){
   shape('circle',{cx:x,cy:8,r:4,fill:ink,stroke:metal,'stroke-width':1.2});
   shape('path',{d:'M '+(x-3)+' 8 H '+(x+3)+' M '+x+' 5 V 11',
    stroke:metal,'stroke-width':.7,fill:'none'});
  }
  shape('path',{d:'M 12 1 H 16',stroke:metal,'stroke-width':2,fill:'none'});
 }
 return g;
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
function projectedPoints(points,project){
 try{
  const result=points.map(project);
  return result.every(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y))?result:null;
 }catch(error){
  console.warn('Capital Travel coordinate projection unavailable',error);
  return null;
 }
}
function showPreview({viewport,points,project}={}){
 if(!viewport||!Array.isArray(points)||points.length<2||typeof project!=='function'){
  clearPreview();return false;
 }
 const pixels=projectedPoints(points,project);
 if(!pixels){clearPreview();return false;}
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
 if(progress===0||points.length===1)return {x:points[0].x,y:points[0].y};
 if(progress===1)return {...points.at(-1)};
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
// Facing is measured from the same native image-pixel path as travel
// progress, so the pawn's direction never changes merely from zooming.
function headingAt(points,fraction,width=2048,height=1159){
 if(!Array.isArray(points)||points.length<2||!Number.isFinite(fraction)||
  !Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return null;
 const lengths=[],total=points.slice(1).reduce((acc,p,i)=>{
  const a=points[i];
  if(!a||!p||![a.x,a.y,p.x,p.y].every(Number.isFinite))return NaN;
  const d=Math.hypot((p.x-a.x)*width,(p.y-a.y)*height);
  lengths.push(d);return acc+d;
 },0);
 if(!Number.isFinite(total)||total<=.000001)return null;
 let remaining=Math.min(1,Math.max(0,fraction))*total;
 for(let i=0;i<lengths.length;i++){
  if(lengths[i]<=.000001)continue;
  if(remaining<lengths[i]||i===lengths.length-1){
   const a=points[i],b=points[i+1];
   const radians=Math.atan2((b.y-a.y)*height,(b.x-a.x)*width);
   return radians*180/Math.PI+90;
  }
  remaining-=lengths[i];
 }
 return null;
}
// Turn the miniature smoothly at a junction without ever moving its
// position off the street graph. Smooth heading is only visual: route
// distance, guide pixels, time charge and saved pin geometry remain exact.
function smoothHeadingAt(points,fraction,lookPixels=14,width=2048,height=1159){
 if(!Array.isArray(points)||points.length<2||!Number.isFinite(fraction)||
  !Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)
  return null;
 const length=points.slice(1).reduce((sum,p,i)=>{
  const a=points[i];
  return sum+Math.hypot((p.x-a.x)*width,(p.y-a.y)*height);
 },0);
 if(!Number.isFinite(length)||length<.001)return null;
 const delta=Math.max(.5,Math.min(60,Number.isFinite(lookPixels)?lookPixels:14))/length;
 const a=positionAt(points,Math.max(0,fraction-delta),width,height);
 const b=positionAt(points,Math.min(1,fraction+delta),width,height);
 if(!a||!b)return null;
 const x=(b.x-a.x)*width,y=(b.y-a.y)*height;
 if(Math.hypot(x,y)<.001)return headingAt(points,fraction,width,height);
 return Math.atan2(y,x)*180/Math.PI+90;
}
function routePrefix(points,fraction,width=2048,height=1159){
 if(!Array.isArray(points)||!points.length||!Number.isFinite(fraction)||
  !Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0||
  points.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)))return [];
 const cut=Math.max(0,Math.min(1,fraction));
 if(cut===0||points.length===1)return [{...points[0]}];
 if(cut===1)return points.map(p=>({...p}));
 const lengths=[],total=points.slice(1).reduce((sum,p,i)=>{
  const q=points[i],d=Math.hypot((p.x-q.x)*width,(p.y-q.y)*height);
  lengths.push(d);return sum+d;
 },0);
 if(total<=1e-9)return [{...points[0]}];
 let left=cut*total;
 const out=[{...points[0]}];
 for(let i=0;i<lengths.length;i++){
  const segment=lengths[i];
  if(left>=segment&&i<lengths.length-1){
   out.push({...points[i+1]});left-=segment;continue;
  }
  const r=segment?Math.max(0,Math.min(1,left/segment)):0;
  out.push({x:points[i].x+(points[i+1].x-points[i].x)*r,
   y:points[i].y+(points[i+1].y-points[i].y)*r});
  break;
 }
 return out;
}
function animate({viewport,points,project,mode='walk',durationMs=null,onProgress=null,onFrame=null}){
 if(active)clear();
 if(!viewport||!Array.isArray(points)||points.length<2||typeof project!=='function')
  return Promise.resolve(false);
 const spec=MODES.find(m=>m.id===mode)||MODES[0];
 const reduce=!!root.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 const duration=reduce?180:Math.max(350,Math.min(24000,
  Number.isFinite(durationMs)?durationMs:
   animationDuration(estimate(points).guidePixels,mode)));
 const svg=el('svg',{class:'capital-travel-overlay','aria-hidden':'true'});
 svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;overflow:hidden';
 const routeLine=el('polyline',{fill:'none',stroke:'#e9c887','stroke-width':3,
  'stroke-linejoin':'round','stroke-linecap':'round','stroke-dasharray':'3 9'});
 const completedLine=el('polyline',{fill:'none',stroke:'#a96f40','stroke-width':4,
  'stroke-linejoin':'round','stroke-linecap':'round','stroke-dasharray':'4 6'});
 // Small copper direction wedge belongs only to the moving game piece.
 // Unlike the old anchor dots, it never persists on the Washington map.
 const facing=el('g',{'aria-hidden':'true'});
 const wedge=el('polygon',{points:'0,-25 -5,-15 5,-15',fill:'#d7a663',
  stroke:'#241c14','stroke-width':2});
 facing.append(wedge);
 const outline=el('circle',{r:15,fill:'#241c14',stroke:'#f1d7a0','stroke-width':3});
 const token=travelFigurine(spec.id);
 const group=el('g',{});group.append(facing,outline,token);svg.append(routeLine,completedLine,group);
 viewport.appendChild(svg);
 return new Promise(resolve=>{
  const state={svg,frame:null,resolve,started:null};active=state;
  function tick(now){
   if(active!==state)return;
   if(state.started===null)state.started=now;
   const progress=Math.min(1,(now-state.started)/duration);
   const local=positionAt(points,progress);
   // Follow the token first so both road lines and token use the SAME
   // camera transform for this frame, even during an active pan.
   if(local&&typeof onFrame==='function'){
    try{onFrame(local,progress)}catch(error){console.warn('Capital Travel map follow failed',error)}
   }
   const raw=projectedPoints(points,project);
   const traversed=projectedPoints(routePrefix(points,progress),project);
   const projected=local?projectedPoints([local],project):null;
   if(!raw||!traversed||!projected){clear();return}
   const position=projected[0];
   const dims={w:Math.max(1,viewport.clientWidth),h:Math.max(1,viewport.clientHeight)};
   svg.setAttribute('viewBox','0 0 '+dims.w+' '+dims.h);
   routeLine.setAttribute('points',raw.map(p=>p.x+','+p.y).join(' '));
   completedLine.setAttribute('points',traversed.map(p=>p.x+','+p.y).join(' '));
   group.setAttribute('transform','translate('+position.x+' '+position.y+')');
   const angle=smoothHeadingAt(points,progress);
   if(angle!==null)facing.setAttribute('transform','rotate('+angle+')');
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
const api=Object.freeze({version:14,modes:MODES,route,estimate,weatherEstimate,weatherKind,arrivalEstimate,remainingMinutes,animationDuration,positionAt,headingAt,smoothHeadingAt,routePrefix,available,animate,cancel:clear,showPreview,clearPreview,
 get active(){return !!active}});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CAPITAL_TRAVEL=api;
})(typeof window!=='undefined'?window:globalThis);
