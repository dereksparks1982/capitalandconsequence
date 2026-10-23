/* Capital & Consequence v0.6.60: first witnessed, saved NPC relationships.
 * A meeting requires simultaneous occupancy in the SAME public/staff-authorized
 * room. Records remain private to the active Washington save; newspapers and
 * contacts must not infer information from these undiscovered encounters.
 */
(function(root){
 'use strict';
 const hash=value=>{let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
 const clamp=v=>Math.max(-100,Math.min(100,Number.isFinite(v)?v:0));
 function ensure(world){
  if(!world||typeof world!=='object'||!world.agents||typeof world.agents!=='object')
   throw Error('Persistent NPC simulation required');
  if(!world.social||world.social.version!==1||!Array.isArray(world.social.history))
   world.social={version:1,lastKey:null,history:[]};
  return world.social;
 }
 function meet(world,definitions,context){
  if(!Array.isArray(definitions)||!context||typeof context.key!=='string'||!context.key||
    !Number.isSafeInteger(context.turn)||context.turn<1||
    typeof context.date!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(context.date))
   throw Error('Observed NPC clock period required');
  const ledger=ensure(world);
  if(ledger.lastKey===context.key)return [];
  const people=definitions.filter(d=>{
   const a=world.agents[d.id];return a&&a.status==='present'&&
    typeof a.locationId==='string'&&a.locationId&&typeof a.roomId==='string'&&a.roomId;
  });
  // Ordered reproducibly, with at most one encounter per NPC in this period.
  const pairs=[];
  for(let i=0;i<people.length;i++)for(let j=i+1;j<people.length;j++){
   const left=people[i],right=people[j],a=world.agents[left.id],b=world.agents[right.id];
   if(a.locationId!==b.locationId||a.roomId!==b.roomId)continue;
   const lo=left.id<right.id?left:right,hi=left.id<right.id?right:left;
   pairs.push({left:lo,right:hi,locationId:a.locationId,roomId:a.roomId,
    order:hash(String(world.seed)+'|'+context.key+'|'+lo.id+'|'+hi.id+'|order')});
  }
  pairs.sort((a,b)=>a.order-b.order||a.left.id.localeCompare(b.left.id)||a.right.id.localeCompare(b.right.id));
  const used=new Set(),records=[];
  for(const p of pairs){
   if(used.has(p.left.id)||used.has(p.right.id))continue;
   const roll=hash(String(world.seed)+'|'+context.key+'|'+p.left.id+'|'+p.right.id);
   if(roll%100>=70)continue;
   const a=world.agents[p.left.id],b=world.agents[p.right.id],prior=Number(a.relationships?.[p.right.id]||0);
   const caution=(Number(p.left.traits?.caution||60)+Number(p.right.traits?.caution||60))/2;
   const kind=roll%11===0&&prior<3?'disagreement':roll%7===0&&caution<78?'assistance':'conversation';
   const delta=kind==='disagreement'?-1:kind==='assistance'?2:1;
   for(const [person,other] of [[a,p.right.id],[b,p.left.id]]){
    if(!person.relationships||typeof person.relationships!=='object')person.relationships={};
    person.relationships[other]=clamp((Number(person.relationships[other])||0)+delta);
    if(!person.social||person.social.version!==1)
     person.social={version:1,encounters:0,assists:0,disagreements:0,last:null};
    person.social.encounters=Math.max(0,Math.floor(person.social.encounters||0))+1;
    if(kind==='assistance')person.social.assists=Math.max(0,Math.floor(person.social.assists||0))+1;
    if(kind==='disagreement')person.social.disagreements=Math.max(0,Math.floor(person.social.disagreements||0))+1;
    person.social.last={withId:other,kind,date:context.date,locationId:p.locationId,roomId:p.roomId,key:context.key};
   }
   const record={id:'meeting:'+context.key+':'+p.left.id+':'+p.right.id,
    type:'private-encounter',actorId:p.left.id,partnerId:p.right.id,turn:context.turn,
    date:context.date,locationId:p.locationId,roomId:p.roomId,kind,relationshipDelta:delta};
   ledger.history.push(record);records.push({...record});
   if(Array.isArray(world.events))world.events.push({...record});
   used.add(p.left.id);used.add(p.right.id);
  }
  if(ledger.history.length>160)ledger.history.splice(0,ledger.history.length-160);
  ledger.lastKey=context.key;
  return records;
 }
 const api=Object.freeze({ensure,meet});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_SOCIAL=api;
})(typeof window!=='undefined'?window:globalThis);
