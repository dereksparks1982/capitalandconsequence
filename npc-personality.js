/* Capital & Consequence: individual social temperament and approach decisions.
 * No generative model required. Never use a demographic group as personality.
 */
(function(root){
 'use strict';
 const bounded=v=>Math.min(100,Math.max(0,Number.isFinite(+v)?+v:50));
 const PROFILE=Object.freeze({
  madamStar:{patience:86,politeness:94,pride:78,discretion:95,curiosity:69,honesty:73},
  luiDelacroix:{patience:57,politeness:73,pride:88,discretion:83,curiosity:92,honesty:49},
  foremanSullivan:{patience:66,politeness:78,pride:31,discretion:55,curiosity:62,honesty:85},
  eddieDoyle:{patience:54,politeness:64,pride:55,discretion:49,curiosity:84,honesty:38},
  inspectorHayes:{patience:36,politeness:66,pride:71,discretion:92,curiosity:69,honesty:81},
  chenMei:{patience:72,politeness:81,pride:47,discretion:67,curiosity:77,honesty:84},
  liWen:{patience:65,politeness:75,pride:64,discretion:79,curiosity:68,honesty:74},
  alexiRurik:{patience:35,politeness:43,pride:76,discretion:88,curiosity:58,honesty:61},
  annaPetrovna:{patience:67,politeness:75,pride:51,discretion:78,curiosity:65,honesty:79},
  pavelOrlov:{patience:70,politeness:86,pride:63,discretion:80,curiosity:73,honesty:77},
  samuelTilden:{patience:47,politeness:80,pride:73,discretion:90,curiosity:56,honesty:75}
 });
 function traits(def){
  const basis=PROFILE[def?.id]||{};
  const given=def?.traits||{};
  return Object.freeze(Object.fromEntries(
   ['sociability','caution','ambition','patience','politeness','pride','discretion','curiosity','honesty']
    .map(key=>[key,bounded(given[key]??basis[key]??50)])));
 }
 function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
 function approach(def,actor,visitor={},context={}){
  if(!def||!actor||!def.id)throw Error('NPC and social state required');
  const t=traits(def),date=String(context.date||''),guest=String(visitor.id||'stranger');
  const relationship=Math.min(100,Math.max(-100,Number(actor.relationships?.[guest])||0));
  const energy=bounded(actor.energy??80);
  const hunger=bounded(actor.needs?.hunger??25);
  const mood=bounded(actor.needs?.mood??65);
  const occupied=!!context.occupied;
  const topic=String(context.topic||'greet');
  const trust=relationship*.45;
  const score=t.sociability*.48+t.patience*.22+energy*.16+t.politeness*.13+
   trust-(occupied?20:0)-(topic==='work'&&occupied?14:0)-
   (hunger>70?(hunger-70)*.18:0)-(mood<45?(45-mood)*.25:0);
  const roll=hash(def.id+'|'+date+'|'+guest+'|'+topic)%100;
  // A well-mannered professional always acknowledges a polite greeting,
  // but this does not obligate them to disclose anything else.
  const greeting=t.sociability>=75&&t.politeness>=75&&topic==='greet';
  const allowed=greeting||score>=roll;
  const style=relationship<=-35?'guarded':t.pride>=80?'proud':t.politeness>=78?'courteous':
   t.sociability<=43?'reserved':'conversational';
  const reason=allowed?'':occupied?'I am occupied just now. Perhaps another time.':
   energy<=28?'I am weary and would rather rest just now.':
   hunger>=85?'I ought to find something to eat first.':
   t.politeness>=70?'Forgive me, but I do not wish to converse at present.':
   t.pride>=70?'I have nothing to discuss with you.':'Not now.';
  return Object.freeze({allowed,reason,style,score:Math.round(score),traits:t});
 }
 const api=Object.freeze({traits,approach});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_PERSONALITY=api;
})(typeof window!=='undefined'?window:globalThis);
