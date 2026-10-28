/* Capital & Consequence: saved industrial subsidiaries and a game-clock merchant fleet.
   Fictional 1878 starting values. Each business has a separate treasury. */
(function(root){
'use strict';
const PRICE={steel:65000,rail:175000,schooner:14000,steamer:36000};
const PORTS={
 Baltimore:{distance:0,storm:.006,piracy:0,leads:['New York']},
 Philadelphia:{distance:4,storm:.01,piracy:0,leads:['New York']},
 'New York':{distance:7,storm:.015,piracy:0,leads:['Liverpool','Havana']},
 Liverpool:{distance:30,storm:.034,piracy:0,leads:['Hamburg']},
 Hamburg:{distance:36,storm:.035,piracy:0,leads:['Singapore']},
 Havana:{distance:17,storm:.048,piracy:.002,leads:['Liverpool']},
 Singapore:{distance:88,storm:.052,piracy:.029,leads:['Hong Kong']},
 'Hong Kong':{distance:101,storm:.05,piracy:.018,leads:[]}
};
const money=n=>'$'+(+n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const addDay=(date,n)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const ageDays=(a,b)=>Math.max(0,Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000));
function roll(key){let h=2166136261;for(const c of String(key)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0)/4294967296}
function fresh(){return{version:1,lastDate:null,
 steel:{owned:false,cash:0,rails:0,iron:0,condition:92,ledger:[]},
 rail:{owned:false,cash:0,miles:35,condition:86,ledger:[]},
 fleet:{cash:0,ships:[],ports:['Baltimore','Philadelphia'],leads:[],electric:{},nextId:0,ledger:[]},
 log:[]}}
function ensure(save){
 if(!save.industrialEmpire||save.industrialEmpire.version!==1)save.industrialEmpire=fresh();
 const e=save.industrialEmpire;
 for(const key of ['steel','rail'])if(!e[key]||!Array.isArray(e[key].ledger))e[key]=fresh()[key];
 if(!e.fleet||!Array.isArray(e.fleet.ships))e.fleet=fresh().fleet;
 if(!Array.isArray(e.fleet.ports))e.fleet.ports=['Baltimore','Philadelphia'];
 if(!Array.isArray(e.fleet.leads))e.fleet.leads=[];
 if(!e.fleet.electric)e.fleet.electric={};
 if(!Array.isArray(e.fleet.ledger))e.fleet.ledger=[];
 if(!Array.isArray(e.log))e.log=[];
 if(!e.lastDate&&/^\d{4}-\d{2}-\d{2}$/.test(save.gameDate||''))e.lastDate=save.gameDate;
 return e;
}
function event(e,date,message){e.log.unshift(date+' · '+message);e.log=e.log.slice(0,40)}
function ledger(account,date,label,amount){account.ledger.push({date,label,amount});if(account.ledger.length>128)account.ledger.shift()}
function result(reason){return{ok:!reason.startsWith('Unavailable:'),message:reason}}
function buy(save,kind){
 const e=ensure(save),subs=e[kind];if(!subs||!['steel','rail'].includes(kind))return result('Unavailable: unknown company.');
 if(save.characterRoute!=='industrialist'||save.paused)return result('Unavailable: proprietor must act in person while unpaused.');
 if(subs.owned)return result('Unavailable: this company is already owned.');
 const reserve=kind==='steel'?3500:10000,required=PRICE[kind]+reserve;
 if(save.personalCash<required)return result('Unavailable: acquisition requires '+money(required)+' personal cash, including working capital.');
 save.personalCash-=required;subs.owned=true;subs.cash=reserve;
 event(e,save.gameDate,(kind==='steel'?'Potomac Iron & Steel Works':'Capital Branch Railway')+' acquired for '+money(PRICE[kind])+'. Subsidiary operating treasury '+money(reserve)+'.');
 root.FE_SKILLS?.practice?.(save,'business-management',{amount:.65,difficulty:70,event:'acquire:'+kind,source:'Negotiating a subsidiary acquisition'});
 root.FE_SKILLS?.practice?.(save,'negotiation',{amount:.35,difficulty:65,event:'acquire:'+kind,source:'Purchase agreement'});
 return result('Acquisition complete. Each company keeps its own operating cash.');
}
function millAction(save,kind){
 const e=ensure(save),m=e.steel;
 if(!m.owned||save.paused||save.phase!=='day')return result('Unavailable: steelworks must be owned and operating.');
 if(!['rails','iron'].includes(kind))return result('Unavailable: unknown product.');
 const cost=kind==='rails'?235:160;if(m.cash<cost)return result('Unavailable: mill needs '+money(cost)+' for ore, coal and wages.');
 m.cash-=cost;m[kind]+=5;m.condition=Math.max(1,m.condition-1.5);
 ledger(m,save.gameDate,'Produce five tons of '+kind,-cost);event(e,save.gameDate,'Mill produced five tons of '+kind+'.');
 root.FE_SKILLS?.practice?.(save,'metallurgy',{amount:.28,difficulty:45,event:'mill:'+kind+':'+m.ledger.length,source:'Working the iron and steel mill'});
 root.FE_SKILLS?.practice?.(save,'manufacturing',{amount:.22,difficulty:45,event:'mill:'+kind+':'+m.ledger.length,source:'Rolling mill production'});
 return result('Produced five tons of '+kind+'.');
}
function merchantSale(save,kind){
 const e=ensure(save),m=e.steel;
 if(!m.owned||save.phase!=='day'||save.paused||m[kind]<5)return result('Unavailable: five tons of stock and an open business day required.');
 const amount=kind==='rails'?315:225;m[kind]-=5;m.cash+=amount;
 ledger(m,save.gameDate,'Merchant bought five tons of '+kind,amount);
 root.FE_SKILLS?.practice?.(save,'salesmanship',{amount:.26,difficulty:42,event:'sale:'+kind+':'+m.ledger.length,source:'Merchant steel sale'});
 return result('Merchant order delivered. Mill received '+money(amount)+'.');
}
function repairRails(save){
 const e=ensure(save),r=e.rail,m=e.steel;
 if(!r.owned||save.paused||save.phase!=='day')return result('Unavailable: railroad repair crew is not working.');
 const affiliated=m.owned&&m.rails>=5,price=affiliated?275:410;
 if(r.cash<price)return result('Unavailable: railroad requires '+money(price)+'.');
 r.cash-=price;r.condition=Math.min(100,r.condition+25);
 ledger(r,save.gameDate,'Track maintenance and rail replacements',-price);
 if(affiliated){m.rails-=5;m.cash+=price;ledger(m,save.gameDate,'Five tons rails sold to subsidiary railway',price)}
 event(e,save.gameDate,'Railroad repaired using '+(affiliated?'steelworks rails':'outside suppliers')+'.');
 root.FE_SKILLS?.practice?.(save,'railway-operations',{amount:.31,difficulty:53,event:'repair:'+r.ledger.length,source:'Railway repair authorization'});
 root.FE_SKILLS?.practice?.(save,'logistics',{amount:.2,difficulty:40,event:'repair:'+r.ledger.length,source:'Supply and track maintenance'});
 return result('Track restored to '+r.condition.toFixed(0)+'% condition.');
}
function buyShip(save,type){
 const e=ensure(save),f=e.fleet,price=PRICE[type],reserve=f.ships.length?0:2500;
 if(!['schooner','steamer'].includes(type)||save.characterRoute!=='industrialist'||save.paused)return result('Unavailable: vessel cannot be acquired.');
 if(save.personalCash<price+reserve)return result('Unavailable: vessel purchase requires '+money(price+reserve)+' personal cash.');
 save.personalCash-=price+reserve;f.cash+=reserve;
 const id=++f.nextId;
 f.ships.push({id,name:(type==='schooner'?'Schooner ':'Steamship ')+id,type,port:'Baltimore',condition:95,status:'in-port',trip:null,experience:0});
 event(e,save.gameDate,'Acquired '+type+' #'+id+' for '+money(price)+'; crew and home port assigned.');
 root.FE_SKILLS?.practice?.(save,'business-management',{amount:.31,difficulty:50,event:'ship-buy:'+id,source:'Merchant shipping acquisition'});
 return result('Vessel added to merchant fleet.');
}
function daysFor(a,b,type){return Math.max(3,Math.round(Math.abs(PORTS[a].distance-PORTS[b].distance)*(type==='steamer'?.85:1.12)))}
function availableFederalCargo(save){
 // 1878 Federal Electric manufactures actual telegraph keys and fittings,
 // not light bulbs; sell and transport only real finished warehouse goods.
 if(save.componentWorks?.warehouse){
  const p=Object.entries(save.componentWorks.warehouse).find(([,quantity])=>Number.isSafeInteger(quantity)&&quantity>=5);
  return p?{source:'componentWorks',productId:p[0],units:5}:null;
 }
 return (save.inventoryByGrade?.standard||0)>=100?{source:'legacyBulbs',productId:'standard',units:100}:null;
}
function dispatch(save,id,dest,cargo,insured){
 const e=ensure(save),f=e.fleet,ship=f.ships.find(v=>v.id===id);
 if(!ship||ship.status!=='in-port'||!f.ports.includes(dest)||dest===ship.port)return result('Unavailable: ship or established route not ready.');
 if(save.paused||save.phase==='report')return result('Unavailable: voyage cannot begin now.');
 if(!['freight','electric'].includes(cargo))return result('Unavailable: unknown cargo.');
 const charge=ship.type==='steamer'?210:110,insurance=insured?Math.ceil(PRICE[ship.type]*.0075):0;
 if(f.cash<charge+insurance)return result('Unavailable: fleet treasury needs '+money(charge+insurance)+' for fees, coal and insurance.');
 const consignment=cargo==='electric'?availableFederalCargo(save):null;
 if(cargo==='electric'&&(save.characterRoute!=='industrialist'||!consignment))
  return result('Unavailable: Federal Electric must have five real 1878 finished components, or 100 later-era standard goods, in its warehouse.');
 if(consignment){
  if(consignment.source==='componentWorks')save.componentWorks.warehouse[consignment.productId]-=consignment.units;
  else save.inventoryByGrade.standard-=consignment.units;
 }
 f.cash-=charge+insurance;ledger(f,save.gameDate,'Departure, port fees'+(insured?', hull insurance':''),-charge-insurance);
 const from=ship.port,days=daysFor(from,dest,ship.type);ship.status='at-sea';
 ship.trip={from,to:dest,cargo,depart:save.gameDate,eta:addDay(save.gameDate,days),insured,fee:cargo==='freight'?(ship.type==='steamer'?840:400):0,consignment};
 event(e,save.gameDate,ship.name+' departed '+from+' for '+dest+' with '+(cargo==='electric'?consignment.units+' '+consignment.productId+' goods':'merchant freight')+'. ETA '+ship.trip.eta+'.');
 root.FE_SKILLS?.practice?.(save,'logistics',{amount:.28,difficulty:51,event:'dispatch:'+ship.id+':'+ship.trip.depart+':'+dest,source:'Scheduling cargo shipment'});
 root.FE_SKILLS?.practice?.(save,'cargo-handling',{amount:.17,difficulty:43,event:'dispatch:'+ship.id+':'+ship.trip.depart+':'+dest,source:'Cargo manifest review'});
 return result('Voyage begun. Expected '+ship.trip.eta+'.');
}
function repairShip(save,id){
 const e=ensure(save),f=e.fleet,ship=f.ships.find(v=>v.id===id);
 if(!ship||ship.status!=='in-port'||save.paused||save.phase!=='day')return result('Unavailable: repairs require a ship in port and an open workday.');
 const price=Math.ceil((100-ship.condition)*(ship.type==='steamer'?38:24)+60);
 if(f.cash<price)return result('Unavailable: shipyard needs '+money(price)+' fleet cash.');
 f.cash-=price;ship.condition=100;ledger(f,save.gameDate,'Shipyard repair '+ship.name,-price);
 root.FE_SKILLS?.practice?.(save,'ship-repair',{amount:.32,difficulty:56,event:'repair-ship:'+ship.id+':'+f.ledger.length,source:'Shipyard repairs'});
 return result(ship.name+' repaired to 100% condition.');
}
function verifyLead(save,name){
 const e=ensure(save),f=e.fleet,idx=f.leads.findIndex(x=>x.port===name);
 if(idx<0||f.ports.includes(name)||!PORTS[name]||save.paused||save.phase==='report')return result('Unavailable: port verification needs a valid unverified merchant lead.');
 if(f.cash<35)return result('Unavailable: port agent requires $35.00.');
 f.cash-=35;f.ports.push(name);f.leads.splice(idx,1);ledger(f,save.gameDate,'Port agent verification: '+name,-35);
 event(e,save.gameDate,'Commercial agent verified trade access in '+name+'.');
 root.FE_SKILLS?.practice?.(save,'navigation',{amount:.2,difficulty:48,event:'verify:'+name,source:'New maritime route charts'});
 root.FE_SKILLS?.practice?.(save,'negotiation',{amount:.28,difficulty:55,event:'verify:'+name,source:'Establishing overseas commercial contact'});
 return result('New trade route established: '+name+'.');
}
function sellElectric(save,port){
 const e=ensure(save),f=e.fleet,stock=f.electric[port];
 if(!Array.isArray(stock)||!stock.length||save.paused||save.phase!=='day')return result('Unavailable: no delivered components or commercial offices are closed.');
 const cargo=stock[0];
 const price=cargo.source==='componentWorks'?root.FE_COMPONENT_WORKS?.PRODUCTS?.[cargo.productId]?.unitPriceCents||0:15;
 if(price<=0)return result('Unavailable: consignee has no valid product quotation.');
 const cents=cargo.source==='componentWorks'?Math.round(cargo.units*price*.8):Math.round(15*100);
 if(cargo.source==='componentWorks'){
  if(!save.componentWorks)return result('Unavailable: component works books unavailable.');
  save.componentWorks.cashCents+=cents;
  save.componentWorks.ledger.push({kind:'export-consignment',date:save.gameDate,productId:cargo.productId,units:cargo.units,revenueCents:cents});
 }else save.companyCash+=cents/100;
 stock.shift();
 event(e,save.gameDate,'Consignee in '+port+' paid Federal Electric '+money(cents/100)+' for '+cargo.units+' '+cargo.productId+' goods, credited to its own company books.');
 root.FE_SKILLS?.practice?.(save,'salesmanship',{amount:.25,difficulty:46,event:'export-sale:'+port+':'+save.gameDate,source:'Overseas Federal Electric sale'});
 return result(cargo.units+' '+cargo.productId+' goods sold at '+port+' for '+money(cents/100)+'.');
}
function arrive(e,ship,date){
 const v=ship.trip;if(!v)return;const key=ship.id+'|'+v.depart+'|'+v.to+'|'+v.cargo;
 const weather=PORTS[v.to],risk=weather.storm*(1+(100-ship.condition)/65)*(v.to==='Havana'&&+date.slice(5,7)>=6&&+date.slice(5,7)<=11?2:1);
 const piracy=weather.piracy,draw=roll(key+'|risk');
 if(draw<risk*.17+piracy*.22){
  const cause=draw<risk*.17?'storm':'piracy',insure=v.insured?Math.round(PRICE[ship.type]*.72):0;
  ship.status='lost';ship.trip=null;if(insure){e.fleet.cash+=insure;ledger(e.fleet,date,'Hull insurance settlement for '+ship.name,insure)}
  event(e,date,ship.name+' was lost at sea due to '+cause+'. '+(insure?'Hull insurance paid '+money(insure)+'.':'No hull insurance payment.'));
  return;
 }
 const damage=draw<risk+piracy?Math.round(8+roll(key+'|damage')*37):Math.round(1+roll(key+'|wear')*4);
 ship.condition=Math.max(7,ship.condition-damage);ship.port=v.to;ship.status='in-port';ship.trip=null;ship.experience++;
 if(v.cargo==='freight'){e.fleet.cash+=v.fee;ledger(e.fleet,date,'Completed merchant freight: '+v.to,v.fee)}
 else {if(!Array.isArray(e.fleet.electric[v.to]))e.fleet.electric[v.to]=[];e.fleet.electric[v.to].push(v.consignment)}
 event(e,date,ship.name+' arrived in '+v.to+'; '+(v.cargo==='freight'?'freight fee '+money(v.fee):'Federal Electric goods await consignee')+'. Hull '+ship.condition+'%.');
 const candidates=weather.leads.filter(p=>!e.fleet.ports.includes(p)&&!e.fleet.leads.some(x=>x.port===p));
 if(candidates.length&&roll(key+'|contact')<Math.min(.72,.38+ship.experience*.04)){
  const port=candidates[Math.floor(roll(key+'|lead')*candidates.length)];
  e.fleet.leads.push({port,captain:ship.name,from:v.to});
  event(e,date,ship.name+' met a traveler in '+v.to+' who reported demand in '+port+'. Verify the lead with a port agent.');
 }
}
function advance(save){
 const e=ensure(save),date=save.gameDate;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return e;
 if(!e.lastDate){e.lastDate=date;return e}
 const days=Math.min(3650,ageDays(e.lastDate,date));
 for(let i=1;i<=days;i++){
  const day=addDay(e.lastDate,i);
  if(e.rail.owned){
   const r=e.rail,earn=r.condition>=35?Math.round(55+r.miles*.72):Math.round(18+r.miles*.28),upkeep=Math.round(39+r.miles*.59);
   r.cash+=earn-upkeep;r.condition=Math.max(0,r.condition-.22);
   ledger(r,day,'Passenger and third-party freight receipts',earn);ledger(r,day,'Crews, coal, locomotives and track upkeep',-upkeep);
  }
  if(e.steel.owned){e.steel.cash-=8;ledger(e.steel,day,'Mill premises and plant upkeep',-8)}
  for(const s of e.fleet.ships){
   if(s.status==='lost')continue;
   const daily=s.type==='steamer'?(s.status==='at-sea'?20:7):(s.status==='at-sea'?9:4);
   e.fleet.cash-=daily;ledger(e.fleet,day,s.name+' wages, stores and upkeep',-daily);
   if(s.status==='in-port')s.condition=Math.max(6,s.condition-.035);
   if(s.status==='at-sea'&&s.trip?.eta<=day)arrive(e,s,day);
  }
 }
 e.lastDate=date;
 return e;
}
function ownedLocation(save,id){return id==='factory'&&save.characterRoute==='industrialist'||!!save.ownedLocationIds?.includes?.(id)}
function render(save,onChange){
 const host=document.getElementById('industrialEmpirePanel');if(!host)return;
 if(save.characterRoute!=='industrialist'){host.hidden=true;return}
 host.hidden=false;const e=advance(save),m=e.steel,r=e.rail,f=e.fleet;
 const button=(key,label)=>'<button type="button" data-empire-action="'+esc(key)+'">'+label+'</button>';
 let html='<h3>Industrial Holdings & Merchant Fleet</h3><p class="fine">1878-era fictional acquisition opportunities. Subsidiaries maintain separate books. Purchases need substantial personal capital.</p><div class="empire-grid"><article><h4>Potomac Iron & Steel Works</h4>';
 html+=!m.owned?'<p>Rolling mill: '+money(PRICE.steel)+' plus $3,500 working capital.</p>'+button('buy-steel','Acquire Works'):'<p>Cash '+money(m.cash)+' · Rail stock '+m.rails+' tons · Iron stock '+m.iron+' tons · Plant '+m.condition.toFixed(0)+'%</p>'+button('make-rails','Roll Five Tons of Rails')+button('make-iron','Produce Five Tons of Iron')+button('sell-rails','Sell Five Tons of Rails')+button('sell-iron','Sell Five Tons of Iron');
 html+='</article><article><h4>Capital Branch Railway</h4>';
 html+=!r.owned?'<p>Thirty-five-mile short line: '+money(PRICE.rail)+' plus $10,000 reserve.</p>'+button('buy-rail','Acquire Railroad'):'<p>Cash '+money(r.cash)+' · '+r.miles+' track miles · Condition '+r.condition.toFixed(0)+'%</p><p>Passenger and freight receipts balanced against wages, coal, rolling stock and repairs.</p>'+button('repair-track','Repair Railway');
 html+='</article></div><h4>Merchant Fleet</h4><p>Fleet treasury '+money(f.cash)+' · '+f.ships.filter(x=>x.status!=='lost').length+' active ships · Established ports: '+f.ports.map(esc).join(', ')+'</p>';
 html+=button('buy-schooner','Buy Schooner · '+money(PRICE.schooner))+button('buy-steamer','Buy Steamship · '+money(PRICE.steamer));
 for(const lead of f.leads)html+='<p class="empire-lead">Captain '+esc(lead.captain)+' learned of '+esc(lead.port)+' while in '+esc(lead.from)+'. '+button('verify:'+lead.port,'Verify port · $35')+'</p>';
 for(const ship of f.ships){
  html+='<article class="empire-ship"><strong>'+esc(ship.name)+'</strong> · '+esc(ship.status==='lost'?'LOST AT SEA':ship.status==='at-sea'?'AT SEA':'IN PORT')+' · Hull '+ship.condition.toFixed(0)+'% · '+esc(ship.status==='at-sea'?ship.trip.from+' → '+ship.trip.to+' · due '+ship.trip.eta:ship.port);
  if(ship.status==='in-port'){
   html+='<div class="empire-voyage"><label>Destination <select data-ship-port="'+ship.id+'">'+f.ports.filter(x=>x!==ship.port).map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('')+'</select></label><label>Cargo <select data-ship-cargo="'+ship.id+'"><option value="freight">Merchant Freight</option><option value="electric">Federal Electric finished components (real inventory)</option></select></label><label><input type="checkbox" data-ship-insure="'+ship.id+'"> Hull insurance</label>'+button('dispatch:'+ship.id,'Dispatch Ship')+button('repair-ship:'+ship.id,'Shipyard Repair')+'</div>';
  }
  html+='</article>';
 }
 for(const [port,goods]of Object.entries(f.electric))if(Array.isArray(goods)&&goods.length)html+='<p>Consigned Federal Electric goods in '+esc(port)+': '+goods.map(g=>g.units+' '+g.productId).join(', ')+'. '+button('sell-electric:'+port,'Complete local sale')+'</p>';
 html+='<h4>Captain & Superintendent Reports</h4><div class="empire-log">'+e.log.map(x=>'<p>'+esc(x)+'</p>').join('')+'</div><p class="fine">Voyages follow the in-game calendar. Ships incur crew and hull upkeep, sometimes require repairs, may suffer storm loss or piracy on historically exposed routes, and occasionally uncover commercial leads. Losses are not reversed automatically.</p>';
 host.innerHTML=html;
 host.onclick=event=>{
  const target=event.target.closest('[data-empire-action]');if(!target)return;
  const key=target.dataset.empireAction;
  let outcome;
  if(key==='buy-steel')outcome=buy(save,'steel');
  else if(key==='buy-rail')outcome=buy(save,'rail');
  else if(key==='make-rails')outcome=millAction(save,'rails');
  else if(key==='make-iron')outcome=millAction(save,'iron');
  else if(key==='sell-rails')outcome=merchantSale(save,'rails');
  else if(key==='sell-iron')outcome=merchantSale(save,'iron');
  else if(key==='repair-track')outcome=repairRails(save);
  else if(key==='buy-schooner')outcome=buyShip(save,'schooner');
  else if(key==='buy-steamer')outcome=buyShip(save,'steamer');
  else if(key.startsWith('verify:'))outcome=verifyLead(save,key.slice(7));
  else if(key.startsWith('sell-electric:'))outcome=sellElectric(save,key.slice(14));
  else if(key.startsWith('repair-ship:'))outcome=repairShip(save,Number(key.slice(12)));
  else if(key.startsWith('dispatch:')){
   const id=Number(key.slice(9));
   outcome=dispatch(save,id,host.querySelector('[data-ship-port="'+id+'"]')?.value,host.querySelector('[data-ship-cargo="'+id+'"]')?.value,!!host.querySelector('[data-ship-insure="'+id+'"]')?.checked);
  }
  if(!outcome)return;
  const status=document.getElementById('notice');if(status)status.textContent=outcome.message;
  if(outcome.ok){onChange();render(save,onChange)}
 };
}
const api=Object.freeze({PRICE,PORTS,ensure,advance,buy,millAction,merchantSale,repairRails,buyShip,dispatch,repairShip,verifyLead,sellElectric,ownedLocation,render,dayFor:daysFor});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_EMPIRE=api;
})(typeof window!=='undefined'?window:globalThis);
