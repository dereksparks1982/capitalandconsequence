/* Capital & Consequence: author-controlled, free-form dialogue facts.
 * No topic menu. Known facts are supplied explicitly; other questions can be
 * left to an optional local model or answered with honest uncertainty.
 * Nothing here grants access, changes money or invents world events.
 */
(function(root){
 'use strict';
 const CLUB=Object.freeze({
  charlieWhitcomb:"I've heard of Madam Star's club. I won't claim to know what happens behind its private doors.",
  samHarlan:"The Star Club isn't on my Hillsdale beat. I don't speak to incidents I haven't witnessed.",
  eliCrowe:"I know the name. I work a different entrance, so don't ask me for their private arrangements.",
  edmundWardman:"I've heard the club mentioned, but my duties at the asylum tell me nothing about its affairs.",
  madamStar:"It is my establishment, and I expect discretion and good manners from every guest. We offer fine dining and quiet company, not gambling.",
  eddieDoyle:"It costs a pretty penny, but I have met useful people there. Madam Star knows how to keep a room civilized.",
  inspectorHayes:"The Star Club? I know the name. Rumor is not evidence, and I won't pretend to know its private affairs.",
  foremanSullivan:"The Star Club? I've heard of it, certainly, but I have never had the money to spend an evening there.",
  luiDelacroix:"Madam Star runs a respectable sort of private house. It is not the sort of entertainment I provide.",
  annaPetrovna:"I know it by reputation, but I have never been among its regular guests.",
  pavelOrlov:"The Star Club is sometimes useful for introductions. A good merchant remembers the difference between a social acquaintance and a trustworthy partner.",
  samuelTilden:"I am acquainted with the name, but I cannot speak to the private affairs of its patrons.",
  chenMei:"I've heard of the place, but it isn't part of my ordinary business. I wouldn't claim to know the people inside.",
  liWen:"It is an expensive establishment from what I hear. I could not offer an informed opinion about its management.",
  alexiRurik:"Я слышал об этом клубе, но не знаю его хозяев."
 });
 const unknown=Object.freeze({
  charlieWhitcomb:"I couldn't give you a reliable answer to that.",
  samHarlan:"I haven't seen enough to say. I won't invent a report.",
  eliCrowe:"I wouldn't know. I'm paid to keep the door, not everybody's secrets.",
  edmundWardman:"I can't say that I know. My work does not make me an authority on everything.",
  madamStar:"I'm afraid that is not a matter on which I can speak with certainty.",
  eddieDoyle:"Couldn't tell you for certain. Plenty of talk goes round, but I wouldn't swear to it.",
  inspectorHayes:"I haven't sufficient information to answer that.",
  foremanSullivan:"I don't know, sir. That is outside my experience.",
  luiDelacroix:"I couldn't say, darling. It would be improper to pretend otherwise.",
  annaPetrovna:"I wouldn't claim to know that.",
  pavelOrlov:"I do not know enough about that to say.",
  samuelTilden:"I have no reliable information on that subject.",
  chenMei:"I don't know enough about that to tell you.",
  liWen:"I couldn't say for certain.",
  alexiRurik:"Не знаю."
 });
 function answer(npc,utterance,context={}){
  if(!npc||typeof utterance!=='string'||!utterance.trim())throw Error('NPC and spoken question required');
  const q=utterance.trim().toLowerCase(),id=npc.id;
  const un=unknown[id]||(npc.language==='ru'?"Не знаю.":"I don't know enough about that.");
  const russian=npc.language==='ru';
  const year=Number(String(context.date||'1878').slice(0,4))||1878;
  const alwaysFuture=/\b(smartphones?|cellphones?|internet|laptops?|corvettes?|satellites?|spacecraft|electric cars?)\b/i;
  const earlyFuture=/\b(television|tvs?|computers?|airplanes?|aeroplanes?|rockets?|movies?|cinema|radio broadcasts?)\b/i;
  if((year<1950&&alwaysFuture.test(q))||(year<1890&&earlyFuture.test(q)))return {handled:true,reply:russian?"Я не понимаю, о чём вы говорите.":"I'm afraid I don't know what you mean by that.",kind:'unknown-era'};
  if(/\b(star club|madam star(?:'s)? (?:club|establishment)|club of madam star)\b/i.test(q))
   return {handled:true,reply:CLUB[id]||un,kind:'club-opinion'};
  if(/\b(who are you|your name|what is your name|introduce yourself)\b/i.test(q))
   return {handled:true,reply:russian?"Меня зовут "+npc.name+".":"My name is "+npc.name+".",kind:'identity'};
  if(/\b(your work|your job|what do you do|what is your occupation|where do you work)\b/i.test(q))
   return {handled:true,reply:russian?un:"I am "+String(npc.occupation||'occupied with my affairs').toLowerCase()+".",kind:'occupation'};
  if(/\b(where are we|what is this place|where am i)\b/i.test(q)){
   const place=String(context.place||'').trim();
   return {handled:true,reply:place?(russian?"Мы сейчас в "+place+".":"We are at "+place+"."):un,kind:'present-place'};
  }
  return {handled:false,reply:un,kind:'uncertain'};
 }
 const api=Object.freeze({answer});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_SCRIPTED_TALK=api;
})(typeof window!=='undefined'?window:globalThis);
