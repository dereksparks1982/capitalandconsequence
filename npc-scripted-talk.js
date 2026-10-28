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
  liWen:'聽說那是一家很昂貴的會所。我不了解他們的內部事務。',
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
  liWen:'我不清楚。',
  alexiRurik:"Не знаю."
 });
 // Author-written public work facts. These describe an established role, never
 // a completed shift, secret, payment, promotion, or promised appointment.
 const DUTIES=Object.freeze({
  charlieWhitcomb:"I own Federal Electric. We assemble and sell small electrical components and telegraph apparatus, and the workshop's orders come first.",
  samHarlan:"I'm a Metropolitan Police patrolman assigned to the Hillsdale beat. I file reports about things I actually encounter.",
  eliCrowe:"I work the entrance at Monsieur Delacroix's Le Paon d'Or. I am paid to manage the door, not speak for the owner.",
  edmundWardman:"I work as an orderly at District Asylum, under other people's authority. I do not direct the institution.",
  samuelTilden:"My public duties concern the executive government of these United States. Private petitions are not public announcements.",
  madamStar:"I run the Star Club. We offer dinner and quiet company, not poker. My guests' private affairs are their own.",
  luiDelacroix:"Le Paon d'Or is mine. I oversee the cabaret, its staff, and the evening entertainment.",
  foremanSullivan:"I help with component assembly and the workshop's orders at Federal Electric. Saturday is for deliveries and ordinary errands, not another production shift.",
  eddieDoyle:"I follow the racing book and arrange introductions. I will not call an unconfirmed rumor a result.",
  inspectorHayes:"My business is police reports and public order. An investigation is not something I discuss over casual conversation.",
  chenMei:"I work among the Chinatown merchants. Customers remember whether an order was actually fulfilled.",
  liWen:"我在華盛頓的華人商業街做生意。",
  alexiRurik:"Я ищу работу курьером. Обещание не означает выполненный заказ.",
  annaPetrovna:"I maintain trade contacts and correspondence. I will not describe a proposed arrangement as a completed bargain.",
  pavelOrlov:"I deal with merchants and business introductions. A conversation is not a signed contract.",
  edwinBooth:"I study and rehearse dramatic roles at the National Theatre. I do not claim an engagement has been booked merely because we discussed one.",
  josephJefferson:"I rehearse and perform at the National Theatre when my duties require it. Comedy needs as much preparation as tragedy.",
  johnMcCullough:"My trade is the dramatic stage. I prepare my tragic roles with the National Theatre company.",
  claraMorris:"I rehearse and perform dramatic parts at the National Theatre. My professional work is not drawing-room gossip.",
  johnTRaymond:"I work in comedy at the National Theatre. It is still a profession that demands rehearsal.",
  charlesHanford:"I'm learning backstage work and small parts at the National Theatre. I have a great deal left to learn.",
  williamRapley:"I manage the National Theatre's bookings and accounts. Actors must rehearse, but a theatre must also keep its books."
 });
 function answer(npc,utterance,context={}){
  if(!npc||typeof utterance!=='string'||!utterance.trim())throw Error('NPC and spoken question required');
  const q=utterance.trim().toLowerCase(),id=npc.id;
  const un=unknown[id]||(npc.language==='ru'?"Не знаю.":"I don't know enough about that.");
  const russian=npc.language==='ru',chinese=npc.language==='zh';
  const year=Number(String(context.date||'1878').slice(0,4))||1878;
  const alwaysFuture=/\b(smartphones?|cellphones?|internet|laptops?|corvettes?|satellites?|spacecraft|electric cars?)\b/i;
  const earlyFuture=/\b(television|tvs?|computers?|airplanes?|aeroplanes?|rockets?|movies?|cinema|radio broadcasts?)\b/i;
  if((year<1950&&alwaysFuture.test(q))||(year<1890&&earlyFuture.test(q)))return {handled:true,reply:chinese?'我不知道你說的是甚麼。':russian?"Я не понимаю, о чём вы говорите.":"I'm afraid I don't know what you mean by that.",kind:'unknown-era'};
  if(/^(?:hello|hi|hey|good morning|good afternoon|good evening|greetings|您好|你好|早安|晚上好|привет|здравствуйте)[.!? ]*$/i.test(q))
   return {handled:true,reply:chinese?'你好。':russian?'Здравствуйте.':"Good day.",kind:'greeting'};
  if(/\b(star club|madam star(?:'s)? (?:club|establishment)|club of madam star)\b/i.test(q))
   return {handled:true,reply:CLUB[id]||un,kind:'club-opinion'};
  if(/\b(who are you|your name|what is your name|introduce yourself)\b/i.test(q))
   return {handled:true,reply:chinese?'我叫李文。':russian?"Меня зовут "+npc.name+".":"My name is "+npc.name+".",kind:'identity'};
  if(/\b(your work|your job|what do you do|what is your occupation|where do you work|tell me about your work|how is work going)\b/i.test(q))
   return {handled:true,reply:DUTIES[id]||(russian||chinese?un:"I work as "+String(npc.occupation||'a Washington resident').toLowerCase()+"."),kind:'occupation'};
  if(/\b(what are you doing|what are you up to|what are you working on|what have you been doing today|how is your day going)\b/i.test(q)){
   const actual=typeof context.activity==='string'?context.activity.trim().slice(0,140):'';
   return {handled:true,reply:actual?(chinese?'我現在有自己的事情要辦。':russian?'У меня сейчас свои дела.':"At present I am "+actual.replace(/[.!?]+$/,'')+"."):un,kind:actual?'observed-activity':'uncertain'};
  }
  if(/\b(where do you live|where is your home|where do you sleep)\b/i.test(q))
   return {handled:true,reply:id==='foremanSullivan'?"I rent a small room at Federal Electric. It is on the workshop premises.":un,kind:id==='foremanSullivan'?'known-residence':'uncertain'};
  if(/\b(can we meet|meet me tomorrow|meet me later|promise to meet|make an appointment|give me a job|can you hire me)\b/i.test(q))
   return {handled:true,reply:chinese?'我不能答應這件事。':russian?'Я не могу этого обещать.':"I cannot promise an appointment or a job simply because we've spoken. An actual arrangement would have to be made.",kind:'no-unearned-commitment'};
  if(/\b(where are we|what is this place|where am i)\b/i.test(q)){
   const place=String(context.place||'').trim();
   return {handled:true,reply:place?(chinese?'我們現在在華盛頓。':russian?"Мы сейчас в "+place+".":"We are at "+place+"."):un,kind:'present-place'};
  }
  return {handled:false,reply:un,kind:'uncertain'};
 }
 const api=Object.freeze({answer});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_SCRIPTED_TALK=api;
})(typeof window!=='undefined'?window:globalThis);
