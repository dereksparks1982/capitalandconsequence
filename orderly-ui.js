/* Capital & Consequence v0.6.63: Edmund's institution workroom and duty book. */
(function(){
 'use strict';
 const duty=window.FE_ORDERLY_DUTY;
 if(!duty)throw Error('Orderly work engine must load first');
 const node=id=>document.getElementById(id);
 const where=()=>window.FE_CITY?.currentLocation?.()||{};
 const put=(id,value)=>{const n=node(id);if(n)n.textContent=value};
 const button=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;return b};
 function mount(){
  const desk=node('careerDesk');
  if(desk&&!node('orderlyDesk')){
   const area=document.createElement('section');area.id='orderlyDesk';area.className='doorman-work-box';
   area.setAttribute('aria-label','Edmund Wardman work ledger');
   area.innerHTML='<h3>Edmund Wardman · Orderly Duty Book</h3><p id="orderlyDeskStats"></p><p id="orderlyDeskGuide"></p><p id="orderlyDeskNotice" role="status"></p><h4>Recently Filed Service</h4><ol id="orderlyDeskHistory"></ol>';
   desk.querySelector('.career-desk-actions')?.before(area);
  }
  const room=document.querySelector('.city-room-placeholder');
  if(room&&!node('orderlyWardPanel')){
   const area=document.createElement('section');area.id='orderlyWardPanel';area.className='doorman-work-box';
   area.setAttribute('aria-label','District Asylum orderly tasks');
   area.innerHTML='<h3>District Asylum · Ordinary Service</h3><p id="orderlyWardText"></p><div id="orderlyWardActions"></div><p id="orderlyWardNotice" role="status"></p>';
   room.appendChild(area);
  }
 }
 function action(kind,choiceId){
  if(S.characterRoute!=='wardman'||!activeProfileId())return;
  const pos=where(),can=duty.access(S,kind,pos.locationId,pos.roomId);
  if(!can.ok){put('orderlyWardNotice',can.reason);return}
  const current=duty.ensure(S).pending;
  if(kind==='assign'&&current){put('orderlyWardNotice','File the pending assignment first.');return}
  if(kind==='attend'&&current?.status!=='assigned'){put('orderlyWardNotice','No service is assigned yet.');return}
  if(kind==='file'&&current?.status!=='awaiting-report'){put('orderlyWardNotice','There is no completed service to record.');return}
  if(kind==='assign'&&(duty.ensure(S).completedByDate[S.gameDate]||0)>=duty.MAX_ASSIGNMENTS){
   put('orderlyWardNotice','Today’s allotted rounds are complete.');return;
  }
  const seconds=kind==='attend'?600:300;
  if(S.dayRemaining<=seconds){put('orderlyWardNotice','Not enough game-clock time remains for the task.');return}
  const spent=window.advanceWorldTime(seconds,true);
  if(spent!==seconds){put('orderlyWardNotice','The duty period did not complete on the game clock.');return}
  const result=kind==='assign'?duty.assign(S,{...pos,date:S.gameDate,profileId:activeProfileId(),spentSeconds:spent}):
   kind==='attend'?duty.attend(S,{...pos,choiceId,spentSeconds:spent}):
   duty.file(S,{...pos,spentSeconds:spent});
  if(result.ok){
   window.FE_MISSIONS?.syncWard?.(S,kind,result);
   if(kind==='file'&&result.log)
    window.FE_LIFE_HISTORY?.record?.(S,{id:'ward:'+result.log.id+':file',
     date:result.log.date,source:'District Asylum duty',text:result.log.result});
  }
  if(result.ok&&kind==='file'&&Array.isArray(S.notes)){
   S.notes.push({date:S.gameDate,source:'asylum orderly duty',text:result.log.id+' · '+result.log.result});
   if(S.notes.length>320)S.notes.shift();
  }
  save(true);render();refresh();
  put('orderlyWardNotice',result.ok?
   (kind==='assign'?'Assignment received. Go to the patient ward.':
    kind==='attend'?'Work completed. Return to the orderly station to file.':
    'Service filed; earned $'+(result.wageCents/100).toFixed(2)+'.'):
   result.reason);
 }
 function refresh(){
  mount();
  const active=S?.characterRoute==='wardman'&&!!activeProfileId();
  const desk=node('orderlyDesk'),room=node('orderlyWardPanel'),pos=where();
  if(desk)desk.hidden=!active;
  if(room)room.hidden=!active||pos.locationId!==duty.VENUE||
   ![duty.STATION,duty.WARD].includes(pos.roomId)||!!node('cityRoomOverlay')?.hidden||
   !!window.FE_CITY?.isDevRoom?.();
  if(!active)return;
  const info=duty.summary(S),pending=info.pending;
  put('orderlyDeskStats','Filed rounds: '+info.totalAssignments+' · Earned: $'+(info.wagesEarnedCents/100).toFixed(2)+'.');
  put('orderlyDeskGuide',pending?pending.status==='assigned'?
   'You have an assigned service. Go to the patient ward and attend to it.':
   'Your ward service is finished. Return to the orderly station to file it.':
   'You begin as a low-ranking attendant, not the asylum’s owner. Ordinary rounds are available during the Business Day.');
  const history=node('orderlyDeskHistory');
  if(history){history.replaceChildren();for(const entry of info.logs.slice(-6).reverse()){
   const li=document.createElement('li');li.textContent=entry.date+' · '+entry.id+' · '+entry.result;history.appendChild(li)
  }
   if(!info.logs.length){const li=document.createElement('li');li.textContent='No completed duties recorded.';history.appendChild(li)}
  }
  if(!room||room.hidden)return;
  const actions=node('orderlyWardActions');if(!actions)return;
  actions.replaceChildren();
  if(pos.roomId===duty.STATION){
   if(pending?.status==='awaiting-report'){
    put('orderlyWardText','Write a brief care-service report and return the assignment book.');
    const b=button('File Service Entry · 5 Minutes',()=>action('file'));
    b.disabled=S.paused||S.dayRemaining<=300;actions.appendChild(b);
   }else if(!pending){
    put('orderlyWardText','Check the ordinary ward assignment book for your next round.');
    const b=button('Review Assignment · 5 Minutes',()=>action('assign'));
    b.disabled=S.paused||S.phase!=='day'||S.dayRemaining<=300||
     (info.completedByDate[S.gameDate]||0)>=duty.MAX_ASSIGNMENTS;actions.appendChild(b);
   }else put('orderlyWardText','Your assigned work awaits in the patient ward.');
  }else if(pending?.status==='assigned'){
   const task=duty.task(S);
   put('orderlyWardText',(task?.title||'Routine duty')+' · '+(task?.description||''));
   for(const c of task?.choices||[]){
    const b=button(c.label+' · 10 Minutes',()=>action('attend',c.id));
    b.disabled=S.paused||S.phase!=='day'||S.dayRemaining<=600;actions.appendChild(b);
   }
  }else put('orderlyWardText',pending?'Return to the orderly station to file the completed service.':
   'There is no active ward assignment. Consult the orderly station first.');
 }
 window.FE_ORDERLY_UI=Object.freeze({refresh});
 refresh();
})();
