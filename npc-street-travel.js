/* Capital & Consequence: route-based NPC journeys from actual saved schedules.
 * No wall-clock advance, teleporting NPCs, invented trips or permanent map dots.
 */
(function(root){
'use strict';
const NS='http://www.w3.org/2000/svg';
let overlay=null;
function plan(from,to,save){
 if(!from||!to||from===to)return null;
 const a=root.FE_NPC_MAP_PIN?.(from),b=root.FE_NPC_MAP_PIN?.(to);
 const engine=root.FE_CAPITAL_TRAVEL;
 if(!a||!b||!engine?.route||!engine?.weatherEstimate)return null;
 const points=engine.route(a,b);
 if(!points||points.length<2||!points.routeType?.startsWith('provisional-street'))return null;
 const estimate=engine.weatherEstimate(points,save?.turnConditions?.weather||'clear');
 const minute=Math.max(5,Math.min(240,estimate.minutes.walk));
 return {minutes:minute,guidePixels:estimate.guidePixels,routeType:points.routeType,
  weather:estimate.weather,routePoints:points.slice(0,128).map(p=>({
   x:+p.x.toFixed(6),y:+p.y.toFixed(6)}))};
}
function progress(j,minute){
 if(!j||!Number.isSafeInteger(j.departedAt)||!Number.isSafeInteger(j.arrivesAt)||
  j.arrivesAt<=j.departedAt||!Number.isSafeInteger(minute))return 0;
 return Math.min(1,Math.max(0,(minute-j.departedAt)/(j.arrivesAt-j.departedAt)));
}
function valid(j){
 return !!j&&j.version===1&&Array.isArray(j.routePoints)&&j.routePoints.length>=2&&
  j.routePoints.length<=128&&j.routePoints.every(p=>
   p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1);
}
function clear(){if(overlay){overlay.remove();overlay=null}}
function render(save,viewport,project,visible){
 clear();
 if(!visible||!viewport||typeof project!=='function'||!save?.npcSimulation?.agents||
  !Number.isSafeInteger(save.worldCalendar?.worldMinute)||!root.FE_CAPITAL_TRAVEL?.positionAt)return 0;
 const minute=save.worldCalendar.worldMinute;
 const riders=Object.values(save.npcSimulation.agents).filter(a=>
  a?.status==='travelling'&&valid(a.journey)&&
  minute>=a.journey.departedAt&&minute<a.journey.arrivesAt).slice(0,20);
 if(!riders.length)return 0;
 const svg=document.createElementNS(NS,'svg');
 svg.setAttribute('class','capital-npc-travel-layer');
 svg.setAttribute('aria-hidden','true');
 svg.setAttribute('viewBox','0 0 '+Math.max(1,viewport.clientWidth)+' '+Math.max(1,viewport.clientHeight));
 svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:7';
 let count=0;
 for(const agent of riders){
  const j=agent.journey,p=root.FE_CAPITAL_TRAVEL.positionAt(j.routePoints,progress(j,minute));
  if(!p)continue;
  let at;try{at=project(p)}catch(error){continue}
  if(!at||!Number.isFinite(at.x)||!Number.isFinite(at.y))continue;
  const group=document.createElementNS(NS,'g');
  group.setAttribute('transform','translate('+at.x+' '+at.y+')');
  const shape=document.createElementNS(NS,'path');
  // Dark figure with short coat, no white anchor marks or textual map labels.
  shape.setAttribute('d','M-3 -7 h6 l1 4 h-8z M0 -3 a3 3 0 1 0 0.001 0z M-5 2 h10 l2 10 h-14z');
  shape.setAttribute('fill','#34281c');
  shape.setAttribute('stroke','#c99b57');
  shape.setAttribute('stroke-width','1.6');
  const title=document.createElementNS(NS,'title');
  title.textContent='Resident traveling on a modeled street';
  group.append(title,shape);svg.appendChild(group);count++;
 }
 if(!count)return 0;
 viewport.appendChild(svg);overlay=svg;
 return count;
}
const api=Object.freeze({plan,progress,valid,render,clear});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_NPC_STREET_TRAVEL=api;
})(typeof window!=='undefined'?window:globalThis);
