/* Fight Club: voluntary unranked bouts. The social bond persists, not a title. */
(function(root){'use strict';
function ensure(state){
 if(!state||typeof state!=='object')throw Error('Underground save required');
 if(!state.brotherhood||typeof state.brotherhood!=='object')state.brotherhood={version:1,meetings:0,peers:{},fights:[],lastFightDate:null};
 if(!state.brotherhood.peers||typeof state.brotherhood.peers!=='object')state.brotherhood.peers={};
 if(!Array.isArray(state.brotherhood.fights))state.brotherhood.fights=[];
 return state.brotherhood;
}
function volunteer(state,{date,opponent,won}){
 const b=ensure(state);
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Date required');
 if(b.lastFightDate===date)throw Error('Already volunteered to fight tonight');
 if(typeof opponent!=='string'||!opponent.trim()||opponent.length>80)throw Error('Participating opponent required');
 if(typeof won!=='boolean')throw Error('Completed fight result required');
 b.lastFightDate=date;b.meetings++;
 b.peers[opponent]=(b.peers[opponent]||0)+1;
 b.fights.push({date,opponent,won});
 if(b.fights.length>45)b.fights.splice(0,b.fights.length-45);
 return {won,opponent,meetings:b.meetings,message:won?'You won tonight. Another night may go differently.':'You lost tonight. The brothers still welcome you.'};
}
const api=Object.freeze({version:1,ensure,volunteer});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_FIGHT_CLUB=api;
})(typeof window!=='undefined'?window:globalThis);
