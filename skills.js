/* Capital & Consequence: individual learn-by-doing skills.
   Skills are owned by each saved character, not shared across profiles.
   60 initial skills, 0–100, no overall character level. */
(function(root){
'use strict';
const GROUPS=Object.freeze([
 {name:'Business & Industry',items:[
 ['business-management','Business Management','Managing company operations and decisions'],
 ['accounting','Accounting','Reading accounts and identifying losses'],
 ['negotiation','Negotiation','Securing fair purchase and contract terms'],
 ['investing','Investing','Evaluating securities and businesses'],
 ['salesmanship','Salesmanship','Finding customers and making sales'],
 ['leadership','Leadership','Managing employees and supervisors'],
 ['mechanical-knowledge','Mechanical Knowledge','Diagnosing machines and equipment'],
 ['electrical-engineering','Electrical Engineering','Learning electrical principles and design'],
 ['metallurgy','Metallurgy','Understanding iron and steel production'],
 ['manufacturing','Manufacturing','Operating production and improving quality'],
 ['railway-operations','Railway Operations','Coordinating passenger and freight railways'],
 ['logistics','Logistics','Coordinating storage and deliveries']]},
 {name:'Maritime & Transportation',items:[
 ['navigation','Navigation','Plotting voyages and reading charts'],
 ['seamanship','Seamanship','Managing vessels safely'],
 ['sailing','Sailing','Handling wind-powered vessels'],
 ['steam-engineering','Steam Engineering','Understanding steam machinery'],
 ['ship-repair','Ship Repair','Inspecting and restoring ship condition'],
 ['weather-knowledge','Weather Knowledge','Reading seasons, storms and weather signs'],
 ['cargo-handling','Cargo Handling','Loading and protecting freight'],
 ['horsemanship','Horsemanship','Riding and handling horses'],
 ['driving-carriage','Driving & Carriage Handling','Operating carriages and wagons'],
 ['animal-husbandry','Animal Husbandry','Caring for animals']]},
 {name:'Recreation & Outdoors',items:[
 ['fishing','Fishing','Hooking and landing fish'],
 ['angling-knowledge','Angling Knowledge','Species, bait, seasons and habitat'],
 ['hunting','Hunting','Taking game responsibly'],
 ['tracking','Tracking','Following trails and signs'],
 ['survival','Survival','Living and traveling outdoors'],
 ['swimming','Swimming','Water safety and swimming ability'],
 ['boxing','Boxing','Striking and defense'],
 ['card-playing','Card Playing','Judgment at the card table'],
 ['horse-racing','Horse Racing','Understanding race conditions']]},
 {name:'Police & Criminal',items:[
 ['observation','Observation','Noticing significant details'],
 ['investigation','Investigation','Connecting clues and reconstructing events'],
 ['interrogation','Interrogation','Questioning reluctant witnesses and suspects'],
 ['interviewing','Interviewing','Gathering reliable testimony'],
 ['marksmanship','Marksmanship','Accurate and controlled firearm handling'],
 ['hand-to-hand-combat','Hand-to-Hand Combat','Close physical defense'],
 ['stealth','Stealth','Moving without attracting attention'],
 ['locksmithing','Locksmithing','Working with locks'],
 ['pickpocketing','Pickpocketing','Sleight of hand and illicit theft'],
 ['deception','Deception','Telling convincing falsehoods'],
 ['streetwise','Streetwise','Understanding neighborhoods and informal networks'],
 ['disguise','Disguise','Changing and concealing appearance']]},
 {name:'Medicine & Knowledge',items:[
 ['first-aid','First Aid','Immediate wound and injury care'],
 ['medicine','Medicine','Diagnosing and treating illness in the period'],
 ['nursing','Nursing','Caring for patients and the infirm'],
 ['pharmacology','Pharmacology','Medicinal preparations and compounds'],
 ['literacy-research','Literacy & Research','Reading and investigating written records'],
 ['languages','Languages','Learning spoken and written languages'],
 ['etiquette','Etiquette','Navigating social customs'],
 ['persuasion','Persuasion','Influencing choices through conversation'],
 ['public-speaking','Public Speaking','Speaking effectively to groups'],
 ['social-awareness','Social Awareness','Understanding behavior and relationships']]},
 {name:'Trades & Craftsmanship',items:[
 ['carpentry','Carpentry','Woodworking and timber repairs'],
 ['blacksmithing','Blacksmithing','Forging and repairing iron'],
 ['machining','Machining','Operating precise machine tools'],
 ['tailoring','Tailoring','Making and repairing clothing'],
 ['cooking','Cooking','Preparing meals'],
 ['butchery','Butchery','Preparing and preserving meat'],
 ['taxidermy','Taxidermy','Preserving and mounting animals and fish']]}
]);
const SKILLS=Object.freeze(GROUPS.flatMap(g=>g.items.map(([id,name,description])=>Object.freeze({id,name,description,group:g.name}))));
if(SKILLS.length!==60||new Set(SKILLS.map(s=>s.id)).size!==60)throw Error('Skill catalog must contain 60 unique skills.');
const BY_ID=Object.freeze(Object.fromEntries(SKILLS.map(s=>[s.id,s])));
const START={
 industrialist:{'business-management':32,accounting:28,negotiation:22,investing:12,salesmanship:26,leadership:20,'mechanical-knowledge':18,'electrical-engineering':17,manufacturing:24,logistics:12,'literacy-research':25,etiquette:12},
 investigator:{observation:34,investigation:16,interviewing:23,interrogation:12,marksmanship:22,'hand-to-hand-combat':24,streetwise:26,tracking:9,'literacy-research':20},
 criminal:{observation:18,streetwise:32,deception:26,stealth:18,'hand-to-hand-combat':18,etiquette:16,'card-playing':18,persuasion:19,'social-awareness':22},
 wardman:{nursing:25,'first-aid':23,medicine:15,pharmacology:10,observation:22,'social-awareness':18,'literacy-research':23,etiquette:15}
};
const DEFAULT={'literacy-research':12,swimming:7,cooking:7,'social-awareness':9,etiquette:8};
const dateValid=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d);
function seed(role='industrialist'){
 const base={...DEFAULT,...(START[role]||START.industrialist)};
 return Object.fromEntries(SKILLS.map(s=>[s.id,Number.isFinite(base[s.id])?base[s.id]:0]));
}
function ensure(save){
 if(!save||typeof save!=='object')throw Error('Skills require a player profile.');
 const record=save.characterSkills;
 if(!record||record.version!==1||!record.values||typeof record.values!=='object'){
  const values=seed(save.characterRoute);
  // Preserve existing skill gains from older fishing saves; never downgrade.
  const oldFishing=Number(save.fishing?.skill);
  if(Number.isFinite(oldFishing))values.fishing=Math.max(values.fishing,Math.min(100,Math.max(0,oldFishing)));
  save.characterSkills={version:1,values,lastDate:null,daily:{},events:[],history:[]};
 }
 const s=save.characterSkills;
 for(const {id} of SKILLS){
  let n=Number(s.values[id]);
  if(!Number.isFinite(n))n=seed(save.characterRoute)[id];
  s.values[id]=Math.round(Math.max(0,Math.min(100,n))*1000)/1000;
 }
 if(!Array.isArray(s.events))s.events=[];
 if(!Array.isArray(s.history))s.history=[];
 if(!s.daily||typeof s.daily!=='object')s.daily={};
 return s;
}
function level(save,id){return BY_ID[id]?ensure(save).values[id]:null}
function practice(save,id,options={}){
 if(!BY_ID[id])return{ok:false,reason:'Unknown skill'};
 if(save.paused||save.phase==='report')return{ok:false,reason:'Cannot practice while time is suspended'};
 const s=ensure(save),date=dateValid(save.gameDate)?save.gameDate:'';
 if(!date)return{ok:false,reason:'Game date missing'};
 if(s.lastDate!==date){s.lastDate=date;s.daily={};}
 const current=s.values[id];
 if(current>=100)return{ok:true,improved:0,value:100,mastered:true};
 // One actual distinct event can grant practice once; re-rendering never grants XP.
 const key=typeof options.event==='string'&&options.event.length<180?date+'|'+id+'|'+options.event:null;
 if(key&&s.events.includes(key))return{ok:true,improved:0,value:current,duplicate:true};
 const done=Number(s.daily[id]||0);
 if(done>=2.2)return{ok:true,improved:0,value:current,dailyCap:true};
 const difficulty=Math.max(1,Math.min(100,Number(options.difficulty)||40));
 const challenge=Math.max(.18,Math.min(1.8,.75+(difficulty-current)/110));
 const amount=Math.max(.005,Math.min(.75,Number(options.amount)||.2))*challenge*Math.max(.1,(110-current)/110);
 const gain=Math.min(2.2-done,100-current,amount);
 s.values[id]=Math.round((current+gain)*1000)/1000;
 s.daily[id]=done+gain;
 if(key){s.events.push(key);if(s.events.length>600)s.events.splice(0,s.events.length-600);}
 if(gain>0){
  s.history.unshift({date,id,amount:+gain.toFixed(3),source:String(options.source||'practice').slice(0,100)});
  if(s.history.length>50)s.history.length=50;
 }
 // Do not recompute an entire fish or lock existing progress to an activity.
 if(id==='fishing'&&save.fishing)save.fishing.skill=s.values.fishing;
 return{ok:true,improved:+gain.toFixed(3),value:s.values[id]};
}
function rank(value){
 if(value>=100)return'Master';
 if(value>=80)return'Expert';
 if(value>=60)return'Experienced';
 if(value>=40)return'Competent';
 if(value>=20)return'Apprentice';
 return'Beginner';
}
function render(save){
 const panel=document.getElementById('personalSkillRegistry');if(!panel)return;
 const s=ensure(save),filter=document.getElementById('skillFilter'),active=filter?.value||'all';
 const skillCount=document.getElementById('skillCount');
 if(skillCount)skillCount.textContent='60 / 60 saved skills · '+Object.values(s.values).filter(v=>v>=100).length+' mastered';
 const list=document.getElementById('skillList');if(!list)return;
 list.replaceChildren();
 for(const group of GROUPS){
  if(active!=='all'&&active!==group.name)continue;
  const section=document.createElement('section');section.className='skills-category';
  const heading=document.createElement('h3');heading.textContent=group.name;section.appendChild(heading);
  const grid=document.createElement('div');grid.className='skills-grid';
  for(const [id,name,description] of group.items){
   const value=s.values[id],card=document.createElement('article');card.className='skill-card';
   const title=document.createElement('b');title.textContent=name;
   const number=document.createElement('output');number.textContent=value.toFixed(1)+' / 100';
   const desc=document.createElement('p');desc.textContent=description;
   const meter=document.createElement('progress');meter.max=100;meter.value=value;meter.setAttribute('aria-label',name+' progress');
   const label=document.createElement('small');label.textContent=rank(value);
   card.append(title,number,meter,label,desc);grid.appendChild(card);
  }
  section.appendChild(grid);list.appendChild(section);
 }
}
const api=Object.freeze({GROUPS,SKILLS,BY_ID,seed,ensure,level,practice,render,rank});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_SKILLS=api;
})(typeof window!=='undefined'?window:globalThis);