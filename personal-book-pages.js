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
 const findings=Array.isArray(save.incidentObservations?.records)?save.incidentObservations.records:[];
 if(findings.length)pages.push(page('asylum-observations','Asylum Inquiry','Personally Observed Events',
  'Sources acquired by Edmund in authorized rooms',
  ['Rumors and suspicions do not become established case facts merely by writing them down.'],
  findings.filter(e=>e?.eventId?.startsWith('asylum:')).map(e=>
   item(e.at+' · '+e.source+(e.locationId?' · '+e.locationId+(e.roomId?'/'+e.roomId:''):''),
    e.description))));
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
 pages.push({id:'notes',section:'Private Writing',title:'My Own Words',
  kicker:'Handwritten notes · saved only with this playable life',
  paragraphs:['These words belong to the player. They do not become NPC evidence, a police report, or a completed mission.'],
  items:[],editable:true,note:txt(save.personalBookNotes||'',4000)});
 return pages;
}
const api=Object.freeze({buildPages,DATA});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PERSONAL_BOOK_PAGES=api;
})(typeof window!=='undefined'?window:globalThis);
