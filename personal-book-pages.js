/* Capital & Consequence: four private books, one presentation system.
 * Each book contains only its current character's observable saved history.
 * Personal annotations are not a physical item, NPC knowledge or evidence.
 */
(function(root){
'use strict';
const txt=(v,max=600)=>String(v??'').slice(0,max);
const ROWS=72;
const DATA=Object.freeze({
 industrialist:Object.freeze({title:'BUSINESS LEDGER',owner:'CHARLES WHITCOMB',
  subtitle:'Federal Electric · Washington',section:'Company Records',
  about:'Widowed proprietor of Federal Electric. Business dealings and the private account of his life are recorded separately.'}),
 investigator:Object.freeze({title:'CASEBOOK',owner:'SAMUEL HARLAN',
  subtitle:'Metropolitan Police · Washington',section:'Duty Records',
  about:'Married patrolman. Home in Hillsdale / Barry Farm, where he walks his assigned beat.'}),
 criminal:Object.freeze({title:'PERSONAL JOURNAL',owner:'ELIAS CROWE',
  subtitle:'Private papers · Washington',section:'Private Recollections',
  about:'Unmarried nightclub doorman. Personal ties are his own affairs, and only observed actions enter the record.'}),
 wardman:Object.freeze({title:'DUTY JOURNAL',owner:'EDMUND WARDMAN',
  subtitle:'District Asylum · Washington',section:'Ward Records',
  about:'Unmarried orderly, estranged from his powerful family. His position grants no authority over patients or their private records.'})
});
function item(heading,text){return {heading:txt(heading,130),text:txt(text,850)}}
function page(id,section,title,kicker,paragraphs=[],items=[]){
 return {id,section,title,kicker,paragraphs,items};
}
function cover(save,def){
 return page('cover',def.section,def.title,def.subtitle,
  [def.owner,def.about,'PERSONAL RECORD · NOT FOR NPC ACCESS'],
  [item('Current date',txt(save.gameDate||'Undated',40))]);
}
function fromNotes(save,max=ROWS){
 const notes=Array.isArray(save.notes)?save.notes:[];
 return notes.slice(-max).reverse().filter(n=>n&&typeof n==='object')
 .map((n,i)=>page('history:'+i,'Recorded History',txt(n.source||'Recorded event',140),
  txt(n.date||'Undated',35),[txt(n.text||'No details preserved.',850)]));
}
function industrialistPages(save){
 const ledger=Array.isArray(save.ledger)?save.ledger:[];
 const trades=Array.isArray(save.transactions)?save.transactions:[];
 const pages=[
  page('accounts','Company Accounts','Current Accounts',txt(save.gameDate,35),
   ['Current amounts in the active company save, not an audited balance sheet.'],[
    item('Company cash',money(save.companyCash)),
    item('Personal cash',money(save.personalCash)),
    item('Debt',money(save.debt)),
    item('Employees',Number.isFinite(save.workers)?String(save.workers):'Not recorded')
   ])
 ];
 if(ledger.length)pages.push(page('ledger','Company Accounts','Ledger Entries','Recent saved business records',
  [],ledger.slice(-ROWS).reverse().map((entry,i)=>item('Entry '+(ledger.length-i),
    typeof entry==='string'?entry:JSON.stringify(entry).slice(0,850)))));
 if(trades.length)pages.push(page('trades','Investments','Transactions','Recorded market activity',[],
  trades.slice(-ROWS).reverse().map((entry,i)=>item('Transaction '+(trades.length-i),
   typeof entry==='string'?entry:JSON.stringify(entry).slice(0,850)))));
 const shop=save.componentWorks;
 if(shop?.version===1){
  const jobs=Array.isArray(shop.orders)?shop.orders:[];
  pages.push(page('actual-factory-orders','Factory Records','Manufacturing Obligations',
   'Real accepted work · not hypothetical finished goods',
   ['An accepted contract is not inventory, income or evidence of a successful delivery.'],
   jobs.slice(-ROWS).reverse().map(o=>item(o.id+' · '+txt(o.customer,65),
    (o.productId||'Unrecorded product')+' · '+(o.made||0)+' made / '+o.quantity+
    ' ordered · '+(o.delivered||0)+' delivered · deadline '+o.deadline))));
  const journal=Array.isArray(shop.ledger)?shop.ledger:[];
  if(journal.length)pages.push(page('actual-factory-receipts','Factory Records','Workshop Receipts',
   'Receipts from existing material, manufacturing and shipment engines',[],
   journal.slice(-ROWS).reverse().map(e=>item(e.date+' · '+(e.kind||'workshop'),
    'Token '+txt(e.token,90)+' · '+txt(e.orderId||e.productId||'',90)+
    (e.goodUnits!==undefined?' · '+e.goodUnits+' passed / '+(e.rejectedUnits||0)+' scrapped':'')+
    (Number.isFinite(e.costCents)?' · cost '+money(e.costCents/100):'')+
    (Number.isFinite(e.revenueCents)?' · paid '+money(e.revenueCents/100):'')))));
  const staff=shop.factoryCapacity;
  if(staff?.version===1)pages.push(page('factory-capacity-record','Factory Records','Staff & Machinery',
   'Existing specialist commitments, not a free automatic production promise',[],[
    item('Bench technician',(staff.staff?.bench?.count||0)+' hired · '+(staff.machines?.bench||1)+
     ' workstation(s) · '+(staff.staff?.bench?.trained?'trained':'not trained')),
    item('Winding specialist',(staff.staff?.winder?.count||0)+' hired · '+(staff.machines?.winder||1)+
     ' winding machine(s) · '+(staff.staff?.winder?.trained?'trained':'not trained')),
    item('Specialist wage arrears',money((staff.payroll?.owedCents||0)/100))
   ]));
  const contract=save.electricCampaign;
  if(contract?.version===1)pages.push(page('municipal-electric-register','Factory Contracts',
   'Streetlighting & Fair Supply','Actual contract status and verified deliveries only',[],[
    item('District streetlighting',(contract.street?.status||'not bid')+
      ' · '+(contract.street?.shipped||0)+' sites shipped · '+
      (contract.street?.certified||0)+' accepted by District'),
    item('World’s Fair electrical supply',(contract.fair?.status||'not bid')+
      ' · '+(contract.fair?.shipped||0)+' bulbs shipped'),
    item('Experimental lamp work',(contract.lamps?.stage||0)+' recorded research stages · '+
      (shop.lampDevelopment?.good||0)+' sound bulbs · '+(shop.lampDevelopment?.rejected||0)+' scrapped')
   ]));
 }
 return pages;
}
function money(value){return Number.isFinite(value)?'$'+value.toFixed(2):'Not recorded'}
function criminalPages(save){
 const d=save.doormanDuty||{};
 const logs=Array.isArray(d.logs)?d.logs:[];
 const pages=[page('occupation','Work Records','Nightclub Door',txt(save.gameDate,35),
  ['Only completed contacts recorded at the club appear below. They are not proof of crimes.'],[
   item('Completed shifts',Number.isSafeInteger(d.totalSegments)?String(d.totalSegments):'0'),
   item('Wages received',Number.isSafeInteger(d.wagesEarnedCents)?money(d.wagesEarnedCents/100):'Not recorded')
  ])];
 if(logs.length)pages.push(page('door-entries','Work Records','Visitors & Incidents',
  'Actual recorded shifts',[],logs.slice(-ROWS).reverse().map(e=>item(
   txt(e?.date||e?.id||'Door entry',100),
   txt(e?.result||e?.description||'No details entered.',700)))));
 const plot=root.FE_PEACOCK_STORY?.summary?.(save);
 if(plot?.events.length)pages.push(page('peacock-favor','Main Story','A Favor with a Price',
  'Eli witnessed these events at the club door',
  ['No one knows the sealed contents. A private book is not a police report.'],
  plot.events.map(e=>item(e.date+' · '+e.source,e.description))));
 const network=root.FE_PEACOCK_NETWORK?.summary?.(save);
 if(network?.events.length)pages.push(page('peacock-network','Main Story','The Keeper of Secrets',
  'Eli personally witnessed these encounters, not an official police record',[],
  network.events.map(e=>item(e.date+' · '+e.source,e.text))));
 const debts=root.FE_PEACOCK_DEBTS?.summary?.(save);
 if(debts?.events.length)pages.push(page('peacock-debts','Main Story','Debts Come Due',
  'Only transactions and conversations Eli directly experienced',
  ['Eli’s personal record does not accuse or arrest anyone.'],
  debts.events.map(e=>item(e.date+' · '+e.source,e.text))));
 const door=save.peacockDoorRegister;
 if(door?.version===1){
  const parcels=Object.values(door.parcels||{});
  if(parcels.length)pages.push(page('door-custody','Work Records','Entrance Parcels',
   'Only items physically accepted during a completed door contact',
   ['Unknown wrapped contents are not personal possessions or proof of a crime.'],
   parcels.slice(-ROWS).reverse().map(p=>item(p.id+' · '+p.date,
    p.description+' · '+p.status+' · '+(p.chain?.length||0)+' recorded custody stages.'))));
  const reports=Object.values(door.shiftReports||{});
  if(reports.length)pages.push(page('door-shift-reports','Work Records','Nightly Floor Reports',
   'Submitted records, not an assumption of owner trust or promotion',[],
   reports.slice(-ROWS).reverse().map(r=>item(r.date+' · '+r.contacts+' paid contacts',
    r.status+' · '+r.requestsForManager+' floor-manager referrals · '+r.tenseContacts+
    ' tense contacts · '+r.untransferredParcels.length+' deliveries pending at filing.'))));
 }
 pages.push(page('plans','Private Recollections','Plans & Recollections','Personally written',
  ['The player can write about targets, rivals, romances or exploits. The game will not pretend that a plan was carried out.']));
 return pages;
}
function wardmanPages(save){
 const d=save.orderlyDuty||{};
 const logs=Array.isArray(d.logs)?d.logs:[];
 const pages=[page('ward','Asylum Duty','Ward & Station Register',txt(save.gameDate,35),
  ['Private duty notes may record unusual incidents, but do not reveal confidential patient histories.'],[
   item('Completed assignments',Number.isSafeInteger(d.totalAssignments)?String(d.totalAssignments):'0'),
   item('Wages received',Number.isSafeInteger(d.wagesEarnedCents)?money(d.wagesEarnedCents/100):'Not recorded')
  ])];
 if(logs.length)pages.push(page('rounds','Asylum Duty','Filed Ward Work','Recorded duties',[],
  logs.slice(-ROWS).reverse().map(e=>item(txt(e?.date||e?.id||'Ward entry',100),
   txt(e?.result||e?.description||'No details entered.',700)))));
 const register=save.wardServiceRegister;
 if(register?.version===1){
  const requests=Object.values(register.requests||{});
  if(requests.length)pages.push(page('asylum-supply-requests','Asylum Duty','Outstanding Supply Reports',
   'Only filed shortage requests and their own recorded administrative steps',
   ['A request or escalation is not proof that supplies arrived or that a director approved it.'],
   requests.slice(-ROWS).reverse().map(r=>item(r.id+' · '+r.created,
    r.description+' · '+r.status+' · '+(r.events?.length||0)+' documented steps · '+
    (r.received?'receipt recorded':'no supplies received')))));
  const handovers=Object.values(register.handover||{});
  if(handovers.length)pages.push(page('asylum-daily-handover','Asylum Duty','Ward Shift Handovers',
   'Actual completed rounds passed to supervisory channels',[],
   handovers.slice(-ROWS).reverse().map(h=>item(h.date+' · '+h.services.length+' filed rounds',
    h.status+' · '+h.supplyRequests.length+' shortage requests · '+
    (h.managerDecision||'no manager decision on file')))));
 }
 const findings=Array.isArray(save.incidentObservations?.records)?save.incidentObservations.records:[];
 if(findings.length)pages.push(page('asylum-observations','Asylum Inquiry','Personally Observed Events',
  'Sources acquired by Edmund in authorized rooms',
  ['Rumors and suspicions do not become established case facts merely by writing them down.'],
  findings.filter(e=>e?.eventId?.startsWith('asylum:')).map(e=>
   item(e.at+' · '+e.source+(e.locationId?' · '+e.locationId+(e.roomId?'/'+e.roomId:''):''),
    e.description))));
 const trustPolice=root.FE_WARDMAN_ESTATE_POLICE?.summary?.(save);
 if(trustPolice?.received)pages.push(page('wardman-trust-certificate','Family Papers',
  'Certified Civil Trust Comparison','Personally received public police abstract',
  ['Financial interest is not proof of a murder or a medical diagnosis.']));
 const escape=root.FE_WARDMAN_ESCAPE?.summary?.(save);
 if(escape?.events.length)pages.push(page('wardman-escape','Personal Matters',
  'Custody, Escape and Return','Edmund’s own recorded actions, never a legal pardon',
  [escape.absconder?'Custody papers remain outstanding; Edmund has not been discharged.':
   'The recorded outcome is separate from the family petition ruling.'],
  escape.events.map(e=>item(e.date+' · '+e.source,e.text))));
 const estate=root.FE_WARDMAN_INHERITANCE?.summary?.(save);
 if(estate?.records.length)pages.push(page('wardman-estate','Family Papers','The Wardman Settlement',
  'Personally received family documents, not a murder verdict',
  ['A financial interest is a possible motive, not a determination of guilt.'],
  estate.records.map(e=>item(e.date+' · '+e.source,e.text))));
 const standing=save.wardmanStanding?.version===1?save.wardmanStanding:null;
 pages.push(page('family','Personal Matters','Family & Standing',txt(save.gameDate,35),
  ['Family estrangement is part of Edmund’s established background. Any actual attempt to have him confined must arise from a recorded story event, not automatic family omniscience.'],
  standing?[item('Workplace trust',String(standing.workplaceTrust)),
    item('Family pressure',String(standing.familyPressure)),
    item('Documented institutional concerns',String(standing.documentedConcerns?.length||0))]:[]));
 return pages;
}
function buildPages(save,{publicFile}={}){
 if(!save||!Object.hasOwn(DATA,save.characterRoute))return [];
 const def=DATA[save.characterRoute];
 let pages=[cover(save,def)];
 pages.push(...(root.FE_MAIN_STORIES?.pages?.(save)||[]));
 if(save.characterRoute==='investigator'){
  const police=root.FE_CASEBOOK_PAGES?.buildPages?.(save,{publicFile})||[];
  pages=pages.concat(police.filter(p=>p.id!=='cover'&&p.id!=='notes'));
 }else if(save.characterRoute==='industrialist')pages.push(...industrialistPages(save));
 else if(save.characterRoute==='criminal')pages.push(...criminalPages(save));
 else pages.push(...wardmanPages(save));
 pages.push(...(root.FE_MISSIONS?.pages?.(save)||[]));
 pages.push(...(root.FE_LIFE_HISTORY?.pages?.(save)||[]));
 pages.push(...fromNotes(save));
 // Preserve older single-field notes without silently overwriting them.
 // Each new entry occupies a permanent dated page in this *character's* book.
 const legacy=txt(save.personalBookNotes||'',4000);
 if(legacy.trim())pages.push(page('private-legacy','Private Writing','Earlier Private Notes',
  'Retained from the original single-page notebook',
  [legacy]));
 const written=Array.isArray(save.personalBookEntries)?save.personalBookEntries:[];
 written.filter(entry=>entry&&typeof entry.text==='string'&&entry.text.trim())
  .forEach((entry,i)=>{
   const date=txt(entry.date||'Undated',40);
   pages.push(page('private-entry:'+(entry.id||i),'Private Writing',
    'My Own Words · Entry '+(i+1),date,[txt(entry.text,4000)]));
  });
 pages.push({id:'notes',section:'Private Writing',title:'Write a New Entry',
  kicker:'New private page · saved only with this playable life',
  paragraphs:['Write, then choose Save Entry. The completed entry becomes a dated page you can return to. Private writing does not become NPC evidence or an official report.'],
  items:[],editable:true,note:''});
 return pages;
}
const api=Object.freeze({buildPages,DATA});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PERSONAL_BOOK_PAGES=api;
})(typeof window!=='undefined'?window:globalThis);
