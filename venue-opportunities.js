/* v0.6.12: location-specific opportunities; proposed games are not playable. */
(function(){
'use strict';
const ITEMS=Object.freeze([{"id":"horse-racing","locationId":"races","name":"Horse Racing","group":"legal","panel":"horse","status":"existing"},{"id":"dog-racing","locationId":"potomacKennelTrack","name":"Dog Racing","group":"legal","panel":"dog","status":"existing"},{"id":"midget-racing","locationId":"capitalSpeedway","name":"Midget Car Racing","group":"legal","panel":"car","status":"existing"},{"id":"boxing","locationId":"washingtonArena","name":"Licensed Boxing","group":"legal","panel":"boxing","status":"existing"},{"id":"star","locationId":"star","name":"Star Club","group":"illicit","panel":"star","status":"existing"},{"id":"working-poker","locationId":"workingPoker","name":"Neighborhood Poker","group":"illicit","panel":"poker","status":"existing"},{"id":"commerce-poker","locationId":"commercePoker","name":"Commerce Club Poker","group":"illicit","panel":"poker","status":"existing"},{"id":"embassy-poker","locationId":"embassyPoker","name":"Embassy Room Poker","group":"illicit","panel":"poker","status":"existing"},{"id":"private-fight","locationId":"privateFightHall","name":"Private Prizefight","group":"illicit","panel":"private","status":"existing"},{"id":"cockfight","locationId":"cockfightingDen","name":"Cockfighting","group":"illicit","panel":"cock","status":"existing"},{"id":"baccarat","locationId":"licensedGamingHall","name":"Possible Licensed Baccarat","group":null,"panel":null,"status":"proposed"},{"id":"blackjack","locationId":"licensedGamingHall","name":"Possible Private Blackjack","group":null,"panel":null,"status":"proposed"},{"id":"roulette","locationId":"licensedGamingHall","name":"Possible Roulette","group":null,"panel":null,"status":"proposed"}].map(o=>Object.freeze(o)));
function get(id){const o=ITEMS.find(v=>v.id===id);return o?{...o}:null}
function entries(id){return ITEMS.filter(o=>o.locationId===id).map(o=>({...o}))}
function canEnterLocation(id){
 const l=window.FederalElectricCity?.getLocation(id);
 if(!l||l.plannedOnly||(l.availableFrom&&S.gameDate<l.availableFrom))return false;
 if(!l.hiddenFromDirectory)return true;
 if(id==='privateFightHall')return !!S.underworld?.privateFightsUnlocked;
 if(id==='cockfightingDen')return !!S.underworld?.cockfightsUnlocked;
 return false;
}
function canUse(id){
 const o=get(id);if(!o||o.status!=='existing'||!activeProfileId()||!canEnterLocation(o.locationId)||currentCityLocation().locationId!==o.locationId)return false;
 if(o.id==='commerce-poker'&&!S.middlePokerUnlocked)return false;
 if(o.id==='embassy-poker'&&!S.elitePokerUnlocked)return false;
 return true;
}
function renderRoomOpportunities(id){
 const panel=document.getElementById('cityRoomOpportunities'),box=document.getElementById('cityRoomOpportunityList');
 if(!panel||!box)return;box.replaceChildren();
 const list=entries(id);panel.hidden=list.length===0;
 for(const o of list){
  const row=document.createElement('div');row.className='city-room-opportunity';
  const label=document.createElement('strong');label.textContent=o.name;row.appendChild(label);
  const status=document.createElement('span');
  status.textContent=o.status!=='existing'?'Planning only':canUse(o.id)?'Available here':'Requires access';
  row.appendChild(status);
  if(o.status==='existing'){
   const button=document.createElement('button');button.type='button';button.textContent='Enter '+o.name;button.disabled=!canUse(o.id);button.onclick=()=>window.FE_CITY?.openLocalActivity?.(o.id);row.appendChild(button);
  }
  box.appendChild(row);
 }
}
window.FE_VENUES=Object.freeze({get,entries,canUse,canEnterLocation,renderRoomOpportunities,
 legalFramework:Object.freeze({licensing:'restricted',allowedCasinoCardGames:'undecided',prohibitedAnimalContests:true})});
})();