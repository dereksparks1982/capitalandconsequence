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
 panel.append(head,summary,actions,notice);parent.appendChild(panel);
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
 render();refresh();
 const standing=S.characterRoute==='wardman'&&id.startsWith('family')?S.wardmanStanding:null;
 show(standing?'Response recorded. Workplace trust: '+standing.workplaceTrust+
  '/100 · Family pressure: '+standing.familyPressure+'/100. No commitment order has been issued.':
  'Filed in your private records. No suspect has been declared guilty.');
 return true;
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
}
root.FE_ASYLUM_CASE_UI=Object.freeze({refresh,action});
refresh();
})(typeof window!=='undefined'?window:globalThis);
