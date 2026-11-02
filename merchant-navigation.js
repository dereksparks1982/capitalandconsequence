/* Capital & Consequence: image-coordinate maritime lanes and saved-clock navigation.
 * Coordinates trace the bundled EcoClipper shipping-lines image at 800 x 600.
 * Early, illustrative lane survey: not certified historical port tracks or a live AIS feed.
 * Never alter the underlying reference image. No independent wall-clock simulation.
 */
(function(root){
 'use strict';
 const MAP='assets/artwork/maps/SHIPPING-LINES-ECOCLIPPER-small.jpg';
 const PORTS=Object.freeze({
  Baltimore:[208,324],Philadelphia:[214,319],'New York':[220,311],
  Liverpool:[361,282],Hamburg:[379,281],Havana:[211,361],
  Singapore:[618,387],'Hong Kong':[641,351]
 });
 // Geographic approximate sea distances are separate from the artwork's pixel lengths.
 // Ports in the middle of an itinerary are waypoints, not free cargo transfers.
 const LANES=Object.freeze([
  {a:'Baltimore',b:'Philadelphia',nm:340,kind:'coastal',points:[[208,324],[206,337],[212,348],[220,352],[215,335],[214,319]]},
  {a:'Philadelphia',b:'New York',nm:250,kind:'coastal',points:[[214,319],[223,333],[231,337],[237,325],[231,315],[220,311]]},
  {a:'New York',b:'Liverpool',nm:3150,kind:'transatlantic',points:[[220,311],[246,305],[277,301],[303,298],[327,291],[347,284],[361,282]]},
  {a:'Liverpool',b:'Hamburg',nm:600,kind:'europe',points:[[361,282],[366,281],[373,278],[379,281]]},
  {a:'New York',b:'Havana',nm:1280,kind:'atlantic',points:[[220,311],[232,330],[226,350],[211,361]]},
  {a:'Hamburg',b:'Singapore',nm:10900,kind:'eastern',points:[[379,281],[368,295],[349,317],[337,347],[352,393],[385,447],[438,481],[496,485],[544,462],[580,431],[618,387]]},
  {a:'Singapore',b:'Hong Kong',nm:1590,kind:'eastern',points:[[618,387],[622,377],[627,364],[635,354],[641,351]]}
 ]);
 const validPort=name=>Object.prototype.hasOwnProperty.call(PORTS,name);
 function route(a,b){
  if(!validPort(a)||!validPort(b)||a===b)return null;
  const distance={[a]:0},prev={},remaining=new Set(Object.keys(PORTS));
  while(remaining.size){
   let port=null,lowest=Infinity;
   for(const x of remaining)if((distance[x]??Infinity)<lowest){port=x;lowest=distance[x]}
   if(!port||!Number.isFinite(lowest))break;
   remaining.delete(port);
   if(port===b)break;
   for(const lane of LANES){
    const neighbor=lane.a===port?lane.b:lane.b===port?lane.a:null;
    if(!neighbor||!remaining.has(neighbor))continue;
    const value=lowest+lane.nm;
    if(value<(distance[neighbor]??Infinity)){distance[neighbor]=value;prev[neighbor]={port,lane}}
   }
  }
  if(!prev[b])return null;
  const legs=[];let cursor=b;
  while(cursor!==a){
   const step=prev[cursor];if(!step)return null;
   legs.unshift({from:step.port,to:cursor,lane:step.lane});
   cursor=step.port;
  }
  const points=[],legsSummary=[];
  for(const leg of legs){
   const forward=leg.lane.a===leg.from;
   const segment=(forward?leg.lane.points:leg.lane.points.slice().reverse()).map(p=>p.slice());
   if(points.length)segment.shift();
   points.push(...segment);
   legsSummary.push({from:leg.from,to:leg.to,nm:leg.lane.nm,kind:leg.lane.kind});
  }
  return {from:a,to:b,points,legs:legsSummary,nauticalMiles:Math.round(distance[b]),survey:'ecoclipper-image-traced-v1'};
 }
 function sailingDays(nauticalMiles,type){
  if(!Number.isFinite(nauticalMiles)||nauticalMiles<=0)return null;
  // Effective passage speeds include time lost to winds, maneuvering, and port approaches.
  const effectivePerDay=type==='steamer'?12*24*.85:6*24*.75;
  return Math.max(2,Math.ceil(nauticalMiles/effectivePerDay));
 }
 function plan(a,b,type){
  const r=route(a,b);return r?{...r,days:sailingDays(r.nauticalMiles,type)}:null;
 }
 const dateMinute=date=>{
  if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
  const ms=Date.parse(date+'T00:00:00Z');
  return Number.isFinite(ms)?Math.floor(ms/60000):null;
 };
 function gameMinute(save){
  if(save?.worldCalendarStatus==='ready'&&Number.isSafeInteger(save.worldCalendar?.worldMinute))
   return save.worldCalendar.worldMinute;
  const m=dateMinute(save?.gameDate);return m===null?null:m;
 }
 function xyAt(points,progress){
  if(!Array.isArray(points)||!points.length)return null;
  if(points.length===1)return {x:points[0][0],y:points[0][1]};
  const lengths=[],total=points.slice(1).reduce((sum,p,i)=>{
   const prev=points[i],len=Math.hypot(p[0]-prev[0],p[1]-prev[1]);
   lengths.push(len);return sum+len;
  },0);
  if(total<=0)return {x:points[0][0],y:points[0][1]};
  let remaining=Math.min(1,Math.max(0,progress))*total;
  for(let i=0;i<lengths.length;i++){
   if(remaining<=lengths[i]||i===lengths.length-1){
    const t=lengths[i]?Math.min(1,remaining/lengths[i]):0;
    return {x:points[i][0]+(points[i+1][0]-points[i][0])*t,
     y:points[i][1]+(points[i+1][1]-points[i][1])*t};
   }
   remaining-=lengths[i];
  }
  return {x:points[points.length-1][0],y:points[points.length-1][1]};
 }
 function position(ship,save){
  if(!ship||ship.status==='lost')return null;
  if(ship.status!=='at-sea'||!ship.trip){
   const point=PORTS[ship.port];return point?{x:point[0],y:point[1],progress:1,atSea:false}:null;
  }
  const trip=ship.trip,charted=route(trip.from,trip.to),points=trip.routePoints||charted?.points;
  if(!points?.length)return null;
  const start=Number.isSafeInteger(trip.departMinute)?trip.departMinute:dateMinute(trip.depart);
  const end=dateMinute(trip.eta),now=gameMinute(save);
  const fraction=start===null||end===null||now===null||end<=start?0:
   Math.min(1,Math.max(0,(now-start)/(end-start)));
  return {...xyAt(points,fraction),progress:fraction,atSea:true,
   remainingDays:end===null||now===null?null:Math.max(0,Math.ceil((end-now)/1440))};
 }
 const api=Object.freeze({MAP,PORTS,LANES,route,plan,sailingDays,gameMinute,position,xyAt});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_MERCHANT_NAV=api;
})(typeof window!=='undefined'?window:globalThis);
