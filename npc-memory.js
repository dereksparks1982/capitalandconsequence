/* Capital & Consequence: private, bounded, importance-weighted NPC memory.
 * Inspired by AI Town's memory design, not its Convex runtime. No model needed.
 * Player statements are always unverified and must not become world truth.
 */
(function(root){
 'use strict';
 const valid=id=>typeof id==='string'&&/^[a-zA-Z][a-zA-Z0-9]{0,39}$/.test(id);
 const dateOK=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d);
 const clamp=(n,lo,hi)=>Math.min(hi,Math.max(lo,Number.isFinite(+n)?+n:lo));
 const weights=Object.freeze({greet:28,city:24,work:25,today:24,'authored-conversation':30,freeform:42,conversation:38,invitation:78,conflict:75,kindness:60,transaction:65,witness:82,reflection:40});
 function ensure(save){
  if(!save||typeof save!=='object')throw Error('NPC memory requires a profile save');
  if(!save.npcLongMemory||save.npcLongMemory.version!==1||
     !save.npcLongMemory.byResident||typeof save.npcLongMemory.byResident!=='object'||
     Array.isArray(save.npcLongMemory.byResident))
   save.npcLongMemory={version:1,byResident:{}};
  return save.npcLongMemory;
 }
 function entries(save,id){
  if(!valid(id))throw Error('Invalid NPC identity');
  const list=ensure(save).byResident[id];
  return Array.isArray(list)?list:[];
 }
 function remember(save,id,event){
  if(!valid(id)||!event||!dateOK(event.date)||typeof event.text!=='string'||!event.text.trim())
   throw Error('Valid NPC memory event required');
  const state=ensure(save),list=state.byResident[id]||(state.byResident[id]=[]);
  const key=typeof event.key==='string'&&event.key.length<=120?event.key:null;
  if(key&&list.some(item=>item.key===key))return false;
  const kind=String(event.kind||'conversation').slice(0,40);
  const memory={
   date:event.date,kind,key,withId:valid(event.withId)?event.withId:null,
   place:typeof event.place==='string'?event.place.slice(0,65):null,
   text:event.text.trim().slice(0,280),
   source:typeof event.source==='string'?event.source.slice(0,55):'personal-observation',
   verified:event.verified===true,
   importance:Math.round(clamp(event.importance??weights[kind]??30,1,100))
  };
  list.push(memory);
  if(list.length>80)list.splice(0,list.length-80);
  return true;
 }
 function recall(save,id,query={}){
  const all=entries(save,id),limit=Math.round(clamp(query.limit??5,1,8));
  const visible=all.filter(m=>(!query.withId||m.withId===query.withId)&&(!query.date||m.date<=query.date));
  return visible.map((m,i)=>{
   const score=m.importance+
    (query.place&&m.place===query.place?14:0)+
    (query.kind&&m.kind===query.kind?12:0)+
    Math.min(9,i/8);
   return {m,score};
  }).sort((a,b)=>b.score-a.score||b.m.date.localeCompare(a.m.date))
   .slice(0,limit).map(({m})=>({...m}));
 }
 function reflect(save,id,date,withId){
  if(!dateOK(date)||!valid(withId))return false;
  const all=entries(save,id);
  const key='reflection|'+date+'|'+withId;
  if(all.some(m=>m.key===key))return false;
  const meetings=all.filter(m=>m.withId===withId&&m.kind!=='reflection'&&m.date<=date);
  if(meetings.length<3)return false;
  const notable=meetings.filter(m=>m.importance>=35).length;
  return remember(save,id,{date,key,kind:'reflection',withId,importance:Math.min(75,35+notable*3),
   source:'personal-reflection',verified:false,
   text:'I have interacted with this person '+meetings.length+' times. My personal impression may be incomplete; their claims are not established facts.'});
 }
 const api=Object.freeze({ensure,entries,remember,recall,reflect});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_MEMORY=api;
})(typeof window!=='undefined'?window:globalThis);
