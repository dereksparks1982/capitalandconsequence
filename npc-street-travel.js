/* Capital & Consequence: route-based NPC journeys from actual saved schedules.
 * No wall-clock advance, teleporting NPCs, invented trips or permanent map dots.
 */
(function(root){
'use strict';
const NS='http://www.w3.org/2000/svg';
let overlay=null;
function plan(from,to,save){
 if(!from||!to||from===to)return null;
 const a=root.FE_NPC_MAP_PIN?.(from),b=root.FE_NPC_MAP_PIN?.(to);
 const engine=root.FE_CAPITAL_TRAVEL;
 if(!a||!b||!engine?.route||!engine?.weatherEstimate)return null;
 const points=engine.route(a,b);
 if(!points||points.length<2||!points.routeType?.startsWith('provisional-street'))return null;
 const estimate=engine.weatherEstimate(points,save?.turnConditions?.weather||'clear');
 const minute=Math.max(5,Math.min(240,estimate.minutes.walk));
 return {minutes:minute,guidePixels:estimate.guidePixels,routeType:points.routeType,
  weather:estimate.weather,routePoints:points.slice(0,128).map(p=>({
   x:+p.x.toFixed(6),y:+p.y.toFixed(6)}))};
}
function progress(j,minute){
 if(!j||!Number.isSafeInteger(j.departedAt)||!Number.isSafeInteger(j.arrivesAt)||
  j.arrivesAt<=j.departedAt||!Number.isSafeInteger(minute))return 0;
 return Math.min(1,Math.max(0,(minute-j.departedAt)/(j.arrivesAt-j.departedAt)));
}
function valid(j){
 return !!j&&j.version===1&&Array.isArray(j.routePoints)&&j.routePoints.length>=2&&
  j.routePoints.length<=128&&j.routePoints.every(p=>
   p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1);
}
/* Journey marks are temporary, clickable street observations. A click shows
 * who is in transit and where they were actually traveling; conversations
 * remain gated by real same-room presence after arrival.
 */
let selected=null;
function clear(reset=true){
 if(overlay){overlay.remove();overlay=null}
 if(reset)selected=null;
}
function identity(agent){
 const def=root.FE_NPC_AI?.list?.().find(p=>p.id===agent.id);
 return {name:def?.name||'Washington traveler',occupation:def?.occupation||'Resident'};
}
function iconKind(agent,def){
 // A wagon requires a recorded wagon vehicle, NOT a guessed ethnicity or
 // costume. In particular, no named itinerant woman currently owns a wagon.
 if(agent.journey?.vehicle==='wagon'||agent.journey?.mode==='wagon')return 'wagon';
 const job=String(def.occupation||'').toLowerCase();
 if(/police|patrolman|inspector/.test(job))return 'police';
 if(/courier|delivery|messenger/.test(job))return 'courier';
 if(/merchant|trader|bookmaker|shop/.test(job))return 'merchant';
 if(/theatre|actor|actress|stage/.test(job))return 'performer';
 if(/factory|workshop|electric|orderly/.test(job))return 'worker';
 return 'resident';
}
const SHAPES=Object.freeze({
 resident:'M0 -11 a4 4 0 1 0 .01 0 M-5 -5 H5 L8 9 H-8Z',
 police:'M-7 -11 L7 -11 L9 -8 H-9Z M0 -7 L2 -2 L8 -2 L4 2 L5 9 L0 6 L-5 9 L-4 2 L-8 -2 L-2 -2Z',
 courier:'M-4 -11 H4 L5 -6 H-5Z M-6 -4 H6 L7 9 H-7Z M4 -3 L11 1 L9 7 L4 4Z',
 merchant:'M-5 -10 H5 L4 -5 H-4Z M-7 -4 H7 L8 9 H-8Z M-4 0 H4 V6 H-4Z',
 performer:'M-5 -10 H5 V-7 H-5Z M-4 -5 H4 L7 8 H-7Z M-9 -11 L-6 -7 M6 -7 L9 -11',
 worker:'M-7 -9 H7 L8 -5 H-8Z M-4 -3 H4 L7 10 H-7Z',
 wagon:'M-13 0 H7 L9 8 H-12Z M-10 -7 H5 L7 -1 H-11Z M-8 8 a3 3 0 1 0 0.01 0 M5 8 a3 3 0 1 0 .01 0 M11 -2 L14 -5 L16 -1 L14 1 L15 8 H11Z'
});
const TINT=Object.freeze({resident:'#49321f',police:'#24374a',courier:'#67452b',
 merchant:'#5b4b29',performer:'#6e333e',worker:'#4f5543',wagon:'#694327'});
function knownToPlayer(save,id){
 // Knowing someone's full name requires a recorded introduction, not merely
 // spotting their moving coat on the city map.
 return !!save?.npcSimulation?.agents?.[id]?.memories?.some(m=>
  m?.key==='greet'&&m.withId===save.characterRoute);
}
function details(svg,agent,def,at,minute,known){
 const box=document.createElement('div');
 box.className='capital-npc-travel-card';
 const title=document.createElement('strong');title.textContent=known?def.name:'Unfamiliar traveler';
 const role=document.createElement('p');role.textContent=known?def.occupation:'A person passing through Washington';
 const journey=document.createElement('p');
 journey.textContent='Traveling through the city. Their destination is unknown.';
 const note=document.createElement('p');note.textContent='To learn where they are going, meet them in person and ask. They may not tell you the truth.';
 const actions=document.createElement('div');actions.className='capital-npc-travel-actions';
 const dismiss=document.createElement('button');dismiss.type='button';dismiss.textContent='Close';
 dismiss.addEventListener('click',event=>{event.stopPropagation();selected=null;box.remove()});
 actions.append(dismiss);box.append(title,role,journey,note,actions);
 // Keep the information inside the map viewport and above the street icon.
 box.style.left=Math.max(6,Math.min(Math.max(6,svg.clientWidth-280),at.x+10))+'px';
 box.style.top=Math.max(6,Math.min(Math.max(6,svg.clientHeight-158),at.y+12))+'px';
 return box;
}
function render(save,viewport,project,visible){
 clear(false);
 if(!visible||!viewport||typeof project!=='function'||!save?.npcSimulation?.agents||
  !Number.isSafeInteger(save.worldCalendar?.worldMinute)||!root.FE_CAPITAL_TRAVEL?.positionAt)return 0;
 const minute=save.worldCalendar.worldMinute;
 const riders=Object.values(save.npcSimulation.agents).filter(a=>
  a?.status==='travelling'&&valid(a.journey)&&
  minute>=a.journey.departedAt&&minute<a.journey.arrivesAt).slice(0,20);
 if(!riders.length){selected=null;return 0}
 const svg=document.createElementNS(NS,'svg');
 svg.setAttribute('class','capital-npc-travel-layer');
 svg.setAttribute('role','group');
 svg.setAttribute('aria-label','Traveling Washington residents');
 svg.setAttribute('viewBox','0 0 '+Math.max(1,viewport.clientWidth)+' '+Math.max(1,viewport.clientHeight));
 svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:7';
 let count=0,active=null,activePos=null,activeDef=null;
 for(const agent of riders){
  const j=agent.journey,p=root.FE_CAPITAL_TRAVEL.positionAt(j.routePoints,progress(j,minute));
  if(!p)continue;
  let at;try{at=project(p)}catch(error){continue}
  if(!at||!Number.isFinite(at.x)||!Number.isFinite(at.y))continue;
  const def=identity(agent),known=knownToPlayer(save,agent.id),kind=iconKind(agent,def);
  const group=document.createElementNS(NS,'g');
  group.setAttribute('transform','translate('+at.x+' '+at.y+')');
  group.setAttribute('role','button');group.setAttribute('tabindex','0');
  group.setAttribute('aria-label',(known?def.name:'Unfamiliar traveler')+', traveling through Washington. Select for details.');
  group.setAttribute('data-resident-id',agent.id);
  group.style.cursor='pointer';group.style.pointerEvents='all';
  const hit=document.createElementNS(NS,'circle');
  hit.setAttribute('r','17');hit.setAttribute('fill','transparent');
  const shape=document.createElementNS(NS,'path');
  shape.setAttribute('d',SHAPES[kind]);
  shape.setAttribute('fill',TINT[kind]);
  shape.setAttribute('stroke','#e3c38b');
  shape.setAttribute('stroke-width','1.4');
  const title=document.createElementNS(NS,'title');
  title.textContent=(known?def.name:'Unfamiliar traveler')+' · click to observe';
  const choose=event=>{
   event.preventDefault?.();event.stopPropagation?.();
   selected=selected===agent.id?null:agent.id;
   render(save,viewport,project,visible);
  };
  group.addEventListener('pointerdown',e=>e.stopPropagation());
  group.addEventListener('click',choose);
  group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){choose(e)}});
  group.append(title,hit,shape);svg.appendChild(group);count++;
  if(selected===agent.id){active=agent;activePos=at;activeDef=def}
 }
 if(!count){selected=null;return 0}
 viewport.appendChild(svg);overlay=svg;
 if(active){
  const card=details(viewport,active,activeDef,activePos,minute,knownToPlayer(save,active.id));
  // A sibling over the SVG is clickable and independent of map pan/zoom.
  card.style.pointerEvents='auto';
  card.addEventListener('pointerdown',event=>event.stopPropagation());
  card.addEventListener('click',event=>event.stopPropagation());
  viewport.appendChild(card);
  // Parent removal cleans the previous card during every redraw.
  overlay= {remove(){svg.remove();card.remove()}};
 }
 return count;
}
const api=Object.freeze({plan,progress,valid,render,clear,iconKind});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_NPC_STREET_TRAVEL=api;
})(typeof window!=='undefined'?window:globalThis);
