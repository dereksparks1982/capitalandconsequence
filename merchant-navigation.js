/* Merchant navigation: Mitchell's 1880 world Mercator atlas, selected by the owner.
 * Original print and 1878 sail-only voyage geometry remain unchanged.
 * Display positions are separate from saved economic routes and travel time.
 */
(function(root){
 'use strict';
 const MAP='assets/artwork/maps/Mitchell_1880_Map/mitchell-world-1880.jpg';
 const PREVIEW='assets/artwork/maps/Mitchell_1880_Map/mitchell-world-1880-preview.jpg';
 const CHART=Object.freeze({width:800,height:492,nativeWidth:9664});
 // Carefully calibrated study overlay on the 9664 x 5944 archival JPEG.
 // Coast placement is approximate at worldwide scale; original painting is unmodified.
 // Overlay uses image coordinates ONLY. Existing 800x600 physical voyage data is preserved.
 const DISPLAY_PORTS=Object.freeze({
  Baltimore:[370,223],Philadelphia:[372,222],'New York':[373,221],
  Liverpool:[465,196],Hamburg:[482,196],Havana:[363,248],
  Singapore:[603,277],'Hong Kong':[617,249]
 });
 const DISPLAY_LANES=Object.freeze([
  {a:'Baltimore',b:'Philadelphia',points:[[370,223],[377,227],[381,222],[372,222]]},
  {a:'Philadelphia',b:'New York',points:[[372,222],[382,224],[382,219],[373,221]]},
  {a:'New York',b:'Liverpool',points:[[373,221],[390,213],[414,200],[438,190],[454,190],[465,196]]},
  {a:'Liverpool',b:'Hamburg',points:[[465,196],[468,205],[478,202],[482,196]]},
  {a:'New York',b:'Havana',points:[[373,221],[385,233],[387,244],[374,253],[363,248]]},
  {a:'Hamburg',b:'Singapore',points:[[482,196],[463,209],[456,228],[459,251],[463,275],
   [479,324],[500,356],[524,361],[555,338],[582,306],[603,277]]},
  {a:'Singapore',b:'Hong Kong',points:[[603,277],[611,266],[617,249]]}
 ]);
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
 function sailingDays(nauticalMiles,type='schooner'){
  if(type!=='schooner'||!Number.isFinite(nauticalMiles)||nauticalMiles<=0)return null;
  // Solely wind-powered vessels: effective speed allows for calm days,
  // prevailing winds, tacking, maneuvers and approach delays.
  const effectivePerDay=6*24*.75;
  return Math.max(2,Math.ceil(nauticalMiles/effectivePerDay));
 }
 function plan(a,b,type='schooner'){
  if(type!=='schooner')return null;
  const r=route(a,b);if(!r)return null;
  // 1878 sail-only routes: headwinds lengthen westbound Atlantic crossings.
  // Multi-leg passages also include realistic stops to reprovision.
  const oceanDays=sailingDays(r.nauticalMiles,type);
  const westbound=r.legs.some(leg=>leg.from==='Liverpool'&&leg.to==='New York');
  const westboundAdjustment=westbound?Math.ceil(oceanDays*.25):0;
  const calls=Math.max(0,r.legs.length-1);
  const portDays=calls*2;
  return {...r,days:oceanDays+westboundAdjustment+portDays,
   underwayDays:oceanDays+westboundAdjustment,portDays,
   basis:'1878 wind-powered sailing, westbound headwinds and port stopovers'};
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
 function displayRoute(a,b){
  const planned=route(a,b);if(!planned)return null;
  const points=[];
  for(const leg of planned.legs){
   const lane=DISPLAY_LANES.find(v=>(v.a===leg.from&&v.b===leg.to)||(v.a===leg.to&&v.b===leg.from));
   if(!lane)return null;
   const forward=lane.a===leg.from;
   const section=(forward?lane.points:lane.points.slice().reverse()).map(p=>p.slice());
   if(points.length)section.shift();
   points.push(...section);
  }
  return {...planned,points,survey:'mitchell-1880-visual-only'};
 }
 function displayPosition(ship,save){
  const legacy=position(ship,save);if(!legacy)return null;
  if(legacy.atSea&&ship?.trip){
   const shown=displayRoute(ship.trip.from,ship.trip.to);
   return shown?{...legacy,...xyAt(shown.points,legacy.progress)}:null;
  }
  const p=DISPLAY_PORTS[ship?.port];
  return p?{...legacy,x:p[0],y:p[1]}:null;
 }
 // Saved personal pins still use the original 800x600 chart grid.
 function savedMarkToDisplay(mark){return [mark.x,mark.y*CHART.height/600]}
 function displayMarkToSaved(x,y){return [x,y*600/CHART.height]}
 const api=Object.freeze({MAP,PREVIEW,CHART,PORTS,LANES,DISPLAY_PORTS,DISPLAY_LANES,
  route,displayRoute,plan,sailingDays,gameMinute,position,displayPosition,xyAt,
  savedMarkToDisplay,displayMarkToSaved});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_MERCHANT_NAV=api;
})(typeof window!=='undefined'?window:globalThis);
