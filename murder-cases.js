/* Federal Electric v0.6.53: source-only investigative mystery engine.
 * Generated truth precedes testimony, with independently testable evidence routes.
 * Profile-local deterministic data; no offscreen clock ticks or player omniscience.
 * Concepts informed by MIT-licensed Mysterious Murder and Cold Truth.
 */
(function(root){
 'use strict';
 const DEFAULT_ROSTER=Object.freeze([
  {id:'madamStar',name:'Madam Star',occupation:'Club proprietor',impulse:15},
  {id:'foremanSullivan',name:'Foreman Sullivan',occupation:'Factory foreman',impulse:8},
  {id:'eddieDoyle',name:'Eddie Doyle',occupation:'Bookmaker',impulse:26},
  {id:'inspectorHayes',name:'Inspector Arthur Hayes',occupation:'Police inspector',impulse:6},
  {id:'chenMei',name:'Chen Mei',occupation:'Merchant',impulse:9},
  {id:'liWen',name:'Li Wen',occupation:'Merchant',impulse:12},
  {id:'pavelOrlov',name:'Pavel Orlov',occupation:'Trade representative',impulse:18},
  {id:'claraWells',name:'Clara Wells',occupation:'Housekeeper',impulse:9},
  {id:'samuelPrice',name:'Samuel Price',occupation:'Railway clerk',impulse:15},
  {id:'elizaHolt',name:'Eliza Holt',occupation:'Bookbinder',impulse:11},
  {id:'henryBell',name:'Henry Bell',occupation:'Business agent',impulse:18},
  {id:'francesReed',name:'Frances Reed',occupation:'Telegraph operator',impulse:13}
 ]);
 const PLACES=Object.freeze([
  {id:'races',name:'Capital Race Grounds'},
  {id:'star',name:'Star Club'},
  {id:'oldChinatown',name:'Chinatown'},
  {id:'russianTradeHall',name:'Russian Trade Hall'},
  {id:'washingtonArena',name:'Washington Arena'},
  {id:'factory',name:'Federal Electric Factory'}
 ]);
 const METHODS=Object.freeze([
  {id:'blunt',name:'a heavy object',trace:'a patterned indentation beside the body'},
  {id:'shot',name:'a firearm',trace:'a spent cartridge found by the doorway'},
  {id:'poison',name:'a poisonous substance',trace:'residue in a drinking cup'}
 ]);
 const STAGES=Object.freeze({scene:'Physical examination',records:'Records inquiry',witness:'Witness interviews'});
 const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
 const pick=(arr,key)=>arr[hash(key)%arr.length];
 const validDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
 const cleanRoster=roster=>{
  if(!Array.isArray(roster)||roster.length<5||roster.length>80)throw Error('Five to eighty distinct adult residents required');
  const seen=new Set();
  return roster.map(r=>{
   if(!r||typeof r.id!=='string'||!/^[a-z][a-zA-Z0-9-]{1,39}$/.test(r.id)||seen.has(r.id)||
    typeof r.name!=='string'||!r.name.trim()||typeof r.occupation!=='string')throw Error('Invalid resident identity');
   seen.add(r.id);
   return {id:r.id,name:r.name.slice(0,90),occupation:r.occupation.slice(0,90),
    impulse:Number.isFinite(+r.impulse)?Math.max(1,Math.min(100,Math.floor(+r.impulse))):10};
  });
 };
 function weightedCulprit(pool,key){
  // Everybody has a nonzero chance. Impulse is propensity, not proof of guilt.
  const weights=pool.map(r=>1+r.impulse),sum=weights.reduce((a,b)=>a+b,0);
  let roll=hash(key)%sum;
  for(let i=0;i<pool.length;i++){roll-=weights[i];if(roll<0)return pool[i]}
  return pool[pool.length-1];
 }
 function createCase(profileId,date,roster=DEFAULT_ROSTER,serial=1){
  if(typeof profileId!=='string'||!profileId||!validDate(date)||!Number.isSafeInteger(serial)||serial<1)
   throw Error('Valid profile, calendar date and case serial required');
  const pool=cleanRoster(roster),seed=profileId+'|'+date+'|'+serial+'|washington-mystery-v1';
  const victim=pick(pool,seed+'victim');
  const available=pool.filter(x=>x.id!==victim.id);
  const culprit=weightedCulprit(available,seed+'culprit');
  const others=available.filter(x=>x.id!==culprit.id).sort((a,b)=>hash(seed+a.id)-hash(seed+b.id));
  const suspects=[culprit,...others.slice(0,3)].sort((a,b)=>hash(seed+'suspect'+a.id)-hash(seed+'suspect'+b.id));
  const decoys=suspects.filter(x=>x.id!==culprit.id);
  const scene=pick(PLACES,seed+'scene'),method=pick(METHODS,seed+'method');
  const hour=9+hash(seed+'hour')%12,minute=hash(seed+'minute')%4*15;
  const time=date+'T'+String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0');
  const byId=id=>pool.find(x=>x.id===id);
  const clues=[
   {id:'physical-match',stage:'scene',thread:'means',source:scene.name+' examination',
    text:'The scene shows '+method.trace+'. Two people are linked to a matching object: '+culprit.name+' and '+decoys[0].name+'.',
    candidates:[culprit.id,decoys[0].id]},
   {id:'financial-dispute',stage:'records',thread:'motive',source:'District commercial records',
    text:'Correspondence shows a serious dispute involving '+victim.name+', '+culprit.name+' and '+decoys[1].name+'.',
    candidates:[culprit.id,decoys[1].id]},
   {id:'visitor-timeline',stage:'witness',thread:'opportunity',source:'Independent street witness',
    text:'A witness recalls seeing '+culprit.name+' or '+decoys[2].name+' near '+scene.name+' around '+time.slice(11)+'.',
    candidates:[culprit.id,decoys[2].id]},
   {id:'unconfirmed-rumor',stage:'witness',thread:'rumor',source:'Unverified neighborhood report',
    text:'A rumor names '+decoys[0].name+'. Nobody has corroborated it, and it is not established evidence.',
    candidates:[]}
  ];
  const alibis={};
  for(const s of suspects){
   const liar=s.id===culprit.id;
   alibis[s.id]={
    actorId:s.id,
    text:liar?'I was elsewhere that evening. There is no reason to place me there.':
     'I had errands of my own. I cannot account for every quarter hour.',
    claimedAway:liar,
    veracity:liar?'false':'unverified'
   };
  }
  const result={version:1,id:'washington-case-'+serial,serial,date,placeId:scene.id,placeName:scene.name,
   title:'Death Report: '+victim.name,
   summary:victim.name+' was found dead near '+scene.name+'. Police have not established who is responsible.',
   victim:{...victim},suspects:suspects.map(x=>({...x})),clues,
   alibis,truth:{culpritId:culprit.id,method:method.name,time,victimId:victim.id,placeId:scene.id},
   discovered:[],interviewed:[],wrongAccusations:[],status:'open',lastAction:null};
  if(!validate(result))throw Error('Generated case failed unique-solution validation');
  return result;
 }
 function candidateIds(c){
  if(!c||!Array.isArray(c.suspects)||!Array.isArray(c.clues))return [];
  const parts=['means','motive','opportunity'].map(t=>c.clues.filter(e=>e.thread===t&&c.discovered.includes(e.id)));
  if(parts.some(p=>p.length===0))return [];
  return c.suspects.map(x=>x.id).filter(id=>parts.every(p=>p.some(e=>e.candidates.includes(id))));
 }
 function validate(c){
  if(!c||c.version!==1||!Array.isArray(c.suspects)||c.suspects.length!==4||!c.truth||!Array.isArray(c.clues))return false;
  const ids=c.suspects.map(x=>x.id);
  if(new Set(ids).size!==4||!ids.includes(c.truth.culpritId)||ids.includes(c.truth.victimId))return false;
  const core=['means','motive','opportunity'].map(thread=>c.clues.find(e=>e.thread===thread));
  if(core.some(e=>!e||!Array.isArray(e.candidates)||e.candidates.length<2||!e.candidates.includes(c.truth.culpritId)))return false;
  const all=ids.filter(id=>core.every(e=>e.candidates.includes(id)));
  return all.length===1&&all[0]===c.truth.culpritId;
 }
 function uncover(c,stage){
  if(!c||c.status!=='open')return {ok:false,reason:'Case is not open'};
  if(!Object.hasOwn(STAGES,stage))return {ok:false,reason:'Unknown inquiry'};
  const discoveries=c.clues.filter(x=>x.stage===stage&&!c.discovered.includes(x.id));
  if(!discoveries.length)return {ok:false,reason:'Already examined'};
  c.discovered.push(...discoveries.map(x=>x.id));
  c.lastAction={type:'inquiry',stage};
  return {ok:true,discovered:discoveries.map(x=>x.id)};
 }
 function interview(c,actorId){
  if(!c||c.status!=='open')return {ok:false,reason:'Case is not open'};
  if(!c.suspects.some(s=>s.id===actorId))return {ok:false,reason:'Unknown witness or suspect'};
  if(c.interviewed.includes(actorId))return {ok:false,reason:'Already interviewed'};
  c.interviewed.push(actorId);c.lastAction={type:'interview',actorId};
  return {ok:true,text:c.alibis[actorId].text};
 }
 function accuse(c,actorId){
  if(!c||c.status!=='open')return {ok:false,reason:'Case is not open'};
  if(!c.suspects.some(x=>x.id===actorId))return {ok:false,reason:'Unknown suspect'};
  if(c.wrongAccusations.includes(actorId))return {ok:false,reason:'This accusation was already investigated'};
  // No guesses until three distinct physical/record/testimonial evidence routes.
  if(!candidateIds(c).length)return {ok:false,reason:'Collect evidence from the scene, records and witnesses first'};
  if(actorId===c.truth.culpritId){
   c.status='solved';c.lastAction={type:'accusation',actorId,correct:true};
   return {ok:true,solved:true,reason:'The accusation fits the independently corroborated evidence'};
  }
  c.wrongAccusations.push(actorId);
  c.status=c.wrongAccusations.length>=3?'cold':'open';
  c.lastAction={type:'accusation',actorId,correct:false};
  return {ok:true,solved:false,reason:c.status==='cold'?'The inquiry has been closed after repeated unsupported accusations':'The accusation was not sustained'};
 }
 function publicFile(c){
  if(!c||!validate(c))return null;
  // Deliberately exclude truth, full alibi metadata, undiscovered clues,
  // raw suspect inclinations, and the hidden candidate sets.
  return {id:c.id,date:c.date,title:c.title,summary:c.summary,placeId:c.placeId,
   placeName:c.placeName,victimName:c.victim.name,status:c.status,
   suspects:c.suspects.map(x=>({id:x.id,name:x.name,occupation:x.occupation,
    statement:c.interviewed.includes(x.id)?c.alibis[x.id].text:null})),
   evidence:c.clues.filter(x=>c.discovered.includes(x.id)).map(x=>({
    id:x.id,thread:x.thread,source:x.source,text:x.text})),
   inquiries:Object.keys(STAGES).map(stage=>({id:stage,label:STAGES[stage],
    completed:c.clues.filter(x=>x.stage===stage).every(x=>c.discovered.includes(x.id))})),
   wrongAccusations:[...c.wrongAccusations],
   readyToAccuse:candidateIds(c).length===1,
   lastAction:c.lastAction?{...c.lastAction}:null};
 }
 const api=Object.freeze({DEFAULT_ROSTER,PLACES,STAGES,createCase,validate,uncover,interview,accuse,candidateIds,publicFile});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_MURDER_CASES=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
