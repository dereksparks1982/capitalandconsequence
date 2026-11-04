/* Unnamed passage companions on physically walkable decks.
 * Their deck positions follow the player's saved world minute, never a second
 * clock, invisible fares, wages, homes, private canon or fabricated trade.
 */
(function(root){
'use strict';
const ship=typeof module==='object'&&module.exports?require('./merchant-shipboard.js'):root.FE_SHIPBOARD;
const PEOPLE=Object.freeze([
 {id:'traveler',label:'Fellow Traveler',role:'passenger',
  description:'A traveler carrying a worn notebook. Their name and destination beyond the ticketed voyage are unknown.'},
 {id:'cards',label:'Card-Table Passenger',role:'passenger',
  description:'Another traveler who spends some of the crossing beside the cards.'},
 {id:'steward',label:'Passenger Steward',role:'crew',
  description:'A shipboard worker attending public passenger areas. Their private quarters remain inaccessible.'}
]);
const replies=Object.freeze({
 traveler:{voyage:'There is time enough at sea to put one’s affairs in order. I keep my own notes, as you do.',
  ship:'Passengers come and go between the berths and the open deck. Not everyone wants conversation.',
  cards:'I have seen cards on the saloon table. That does not tell you what any stranger will wager.'},
 cards:{voyage:'A long passage gives a person time to practice patience. The sea will not hurry for us.',
  ship:'There is a table below when the ship is calm enough for cards.',
  cards:'A fair game needs every card on the table and no promises of easy money.'},
 steward:{voyage:'The vessel continues its passage while everyone goes about their business.',
  ship:'The passenger galley and drinking water are open to travelers. The crew areas are not.',
  cards:'You may visit the passenger card table, but keep the passageways clear.'}
});
const floorMod=(v,n)=>((v%n)+n)%n;
const no=reason=>({ok:false,reason}),yes=(reason,data={})=>({ok:true,reason,...data});
function ensure(save){
 const interior=ship.ensure(save);if(!interior)return null;
 let life=interior.life;
 if(!life||life.version!==1)life=interior.life={version:1,people:PEOPLE.map(p=>({id:p.id,role:p.role})),conversations:[]};
 if(!Array.isArray(life.conversations))life.conversations=[];
 return life;
}
function schedule(save,id){
 const steamer=save?.passengerSea?.voyage?.type==='steamer';
 const at=(deck,x,y)=>({deck,x,y});
 const lowerB=at('lower',3,steamer?5:3),saloon=at(steamer?'main':'lower',3,4),
  galley=at(steamer?'main':'lower',8,4),water=at(steamer?'main':'lower',9,6),
  lookout=at('upper',4,5),stairs=at(steamer?'main':'lower',6,2);
 if(id==='traveler')return [lowerB,galley,lookout,lowerB];
 if(id==='cards')return [lowerB,lookout,saloon,saloon];
 if(id==='steward')return [galley,galley,water,stairs];
 return null;
}
function key(p){return p.deck+':'+p.x+':'+p.y}
function findRoute(save,from,to){
 const all=ship.decks(save);if(!all||!from||!to)return [];
 const stack=[from],seen=new Set([key(from)]),parent=new Map(),found=key(to);
 for(let n=0;n<stack.length;n++){
  const p=stack[n],id=key(p);if(id===found)break;
  const candidates=[[p.x,p.y-1],[p.x-1,p.y],[p.x+1,p.y],[p.x,p.y+1]].map(([x,y])=>({deck:p.deck,x,y}));
  if(ship.tile(save,p.deck,p.x,p.y)==='H'){
   const index=all.findIndex(d=>d.id===p.deck);
   for(const next of [index-1,index+1])if(all[next]&&ship.tile(save,all[next].id,p.x,p.y)==='H')
    candidates.push({deck:all[next].id,x:p.x,y:p.y});
  }
  for(const q of candidates){
   const k=key(q);if(seen.has(k)||!ship.allowed(ship.tile(save,q.deck,q.x,q.y)))continue;
   seen.add(k);parent.set(k,id);stack.push(q);
  }
 }
 if(!seen.has(found))return [];
 const lookup=new Map(stack.map(p=>[key(p),p])),path=[];
 for(let cursor=found;cursor;cursor=parent.get(cursor))path.unshift(lookup.get(cursor));
 return path;
}
function positionAt(save,id,minute){
 if(!ship.decks(save)||!Number.isSafeInteger(minute))return null;
 const times=schedule(save,id);if(!times)return null;
 const tod=floorMod(minute,1440),slot=Math.floor(tod/360),
  prev=times[(slot+3)%4],next=times[slot],steps=Math.floor((tod-slot*360)/4);
 const path=findRoute(save,prev,next);
 return path.length?{...path[Math.min(path.length-1,steps)],id,
  moving:steps<path.length-1,target:next.deck}:{...next,id,moving:false,target:next.deck};
}
function position(save,id){return positionAt(save,id,save.worldCalendar?.worldMinute)}
function onDeck(save,deck){
 if(!ensure(save))return [];
 // Show two registered simulated travelers on real shipboard tiles. Their
 // stable scheduler IDs still drive walking and dialogue on older saves.
 const registryId=save?.passengerSea?.voyage?.registryId;
 const row=registryId&&root.FE_MERCHANT_MANIFEST?.ensure?.(save)?.voyages?.find(v=>v.id===registryId);
 const registered=row?.passengers?.filter(p=>p.role==='passenger')||[];
 return PEOPLE.map(p=>{
  const visitor=p.id==='traveler'?registered[0]:p.id==='cards'?registered[1]:null;
  return {...p,...(visitor?{label:visitor.name,
   description:'Ticketed passenger on this voyage, registered in the ship manifest.'}:{}),
   ...position(save,p.id)};
 }).filter(p=>p.deck===deck);
}
function nearby(save){
 const me=ship.ensure(save);if(!me)return [];
 return onDeck(save,me.deck).filter(p=>Math.abs(p.x-me.x)+Math.abs(p.y-me.y)<=1);
}
function offerTalk(save,id,topic){
 if(!['voyage','ship','cards'].includes(topic))return no('Unknown conversation topic.');
 const actor=PEOPLE.find(p=>p.id===id),ready=ship.canAct(save,120);
 if(!actor)return no('This traveler is not aboard.');
 if(!ready.ok)return ready;
 const life=ensure(save),me=ship.ensure(save),other=position(save,id);
 if(!other||other.deck!==me.deck||Math.abs(other.x-me.x)+Math.abs(other.y-me.y)>1)
  return no('Reach the same deck and stand beside this person before speaking.');
 const now=save.worldCalendar.worldMinute;
 if(life.conversations.some(r=>r.id===id&&now-r.minute<30&&now-r.minute>=0))
  return no('You have already spoken with this person recently.');
 return yes('Conversation available.',{id,topic,start:now,voyageId:me.voyageId,seconds:120,position:{deck:other.deck,x:other.x,y:other.y}});
}
function finishTalk(save,offer){
 if(!offer?.ok||!offer.id||!PEOPLE.some(p=>p.id===offer.id))return no('No verified meeting began.');
 const life=ensure(save),me=ship.ensure(save);
 if(!life||!me||me.voyageId!==offer.voyageId||save.worldCalendar?.worldMinute!==offer.start+2)
  return no('The passage changed before the conversation could be recorded.');
 const other=positionAt(save,offer.id,offer.start);
 if(!other||other.deck!==me.deck||Math.abs(other.x-me.x)+Math.abs(other.y-me.y)>1)
  return no('The speaker was not physically nearby when the conversation began.');
 if(life.conversations.some(r=>r.id===offer.id&&r.minute===offer.start))
  return no('That conversation is already on record.');
 const answer=replies[offer.id]?.[offer.topic];if(!answer)return no('Unrecognized conversation.');
 const record={id:offer.id,topic:offer.topic,minute:offer.start,answer};
 life.conversations.push(record);life.conversations=life.conversations.slice(-90);
 return yes(answer,{record});
}
const api=Object.freeze({PEOPLE,ensure,schedule,findRoute,positionAt,position,onDeck,nearby,offerTalk,finishTalk});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_SHIPBOARD_LIFE=api;
})(typeof window!=='undefined'?window:globalThis);
