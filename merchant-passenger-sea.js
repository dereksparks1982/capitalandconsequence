/* Capital & Consequence: personally paid maritime passenger journeys.
 * Separate from FE_EMPIRE owned cargo ships and treasury. No clock is created.
 * Boarding requires presence at the existing Potomac bank passenger pier.
 * A 2-day approximate river/Chesapeake feeder brings passengers to Baltimore.
 * Ocean progress follows the existing saved world minute across day reports.
 */
(function(root){
 'use strict';
 const nav=typeof module==='object'&&module.exports?require('./merchant-navigation.js'):root.FE_MERCHANT_NAV;
 const walk=typeof module==='object'&&module.exports?require('./merchant-harbor-walk.js'):root.FE_MERCHANT_HARBOR_WALK;
 const ZONES=['quay','warehouse','customs','market','lodging','street'];
 const TRANSFER_DAYS=2;
 const BOAT_RATES=Object.freeze({schooner:{base:12,perNM:.012},steamer:{base:25,perNM:.018}});
 const validPort=p=>Object.prototype.hasOwnProperty.call(nav.PORTS,p);
 const rounded=n=>Math.round(n*100)/100;
 const result=(ok,reason,extra={})=>({ok,reason,...extra});
 function ensure(save){
  if(!save||typeof save!=='object')throw Error('Player save required');
  if(!save.passengerSea||save.passengerSea.version!==1)
   save.passengerSea={version:1,port:null,voyage:null,position:{zone:'quay',x:6,y:7},history:[],nextId:0};
  const st=save.passengerSea;
  if(!Array.isArray(st.history))st.history=[];
  if(!st.position||typeof st.position!=='object')st.position={zone:'quay',x:6,y:7};
  if(!Number.isSafeInteger(st.nextId)||st.nextId<0)st.nextId=0;
  return st;
 }
 function position(save){
  const state=ensure(save),trip=state.voyage;
  if(!trip)return {phase:state.port?'ashore':'washington',port:state.port};
  const now=nav.gameMinute(save);
  const elapsed=Number.isSafeInteger(now)?Math.max(0,now-trip.departMinute):0;
  const duration=trip.arrivalMinute-trip.departMinute;
  const fraction=duration>0?Math.min(1,elapsed/duration):0;
  const oceanFraction=Math.max(0,Math.min(1,(elapsed-trip.transferDays*1440)/(duration-trip.transferDays*1440)));
  const xy=nav.xyAt(trip.points,oceanFraction);
  return {phase:'at-sea',port:null,from:trip.from,to:trip.to,progress:fraction,
   seaProgress:oceanFraction,coordinates:xy,etaDate:trip.etaDate,
   daysRemaining:Math.max(0,Math.ceil((trip.arrivalMinute-(now??trip.departMinute))/1440)),
   feeder:elapsed<trip.transferDays*1440};
 }
 function quote(save,to,type='steamer'){
  if(!save||save.characterRoute!=='industrialist')return result(false,'Only Charles can purchase a passenger berth.');
  if(!BOAT_RATES[type])return result(false,'Unknown passenger vessel type.');
  if(save.paused||save.phase==='report')return result(false,'Passenger bookings are unavailable while paused or during a report.');
  if(save.worldCalendarStatus!=='ready'||!Number.isSafeInteger(save.worldCalendar?.worldMinute))
   return result(false,'Passenger passage requires the authoritative saved 24-hour clock.');
  const st=ensure(save);
  if(st.voyage)return result(false,'A passenger voyage is already underway.');
  const atHome=!st.port,physical=save.currentLocation||{};
  const atPier=physical.locationId==='potomacFishingBank'&&physical.roomId==='passenger-pier';
  const atForeign=physical.locationId==='foreignHarbor'&&!!st.port;
  if(atHome&&!atPier)return result(false,'Go to the actual Passenger Pier at the Potomac River Fishing Bank to buy passage.');
  if(!atHome&&!atForeign)return result(false,'The passenger must be physically present in the arrived foreign harbour.');
  const from=st.port||'Baltimore',dest=atHome?to:'Baltimore';
  if(!validPort(dest)||dest===from)return result(false,'Invalid passenger destination.');
  // No imaginary point-to-point jump. Only paths already connected on the chart.
  const itinerary=nav.plan(from,dest,type);
  if(!itinerary)return result(false,'No navigable commercial chart route connects these ports.');
  const feederDays=TRANSFER_DAYS;
  const days=itinerary.days+feederDays;
  const rate=BOAT_RATES[type],fare=rounded(rate.base+rate.perNM*itinerary.nauticalMiles+feederDays*4);
  if(!Number.isFinite(save.personalCash)||save.personalCash<fare)
   return result(false,'Personal money is insufficient for the $'+fare.toFixed(2)+' passage.',{fare});
  const departMinute=nav.gameMinute(save);
  const arrivalMinute=departMinute+days*1440;
  const etaDate=new Date(arrivalMinute*60000).toISOString().slice(0,10);
  return result(true,'Passenger quotation is available.',{
   from,to:dest,type,days,seaDays:itinerary.days,transferDays:feederDays,
   nauticalMiles:itinerary.nauticalMiles,fare,departMinute,arrivalMinute,etaDate,
   points:itinerary.points.map(point=>point.slice()),
   legs:itinerary.legs.map(leg=>({...leg})),returning:!!st.port
  });
 }
 function embark(save,dest,type){
  const q=quote(save,dest,type);
  if(!q.ok)return q;
  const st=ensure(save);
  // No separate treasury: this is a personal trip, not a shipment of company stock.
  save.personalCash=rounded(save.personalCash-q.fare);
  const id=++st.nextId;
  st.voyage={id,from:q.from,to:q.to,type:q.type,days:q.days,seaDays:q.seaDays,
   transferDays:q.transferDays,nauticalMiles:q.nauticalMiles,fare:q.fare,
   departMinute:q.departMinute,arrivalMinute:q.arrivalMinute,etaDate:q.etaDate,
   points:q.points,legs:q.legs,returning:q.returning};
  st.port=null;
  save.currentLocation={locationId:'passengerVessel',roomId:'cabin'};
  st.history.push({id,date:save.gameDate,kind:'embarked',from:q.from,to:q.to,fare:q.fare,eta:q.etaDate});
  st.history=st.history.slice(-80);
  return result(true,'Passenger boarded. Use the normal world clock and daily reports during the voyage.',{voyage:st.voyage});
 }
 function sync(save){
  const st=ensure(save),trip=st.voyage,
   now=save.worldCalendarStatus==='ready'&&Number.isSafeInteger(save.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null;
  if(!trip||!Number.isSafeInteger(now)||now<trip.arrivalMinute)return result(false,'No passenger arrival due.');
  const isReturn=!!trip.returning;
  st.voyage=null;
  st.port=isReturn?null:trip.to;
  st.position={zone:'quay',x:6,y:7};
  save.currentLocation=isReturn?{locationId:'potomacFishingBank',roomId:'passenger-pier'}:
   {locationId:'foreignHarbor',roomId:'quay'};
  st.history.push({id:trip.id,date:save.gameDate,kind:'arrived',port:trip.to,returning:isReturn});
  st.history=st.history.slice(-80);
  return result(true,isReturn?'Returned to the Washington Passenger Pier.':'Arrived at '+trip.to+'.',{port:st.port,returned:isReturn});
 }
 function canWalk(save,zone,x,y){
  const st=ensure(save);
  if(st.voyage||!st.port||save.currentLocation?.locationId!=='foreignHarbor')
   return result(false,'Charles is not ashore at a foreign port.');
  if(!ZONES.includes(zone))return result(false,'Unknown port sector.');
  const grid=walk.tiles(zone);
  if(!Number.isInteger(x)||!Number.isInteger(y)||!walk.passable(grid?.[y]?.[x]))
   return result(false,'That tile cannot be entered.');
  if(save.paused||save.phase==='report')return result(false,'Walking is unavailable right now.');
  const previous=st.position;
  if(previous.zone===zone&&Math.abs(previous.x-x)+Math.abs(previous.y-y)!==1)
   return result(false,'Walk one adjacent tile at a time.');
  if(previous.zone!==zone&&(x!==6||y!==7))return result(false,'Enter a different sector through its public approach.');
  return result(true,'Port path accessible.');
 }
 function move(save,zone,x,y){
  const allowed=canWalk(save,zone,x,y);if(!allowed.ok)return allowed;
  const st=ensure(save);
  st.position={zone,x,y};
  save.currentLocation={locationId:'foreignHarbor',roomId:zone};
  return result(true,'Moved within '+st.port+': '+zone+'.',{position:{...st.position}});
 }
 const api=Object.freeze({TRANSFER_DAYS,BOAT_RATES,ZONES,ensure,position,quote,embark,sync,canWalk,move});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_PASSENGER_SEA=api;
})(typeof window!=='undefined'?window:globalThis);
