/* v0.6.15: Autonomous background lives in one profile's Washington.
   Seeded paths persist; announcements never reveal the actor's hidden identity.
   No offline progression and no random reroll after save/load. */
(function(){
 'use strict';
 const PATHS=Object.freeze({
  investigator:Object.freeze(['public-service','private-detective','political-career','compromised']),
  criminal:Object.freeze(['petty-offender','organized-crime','suspected-serial-offender','quiet-underworld'])
 });
 const SCHEDULE=16; // 4 business turns/month; each milestone is four calendar months.
 function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
 function roll(seed,id,key,n){return hash(seed+'|'+id+'|'+key)%n}
 function empty(){return {version:1,seed:null,lastProcessedTurn:0,actors:{},history:[]}}
 function ensure(){
  if(!S.otherLives||typeof S.otherLives!=='object')S.otherLives=empty();
  const world=S.otherLives;
  if(!Number.isSafeInteger(world.seed)||world.seed<0)world.seed=hash((activeProfileId()||'legacy')+'|living-characters-v1');
  if(!world.actors||typeof world.actors!=='object')world.actors={};
  if(!Array.isArray(world.history))world.history=[];
  if(!Number.isSafeInteger(world.lastProcessedTurn)||world.lastProcessedTurn<0)world.lastProcessedTurn=0;
  for(const id of Object.keys(PATHS)){
   if(id===S.characterRoute)continue;
   if(!world.actors[id]||typeof world.actors[id]!=='object'){
    const choices=PATHS[id];
    world.actors[id]={id,arc:choices[roll(world.seed,id,'arc',choices.length)],stage:0,lastTurn:0,status:'active'};
   }
  }
  return world;
 }
 function bulletin(id,arc,stage){
  const k=Math.min(stage,3);
  if(id==='investigator'){
   if(arc==='public-service')return ['DETECTIVE COMMENDED','A Washington investigator is receiving attention for persistent police work.',2];
   if(arc==='private-detective')return ['PRIVATE INQUIRY OFFICE OPENS','A former District investigator has opened an independent detective practice.',1];
   if(arc==='political-career')return ['INVESTIGATOR ENTERS CIVIC AFFAIRS','A Washington detective is becoming increasingly involved in public life.',1];
   return k<2?['QUESTIONS RAISED ABOUT POLICE CASE','Officials are reviewing complaints concerning an investigation.',1]:['INTERNAL POLICE INQUIRY WIDENS','District officials have opened a wider review of alleged misconduct.',2];
  }
  if(arc==='petty-offender')return k<2?['SHOPKEEPERS REPORT THEFTS','Several Washington merchants report a series of small thefts.',1]:['LOCAL SUSPECT QUESTIONED','Police questioned a suspect after a fresh set of reported petty thefts.',1];
  if(arc==='organized-crime')return k<2?['UNLICENSED CLUBS DRAW NOTICE','Officials report closer scrutiny of an underground gambling network.',1]:['POLICE PROBE CRIMINAL ORGANIZATION','Investigators describe a growing pattern of coordinated extortion and illegal gaming.',3];
  if(arc==='suspected-serial-offender')return k<2?['POLICE REVIEW POSSIBLY RELATED DEATHS','Investigators are comparing several deaths, without identifying a suspect or claiming a confirmed connection.',2]:['DISTRICT POLICE WIDEN DEATH INQUIRY','Detectives are pursuing new leads in a series of troubling deaths. No suspect has been named.',3];
  return ['DISTRICT OFFICIALS REPORT QUIET NIGHT','Police report little new information concerning several long-running underground inquiries.',0];
 }
 function advance(turn){
  const w=ensure(),target=Math.max(0,Math.floor(+turn||0));
  if(target<=w.lastProcessedTurn)return [];
  const publicItems=[];
  // Resolve milestones exactly once, in chronological order.
  for(let t=w.lastProcessedTurn+1;t<=target;t++){
   if(t<=1||t%SCHEDULE!==0)continue;
   for(const id of Object.keys(PATHS)){
    if(id===S.characterRoute)continue;
    const actor=w.actors[id];if(!actor)continue;
    actor.stage++;actor.lastTurn=t;
    const [headline,summary,priority]=bulletin(id,actor.arc,actor.stage);
    const record={id:id+'-turn-'+t,actorId:id,turn:t,date:S.gameDate,headline,summary,priority,public:priority>0};
    w.history.push(record);
    if(record.public&&t===target)publicItems.push({...record});
   }
  }
  w.lastProcessedTurn=target;
  if(w.history.length>256)w.history.splice(0,w.history.length-256);
  return publicItems;
 }
 function publishInPaper(items){
  if(!Array.isArray(items)||!items.length)return;
  const notable=items.filter(x=>x.public).sort((a,b)=>b.priority-a.priority)[0];
  if(!notable)return;
  // Club raid coverage remains the higher priority headline.
  const raid=String(S.headline||'').includes('RAID');
  if(notable.priority>=3&&!raid){
   S.headline=notable.headline;S.story=notable.summary;
  }else S.societyStory=(S.societyStory||'')+' '+notable.summary;
 }
 function publicHistory(){return ensure().history.filter(x=>x.public).map(x=>({turn:x.turn,date:x.date||null,headline:x.headline,summary:x.summary}));}
 function renderPublicDispatches(){
  const container=document.getElementById('washingtonPublicDispatches');if(!container)return;
  const reports=publicHistory().slice(-16).reverse();
  container.replaceChildren();
  if(!reports.length){
   const note=document.createElement('p');note.className='empty';note.textContent='No additional public dispatches have been filed.';container.appendChild(note);return;
  }
  for(const r of reports){
   const article=document.createElement('article');article.className='washington-dispatch';
   const mark=document.createElement('small');mark.textContent=r.date||'Turn '+r.turn;article.appendChild(mark);
   const title=document.createElement('strong');title.textContent=r.headline;article.appendChild(title);
   const paragraph=document.createElement('p');paragraph.textContent=r.summary;article.appendChild(paragraph);
   container.appendChild(article);
  }
 }
 window.FE_LIVING_CHARACTERS=Object.freeze({ensure,advance,publishInPaper,publicHistory,renderPublicDispatches});
})();
