/* Capital & Consequence: street scene and station desk for rookie officer.
 * UI sits inside existing rooms; does not fabricate a detective promotion.
 */
(function(){
 'use strict';
 const logic=window.FE_PATROL;
 if(!logic)throw Error('Patrol duty simulation module must load first');
 const $$=id=>document.getElementById(id);
 function create(){
  const desk=$$('careerDesk');
  if(desk&&!$$('patrolDutyDesk')){
   const section=document.createElement('section');
   section.id='patrolDutyDesk';section.className='patrol-duty-box';
   section.setAttribute('aria-label','Patrolman duty book');
   section.innerHTML='<h3>Samuel “Sam” Harlan · Duty Book</h3><p id="patrolDutyLedger"></p><p id="patrolDutyInstruction"></p><button type="button" id="patrolFileReport">File Station Report · 5 Minutes</button><p id="patrolDeskNotice" role="status"></p><h4>Filed Reports</h4><ol id="patrolFiledReports"></ol>';
   desk.querySelector('.career-desk-actions')?.before(section);
   section.querySelector('#patrolFileReport').onclick=()=>perform('report');
  }
  const placeholder=document.querySelector('.city-room-placeholder');
  if(placeholder&&!$$('patrolStreetPanel')){
   const section=document.createElement('section');
   section.id='patrolStreetPanel';section.className='patrol-duty-box';
   section.setAttribute('aria-label','Walking beat patrol');
   section.innerHTML='<h3>Police Beat · Street Duty</h3><p id="patrolStreetStatus"></p><div id="patrolStreetChoices"></div><p id="patrolStreetNotice" role="status"></p>';
   placeholder.appendChild(section);
  }
 }
 function location(){return window.FE_CITY?.currentLocation?.()?.locationId||null}
 function room(){return window.FE_CITY?.currentLocation?.()?.roomId||null}
 function setText(id,text){const el=$$(id);if(el)el.textContent=text}
 function button(label,fn){
  const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;return b;
 }
 function perform(action,choiceId=null){
  if(S.characterRoute!=='investigator'||!activeProfileId())return;
  const id=location(),pending=logic.ensure(S).pending;
  const access=logic.access(S,action,id,room());
  const notice=action==='report'?'patrolDeskNotice':'patrolStreetNotice';
  if(!access.ok){setText(notice,access.reason);return}
  if(action==='walk'&&pending){setText(notice,'Finish the current incident first.');return}
  if(action==='respond'&&(!pending||pending.status!=='awaiting-response'||pending.locationId!==id)){setText(notice,'There is no open incident here.');return}
  if(action==='report'&&(!pending||pending.status!=='awaiting-report')){setText(notice,'No completed street incident is ready for filing.');return}
  const seconds=action==='walk'?600:300;
  if(S.dayRemaining<seconds){setText(notice,'Not enough duty time remains today.');return}
  const spent=window.advanceWorldTime(seconds,true);
  if(spent!==seconds){setText(notice,'Clock charge did not complete. No work was recorded.');return}
  let result;
  if(action==='walk')result=logic.walk(S,{locationId:id,date:S.gameDate,profileId:activeProfileId(),spentSeconds:spent});
  else if(action==='respond')result=logic.respond(S,{locationId:id,choiceId,spentSeconds:spent});
  else result=logic.report(S,{locationId:id,roomId:room(),spentSeconds:spent});
  if(!result.ok){setText(notice,result.reason);save(true);render();refresh();return}
  if(action==='report'&&Array.isArray(S.notes)){
   S.notes.push({date:S.gameDate,source:'patrol duty report',text:result.record.id+' · '+result.record.reportText});
   if(S.notes.length>320)S.notes.shift();
  }
  save(true);render();refresh();
  setText(notice,action==='walk'?'An incident requires your attention.':action==='respond'?'The incident is handled. Return to the station and file the report.':'Station report filed and saved.');
 }
 function refresh(){
  create();
  const isCop=S?.characterRoute==='investigator'&&!!activeProfileId();
  const desk=$$('patrolDutyDesk');
  if(desk)desk.hidden=!isCop;
  const street=$$('patrolStreetPanel');
  if(street)street.hidden=!isCop||!logic.STREETS.some(v=>v.id===location())||!!$$('cityRoomOverlay')?.hidden||!!window.FE_CITY?.isDevRoom?.();
  if(!isCop)return;
  const record=logic.summary(S),pending=record.pending;
  const atStation=location()==='metropolitanPolice'&&room()==='station-duty-room';
  setText('patrolDutyLedger','Circuits: '+record.walks+' · Beat duty: '+record.beatMinutes+' minutes · Street contacts: '+record.contacts+' · Summons records: '+record.summons+' · Station reports: '+record.reportsFiled+'.');
  setText('patrolDutyInstruction',pending?pending.id+' · '+(pending.status==='awaiting-response'?'Unresolved at '+pending.locationId+'. Return to that street.':'Handled at '+pending.locationId+'. Return to the police station duty room and write your report.'):'Assigned street beats: Barry Farm and Chinatown. Travel with the Washington map to begin. All duty actions consume game time.');
  const filing=$$('patrolFileReport');
  if(filing){
   filing.disabled=!atStation||!pending||pending.status!=='awaiting-report'||S.paused||S.phase==='report'||S.dayRemaining<300;
   filing.title=atStation?'File the completed incident in the station duty book.':'Enter the Metropolitan Police patrolmen’s duty room to write reports.';
  }
  const log=$$('patrolFiledReports');if(log){
   log.replaceChildren();
   for(const item of record.logs.slice(-6).reverse()){
    const li=document.createElement('li');li.textContent=item.date+' · '+item.id+' · '+item.reportText;log.appendChild(li);
   }
   if(!record.logs.length){const li=document.createElement('li');li.textContent='No filed reports yet.';log.appendChild(li)}
  }
  if(!street||street.hidden)return;
  const choices=$$('patrolStreetChoices');if(!choices)return;
  choices.replaceChildren();
  const blocked=S.paused||S.phase!=='day';
  const onThisStreet=pending?.locationId===location();
  let summary;
  if(pending?.status==='awaiting-response'){
   if(!onThisStreet)summary='Your open encounter is at another street. Return there.';
   else{
    const incident=logic.scene(S);
    summary=(incident?.name||'Street incident')+' · '+(incident?.description||'');
    for(const c of incident?.choices||[]){
     const b=button(c.label,()=>perform('respond',c.id));b.disabled=blocked||S.dayRemaining<300;choices.appendChild(b);
    }
   }
  }else if(pending?.status==='awaiting-report'){
   summary='This encounter is handled. Return to the Metropolitan Police duty room and use your desk to file '+pending.id+'.';
  }else{
   summary='Walk the assigned street, observe local activity, and attend to an ordinary patrol matter. No horse, car, or detective authority.';
   const b=button('Walk This Beat · 10 Minutes',()=>perform('walk'));b.disabled=blocked||S.dayRemaining<600;choices.appendChild(b);
  }
  setText('patrolStreetStatus',summary);
 }
 window.FE_PATROL_UI=Object.freeze({refresh});
 refresh();
})();
