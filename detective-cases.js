/* Federal Electric v0.6.53: career-desk detective notebook and police actions.
 * Only the investigator may open a case; canonical answers remain profile-private.
 */
(function(){
 'use strict';
 const engine=window.FE_MURDER_CASES;
 if(!engine)throw Error('Murder case engine must load before detective desk');
 const COST=120;
 let flash='';
 function eligible(){return typeof S==='object'&&S.characterRoute==='investigator'&&
  typeof activeProfileId==='function'&&!!activeProfileId()}
 function store(){
  if(!eligible())return null;
  if(!S.detectiveCases||S.detectiveCases.version!==1||!Array.isArray(S.detectiveCases.cases))
   S.detectiveCases={version:1,nextSerial:1,cases:[]};
  const book=S.detectiveCases;
  if(!Number.isSafeInteger(book.nextSerial)||book.nextSerial<1)
   book.nextSerial=Math.max(1,...book.cases.map(c=>c.serial||0))+1;
  return book;
 }
 function ensure(){
  const book=store();if(!book)return null;
  if(!book.cases.length){
   const c=engine.createCase(activeProfileId(),S.gameDate,engine.DEFAULT_ROSTER,book.nextSerial++);
   book.cases.push(c);
   if(typeof save==='function')save(true);
  }
  return book.cases[book.cases.length-1];
 }
 function current(){
  const c=ensure();return c?engine.publicFile(c):null;
 }
 function allowed(){
  if(!eligible())return 'Detective duties are available only on an investigator profile.';
  if(S.paused)return 'Resume the simulation before investigating.';
  if(S.phase==='report')return 'Finish the daily report before investigating.';
  if(!Number.isFinite(+S.dayRemaining)||S.dayRemaining<COST)
   return 'Not enough time remains in this phase for an inquiry.';
  return null;
 }
 function spend(){
  if(typeof window.advanceWorldTime!=='function')return false;
  return window.advanceWorldTime(COST,true)===COST;
 }
 function pursue(kind,id){
  const c=ensure();
  if(!c)return {ok:false,reason:'No investigator profile'};
  const reason=allowed();if(reason)return {ok:false,reason};
  if(c.status!=='open')return {ok:false,reason:'This case is closed'};
  if(kind==='inquiry'&&(!Object.hasOwn(engine.STAGES,id)||c.clues.filter(x=>x.stage===id).every(x=>c.discovered.includes(x.id))))
   return {ok:false,reason:'That inquiry is already complete'};
  if(kind==='interview'&&(!c.suspects.some(x=>x.id===id)||c.interviewed.includes(id)))
   return {ok:false,reason:'That interview cannot be repeated'};
  if(kind==='accuse'&&(!c.suspects.some(x=>x.id===id)||c.wrongAccusations.includes(id)))
   return {ok:false,reason:'That person cannot be accused again'};
  if(kind==='accuse'&&!engine.candidateIds(c).length)return {ok:false,reason:'Gather all three evidence threads before accusing anyone'};
  if(!['inquiry','interview','accuse'].includes(kind))return {ok:false,reason:'Unknown police action'};
  if(!spend())return {ok:false,reason:'Could not advance the game clock'};
  const outcome=kind==='inquiry'?engine.uncover(c,id):kind==='interview'?engine.interview(c,id):engine.accuse(c,id);
  if(outcome.ok&&typeof save==='function')save(true);
  return outcome;
 }
 function nextCase(){
  const book=store(),c=ensure();
  if(!book||!c||c.status==='open')return {ok:false,reason:'Resolve the open case first'};
  if(book.cases.length>=8)return {ok:false,reason:'Eight cases are on record. Case archives are retained.'};
  const next=engine.createCase(activeProfileId(),S.gameDate,engine.DEFAULT_ROSTER,book.nextSerial++);
  book.cases.push(next);if(typeof save==='function')save(true);
  return {ok:true,reason:'A new case has been assigned'};
 }
 function render(){
  const panel=document.getElementById('detectiveCasePanel');
  if(!panel||!eligible())return;
  const file=current();
  panel.replaceChildren();
  if(!file)return;
  const node=(tag,text,cls,parent=panel)=>{
   const el=document.createElement(tag);
   if(cls)el.className=cls;
   el.textContent=text;parent.appendChild(el);return el;
  };
  node('h3','Metropolitan Police · Homicide Casebook');
  node('p',file.title+' · '+file.date+' · '+file.status.toUpperCase(),'detective-case-heading');
  node('p',file.summary,'detective-case-summary');
  if(flash)node('p',flash,'detective-case-feedback').setAttribute('role','status');
  const act=(label,handler,disabled=false,parent=panel)=>{
   const b=node('button',label,'detective-case-button',parent);
   b.type='button';b.disabled=disabled;
   b.addEventListener('click',()=>{
    const outcome=handler();
    flash=outcome.reason||(outcome.ok?'New information entered into your casebook.':'Unable to complete that action.');
    render();
   });return b;
  };
  if(file.status==='open'){
   node('h4','Investigative inquiries');
   const actions=node('div','','detective-case-actions');
   for(const item of file.inquiries)act((item.completed?'✓ ':'')+item.label,
    ()=>pursue('inquiry',item.id),item.completed,actions);
  }
  node('h4','Collected evidence');
  if(!file.evidence.length)node('p','No physical or documentary evidence collected. Begin with the scene.','detective-case-muted');
  for(const clue of file.evidence){
   const entry=node('article','','detective-case-evidence');
   node('strong',clue.thread.toUpperCase()+' · '+clue.source,null,entry);
   node('p',clue.text,null,entry);
  }
  node('h4','Suspects and statements');
  const list=node('div','','detective-case-suspects');
  for(const suspect of file.suspects){
   const card=node('article','','detective-case-person',list);
   node('strong',suspect.name+' · '+suspect.occupation,null,card);
   node('p',suspect.statement||'No interview recorded.',null,card);
   if(file.status==='open'){
    const controls=node('div','','detective-case-actions',card);
    act('Interview',()=>pursue('interview',suspect.id),!!suspect.statement,controls);
    act('Accuse',()=>pursue('accuse',suspect.id),!file.readyToAccuse||file.wrongAccusations.includes(suspect.id),controls);
   }
  }
  if(file.status==='open'){
   node('p',file.readyToAccuse?'All three evidence threads are recorded. The decision is yours.':
    'Before accusing, examine the scene, check records, and interview witnesses.','detective-case-muted');
  }else{
   node('p',file.status==='solved'?'Case closed: the supporting evidence held.':'Case cold: the accusation record has exhausted this inquiry.','detective-case-feedback');
   act('Request Next Case',nextCase);
  }
  node('p','Each inquiry or interview consumes two in-game minutes. Evidence is saved with this character.','detective-case-muted');
 }
 window.FE_DETECTIVE_CASES=Object.freeze({ensure,current,pursue,nextCase,render});
})();
