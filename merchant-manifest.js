/* Merchant and passenger ship registers, 1878 alternate history.
 * Records in this archive are FICTIONAL simulated travelers, not real
 * immigration documents. One saved-world clock owns both vessels and people.
 * Each completed voyage remains in the save; no 40-entry rolling log here.
 */
(function(root){
'use strict';
const FIRST=['Ada','Albert','Alice','Arthur','Beatrice','Clara','Daniel','Edward','Ellen','Frederick','George','Harriet','Henry','Ida','James','Joseph','Lydia','Margaret','Mary','Nathan','Peter','Rosa','Samuel','Thomas'];
const LAST=['Abbott','Baker','Bennett','Brooks','Carter','Dawson','Ellis','Foster','Green','Hall','Hughes','Mason','Miller','Parker','Price','Reed','Shaw','Turner','Walsh','Young'];
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ensure(save){
 if(!save||typeof save!=='object')return null;
 if(!save.maritimeManifests||save.maritimeManifests.version!==1)
  save.maritimeManifests={version:1,next:0,voyages:[]};
 const r=save.maritimeManifests;
 if(!Array.isArray(r.voyages))r.voyages=[];
 if(!Number.isSafeInteger(r.next)||r.next<0)r.next=r.voyages.length;
 return r;
}
function pick(seed,limit){
 let h=2166136261;
 for(const c of String(seed))h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;
 return h%limit;
}
function travelers(id,ship,trip,count){
 const people=[];
 for(let i=0;i<count;i++){
  const seed=id+'|'+ship+'|'+trip.from+'|'+trip.to+'|'+i;
  const name=FIRST[pick(seed+'|f',FIRST.length)]+' '+LAST[pick(seed+'|l',LAST.length)];
  people.push({id:id+'-P'+String(i+1).padStart(3,'0'),name,
   from:trip.from,to:trip.to,role:'passenger',status:'aboard',
   fictional:true,fare:'not modeled'});
 }
 return people;
}
function newId(r,prefix){return prefix+'-'+String(++r.next).padStart(6,'0')}
function cargo(trip){
 if(trip.cargo==='trade'&&trip.tradeLot)
  return {kind:'trade',description:String(trip.tradeLot.name||'Purchased merchant cargo'),
   invoiceId:trip.tradeLot.id,units:trip.tradeLot.units,landedUnits:null,damagedUnits:null};
 if(trip.cargo==='electric'&&trip.consignment)
  return {kind:'electric',description:String(trip.consignment.productId||'Federal Electric components'),
   units:trip.consignment.units,landedUnits:null,damagedUnits:null};
 return {kind:'freight',description:'General merchant freight (undetailed cargo)',
  units:null,landedUnits:null,damagedUnits:null};
}
function registerMerchant(save,ship,legacy=false){
 if(!ship||ship.status!=='at-sea'||!ship.trip)return null;
 const r=ensure(save),t=ship.trip;if(!r)return null;
 const existing=t.registryId&&r.voyages.find(v=>v.id===t.registryId);
 if(existing)return existing;
 const id=newId(r,'MV');
 t.registryId=id;
 const entry={id,kind:'merchant',shipId:ship.id,shipName:String(ship.name),
  type:ship.type,from:t.from,to:t.to,depart:t.depart,eta:t.eta,
  departMinute:t.departMinute??null,arrived:null,status:'at-sea',cargo:cargo(t),
  passengers:legacy?[]:travelers(id,ship.name,t,2),
  crew:'Names not yet registered',source:legacy?'recovered-existing-save':'fictional-simulation',
  events:[{date:t.depart,kind:legacy?'recovered':'departure',
   description:legacy?'Recovered voyage already underway in an earlier save; no fictional passenger names invented retroactively.':
    'Departure and fictional passenger roll recorded.'}]};
 r.voyages.push(entry);
 return entry;
}
function recoverFleet(save,fleet){
 if(!fleet||!Array.isArray(fleet.ships))return;
 for(const ship of fleet.ships)
  if(ship.status==='at-sea'&&ship.trip)registerMerchant(save,ship,true);
}
function closeMerchant(save,ship,trip,status,date,detail={}){
 if(!trip||!['arrived','lost'].includes(status))return null;
 const r=ensure(save);if(!r)return null;
 let row=trip.registryId&&r.voyages.find(v=>v.id===trip.registryId);
 if(!row)row=registerMerchant(save,{...ship,status:'at-sea',trip},true);
 if(!row||row.status!=='at-sea')return row;
 row.status=status;row.arrived=date;
 row.cargo.landedUnits=row.cargo.units===null?null:status==='lost'?0:
  Math.max(0,row.cargo.units-(detail.damagedUnits||0));
 row.cargo.damagedUnits=row.cargo.units===null?null:status==='lost'?row.cargo.units:
  Math.max(0,detail.damagedUnits||0);
 row.hullCondition=Number.isFinite(ship.condition)?ship.condition:null;
 row.passengers.forEach(p=>{p.status=status==='arrived'?'disembarked':'missing-at-sea'});
 row.events.push({date,kind:status,description:status==='arrived'?
  'Ship arrived in '+String(trip.to)+'. Recorded cargo awaits its usual sale or collection.':
  'Ship reported lost at sea ('+String(detail.cause||'cause undetermined')+'); listed passengers marked missing.'});
 return row;
}
function registerPassenger(save,trip,playerName,legacy=false){
 if(!trip)return null;
 const r=ensure(save);if(!r)return null;
 const existing=trip.registryId&&r.voyages.find(v=>v.id===trip.registryId);
 if(existing)return existing;
 const id=newId(r,'PV');trip.registryId=id;
 const boarding={id:id+'-PLAYER',name:String(playerName||'Charles Whitecomb'),
  from:trip.from,to:trip.to,role:'player',status:'aboard',
  fictional:true,fare:trip.fare};
 const peers=legacy?[]:travelers(id,'Passenger '+trip.type,trip,3);
 const row={id,kind:'passenger',shipName:'Ticketed '+trip.type+' passenger vessel',
  type:trip.type,from:trip.from,to:trip.to,depart:save.gameDate,
  eta:trip.etaDate,departMinute:trip.departMinute,status:'at-sea',arrived:null,
  cargo:{kind:'none',description:'No cargo ledger assigned to this passenger ticket',
   units:null,landedUnits:null,damagedUnits:null},
  passengers:[boarding,...peers],source:legacy?'recovered-existing-save':'fictional-simulation',
  events:[{date:save.gameDate,kind:'departure',description:'Passenger boarded, fare paid '+Number(trip.fare).toFixed(2)+'.'}]};
 r.voyages.push(row);
 return row;
}
function closePassenger(save,trip,date){
 const r=ensure(save);if(!r||!trip)return null;
 let row=trip.registryId&&r.voyages.find(v=>v.id===trip.registryId);
 if(!row)row=registerPassenger(save,trip,'Charles Whitecomb',true);
 if(!row||row.status!=='at-sea')return row;
 row.status='arrived';row.arrived=date;row.eta=trip.etaDate;
 row.passengers.forEach(p=>{p.status='disembarked'});
 row.events.push({date,kind:'arrived',
  description:trip.returning?'Return connection reached Washington Passenger Pier.':
   'Passenger voyage reached '+String(trip.to)+'.'});
 return row;
}
function weatherDelay(save,trip,date,minutes){
 const row=trip?.registryId&&ensure(save)?.voyages.find(v=>v.id===trip.registryId);
 if(!row||row.status!=='at-sea')return;
 row.eta=trip.etaDate;
 row.events.push({date,kind:'weather-delay',
  description:'Rough seas delayed estimated arrival by '+Math.round(minutes/60)+' hours.'});
}
function records(save,query='',shipId=null){
 const r=ensure(save);if(!r)return [];
 const needle=String(query??'').trim().toLowerCase();
 return r.voyages.filter(v=>(shipId===null||String(v.shipId)===String(shipId))&&
  (!needle||[v.id,v.shipName,v.from,v.to,v.status,v.cargo?.description,
   ...(v.passengers||[]).map(p=>p.name)].some(x=>String(x??'').toLowerCase().includes(needle))));
}
function roster(entry){
 if(!entry)return '';
 const people=Array.isArray(entry.passengers)?entry.passengers:[];
 return '<details class="merchant-people"><summary>Passenger Roll · '+people.length+'</summary>'+
  '<p class="fine">All named passengers are fictional simulation records, not real immigration evidence.</p>'+
  (people.length?'<ol>'+people.map(p=>'<li>'+safe(p.name)+' · '+safe(p.status)+'</li>').join('')+'</ol>':
   '<p>Passenger identities were not recorded for this older voyage.</p>')+'</details>';
}
function detail(entry){
 if(!entry)return '<p>No voyage registered.</p>';
 const c=entry.cargo||{};
 return '<article class="merchant-manifest-entry"><h5>'+safe(entry.id)+' · '+safe(entry.shipName)+'</h5>'+
  '<p>'+safe(entry.from)+' → '+safe(entry.to)+' · '+safe(entry.type)+
  ' · <b>'+safe(entry.status)+'</b></p>'+
  '<p>Departed '+safe(entry.depart)+' · Estimated '+safe(entry.eta)+
  (entry.arrived?' · Resolved '+safe(entry.arrived):'')+'</p>'+
  '<p>Cargo: '+safe(c.description||'Unrecorded')+
  (Number.isFinite(c.units)?' · '+c.units+' units'+
   (Number.isFinite(c.landedUnits)?', '+c.landedUnits+' landed':''):'')+'</p>'+
  roster(entry)+
  '<details><summary>Captain’s Voyage Events · '+(entry.events?.length||0)+'</summary>'+
  (entry.events||[]).map(e=>'<p>'+safe(e.date)+' · '+safe(e.description)+'</p>').join('')+'</details></article>';
}
function archive(save,query='',limit=60,shipId=null){
 const found=records(save,query,shipId);
 return '<p>'+found.length+' matching voyage'+(found.length===1?'':'s')+
  ' (permanent in this save).</p>'+
  (found.length?found.slice(-limit).reverse().map(detail).join(''):
  '<p>No matching entries yet. Departures will enter the register automatically.</p>')+
  (found.length>limit?'<p>Showing the most recent '+limit+' records. Narrow the search to find older voyages.</p>':'');
}
const api=Object.freeze({ensure,registerMerchant,recoverFleet,closeMerchant,
 registerPassenger,closePassenger,weatherDelay,records,detail,archive});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_MERCHANT_MANIFEST=api;
})(typeof window!=='undefined'?window:globalThis);