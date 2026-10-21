/* Federal Electric v0.6.14: shared-city, multiple-story framework.
   Only the existing industrialist story is playable. Other character paths
   are proposals, not mislabeled as working or a forced identity change. */
(function(){
 'use strict';
 const ROUTES=Object.freeze([
  Object.freeze({id:'industrialist',name:'Businessman / Tycoon',status:'playable',
   startingLocationId:'factory',paperDoll:'assets/artwork/characters/paperdolls/paperdoll.png',
   summary:'Build Federal Electric, invest, socialize and explore Washington.',
   systems:Object.freeze(['factory','Federal Exchange','business contracts','civil society'])}),
  Object.freeze({id:'investigator',name:'Police / Private Eye',status:'planned',
   startingLocationId:null,paperDoll:null,
   summary:'Investigations, witnesses, evidence, private clients and the same Washington streets.',
   systems:Object.freeze(['case files','contacts','evidence chains','police or private practice'])}),
  Object.freeze({id:'criminal',name:'Criminal / Outlaw',status:'planned',
   startingLocationId:null,paperDoll:null,
   summary:'Underworld contacts, risk, concealment and persistent repercussions. An optional dark thriller storyline remains undecided.',
   systems:Object.freeze(['underground venues','illicit enterprises','investigations','consequences'])})
 ]);
 function list(){return ROUTES.map(r=>({...r,systems:[...r.systems]}))}
 function get(id){const r=ROUTES.find(v=>v.id===id);return r?{...r,systems:[...r.systems]}:null}
 function normalize(id){return get(id)?.id||'industrialist'}
 function label(id){return get(id)?.name||'Businessman / Tycoon'}
 function canStart(id){return get(id)?.status==='playable'}
 function renderChoices(){
  const target=document.getElementById('titleCharacterChoices');if(!target)return;
  target.replaceChildren();
  const info=document.createElement('p');info.textContent='Character story: the business route is playable today. Other lives are planned for this same Washington.';target.appendChild(info);
  for(const route of ROUTES){
   const row=document.createElement('div');row.className='title-character-route';
   const name=document.createElement('strong');name.textContent=route.name;row.appendChild(name);
   const state=document.createElement('small');state.textContent=route.status==='playable'?'Selected · Available':'Future story · Not selectable yet';row.appendChild(state);
   target.appendChild(row);
  }
 }
 window.FE_CHARACTERS=Object.freeze({list,get,normalize,label,canStart,renderChoices});
})();
