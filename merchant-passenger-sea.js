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
 const manifest=typeof module==='object'&&module.exports?require('./merchant-manifest.js'):root.FE_MERCHANT_MANIFEST;
 const ZONES=['quay','warehouse','customs','market','lodging','street'];
 const TRANSFER_DAYS=2;
 const LODGING_COST=1.25; // Provisional game balance, not an authenticated 1878 room rate.
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
  if(st.voyage)manifest?.registerPassenger?.(save,st.voyage,'Charles Whitecomb',true);
  return st;
 }
 // Deterministic voyage exposure: a forecast is not a guaranteed arrival date.
 // Recorded once on embarkation and revealed only as the vessel reaches rough seas.
 // These are bounded game-balance estimates, not a historical weather database.
 function modeledDelay(from,to,type,departMinute,legs){
  if(!Array.isArray(legs)||!legs.some(l=>['transatlantic','atlantic','eastern'].includes(l.kind)))return 0;
  const key=[from,to,type,Math.floor(departMinute/1440)].join('|');
  let hash=2166136261;
  for(let i=0;i<key.length;i++)hash=Math.imul(hash^key.charCodeAt(i),16777619)>>>0;
  const month=new Date(departMinute*60000).getUTCMonth();
  const risk=(month===11||month<=1?30:month>=5&&month<=10?22:14)+(type==='schooner'?10:0);
  return hash%100<risk?(1+Math.floor(hash/101)%4)*720:0;
 }
 function position(save){
  const state=ensure(save),trip=state.voyage;
  if(!trip)return {phase:state.port?'ashore':'washington',port:state.port};
  const now=nav.gameMinute(save);
  const elapsed=Number.isSafeInteger(now)?Math.max(0,now-trip.departMinute):0;
  const duration=trip.arrivalMinute-trip.departMinute;
  const fraction=duration>0?Math.min(1,elapsed/duration):0;
  const transferMinutes=trip.transferDays*1440,seaMinutes=trip.seaDays*1440;
  // Departing Washington: feeder BEFORE ocean. Returning: ocean BEFORE feeder.
  const oceanStart=trip.returning?0:transferMinutes;
  const oceanElapsed=Math.max(0,elapsed-oceanStart);
  const weather=trip.weather,delay=weather?.observed?weather.delayMinutes:0;
  const interruptionAt=weather?weather.triggerMinute-trip.departMinute-oceanStart:seaMinutes;
  const effectiveOcean=delay>0&&oceanElapsed>interruptionAt?
   Math.max(interruptionAt,oceanElapsed-delay):oceanElapsed;
  const oceanFraction=Math.max(0,Math.min(1,effectiveOcean/Math.max(1,seaMinutes)));
  const feeder=trip.returning?elapsed>=seaMinutes+delay:elapsed<transferMinutes;
  const xy=nav.xyAt(trip.points,oceanFraction);
  return {phase:'at-sea',port:null,from:trip.from,to:trip.to,progress:fraction,
   seaProgress:oceanFraction,coordinates:xy,etaDate:trip.etaDate,
   daysRemaining:Math.max(0,Math.ceil((trip.arrivalMinute-(now??trip.departMinute))/1440)),
   feeder,weatherDelayMinutes:delay};
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
  const delayMinutes=modeledDelay(q.from,q.to,q.type,q.departMinute,q.legs);
  const oceanStart=q.departMinute+(q.returning?0:q.transferDays*1440);
  st.voyage={id,from:q.from,to:q.to,type:q.type,days:q.days,seaDays:q.seaDays,
   transferDays:q.transferDays,nauticalMiles:q.nauticalMiles,fare:q.fare,
   departMinute:q.departMinute,arrivalMinute:q.arrivalMinute,etaDate:q.etaDate,
   points:q.points,legs:q.legs,returning:q.returning,
   weather:{triggerMinute:oceanStart+Math.floor(q.seaDays*1440*.45),
    delayMinutes,observed:false,description:'Modeled rough-sea delay; historical conditions unverified.'}};
  manifest?.registerPassenger?.(save,st.voyage,'Charles Whitecomb');
  st.port=null;
  save.currentLocation={locationId:'passengerVessel',roomId:'cabin'};
  st.history.push({id,date:save.gameDate,kind:'embarked',from:q.from,to:q.to,fare:q.fare,eta:q.etaDate});
  st.history=st.history.slice(-80);
  return result(true,'Passenger boarded. Use the normal world clock and daily reports during the voyage.',{voyage:st.voyage});
 }
 function sync(save){
  const st=ensure(save),trip=st.voyage,
   now=save.worldCalendarStatus==='ready'&&Number.isSafeInteger(save.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null;
  if(!trip||!Number.isSafeInteger(now))return result(false,'No passenger arrival due.');
  // The schedule changes once when the voyage reaches the affected ocean leg.
  // Repeated renders, reloads, daily reports and large clock jumps never reroll it.
  const weather=trip.weather;
  if(weather&&!weather.observed&&Number.isSafeInteger(weather.triggerMinute)&&now>=weather.triggerMinute){
   weather.observed=true;
   if(Number.isSafeInteger(weather.delayMinutes)&&weather.delayMinutes>0){
    trip.arrivalMinute+=weather.delayMinutes;
    trip.etaDate=new Date(trip.arrivalMinute*60000).toISOString().slice(0,10);
    st.history.push({id:trip.id,kind:'weather-delay',date:save.gameDate,
     delayMinutes:weather.delayMinutes,eta:trip.etaDate});
    st.history=st.history.slice(-80);
    manifest?.weatherDelay?.(save,trip,save.gameDate,weather.delayMinutes);
   }
  }
  if(now<trip.arrivalMinute)return result(false,'No passenger arrival due.');
  const isReturn=!!trip.returning;
  manifest?.closePassenger?.(save,trip,save.gameDate);
  st.voyage=null;
  st.port=isReturn?null:trip.to;
  st.position={zone:'quay',x:6,y:7};
  save.currentLocation=isReturn?{locationId:'potomacFishingBank',roomId:'passenger-pier'}:
   {locationId:'foreignHarbor',roomId:'quay'};
  st.history.push({id:trip.id,date:save.gameDate,kind:'arrived',port:trip.to,returning:isReturn});
  st.history=st.history.slice(-80);
  return result(true,isReturn?'Returned to the Washington Passenger Pier.':'Arrived at '+trip.to+'.',{port:st.port,returned:isReturn});
 }
 function lodgingQuote(save){
  if(!save||save.characterRoute!=='industrialist')return result(false,'Only Charles may rent a harbour bed.');
  const st=ensure(save);
  if(st.voyage||!st.port||save.currentLocation?.locationId!=='foreignHarbor'||
    save.currentLocation?.roomId!=='lodging'||st.position.zone!=='lodging')
   return result(false,'Reach the Sailors’ Lodging section in person to rent a bed.');
  if(save.paused||save.phase==='report'||root.FE_MEDICAL_RECORDS?.pending?.(save))
   return result(false,'Lodging is unavailable while paused, at daily report or during medical recovery.');
  if(!Number.isSafeInteger(save.worldCalendar?.worldMinute)||save.worldCalendarStatus!=='ready')
   return result(false,'The saved world clock is unavailable.');
  if(!Number.isFinite(save.personalCash)||save.personalCash<LODGING_COST)
   return result(false,'Insufficient personal money for lodging.',{fare:LODGING_COST});
  return result(true,'A modest lodging bed is available.',{fare:LODGING_COST});
 }
 function payLodging(save,minutes){
  const st=ensure(save),now=nav.gameMinute(save);
  if(st.voyage||!st.port||save.currentLocation?.locationId!=='foreignHarbor'||
    save.currentLocation?.roomId!=='lodging'||st.position.zone!=='lodging')
   return result(false,'Not physically in the foreign harbour lodging.');
  if(!Number.isInteger(minutes)||minutes<60||minutes>480||!Number.isSafeInteger(now))
   return result(false,'Only a completed one-to-eight-hour rest may be settled.');
  if(!Number.isFinite(save.personalCash)||save.personalCash<LODGING_COST)
   return result(false,'Insufficient personal money to settle this stay.');
  if(st.history.some(h=>h.kind==='lodging'&&h.minute===now&&h.port===st.port))
   return result(false,'This completed lodging stay is already in the register.');
  save.personalCash=rounded(save.personalCash-LODGING_COST);
  const receipt={id:++st.nextId,kind:'lodging',date:save.gameDate,
   port:st.port,minute:now,minutes,fare:LODGING_COST};
  st.history.push(receipt);st.history=st.history.slice(-80);
  return result(true,'Paid '+LODGING_COST.toFixed(2)+' for '+minutes+' minutes of harbour rest.',{receipt});
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
 const api=Object.freeze({TRANSFER_DAYS,BOAT_RATES,LODGING_COST,ZONES,modeledDelay,ensure,position,quote,embark,sync,lodgingQuote,payLodging,canWalk,move});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_PASSENGER_SEA=api;
})(typeof window!=='undefined'?window:globalThis);
