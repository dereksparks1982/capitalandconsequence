/* Charles Whitcomb: interactive pre-campaign Alexandria-to-Washington vignette.
 * A one-time authored opening, NOT an inaccurate simulated/new maritime route.
 * Character choices use the actual saved family record; no money, time,
 * inventory, ownership, map pixels or other careers are changed here.
 */
(function(root){
'use strict';
const SCENES=Object.freeze([
 Object.freeze({id:'alexandria',place:'Alexandria · Family Trading Office',setting:'Overland storehouses and account books',
  title:'Terms of Departure',
  story:'Your father has built his fortune on contracts, warehouses and trading caravans, not a fleet of ships. A veteran of British military service elsewhere, he runs his accounts with the discipline of an officer. The American electrical-components works will be yours to manage, but he is investing, not giving a gift.',
  detail:'The loan and his original voting stake are two different obligations. You may repay the debt. His shares will still be his.',
  options:Object.freeze([
   {id:'clear-accounts',title:'Promise him punctual, transparent company accounts',effect:'A disciplined business approach.'},
   {id:'independence',title:'Request latitude to make American business decisions',effect:'A firmer claim to your own authority.'},
   {id:'consult',title:'Agree to consult him on major commercial risks',effect:'A cooperative opening arrangement.'}
  ])}),
 Object.freeze({id:'departure',place:'Alexandria · Departure Quay',setting:'A passenger crossing begins',
  title:'Leaving Home',
  story:'The docks are busy with merchants, stevedores and passengers. Your mother is Egyptian, your father British, and Alexandria is the place that made you who you are. Ahead lies a sea crossing and a factory in Washington with your name attached to its future.',
  detail:'No free shipping contracts accompany the family name. Your father trades overland. Any future maritime contacts must be earned.',
  options:Object.freeze([
   {id:'mother-letter',title:'Write a private farewell letter to your mother',effect:'Family affection matters beyond the balance sheet.'},
   {id:'manifest',title:'Read the passage papers and study the freight accounts',effect:'Keep your business arrangements in order.'},
   {id:'quiet',title:'Spend the departure quietly with your own thoughts',effect:'You set out on your own terms.'}
  ])}),
 Object.freeze({id:'cabin',place:'At Sea · Passenger Cabin',setting:'An introductory passage, not a charted game voyage',
  title:'The Ledger at Sea',
  story:'Days at sea give you time to study the proposed Washington works. A modest factory, early electrical apparatus and one paid assistant are the beginning of a venture that must eventually stand on its own. Every monthly installment will come out of real company funds.',
  detail:'The American campaign begins at the existing factory on January 2, 1878. This opening does not move the normal clock or create an imaginary shipping route on your chart.',
  options:Object.freeze([
   {id:'reserve',title:'Set aside a plan for the first loan installment',effect:'Preparation for the first bill.'},
   {id:'workshop',title:'Review the equipment and components before arrival',effect:'Practical priorities for the works.'},
   {id:'aspiration',title:'Write down why you want an independent future',effect:'A private resolution to build something of your own.'}
  ])}),
 Object.freeze({id:'washington',place:'Washington · Federal Electric',setting:'January 2, 1878 · The established campaign',
  title:'The Works Are Waiting',
  story:'The factory, property, workshop tools and opening operating funds have already been financed. Your father owns one quarter of the voting equity; you own three quarters and control the day-to-day works for now. The first payment is due next month, and Sullivan is your only hired workshop assistant.',
  detail:'The paper map, factory and city remain precisely as they were. From here, the world clock, contracts, personal cash, corporate voting and ordinary Washington travel take over.',
  options:Object.freeze([
   {id:'start-books',title:'Open the Business Ledger and begin the day',effect:'Start with accounts and obligations.'},
   {id:'start-works',title:'Inspect the electrical-components workshop first',effect:'Start with the physical business.'},
   {id:'start-future',title:'Begin work, determined to earn your independence',effect:'Start with a personal ambition.'}
  ])})
]);
const ids=Object.freeze(Object.fromEntries(SCENES.map((s,i)=>[s.id,i])));
function completed(){return {version:1,stage:SCENES.length,finished:true,history:[],started:false};}
function ensure(save){
 if(!save||typeof save!=='object')throw Error('A saved profile is required.');
 if(save.characterRoute!=='industrialist')return null;
 if(!save.whitcombIntro)save.whitcombIntro=completed(); // Old campaigns never lose progress or replay a new opening.
 const state=save.whitcombIntro;
 if(state.version!==1||!Number.isInteger(state.stage)||state.stage<0||state.stage>SCENES.length||
  !Array.isArray(state.history))throw Error('Unrecognized introduction state. The original save was not reset.');
 return state;
}
function begin(save){
 if(!save||save.characterRoute!=='industrialist')return {ok:false,reason:'This introduction belongs to Charles Whitcomb.'};
 if(save.whitcombIntro)return {ok:false,reason:'An introduction already exists for this character.'};
 save.whitcombIntro={version:1,stage:0,finished:false,history:[],started:true};
 return {ok:true,stage:0};
}
function current(save){
 const state=ensure(save);
 if(!state||state.finished||state.stage>=SCENES.length)return null;
 return SCENES[state.stage];
}
function choose(save,optionId){
 const state=ensure(save),scene=current(save);
 if(!scene)return {ok:false,reason:'The opening has already finished or is unavailable.'};
 if(save.paused)return {ok:false,reason:'The opening cannot proceed while paused.'};
 const option=scene.options.find(o=>o.id===optionId);
 if(!option)return {ok:false,reason:'That decision is not available in this scene.'};
 if(state.history.some(e=>e.scene===scene.id))return {ok:false,reason:'This scene already has a saved decision.'};
 // Relationship consequences use an existing, uniquely identified family event.
 const family=root.FE_WHITCOMB_FAMILY;
 const outcome=family?.recordChoice?.(save,option.id,'intro:'+scene.id+':'+option.id);
 if(!outcome?.ok)return {ok:false,reason:outcome?.reason||'The family record is unavailable.'};
 const record={scene:scene.id,option:option.id,title:option.title,description:option.effect};
 state.history.push(record);
 state.stage++;
 if(state.stage>=SCENES.length)state.finished=true;
 return {ok:true,finished:state.finished,stage:state.stage,decision:record};
}
const api=Object.freeze({SCENES,ids,ensure,begin,current,choose});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WHITCOMB_INTRO=api;
})(typeof window!=='undefined'?window:globalThis);
