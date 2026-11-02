/* Capital & Consequence: financed railroad construction on the existing rail plan.
 * A map pencil is not a deed. Never convert painted lines into paid property
 * without rights, real company funds, construction labor and time.
 * No automatic railway profits or unauthorized new map pins.
 */
(function(root){
'use strict';
const RAIL=()=>root.FE_RAILWAY;
const TYPES=Object.freeze({charter:'charter',rights:'rights',build:'build',engine:'engine',dispatch:'dispatch'});
const CHARTER=25000,ENGINE=140000,CREW_SHIFT=90,CREW_COST=3500;
const clone=x=>JSON.parse(JSON.stringify(x));
const blank=()=>({version:1,charter:null,lines:[],engines:[],trips:[],receipts:{},ledger:[],serial:0});
function read(save){
 const s=save?.railwayCompany||blank();
 if(s.version!==1||!Array.isArray(s.lines)||!Array.isArray(s.engines)||!Array.isArray(s.trips)||
  !s.receipts||!Array.isArray(s.ledger)||!Number.isSafeInteger(s.serial))
   throw Error('Unrecognized railway ownership ledger; do not erase private company rights.');
 return clone(s);
}
function ensure(save){if(!save.railwayCompany)save.railwayCompany=blank();read(save);return save.railwayCompany;}
function cash(save){return Math.round(Number(save?.companyCash)*100)}
function makeDate(save){return root.FE_WASHINGTON_TIME?.now?.(save)}
function preflight(save,{action,from,to,lineId,date,postTime=false}){
 if(!Object.hasOwn(TYPES,action))return {ok:false,reason:'Unknown railway transaction.'};
 if(save?.characterRoute!=='industrialist'||save.paused||save.phase!=='day'||
  save.currentLocation?.locationId!=='factory')
  return {ok:false,reason:'Railroad financing belongs to Charles during business hours at Federal Electric.'};
 if(root.FE_CORPORATE?.canManage&&root.FE_CORPORATE.canManage(save)===false)
  return {ok:false,reason:'Charles no longer controls the corporate treasury.'};
 const clock=makeDate(save);
 if(!clock||!Number.isSafeInteger(clock.minuteOfDay)||date&&date!==clock.date)
  return {ok:false,reason:'A single valid Washington business date is required.'};
 const company=read(save);
 if(!Number.isSafeInteger(cash(save))||cash(save)<0)
  return {ok:false,reason:'Company funds are not valid.'};
 let seconds,costCents,details={};
 if(action==='charter'){
  if(company.charter)return {ok:false,reason:'The railway charter is already purchased.'};
  seconds=60*60;costCents=CHARTER;
 }else{
  if(!company.charter)return {ok:false,reason:'Acquire the railroad charter before investing company funds.'};
  if(action==='rights'){
   const plan=RAIL()?.sanitize?.(save.railwayPlanner),route=RAIL()?.path?.(plan,from,to);
   if(!route||!Number.isFinite(route.distancePixels)||route.distancePixels<5)
    return {ok:false,reason:'A connected hand-painted rail route between two planned stations is required.'};
   if(company.lines.some(x=>(x.fromId===from&&x.toId===to)||(x.fromId===to&&x.toId===from)))
    return {ok:false,reason:'Rights for this station pair were already acquired.'};
   if(company.lines.length>=12)return {ok:false,reason:'Only twelve corridors can be financed in the current railway company.'};
   const start=plan.stations.find(s=>s.id===from),end=plan.stations.find(s=>s.id===to);
   if(!start||!end)return {ok:false,reason:'A real pair of planned stations is required.'};
   const length=Math.ceil(route.distancePixels);
   // A separate signed rights contract. Existing planned track is NOT yet constructed.
   costCents=7500+length*45;
   seconds=60*60;
   details={fromId:from,toId:to,fromStation:clone(start),toStation:clone(end),
    route:route.points.map(p=>({x:p.x,y:p.y})),length,
    crewShiftsRequired:Math.max(2,Math.ceil(length/70))};
  }else if(action==='build'){
   const line=company.lines.find(x=>x.id===lineId);
   if(!line)return {ok:false,reason:'No purchased corridor rights exist for that line.'};
   if(line.status==='open')return {ok:false,reason:'This corridor is already constructed.'};
   seconds=CREW_SHIFT*60;costCents=CREW_COST;
   details={id:line.id,nextShift:line.crewShiftsCompleted+1,final:line.crewShiftsCompleted+1>=line.crewShiftsRequired};
  }else if(action==='engine'){
   if(!company.lines.some(l=>l.status==='open'))return {ok:false,reason:'Construct a corridor before purchasing a locomotive.'};
   if(company.engines.length>=4)return {ok:false,reason:'All available locomotive berths are occupied.'};
   seconds=120*60;costCents=ENGINE;
  }else if(action==='dispatch'){
   const line=company.lines.find(x=>x.id===lineId&&x.status==='open');
   if(!line)return {ok:false,reason:'Only paid, constructed rail lines can carry an owned locomotive.'};
   const active=company.trips.find(t=>t.status==='running'&&
    Number.isSafeInteger(save.worldCalendar?.worldMinute)&&
    save.worldCalendar.worldMinute<t.departMinute+t.durationMinutes);
   if(active)return {ok:false,reason:'The railway locomotive is already in service.'};
   if(!company.engines.length)return {ok:false,reason:'No paid locomotive has been delivered to Federal Electric.'};
   seconds=15*60;costCents=1200;
   details={id:line.id,durationMinutes:Math.max(10,Math.ceil(line.length/24)),trainId:company.engines[0].id};
  }
 }
 if(costCents>cash(save))return {ok:false,reason:'Insufficient company funds. Required $'+(costCents/100).toFixed(2)+'.'};
 if(!postTime){
  const remaining=root.FE_WASHINGTON_TIME?.phaseSecondsRemaining?.(save);
  if(!Number.isSafeInteger(remaining)||remaining<=seconds)
   return {ok:false,reason:'Not enough business-day time to complete this railway instruction.'};
 }
 return {ok:true,action,seconds,costCents,date:clock.date,...details};
}
function transact(save,request){
 const {token,date,action}=request||{};
 if(typeof token!=='string'||!/^[a-z0-9][a-z0-9:._-]{0,95}$/i.test(token))
  return {ok:false,reason:'A valid unique railway transaction receipt is required.'};
 const old=save?.railwayCompany?.receipts?.[token];
 if(old)return {...clone(old),repeated:true};
 const allowed=preflight(save,{...request,postTime:true});
 if(!allowed.ok)return allowed;
 if(date!==allowed.date||request.spentSeconds!==allowed.seconds)
  return {ok:false,reason:'Exact game date and charged time are required for railroad work.'};
 const entity=ensure(save);
 let result={};
 if(action==='charter'){
  entity.charter={date,feeCents:CHARTER,owner:'Federal Electric',status:'registered'};
  result={description:'Railroad charter registered. No track, station or trains are yet owned.'};
 }else if(action==='rights'){
  const id='RAIL-LINE-'+(++entity.serial);
  const line={id,fromId:allowed.fromId,toId:allowed.toId,
   stations:[allowed.fromStation,allowed.toStation],route:allowed.route,length:allowed.length,
   rightsDate:date,rightsCents:allowed.costCents,status:'under-construction',
   crewShiftsRequired:allowed.crewShiftsRequired,crewShiftsCompleted:0,
   constructionCostCents:0,openDate:null,faresCollectedCents:0,freightCollectedCents:0};
  entity.lines.push(line);result={lineId:id,description:'Purchased rights for '+line.stations.map(s=>s.name).join(' to ')+
   '. Construction and stations are NOT finished.'};
 }else if(action==='build'){
  const line=entity.lines.find(x=>x.id===request.lineId);
  line.crewShiftsCompleted++;line.constructionCostCents+=CREW_COST;
  if(allowed.final){line.status='open';line.openDate=date;}
  result={lineId:line.id,status:line.status,
   description:'Paid construction shift '+line.crewShiftsCompleted+'/'+line.crewShiftsRequired+
    (allowed.final?' · line and station platforms opened.':' · remaining work unpaid.')};
 }else if(action==='engine'){
  const id='FE-LOCO-'+(++entity.serial);
  entity.engines.push({id,date,purchasePriceCents:ENGINE,status:'serviceable'});
  result={engineId:id,description:'Purchased one actual locomotive for the railway company.'};
 }else if(action==='dispatch'){
  const t={id:'FE-TRIP-'+(++entity.serial),lineId:allowed.id,engineId:allowed.trainId,
   departMinute:save.worldCalendar.worldMinute,date,durationMinutes:allowed.durationMinutes,
   fuelCents:1200,status:'running',passengerRevenueCents:0,freightRevenueCents:0};
  // Internal component carriage must be explicitly loaded first.
  // Starting a train alone never transfers stock, creates a buyer or pays fares.
  const cargo=Array.isArray(entity.freight)?entity.freight.find(x=>x.lineId===allowed.id&&x.status==='origin-loaded'):null;
  if(cargo){cargo.status='in-transit';cargo.tripId=t.id;t.cargoManifestId=cargo.id;}
  entity.trips.push(t);if(entity.trips.length>120)entity.trips.splice(0,entity.trips.length-120);
  result={tripId:t.id,cargoManifestId:cargo?.id||null,
   description:'Owned locomotive dispatched.'+(cargo?' Carrying genuine factory components for depot receipt.':'')+
    ' Fuel paid; no unsupported ticket or freight revenue.'};
 }
 save.companyCash=(cash(save)-allowed.costCents)/100;
 if(save.componentWorks)save.componentWorks.cashCents=Math.round(save.companyCash*100);
 const receipt={ok:true,action,date,token,elapsedSeconds:allowed.seconds,costCents:allowed.costCents,...result};
 entity.receipts[token]=receipt;
 entity.ledger.push({date,action,costCents:allowed.costCents,token,...result});
 if(entity.ledger.length>180)entity.ledger.splice(0,entity.ledger.length-180);
 if(Array.isArray(save.notes))save.notes.push({date,source:'Federal Electric railway accounts',text:result.description});
 return {...clone(receipt),repeated:false};
}
function trips(save){
 const x=read(save),minute=save?.worldCalendar?.worldMinute;
 return x.trips.slice(-10).map(t=>{
  const ended=Number.isSafeInteger(minute)&&minute>=t.departMinute+t.durationMinutes;
  return {...t,status:ended?'arrived':t.status};
 });
}
function locomotivePosition(save){
 const current=trips(save).reverse().find(x=>x.status==='running');
 const line=save?.railwayCompany?.lines?.find(x=>x.id===current?.lineId);
 if(!line||!current||!Number.isSafeInteger(save?.worldCalendar?.worldMinute))return null;
 const points=line.route;if(!Array.isArray(points)||points.length<2)return null;
 const length=a=>Math.hypot((a.x)*2048,(a.y)*1159);
 const lens=points.slice(1).map((p,i)=>length({x:p.x-points[i].x,y:p.y-points[i].y}));
 const distance=lens.reduce((a,b)=>a+b,0);
 let left=Math.max(0,Math.min(1,(save.worldCalendar.worldMinute-current.departMinute)/current.durationMinutes))*distance;
 for(let i=1;i<points.length;i++){
  const d=lens[i-1];if(left<=d)return {x:points[i-1].x+(points[i].x-points[i-1].x)*left/d,
   y:points[i-1].y+(points[i].y-points[i-1].y)*left/d,tripId:current.id};
  left-=d;
 }
 return {...points.at(-1),tripId:current.id};
}
const api=Object.freeze({read,preflight,transact,trips,locomotivePosition});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_RAIL_COMPANY=api;
})(typeof window!=='undefined'?window:globalThis);
