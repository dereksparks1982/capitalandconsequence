/* A known person must be witnessed, reported by name or encountered.
 * No independent clock, no automatic omniscient map roster. */
(function(root){
'use strict';
const allowed=new Set(['encounter','newspaper','conversation','reported','introduction']);
function ensure(save){
 if(!save||typeof save!=='object')return null;
 if(!save.knownPeople||save.knownPeople.version!==1||!save.knownPeople.byId)
  save.knownPeople={version:1,byId:{}};
 return save.knownPeople;
}
function known(save,id){return typeof id==='string'&&!!ensure(save)?.byId?.[id];}
function learn(save,id,source='encounter',evidence=''){
 if(!id||typeof id!=='string'||!allowed.has(source)||!save)return false;
 const data=ensure(save);
 if(known(save,id))return false;
 const minute=Number.isSafeInteger(save.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null;
 data.byId[id]={source,minute,evidence:String(evidence||'').slice(0,110)};
 return true;
}
function exactMention(haystack,name){
 const text=haystack.replace(/[“”]/g,'"').toLocaleLowerCase('en');
 const term=name.replace(/[“”]/g,'"').toLocaleLowerCase('en').trim();
 if(!term||term.length<5)return false;
 let pos=text.indexOf(term);
 while(pos>=0){
  const left=pos===0?'':text[pos-1],right=text[pos+term.length]||'';
  if(!/[\p{L}\p{N}]/u.test(left)&&!/[\p{L}\p{N}]/u.test(right))return true;
  pos=text.indexOf(term,pos+1);
 }
 return false;
}
function fromText(save,text,source,roster){
 if(!['newspaper','conversation','reported'].includes(source)||
   typeof text!=='string'||!Array.isArray(roster)||!save)return [];
 const found=[];
 for(const person of roster){
  if(!person?.id||typeof person.name!=='string')continue;
  if(!exactMention(text,person.name))continue;
  if(learn(save,person.id,source,text.slice(0,110)))found.push(person.id);
 }
 return found;
}
const api=Object.freeze({ensure,known,learn,fromText});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_NPC_DISCOVERY=api;
})(typeof window!=='undefined'?window:globalThis);
