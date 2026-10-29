/* Private, append-only confirmed events, never NPC knowledge. */
(function(root){'use strict';
function ensure(save){
 if(!save||typeof save!=='object')throw Error('Playable life required');
 if(!save.lifeHistory||save.lifeHistory.version!==1||!Array.isArray(save.lifeHistory.events))
  save.lifeHistory={version:1,nextSequence:1,events:[]};
 const h=save.lifeHistory;
 if(!Number.isSafeInteger(h.nextSequence)||h.nextSequence<1)h.nextSequence=1+Math.max(0,...h.events.map(e=>e.sequence||0));
 return h;
}
function record(save,{id,date,source,text}={}){
 if(typeof id!=='string'||!id||id.length>140||typeof text!=='string'||!text)throw Error('Confirmed event identity and text required');
 const h=ensure(save);if(h.events.some(e=>e.id===id))return {status:'duplicate'};
 const event={id,sequence:h.nextSequence++,date:String(date||save.gameDate||'').slice(0,32),
 source:String(source||'Personal record').slice(0,100),text:text.slice(0,1500)};
 h.events.push(event);return {status:'recorded',event:{...event}};
}
function pages(save,size=12){
 const rows=ensure(save).events,out=[];
 for(let i=0;i<rows.length;i+=size)out.push({id:'life-history:'+i,section:'Life History',title:'Recorded Events',
 kicker:'Confirmed actions, as experienced by this character',paragraphs:[],
 items:rows.slice(i,i+size).map(e=>({heading:e.date+' · '+e.source,text:e.text}))});
 return out;
}
const api=Object.freeze({ensure,record,pages});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_LIFE_HISTORY=api;
})(typeof window!=='undefined'?window:globalThis);
