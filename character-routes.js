/* Federal Electric v0.6.33: four independent Washington career foundations.
   Industrialist retains the only complete profession-specific gameplay.
   The other three open honest, shared-city desk previews for later expansion. */
(function(){
 'use strict';
 const ROUTES=Object.freeze([
  Object.freeze({id:'industrialist',name:'Businessman',status:'playable',deskTitle:'Executive Office',deskColor:'green',
   startingLocationId:'factory',paperDoll:'assets/artwork/characters/paperdolls/paperdoll.png',
   summary:'Own Federal Electric. Manage contracts, production, investments and private influence.',
   systems:Object.freeze(['factory','Federal Exchange','contracts','society'])}),
  Object.freeze({id:'investigator',name:'Patrolman',status:'foundation',deskTitle:'Station Duty Desk',deskColor:'blue',
   startingLocationId:null,paperDoll:null,
   summary:'Start on the beat. Investigate a murder, interview suspects, compare evidence and submit an accusation. Promotions and patrols will follow.',
   systems:Object.freeze(['patrol','incident reports','case files','evidence'])}),
  Object.freeze({id:'criminal',name:'Layman',status:'foundation',deskTitle:'Private Writing Desk',deskColor:'red',
   startingLocationId:null,paperDoll:null,
   summary:'Begin as an ordinary civilian. Honest work, property and an optional underworld path lie ahead.',
   systems:Object.freeze(['civilian life','work','opportunity','underworld choices'])}),
  Object.freeze({id:'wardman',name:'Wardman',status:'foundation',deskTitle:'Hospital Duty Desk',deskColor:'cream',
   startingLocationId:null,paperDoll:null,
   summary:'An unfavored member of the Wardman family begins in institutional service. Rise through the ranks over years.',
   systems:Object.freeze(['hospital duty','patient records','institutional politics','advancement'])})
 ]);
 function list(){return ROUTES.map(r=>({...r,systems:[...r.systems]}))}
 function get(id){const r=ROUTES.find(v=>v.id===id);return r?{...r,systems:[...r.systems]}:null}
 function normalize(id){return get(id)?.id||'industrialist'}
 function label(id){return get(id)?.name||'Businessman'}
 function canStart(id){return !!get(id)}
 function selected(){return normalize(document.querySelector('input[name="characterRoute"]:checked')?.value||'industrialist')}
 function renderChoices(){
  const target=document.getElementById('titleCharacterChoices');if(!target)return;
  target.replaceChildren();
  const info=document.createElement('p');
  info.textContent='All four careers have desks and the shared city. Businessman is the only fully implemented career. The other three begin as previews.';
  target.appendChild(info);
  for(const route of ROUTES){
   const row=document.createElement('label');row.className='title-character-route';
   const input=document.createElement('input');input.type='radio';input.name='characterRoute';input.value=route.id;input.checked=route.id==='industrialist';row.appendChild(input);
   const name=document.createElement('strong');name.textContent=route.name;row.appendChild(name);
   const state=document.createElement('small');state.textContent=route.status==='playable'?'Playable career':'Desk and shared-city foundation only';row.appendChild(state);
   target.appendChild(row);
  }
 }
 window.FE_CHARACTERS=Object.freeze({list,get,normalize,label,canStart,selected,renderChoices});
})();