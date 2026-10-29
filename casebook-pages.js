/* Capital & Consequence: public pages for Sam Harlan's physical casebook.
 * Read only evidence the active police profile has actually recorded.
 * Never call detectiveCases.ensure() or expose a murder file's hidden truth.
 */
(function(root){
'use strict';
const MAX_REPORTS=60;
const text=(value,max=500)=>String(value??'').slice(0,max);
function incidentPage(entry,kind){
 const title=kind==='pending'?'Outstanding Patrol Incident':'Filed Patrol Report';
 const status=text(entry?.status||'unrecorded',55).replace(/-/g,' ');
 const id=text(entry?.id||'Unnumbered',42);
 return {id:'patrol:'+kind+':'+id,section:'Patrol Records',title,
  kicker:id+' · '+text(entry?.date||'Undated',32),
  paragraphs:[text(entry?.description||'No original description was recorded.',720)],
  items:[
   {heading:'Standing',text:status},
   {heading:'Location',text:entry?.locationId==='hillsdale'?'Hillsdale / Barry Farm':text(entry?.locationId||'Unrecorded',80)},
   {heading:'Disposition',text:text(entry?.reportText||entry?.disposition||'No disposition filed.',700)}
  ]};
}
function publicCasePages(raw,publicFile){
 if(typeof publicFile!=='function')return [];
 let file=null;
 try{file=publicFile(raw)}catch(error){return []}
 if(!file||typeof file.id!=='string')return [];
 const key='case:'+text(file.id,70);
 const result=[{id:key+':summary',section:'Case Files',title:text(file.title,150),
  kicker:text(file.date,40)+' · '+text(file.status,50),
  paragraphs:[text(file.summary,1200)],
  items:[
   {heading:'Scene',text:text(file.placeName||'Not recorded',150)},
   {heading:'Victim',text:text(file.victimName||'Unknown',100)},
   {heading:'Case standing',text:text(file.status||'Unrecorded',55)}
  ]}];
 result.push({id:key+':evidence',section:'Case Files',title:'Evidence Register',
  kicker:text(file.title,120),paragraphs:[],
  items:Array.isArray(file.evidence)&&file.evidence.length?
   file.evidence.slice(0,24).map(e=>({
    heading:text(e.thread||'Item',60)+' · '+text(e.source||'Unknown source',130),
    text:text(e.text,850)})):
   [{heading:'No collected exhibits',text:'No evidence has been entered into this case file.'}]});
 result.push({id:key+':statements',section:'Case Files',title:'Persons & Statements',
  kicker:text(file.title,120),paragraphs:[],
  items:Array.isArray(file.suspects)&&file.suspects.length?
   file.suspects.slice(0,18).map(p=>({
    heading:text(p.name||'Unnamed person',100)+' · '+text(p.occupation||'Unknown occupation',110),
    text:p.statement?text(p.statement,850):'No statement has been recorded.'})):
   [{heading:'No interviewed persons',text:'No persons have been entered into this file.'}]});
 return result;
}
function buildPages(save,{publicFile}={}){
 if(!save||save.characterRoute!=='investigator')return [];
 const pending=save.patrolDuty?.pending;
 const logs=Array.isArray(save.patrolDuty?.logs)?save.patrolDuty.logs:[];
 const cases=Array.isArray(save.detectiveCases?.cases)?save.detectiveCases.cases:[];
 const pages=[
  {id:'cover',section:'Metropolitan Police',title:'SAMUEL HARLAN',
   kicker:'PRIVATE DUTY & CASEBOOK · WASHINGTON, D.C.',
   paragraphs:['Patrol observations, filed reports, case evidence and personal annotations.',
    'Records belong to this life. Unreported suspicions are not established evidence.'],
   items:[]},
  {id:'register',section:'Duty Register',title:'Current Duties',
   kicker:text(save.gameDate||'Undated',35),
   paragraphs:[pending?
    'A patrol incident awaits further action.':'No unresolved patrol incident is currently entered.',
    cases.length?cases.length+' recorded homicide case file(s).':
     'No detective cases are assigned to this officer.'],
   items:[
    {heading:'Assigned beat',text:'Hillsdale / Barry Farm'},
    {heading:'Station reports filed',text:String(logs.filter(l=>l?.status==='filed').length)},
    {heading:'Duty status',text:save.patrolDuty?.onDuty?'On duty':'Off duty'}
   ]}
 ];
 if(pending&&typeof pending==='object')pages.push(incidentPage(pending,'pending'));
 for(const entry of logs.slice(-MAX_REPORTS).reverse())if(entry&&typeof entry==='object')
  pages.push(incidentPage(entry,'filed'));
 for(const raw of cases.slice(-8))pages.push(...publicCasePages(raw,publicFile));
 const asylumEvidence=Array.isArray(save.incidentObservations?.records)?
  save.incidentObservations.records.filter(e=>e&&typeof e.eventId==='string'&&e.eventId.startsWith('asylum:')):[];
 if(asylumEvidence.length)pages.push({id:'asylum-inquiry',section:'Case Files',
  title:'District Asylum · Preliminary Inquiry',
  kicker:'Sources actually received or witnessed by Samuel Harlan',
  paragraphs:['These are preliminary notes only. No homicide warrant, detective rank or proven culprit is implied.'],
  items:asylumEvidence.map(e=>({
   heading:text(e.at||'Undated',40)+' · '+text(e.source||'Source unrecorded',100),
   text:text(e.description||'No statement retained',850)
  }))});
 const medical=Array.isArray(save.morgueExaminations)?save.morgueExaminations:[];
 pages.push({id:'postmortem',section:'Medical Records',title:'Postmortem Reports',
  kicker:'Records lawfully provided to this officer',
  paragraphs:medical.length?[]:['No morgue examination reports have been entered into this casebook.'],
  items:medical.slice(-20).map(record=>({
   heading:text(record?.caseId||'Unnumbered report',80),
   text:text(record?.publicFinding||'No verified finding released.',900)
  }))});
 pages.push({id:'notes',section:'Personal Notes',title:'My Notes',
  kicker:'Private handwriting · saved to this character',
  paragraphs:['These are your own notes, not evidence or verified testimony.'],
  items:[],editable:true,note:text(save.casebookPersonalNotes||'',2000)});
 return pages;
}
const api=Object.freeze({buildPages,publicCasePages});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CASEBOOK_PAGES=api;
})(typeof window!=='undefined'?window:globalThis);
