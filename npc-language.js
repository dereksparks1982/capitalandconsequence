/* Capital & Consequence v0.6.61: NPC speech comprehension.
 * Language is a per-actor capability, not a shortcut to hidden facts.
 * English is the current documented default for residents with English speech.
 * More fluency, interpreters and language learning require earned world events.
 */
(function(root){
 'use strict';
 const valid=v=>typeof v==='string'&&/^[a-z]{2,3}$/.test(v);
 function spoken(def){
  if(!def||typeof def!=='object')return [];
  const list=Array.isArray(def.languages)?def.languages:
   [typeof def.language==='string'?def.language:'en'];
  return [...new Set(list.filter(valid))];
 }
 function common(first,second){
  const a=spoken(first),b=spoken(second);
  return a.find(code=>b.includes(code))||null;
 }
 function understands(listener,spokenLanguage){return valid(spokenLanguage)&&spoken(listener).includes(spokenLanguage)}
 const api=Object.freeze({spoken,common,understands});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_LANGUAGE=api;
})(typeof window!=='undefined'?window:globalThis);
