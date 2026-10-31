/* In-room inquiry: menus only, no movement rewrite or additional city pins.
 * Evidence is admitted to this character's personal records ONLY on real
 * permitted actions with actual time charged through the shared game clock.
 */
(function(root){'use strict';
const $=id=>document.getElementById(id),api=()=>root.FE_ASYLUM_STORY;
function mount(){
 if($('asylumInquiryPanel'))return $('asylumInquiryPanel');
 const parent=document.querySelector('#cityRoomOverlay .city-room-placeholder');
 if(!parent)return null;
 const panel=document.createElement('section');
 panel.id='asylumInquiryPanel';panel.className='doorman-work-box';
 panel.setAttribute('aria-label','District Asylum incident inquiry');
 const head=document.createElement('h3');head.textContent='District Asylum · Unexplained Death';
 const summary=document.createElement('p');summary.id='asylumInquirySummary';
 const actions=document.createElement('div');actions.id='asylumInquiryActions';
 const notice=document.createElement('p');notice.id='asylumInquiryNotice';notice.setAttribute('role','status');
 const casebook=document.createElement('div');casebook.id='asylumCasebook';casebook.className='doorman-work-box';
 const roster=document.createElement('div');roster.id='asylumCasebookLeads';
 const select=document.createElement('select');select.id='asylumCasebookSuspect';
 select.setAttribute('aria-label','Person named in case referral');
 const submit=document.createElement('button');submit.id='asylumCasebookFile';submit.type='button';
 submit.addEventListener('click',fileSuspect);
 const review=document.createElement('p');review.id='asylumCasebookReview';review.setAttribute('role','status');
 casebook.append(roster,select,submit,review);
 panel.append(head,summary,actions,casebook,notice);parent.appendChild(panel);
 return panel;
}
function context(){
 const location=root.FE_CITY?.currentLocation?.()||{};
 return {...location,dev:root.FE_CITY?.isDevRoom?.()};
}
function current(){
 const id=typeof activeProfileId==='function'?activeProfileId():null;
 if(!id||!S?.sharedWorldId)return null;
 return root.FE_SHARED_WORLD?.read?.(localStorage,S.sharedWorldId)||null;
}
function show(message){
 const notice=$('asylumInquiryNotice');
 if(notice)notice.textContent=message;
}
function action(id){
 const story=api(),world=current(),place=context(),profile=activeProfileId(),saveRef=S;
 const preview=story?.preview?.(saveRef,world,id,place);
 if(!preview?.ok){show(preview?.reason||'Action unavailable');return false}
 if(!root.FE_WASHINGTON_TIME?.canSpend?.(S,preview.seconds)){show('Not enough game time.');return false}
 const spent=root.advanceWorldTime(preview.seconds,true);
 if(spent!==preview.seconds||S!==saveRef||profile!==activeProfileId()){
  show('This action was interrupted; no observation was filed.');return false;
 }
 const result=story.apply(S,current()||world,id,place,{spentSeconds:spent});
 if(!result.ok){
  show(result.reason||'Action was not recorded.');return false;
 }
 const persisted=save(true);
 if(!persisted){show('Autosave failed. Keep the game open and retry after freeing storage.');return false}
 if(result.bridgeOutcome?.released||result.familyOutcome?.released||result.escapeOutcome?.escaped){
  root.FE_CITY?.openRoom?.('blackwoodAsylum','reception');
 }
 if(result.escapeOutcome?.returned)root.FE_CITY?.openRoom?.('blackwoodAsylum','patient-ward');
 render();refresh();
 const standing=S.characterRoute==='wardman'&&(id.startsWith('family')||id.startsWith('ward'))?S.wardmanStanding:null;
 show(standing?
  (result.estatePoliceOutcome?.description||result.escapeOutcome?.description||result.inheritanceOutcome?.description||result.custodyOutcome?.description||result.bridgeOutcome?.description||result.familyOutcome?.description||'Family response recorded.')+
  ' Workplace trust: '+standing.workplaceTrust+
  '/100 · Family pressure: '+standing.familyPressure+
  '/100 · Petition: '+(standing.petition?.status||'none')+'.':
  (result.bridgeOutcome?.description||'Filed in your private records. No suspect has been declared guilty.'));
 return true;
}
function fileSuspect(){
 const work=root.FE_ASYLUM_CASEWORK,world=current(),place=context(),profile=activeProfileId(),saveRef=S;
 const suspect=$('asylumCasebookSuspect')?.value;
 const check=work?.canFile?.(S,world,place,suspect);
 if(!check?.ok){show(check?.reason||'The case cannot be filed here.');return false;}
 if(typeof root.confirm==='function'&&!root.confirm(check.warning+' File this report?'))return false;
 if(!root.FE_WASHINGTON_TIME?.canSpend?.(S,check.seconds)){show('Insufficient game time for this filing.');return false}
 const elapsed=root.advanceWorldTime(check.seconds,true);
 if(elapsed!==check.seconds||S!==saveRef||profile!==activeProfileId()){
  show('The case filing was interrupted. No allegation was recorded.');return false;
 }
 const result=work.file(S,current()||world,place,suspect,{spentSeconds:elapsed});
 if(!result?.ok){show(result?.reason||'The case filing failed.');return false;}
 const persisted=save(true);
 if(!persisted){show('Autosave failed. Keep the game open to retry the save.');return false}
 render();refresh();
 show(result.kind==='referral'?
  'Police referral filed for independent review. No arrest, conviction, or verdict was entered.':
  'Edmund recorded a private concern. Family pressure may rise; he has not ordered an arrest.');
 return true;
}
function casebook(){
 const area=$('asylumCasebook'),work=root.FE_ASYLUM_CASEWORK,world=current();
 if(!area)return;
 const file=work?.dossier?.(S,world),place=context();
 area.hidden=!file;
 if(!file)return;
 const list=$('asylumCasebookLeads');list.replaceChildren();
 const title=document.createElement('h4');title.textContent='Casebook · Access, Passage and Time';list.append(title);
 for(const lead of file.leads){
  const row=document.createElement('p');
  row.textContent=lead.available?lead.label+': '+lead.description:
   lead.label+': Unverified. Examine '+lead.sourceAction+' through your own authorized work.';
  list.append(row);
 }
 for(const record of file.supplements||[]){
  const line=document.createElement('p');line.textContent='Additional evidence · '+record.source+': '+record.description;
  list.append(line);
 }
 const family=root.FE_WARDMAN_RECORDS?.summary?.(S,world);
 if(family&&S.characterRoute==='wardman'){
  const summary=document.createElement('p');
  summary.textContent='Institutional records: '+(family.amended?'Amendment verified firsthand':'No amendment independently verified')+
   ' · Preserved copy: '+(family.copyPreserved?'yes':'no')+
   ' · Independent witness: '+(family.witness?'yes':'no')+
   ' · Petition: '+(family.petition||'none')+
   (family.confinement?' · EDMUND CONFINED AS A PATIENT':'');
  list.append(summary);
  const custody=root.FE_WARDMAN_CUSTODY?.summary?.(S);
  if(custody){
   const line=document.createElement('p');
   line.textContent='Patient custody: '+custody.stage+
    ' · Misconduct: '+custody.misconduct+' · Protections: '+custody.protection+
    (custody.reviewDate?' · Procedure review: '+custody.reviewDate:'')+
    (custody.outcome?' · Final decision: '+custody.outcome:'')+
    (custody.careerEnded?' · CAREER ENDED':'');
   list.append(line);
  }
  const estate=root.FE_WARDMAN_INHERITANCE?.summary?.(S);
  if(estate?.receivedAt){
   const statement=document.createElement('p');
   statement.textContent='Wardman settlement letter: received '+estate.receivedAt+
    (estate.verified?' · Independent clerk verified receipt':' · Not independently authenticated');
   list.append(statement);
  }
  const escape=root.FE_WARDMAN_ESCAPE?.summary?.(S);
  if(escape?.events.length){
   const line=document.createElement('p');
   line.textContent='Escape attempt: '+escape.stage+
    (escape.outcome?' · '+escape.outcome:'')+
    (escape.absconder?' · Outstanding custody order':'');
   list.append(line);
  }
  const estatePolice=root.FE_WARDMAN_ESTATE_POLICE?.summary?.(S);
  if(estatePolice&&(estatePolice.certified||estatePolice.examined||estatePolice.received)){
   const item=document.createElement('p');
   item.textContent=S.characterRoute==='investigator'?
    'Public trust record: '+(estatePolice.certified?'Signed comparison filed':'Abstract inspected'):
    'Public trust police certificate: '+(estatePolice.received?'copy obtained':'not obtained');
   list.append(item);
  }
  const police=root.FE_WARDMAN_POLICE?.summary?.(S);
  if(police){
   const entry=document.createElement('p');
   entry.textContent='Independent police evidence: '+(police.received?'Authenticated copy received':'Not yet obtained')+
    (police.rehearing?' · Reopened hearing: '+police.rehearing:'');
   list.append(entry);
  }
 }
 const result=document.createElement('p');
 result.textContent=file.ready?
  'All three independent accounts now overlap on one possible suspect. This is sufficient to file a reasoned allegation, NOT a conviction.':
  'Three independent sources are required before naming a suspect. No identity has been proven.';
 list.append(result);
 const choices=$('asylumCasebookSuspect'),previous=choices.value;
 choices.replaceChildren();
 for(const person of file.suspects){
  const option=document.createElement('option');option.value=person.id;
  option.textContent=person.name+(person.statement?' · '+person.statement:' · Statement not yet obtained');choices.append(option);
 }
 if(file.suspects.some(x=>x.id===previous))choices.value=previous;
 const submit=$('asylumCasebookFile');submit.textContent=S.characterRoute==='investigator'?
  'Refer Named Suspect to Sergeant · 10 minutes':'Enter Named Concern in Orderly Register · 10 minutes';
 const permission=work.canFile(S,world,place,choices.value);
 submit.disabled=!permission.ok;submit.title=permission.reason||permission.warning||'';
 const review=$('asylumCasebookReview');
 review.textContent=file.publicReview?
  'Official referral: '+file.publicReview.status+
  (file.publicReview.decision?' · Review: '+file.publicReview.decision:' · No official finding yet.')+
  '. No conviction entered.':
  S.characterRoute==='wardman'?
   'Edmund has no police arrest power. A witnessed written record may protect him against family pressure.':
   'A referral starts independent police review after a later world day. An accusation is not a warrant.';
}
function refresh(){
 const panel=mount();if(!panel)return;
 const story=api(),world=current(),place=context(),caseFile=story?.visible?.(world);
 const eligible=caseFile&&['wardman','investigator'].includes(S?.characterRoute)&&
  (place.locationId==='blackwoodAsylum'||place.locationId==='metropolitanPolice'||place.locationId==='governmentHospital')
  &&!place.dev&&!$('cityRoomOverlay')?.hidden;
 panel.hidden=!eligible;
 if(!eligible)return;
 $('asylumInquirySummary').textContent='A death was reported on '+caseFile.at+'. Your findings depend on your work, your access, and where you have actually been. The murderer is not revealed.';
 const actions=$('asylumInquiryActions');actions.replaceChildren();
 let shown=0;
 for(const [id,detail] of Object.entries(story.ACTIONS)){
  if(!detail.routes.includes(S.characterRoute)||detail.location!==place.locationId||detail.room!==place.roomId)continue;
  const possible=story.preview(S,world,id,place);
  if(story.seen(S,id))continue;
  const button=document.createElement('button');button.type='button';button.textContent=detail.label;
  button.disabled=!possible.ok;button.title=possible.ok?'':possible.reason;
  if(!possible.ok)button.setAttribute('aria-label',detail.label+' · '+possible.reason);
  button.addEventListener('click',()=>action(id));
  actions.append(button);shown++;
  if(!possible.ok){
   const why=document.createElement('small');why.textContent=possible.reason;actions.append(why);
  }
 }
 if(!shown){
  const empty=document.createElement('p');
  empty.textContent='No further inquiry actions available in this room. Your casebook and personal journal retain discoveries made here.';
  actions.append(empty);
 }
 casebook();
}
root.FE_ASYLUM_CASE_UI=Object.freeze({refresh,action,fileSuspect});
refresh();
})(typeof window!=='undefined'?window:globalThis);
