/* Capital & Consequence v0.6.57. Shared title and career desk foundation.
   Does not simulate unbuilt police, civilian or hospital careers. */
(function(){
 'use strict';
 const routes=window.FE_CHARACTERS;
 if(!routes)return;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let choice='industrialist',showNew=false,lastRenderedRoute='';
 const menu=document.createElement('section');
 menu.id='careerMainMenu';menu.className='career-main-menu';
 menu.setAttribute('aria-label','Capital & Consequence main menu');
 menu.innerHTML=`<div class="career-menu-paper">
   <header class="career-menu-heading"><small>WASHINGTON · THE CAPITAL DISTRICT</small><h1>CAPITAL &amp; CONSEQUENCE</h1><p>LIVES IN AN ALTERNATE UNITED STATES</p><div class="career-menu-rule"></div>
   <p class="career-menu-motto">One city. Countless lives. Every choice has consequences.</p>
   <p class="career-nation-premise">After the Civil War, the United States abolished state borders and reorganized into districts serving national needs.</p>
   <output id="careerMenuDate">No profile selected</output></header>
   <section class="career-menu-careers" aria-label="Four playable character foundations"><h2>Choose a Life</h2><div id="careerMenuRoutes" class="career-menu-routes"></div></section>
   <section class="career-menu-records" aria-label="Saved lives"><h2>Saved Profiles</h2><div id="careerMenuProfiles"></div></section>
   <section id="careerMenuCreateBox" class="career-menu-create" hidden><label>Character / Profile Name <input id="careerMenuName" type="text" maxlength="28" autocomplete="off" placeholder="Enter a name"></label><p id="careerMenuCreateRoute"></p><button id="careerMenuCreateConfirm" type="button">Start This Life</button><button id="careerMenuCreateCancel" type="button">Cancel</button></section>
   <p id="careerMenuMessage" class="career-menu-message" role="status" aria-live="polite"></p>
   <div class="career-menu-buttons"><button id="careerMenuContinue" type="button">Continue</button><button id="careerMenuNew" type="button">New Profile</button><button id="careerMenuArchives" type="button">Archives</button><button id="careerMenuDistricts" type="button">District Register</button><button id="careerMenuOptions" type="button">Options</button></div>
   <footer>FOUR LIVES · ONE WASHINGTON · AUTOSAVE ENABLED</footer>
 </div>`;
 document.body.appendChild(menu);
 // Keep the old markup only as a noninteractive compatibility/archive scaffold
 // until the legacy audio/title services are independently retired.
 // Move the live map and archive dialogue OUT of that hidden scaffold so neither
 // may ever accidentally display the former illustrated office.
 const legacy=document.getElementById('titleScreen');
 const devPanel=document.getElementById('titleDevPanel');
 // Keep the complete existing dev panel on every screen instead of inside
 // the retired, inert illustrated title screen.
 if(devPanel){
  // The panel is an opt-in diagnostic overlay, never visible at launch.
  document.body.appendChild(devPanel);
  devPanel.hidden=true;
  const toggle=document.createElement('button');
  toggle.id='careerDevToggle';
  toggle.className='career-dev-toggle';
  toggle.type='button';
  toggle.textContent='DEV';
  toggle.title='Toggle developer panel (Ctrl+Shift+D)';
  toggle.setAttribute('aria-label','Open developer panel');
  toggle.setAttribute('aria-controls','titleDevPanel');
  toggle.setAttribute('aria-expanded','false');
  const setOpen=open=>{
   devPanel.hidden=!open;
   toggle.setAttribute('aria-expanded',String(open));
   toggle.setAttribute('aria-label',open?'Close developer panel':'Open developer panel');
   toggle.textContent=open?'CLOSE DEV':'DEV';
  };
  toggle.addEventListener('click',()=>setOpen(devPanel.hidden));
  document.addEventListener('keydown',e=>{
   if(e.ctrlKey&&e.shiftKey&&e.code==='KeyD'){
    e.preventDefault();e.stopPropagation();setOpen(devPanel.hidden);
   }
   if(e.key==='Escape'&&!devPanel.hidden){
    setOpen(false);
   }
  });
  document.body.appendChild(toggle);
 }
 const dialog=document.getElementById('titleDialog');
 const map=document.getElementById('titleMapViewer');
 const roomOverlay=document.getElementById('cityRoomOverlay');
 if(map)document.body.appendChild(map);
 // City destinations are active scenes, not children of the retired title UI.
 if(roomOverlay)document.body.appendChild(roomOverlay);
 if(dialog){document.body.appendChild(dialog);dialog.classList.add('career-global-dialog');dialog.addEventListener('click',e=>{if(e.target===dialog)closeTitleDialog()});}
 if(legacy){legacy.hidden=true;legacy.setAttribute('aria-hidden','true');legacy.inert=true;}
 const desk=document.createElement('section');
 desk.id='careerDesk';desk.className='career-desk';desk.setAttribute('aria-label','Personal career desk');
 // Private player-only records. No NPC may inspect this interface or learn
 // any facts from the text of the player's private pages.
 window.FE_PERSONAL_BOOK?.bind?.({getSave:()=>S,save:()=>save(true)});
 const first=document.querySelector('#desk > h2');
 if(first)first.before(desk);
 function dateLabel(profile){
  if(!profile)return 'No saved life selected · 1890 opening';
  let saved;
  try{saved=JSON.parse(localStorage.getItem(profileSaveKey(profile.id))||'null')}catch(e){return 'Unreadable autosave · original data preserved'}
  if(!saved)return 'No readable autosave · original data preserved';
  const date=/^\d{4}-\d{2}-\d{2}$/.test(saved.gameDate||'')?saved.gameDate:'Date not recorded';
  const phase={day:'BUSINESS DAY',night:'WASHINGTON NIGHT',report:'DAILY REPORT'}[saved.phase]||'TIME NOT RECORDED';
  const secs=Number.isFinite(+saved.dayRemaining)?Math.max(0,Math.ceil(+saved.dayRemaining)):null;
  const remaining=secs===null?'':(' · '+String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0')+' remaining');
  return date+' · '+phase+remaining;
 }
 function message(s=''){menu.querySelector('#careerMenuMessage').textContent=s}
 function renderMenu(){
  const profiles=readProfiles(),active=activeProfileId();
  menu.querySelector('#careerMenuDate').textContent=dateLabel(profiles.find(p=>p.id===active)||profiles[0]);
  menu.querySelector('#careerMenuRoutes').innerHTML=routes.list().map(r=>`<button type="button" data-career-pick="${escape(r.id)}" class="career-menu-route ${r.id===choice?'selected':''}" aria-pressed="${r.id===choice}" data-color="${escape(r.deskColor)}"><b>${escape(r.characterName||r.name)}</b><small>${escape(r.name)} · ${r.status==='playable'?'BUSINESS CAREER':'DESK & CITY FOUNDATION'}</small><span>${escape(r.summary)}</span></button>`).join('');
  menu.querySelector('#careerMenuProfiles').innerHTML=profiles.length?profiles.map(p=>{
   let saved=null;try{saved=JSON.parse(localStorage.getItem(profileSaveKey(p.id))||'null')}catch(e){}
   const route=routes.label(saved?.characterRoute);
   return `<div class="career-menu-profile"><div><b>${escape(p.name)}</b><small>${escape(route)} · ${escape(dateLabel(p))}${p.id===active?' · ACTIVE':''}</small></div><button type="button" data-career-load="${escape(p.id)}">Load</button><button type="button" class="danger" data-career-delete="${escape(p.id)}">Delete</button></div>`;
  }).join(''):'<p class="career-empty">No saved lives yet. Choose a career and create a profile.</p>';
  menu.querySelector('#careerMenuCreateBox').hidden=!showNew;
  menu.querySelector('#careerMenuCreateRoute').textContent='Starting as: '+routes.label(choice)+(choice==='industrialist'?' · Full business career':' · Career preview, shared city available');
  menu.querySelector('#careerMenuNew').disabled=profiles.length>=4;
 }
 function load(id){
  if(!id)return message('Create a profile before continuing.');
  const wasLoaded=loadProfileById(id);
  if(!wasLoaded)return message('The selected autosave could not be loaded. Its original data has been preserved.');
  showNew=false;menu.hidden=true;lastRenderedRoute='';refreshDesk();
 }
 function create(){
  const input=menu.querySelector('#careerMenuName');
  const name=(input.value||'').trim();
  if(!name)return message('Enter a character or profile name first.');
  if(readProfiles().length>=4)return message('Four save slots are occupied. Existing profiles have not been changed.');
  if(!routes.canStart(choice))return message('That life is not available yet.');
  createProfile(name,choice);
  showNew=false;menu.hidden=true;lastRenderedRoute='';refreshDesk();
 }
 function open(){
  if(activeProfileId()&&!profileSaveReadBlocked)save(true);
  const title=document.getElementById('titleScreen');
  if(title)title.hidden=true;
  titleScreenDeskBreak=false;
  closeCityRoom();closeTitleMap();
  pauseTitleAudio();
  showNew=false;menu.hidden=false;message();
  renderMenu();
 }
 function refreshDesk(){
  const route=routes.get(S.characterRoute)||routes.get('industrialist');
  document.body.dataset.career=route.id;
  if(lastRenderedRoute!==route.id){
   lastRenderedRoute=route.id;
   desk.dataset.route=route.id;
   desk.innerHTML=`<div class="career-desk-heading"><div><small>PERSONAL HEADQUARTERS · ${escape(route.name.toUpperCase())}</small><h2>${escape(route.deskTitle)}</h2><p id="careerDeskDate"></p></div><span class="career-desk-seal">${escape(route.name)}</span></div>
    <div class="career-desk-art" aria-label="${escape(route.name)} desk, period-style placeholder">
      <div class="career-desk-ledger"><small>${escape(route.name.toUpperCase())} · ${escape(route.deskTitle.toUpperCase())}</small><strong>${route.id==='industrialist'?'Factory Ledger':route.id==='investigator'?'Duty & Incident Book':route.id==='criminal'?'Personal Notebook':'Institutional Ward Register'}</strong><span>WASHINGTON · PRIVATE PAPERS</span></div>
      <div class="career-desk-blotter"><div class="career-desk-sheet">REPORTS<br>AND NOTES</div><button type="button" id="careerDeskMap" class="career-desk-map" title="Open the Washington map" aria-label="Open Washington map"><img src="assets/artwork/maps/title-map-1938.jpg?v=desktop1" alt="" draggable="false"></button></div>
      <div class="career-desk-pencil" aria-hidden="true"></div>
    </div>
    <p class="career-desk-summary">${escape(route.summary)}</p>
    ${route.id==='investigator'?'<p class="career-desk-readiness">Station orders: walk your assigned beat, respond to disturbances and prepare your duty papers. Detective casework is not authorized at rookie rank.</p>':''}
    ${route.id==='industrialist'?'<p class="career-desk-readiness">Your executive career and business systems remain available below. This desk uses a generic period placeholder, not the retired title-screen artwork.</p>':'<p class="career-desk-readiness">Career foundation: your desk, saved time and Washington are usable. Sam has a patrol-and-report loop and Eli has ordinary paid doorman shifts; Edmund now performs limited report-gated orderly rounds; promotions remain in development. The factory belongs to Charles Whitcomb.</p>'}
    <div class="career-desk-actions"><button type="button" id="careerDeskEnterLocation">Enter Current Location</button><button type="button" id="careerDeskMapButton">Washington Map</button><button type="button" id="careerDeskJournal">${route.id==='industrialist'?'Business Ledger':route.id==='investigator'?'Casebook':route.id==='criminal'?'Personal Journal':'Duty Journal'}</button><button type="button" id="careerDeskWait">Spend 5 Minutes</button><button type="button" id="careerDeskMenu">Main Menu</button></div>`;
   desk.querySelector('#careerDeskMap').onclick=()=>openTitleMap();
   desk.querySelector('#careerDeskMapButton').onclick=()=>openTitleMap();
   desk.querySelector('#careerDeskEnterLocation').onclick=()=>window.FE_CITY?.openRoom?.(S.currentLocation.locationId,S.currentLocation.roomId);
   desk.querySelector('#careerDeskJournal').onclick=()=>window.FE_PERSONAL_BOOK?.open?.();
   desk.querySelector('#careerDeskMenu').onclick=open;
   desk.querySelector('#careerDeskWait').onclick=()=>{
    if(S.paused)return;
    if(S.phase==='report')return;
    const spent=window.advanceWorldTime(300,true);
    save(true);render();
    const note=document.getElementById('careerDeskDate');
    if(note&&spent===0)note.textContent+=' · No time remains in this phase';
   };
  }
  const d=desk.querySelector('#careerDeskDate');
  if(d)d.textContent=S.gameDate+' · '+({day:'BUSINESS DAY',night:'WASHINGTON NIGHT',report:'DAILY REPORT'}[S.phase]||S.phase)+' · '+clockText()+' remaining';
  window.FE_PATROL_UI?.refresh?.();
  window.FE_DOORMAN_UI?.refresh?.();
  window.FE_ORDERLY_UI?.refresh?.();
  // The preexisting detective casebook engine stays offline until a promotion system grants investigative authority.
 }
 menu.addEventListener('click',e=>{
  const button=e.target.closest('button');if(!button)return;
  if(button.dataset.careerPick){choice=routes.normalize(button.dataset.careerPick);message();renderMenu();return}
  if(button.dataset.careerLoad){load(button.dataset.careerLoad);return}
  if(button.dataset.careerDelete){
   deleteProfileById(button.dataset.careerDelete);
   closeTitleDialog();
   renderMenu();return;
  }
  switch(button.id){
   case 'careerMenuContinue':load(activeProfileId()||readProfiles()[0]?.id);break;
   case 'careerMenuNew':showNew=true;renderMenu();menu.querySelector('#careerMenuName').focus();break;
   case 'careerMenuCreateConfirm':create();break;
   case 'careerMenuCreateCancel':showNew=false;renderMenu();break;
   case 'careerMenuArchives':renderTitleArchives();break;
   case 'careerMenuDistricts':{
    const nation=window.FE_NATIONAL_DISTRICTS;
    if(!nation)return message('The national district charter is unavailable.');
    openTitleDialog('The United States of Districts',
     '<p>'+escape(nation.publicDescription())+'</p><pre class="career-district-register">'+escape(nation.registerText())+'</pre>');
    break;
   }
   case 'careerMenuOptions':openTitleDialog('Options','<p>Period menu settings will be added in later builds.</p>');break;
  }
 });
 menu.querySelector('#careerMenuName').addEventListener('keydown',e=>{if(e.key==='Enter')create()});
 document.addEventListener('keydown',e=>{
  if(menu.hidden||e.target.closest('input,textarea,select,[contenteditable]'))return;
  if(e.code==='KeyM'){e.stopImmediatePropagation();e.preventDefault();}
 },true);
 // Clicking an old title hotspot cannot reveal the former front page;
 // the old office remains solely in the archive, not in any playable desk.
 window.FE_CAREER_SHELL=Object.freeze({open,refreshDesk,renderMenu});
 refreshDesk();renderMenu();pauseTitleAudio();
})();