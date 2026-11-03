/* Capital & Consequence v0.7.103: six named life routes and their approved portrait assets.
   Existing internal route IDs are permanent save identifiers; do not rename them.
   Career foundations do not imply that every business simulation is complete. */
(function(){
 'use strict';
 const ROUTES=Object.freeze([
  Object.freeze({id:'industrialist',name:'Businessman',characterName:'Charles Whitecomb',status:'playable',deskTitle:'Executive Office',deskColor:'green',
   startingLocationId:'factory',paperDoll:'assets/artwork/characters/paperdolls/paperdoll.png',
   portrait:"assets/artwork/characters/portraits/Charles Whitecomb_ Contemplative Portrait in Burgundy and Gold.png",
   summary:'Own Federal Electric. Manage electrical production, contracts, finances and the family investment.',
   systems:Object.freeze(['factory','Federal Exchange','contracts','society'])}),
  Object.freeze({id:'investigator',name:'Patrolman',characterName:'Samuel Harlan',status:'foundation',deskTitle:'Station Duty Desk',deskColor:'blue',
   startingLocationId:'metropolitanPolice',startingRoomId:'station-duty-room',paperDoll:null,
   portrait:"assets/artwork/characters/portraits/Samuel Harlan_ Rookie Hillsdale Patrolman in Oil Paint.png",
   summary:'Rookie Black patrolman assigned to the Hillsdale beat. Clock in, patrol on duty and file routine reports.',
   systems:Object.freeze(['walking beat','ordinary incidents','station paperwork','future promotions'])}),
  Object.freeze({id:'criminal',name:'Doorman',characterName:'Elias Crowe',status:'foundation',deskTitle:'Private Writing Desk',deskColor:'red',
   startingLocationId:'secondNightclub',startingRoomId:'doorman-post',paperDoll:null,
   portrait:"assets/artwork/characters/portraits/Elias Crowe_ Weary Victorian Outlaw Portrait.png",
   summary:'Work the entrance at the Golden Peacock. Handle visitors, earn wages and navigate the city underworld.',
   systems:Object.freeze(['nightclub doorman shifts','wages','ordinary visitors','off-duty choices'])}),
  Object.freeze({id:'wardman',name:'Asylum Orderly',characterName:'Edmund Wardman',status:'foundation',deskTitle:'Hospital Duty Desk',deskColor:'cream',
   startingLocationId:'blackwoodAsylum',paperDoll:null,
   portrait:"assets/artwork/characters/portraits/Edmund Wardman_ Weary Asylum Orderly.png",
   summary:'An orderly at District Asylum, where his older brother runs the institution. Perform rounds and keep records.',
   systems:Object.freeze(['hospital duty','patient records','institutional politics','advancement'])}),
  Object.freeze({id:'proprietor',name:'Star Club Owner',characterName:'Bridget Kennedy',status:'foundation',deskTitle:'Star Club Proprietor’s Office',deskColor:'red',
   startingLocationId:'star',startingRoomId:'owner-office',paperDoll:null,
   portrait:"assets/artwork/characters/portraits/Bridget Kennedy_ Regal Irish Redhead in Emerald Velvet.png",
   summary:'Own the Star Club while Madame Star oversees daily operations. Proprietor finances and staff systems are in development.',
   systems:Object.freeze(['Star Club','proprietor office','resident manager','future accounts'])}),
  Object.freeze({id:'mariner',name:'Shipping Merchant',characterName:'Benjamin Leach',status:'foundation',deskTitle:'Salem Wharf Office',deskColor:'blue',
   startingLocationId:'salemHarbor',startingRoomId:'leach-office',paperDoll:null,
   portrait:"assets/artwork/characters/portraits/Benjamin Leach_ Weathered Maritime Captain Portrait.png",
   summary:'A self-made Salem shipping merchant. Visit his wharf office and inspect the world shipping chart; trade management is in development.',
   systems:Object.freeze(['Salem harbor','shipping chart','merchant records','future cargo trade'])})
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
  info.textContent='Six selectable lives. Charles has the developed industrial career; the others have working foundations with further career systems in progress.';
  target.appendChild(info);
  for(const route of ROUTES){
   const row=document.createElement('label');row.className='title-character-route';
   const input=document.createElement('input');input.type='radio';input.name='characterRoute';input.value=route.id;input.checked=route.id==='industrialist';row.appendChild(input);
   const name=document.createElement('strong');name.textContent=route.characterName;row.appendChild(name);
   const state=document.createElement('small');state.textContent=route.status==='playable'?'Business career':'Career foundation';row.appendChild(state);
   target.appendChild(row);
  }
 }
 window.FE_CHARACTERS=Object.freeze({list,get,normalize,label,canStart,selected,renderChoices});
})();
