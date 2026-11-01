/* Character-only fortune telling. The reader chooses all cards, then frames
 * a symbolic interpretation around the playable person's recorded life.
 * No real-world user information, secret NPC motives or deterministic prophecy.
 */
(function(root){
'use strict';
const CONCERNS=Object.freeze({
 industrialist:Object.freeze([
  {id:'business',name:'burden of business',observe:'Your enterprise demands more than money; it demands hours you cannot recover.',advice:'Delegating responsibility may preserve what your ambition has built.'},
  {id:'legacy',name:'legacy and solitude',observe:'A great name can fill a public hall and still leave a private house quiet.',advice:'Remember that a reputation and a life are not the same possession.'}]),
 investigator:Object.freeze([
  {id:'duty',name:'duty and the beat',observe:'The streets reward a steady eye, though they rarely offer simple answers.',advice:'Test what you witness before believing what the loudest voice claims.'},
  {id:'home',name:'family and service',observe:'Duty calls you out into Washington while home calls you back.',advice:'Do not confuse being needed with being unable to rest.'}]),
 criminal:Object.freeze([
  {id:'risk',name:'secrets and dangerous favors',observe:'An easy bargain often leaves a difficult debt behind it.',advice:'Question those who offer you safety at another person’s expense.'},
  {id:'freedom',name:'freedom and temptation',observe:'You prize the freedom to walk away, but each choice leaves a trace.',advice:'The surest escape may be the temptation you decline.'}]),
 wardman:Object.freeze([
  {id:'asylum',name:'the asylum and family influence',observe:'You live beneath the weight of other people’s authority and judgment.',advice:'Keep your own account of what you witness; a written fact outlives a rumor.'},
  {id:'self',name:'dignity and confinement',observe:'You are not always free to choose which doors open before you.',advice:'Protect your judgment, even when someone else claims the right to speak for you.'}])
});
const MEANINGS=Object.freeze({
 'The Fool':'a road opening where none seemed to exist',
 'The Magician':'skill brought into deliberate action',
 'The High Priestess':'an unanswered question that deserves silence',
 'The Empress':'care for people and things entrusted to you',
 'The Emperor':'authority that must answer for its decisions',
 'The Hierophant':'an institution and the customs that uphold it',
 'The Lovers':'a choice whose consequences touch other people',
 'The Chariot':'progress that asks for discipline',
 Strength:'endurance without needless cruelty',
 'The Hermit':'knowledge gained from stepping away',
 'Wheel of Fortune':'circumstances turning beyond anyone’s control',
 Justice:'the difference between accusation and proof',
 'The Hanged Man':'a sacrifice that might alter your perspective',
 Death:'an ending that allows another chapter to begin',
 Temperance:'moderation between competing demands',
 'The Devil':'a tempting bargain with unseen obligations',
 'The Tower':'a sudden interruption of fragile plans',
 'The Star':'hope that survives uncertainty',
 'The Moon':'shadows, rumors, and incomplete information',
 'The Sun':'something previously hidden coming plainly into view',
 Judgement:'an accounting of old decisions',
 'The World':'a chapter reaching its natural conclusion'
});
const SUITS=Object.freeze({
 Wands:'work, ambition, and difficult action',
 Cups:'companionship, loneliness, and emotional debts',
 Swords:'conflict, testimony, and dangerous decisions',
 Pentacles:'money, objects, wages, and material security'
});
function facts(save){
 const route=save?.characterRoute||'industrialist';
 const base=CONCERNS[route]||CONCERNS.industrialist;
 const out=base.map(x=>({...x}));
 const meters=save?.characterNeeds?.meters;
 if(meters&&Number(meters.energy)<30)out.unshift({id:'fatigue',name:'exhaustion',
  observe:'Your body has been asking for rest, though your obligations have not been quiet.',
  advice:'A person who will not rest may be forced to stop.'});
 if((save?.medicalRecords?.patients?.['player:'+route]?.collapses||0)>1)out.unshift({id:'repeated',name:'repeated collapse',
  observe:'You have fallen more than once, and an ordinary night no longer answers for the strain.',
  advice:'A longer recovery may be wiser than another brave declaration.'});
 if(Number(save?.personalCash)<5)out.unshift({id:'money',name:'scarce personal funds',
  observe:'Small expenses have begun to carry an unusual weight.',
  advice:'Count the coins you hold before trusting promises of easy riches.'});
 if(route==='industrialist'&&Number(save?.companyCash)<100)out.unshift({id:'factory',name:'factory finances',
  observe:'The works cannot thrive on reputation alone; men and materials must still be paid.',
  advice:'Guard the payroll more carefully than your pride.'});
 if(meters&&Number(meters.health)<45)out.unshift({id:'health',name:'recent illness or injury',
  observe:'A bodily weakness has made ordinary tasks harder than before.',
  advice:'Even a strong will must answer to an injured body.'});
 // Refer only to stories the character actually encountered or public
 // headlines; do NOT read another NPC's secret memories or the murder solver.
 const recentNotes=Array.isArray(save?.notes)?save.notes.slice(-12):[];
 const witnessed=recentNotes.map(n=>String(n?.source||'')+' '+String(n?.text||'')).join(' ');
 const headline=String(save?.headline||'')+' '+String(save?.societyStory||'');
 if(/\\b(?:murder|corpse|dead body|homicide|investigation)\\b/i.test(witnessed))
  out.unshift({id:'inquiry',name:'troubling events witnessed',
   observe:'A dark event has unsettled the ordinary course of your days.',
   advice:'Attend to what can be proved; fear and rumor are poor witnesses.'});
 if(/\\b(?:raid|scandal|disgrace|accusation)\\b/i.test(headline)&&route!=='wardman')
  out.unshift({id:'scandal',name:'public unrest in Washington',
   observe:'Washington is speaking loudly of scandal and uncertainty.',
   advice:'Not every public accusation points to a private truth.'});
 if(/\\b(?:factory shutdown|strike|production suspended|labor unrest)\\b/i.test(witnessed)&&route==='industrialist')
  out.unshift({id:'interruption',name:'recent disruption at the works',
   observe:'The work of many hands was lately interrupted.',
   advice:'A sound enterprise relies on people as surely as on machinery.'});
 if(save?.circusPerformances?.length)
  out.push({id:'spectacle',name:'recent public spectacle',
   observe:'You have lately seen how a crowd can be carried away by spectacle.',
   advice:'The loudest performance is not always the one that deserves belief.'});
 return out.slice(0,4);
}
function cardMeaning(card){
 if(card.arcana==='major')return MEANINGS[card.name]||'a turning point';
 return SUITS[card.suit]||'the ordinary burdens of life';
}
function interpret(save,session){
 if(!session||!Array.isArray(session.cards)||!session.cards.length)return {ok:false,reason:'There are no cards on the table.'};
 if(session.interpretation)return {ok:true,reading:session.interpretation};
 const current=facts(save);
 const vision=root.FE_TAROT_SECOND_SIGHT?.vision?.(save,session)||null;
 const positions=session.cards.map((card,i)=>{
  const concern=current[i%current.length];
  const symbol=cardMeaning(card);
  const posture=card.reversed?'The card lies reversed, warning against mistaking the sign for a promise.':'The card stands upright, asking you to consider its meaning.';
  const text=card.position+': '+card.name+(card.reversed?' (reversed)':'')+
   '. I see '+symbol+'. '+posture+' '+concern.observe+' '+concern.advice+
   (vision?.cardIndex===i?' The reader leans forward. '+vision.saying:'');
  return {cardId:card.id,position:card.position,meaning:text,focusId:concern.id};
 });
 const closing='These cards speak in possibilities, not certainties. Your next choices will matter more than my table.';
 session.interpretation={intro:'The fortune-teller shuffles, cuts the deck and draws the cards herself. She studies them a moment before speaking.',
  passages:positions,closing,focus:current.map(x=>x.id),characterRoute:save?.characterRoute||'industrialist'};
 return {ok:true,reading:session.interpretation};
}
const api=Object.freeze({MEANINGS,SUITS,CONCERNS,facts,interpret});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_TAROT_INTERPRETATION=api;
})(typeof window!=='undefined'?window:globalThis);
