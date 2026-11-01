/* Full 78-card, art-agnostic tarot engine for a future roaming reader.
 * No external libraries, online services or art. Shuffle/draw requires an
 * explicit player encounter; nothing in a spread predicts actual game events.
 */
(function(root){
'use strict';
const MAJOR=Object.freeze(['The Fool','The Magician','The High Priestess','The Empress','The Emperor',
 'The Hierophant','The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune',
 'Justice','The Hanged Man','Death','Temperance','The Devil','The Tower','The Star',
 'The Moon','The Sun','Judgement','The World']);
const SUITS=Object.freeze(['Wands','Cups','Swords','Pentacles']);
const RANKS=Object.freeze(['Ace','Two','Three','Four','Five','Six','Seven','Eight',
 'Nine','Ten','Page','Knight','Queen','King']);
const CARDS=Object.freeze([
 ...MAJOR.map((name,i)=>Object.freeze({id:'major-'+i,arcana:'major',name,number:i,artKey:'major-'+i})),
 ...SUITS.flatMap(suit=>RANKS.map((rank,i)=>Object.freeze({
  id:suit.toLowerCase()+'-'+(i+1),arcana:'minor',suit,rank,number:i+1,
  name:rank+' of '+suit,artKey:suit.toLowerCase()+'-'+(i+1)
 })))
]);
const SPREADS=Object.freeze({
 single:Object.freeze(['Present concern']),
 three:Object.freeze(['Past','Present','Possible future']),
 decision:Object.freeze(['What is known','What is hidden','A possible course']),
 crossroads:Object.freeze(['One path','Another path','What deserves attention'])
});
function seedHash(input){
 let x=2166136261;for(const ch of String(input)){x^=ch.charCodeAt(0);x=Math.imul(x,16777619)}return x>>>0;
}
function shuffle(seed){
 let x=seedHash(seed)||0x12345678;
 const rand=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296};
 const deck=CARDS.map(x=>x.id);
 for(let i=deck.length-1;i>0;i--){
  const j=Math.floor(rand()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];
 }
 return {deck,rand};
}
function draw(seed,spread='three'){
 const positions=SPREADS[spread];
 if(!positions)return {ok:false,reason:'Unknown spread.'};
 const {deck,rand}=shuffle(seed),selection=deck.slice(0,positions.length);
 return {ok:true,spread,cards:selection.map((id,index)=>({
  ...CARDS.find(card=>card.id===id),position:positions[index],reversed:rand()<.27
 }))};
}
function reading(save,{readerId,encounterId,spread='three',feeCents=0}={}){
 const t=Number.isSafeInteger(save?.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null;
 if(t===null||!readerId||!encounterId)return {ok:false,reason:'An actual local reading encounter is required.'};
 if(!Number.isSafeInteger(feeCents)||feeCents<0||feeCents>10000)return {ok:false,reason:'Invalid sitting price.'};
 if(!save.tarotSessions)save.tarotSessions=[];
 const prior=save.tarotSessions.find(e=>e.encounterId===encounterId);
 if(prior)return {ok:true,replayed:true,session:prior};
 if(Math.round((Number(save.personalCash)||0)*100)<feeCents)return {ok:false,reason:'You cannot afford this reading.'};
 const picked=draw(save.characterRoute+'|'+t+'|'+readerId+'|'+encounterId,spread);
 if(!picked.ok)return picked;
 save.personalCash=Math.round((Math.round(save.personalCash*100)-feeCents))/100;
 const session={encounterId:String(encounterId),readerId:String(readerId),minute:t,
  spread,cards:picked.cards,feeCents};
 save.tarotSessions.push(session);
 save.tarotSessions=save.tarotSessions.slice(-80);
 return {ok:true,replayed:false,session};
}
const api=Object.freeze({CARDS,MAJOR,SUITS,RANKS,SPREADS,shuffle,draw,reading});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_TAROT=api;
})(typeof window!=='undefined'?window:globalThis);
