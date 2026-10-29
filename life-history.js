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
function syncBusiness(save){
 if(save?.characterRoute!=='industrialist')return {added:0};
 const h=ensure(save);
 if(!h.sources||typeof h.sources!=='object')h.sources={};
 let added=0;
 const sources=[
  {field:'transactions',label:'Brokerage transaction'},
  {field:'ledger',label:'Federal Electric daily accounts'}
 ];
 for(const entry of sources){
  const rows=Array.isArray(save[entry.field])?save[entry.field]:[];
  let cursor=Number.isSafeInteger(h.sources[entry.field])?h.sources[entry.field]:0;
  cursor=Math.max(0,Math.min(cursor,rows.length));
  for(let i=cursor;i<rows.length;i++){
   const row=rows[i];if(row===null||row===undefined)continue;
   const contents=typeof row==='string'?row:JSON.stringify(row);
   const date=typeof row==='object'&&row.date?String(row.date):save.gameDate;
   const result=record(save,{id:'business:'+entry.field+':'+i,date,
    source:entry.label,text:String(contents).slice(0,1500)});
   if(result.status==='recorded')added++;
  }
  h.sources[entry.field]=rows.length;
 }
 return {added};
}
function pages(save,size=12){
 const rows=ensure(save).events,out=[];
 for(let i=0;i<rows.length;i+=size)out.push({id:'life-history:'+i,section:'Life History',title:'Recorded Events',
 kicker:'Confirmed actions, as experienced by this character',paragraphs:[],
 items:rows.slice(i,i+size).map(e=>({heading:e.date+' · '+e.source,text:e.text}))});
 return out;
}
const api=Object.freeze({ensure,record,pages,syncBusiness});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_LIFE_HISTORY=api;
})(typeof window!=='undefined'?window:globalThis);
