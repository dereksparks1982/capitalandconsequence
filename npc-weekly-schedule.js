/* Capital & Consequence: non-guaranteed weekly routines for named NPCs.
 * Daily windows: 8 AM-noon, noon-5 PM, 5-10 PM and 10 PM-8 AM.
 * The existing NPC agency and room permissions still determine actual visits.
 */
(function(root){
 'use strict';
 const WEEK=Object.freeze({
  samuelTilden:{work:['whiteHouse|reviewing executive correspondence','whiteHouse|receiving authorized visitors',null,null],sat:['whiteHouse|urgent presidential papers',null,null,null],sun:[null,null,null,null]},
  madamStar:{work:['star|reviewing appointments','star|receiving callers','star|hosting guests','star|concluding private business'],sat:['star|reviewing reservations','star|receiving weekend guests','star|hosting Saturday guests','star|concluding private business'],sun:[null,'star|reviewing accounts','star|receiving quiet company',null]},
  luiDelacroix:{work:[null,'secondNightclub|overseeing staff','secondNightclub|hosting patrons','secondNightclub|closing the house'],sat:[null,'secondNightclub|preparing the evening','secondNightclub|hosting the Saturday crowd','secondNightclub|closing the house'],sun:[null,null,'secondNightclub|attending private business',null]},
  foremanSullivan:{work:['factory|preparing tools','factory|assisting with component orders',null,null],sat:[null,null,null,null],sun:[null,null,null,null]},
  eddieDoyle:{work:['races|reviewing entries','races|taking bets','star|making introductions',null],sat:['races|reviewing Saturday entries','races|taking bets','star|socializing',null],sun:[null,null,'star|visiting acquaintances',null]},
  inspectorHayes:{work:['metropolitanPolice|reviewing reports','metropolitanPolice|attending to police duties','washingtonArena|watching a public event',null],sat:[null,null,'washingtonArena|watching the fights',null],sun:[null,null,null,null]},
  chenMei:{work:['oldChinatown|opening the market','oldChinatown|speaking with customers',null,null],sat:['oldChinatown|taking Saturday customers','oldChinatown|settling accounts',null,null],sun:[null,null,null,null]},
  liWen:{work:['oldChinatown|meeting merchants','oldChinatown|following business orders',null,null],sat:['oldChinatown|attending the Saturday trade','oldChinatown|reconciling receipts',null,null],sun:[null,null,null,null]},
  alexiRurik:{work:['russianTradeHall|seeking work','races|following a delivery','workingPoker|watching the game',null],sat:[null,'races|seeking courier work','workingPoker|watching the game',null],sun:[null,null,null,null]},
  annaPetrovna:{work:['russianTradeHall|meeting visiting merchants','russianTradeHall|attending correspondence',null,null],sat:[null,'russianTradeHall|speaking with acquaintances',null,null],sun:[null,null,null,null]},
  pavelOrlov:{work:['russianTradeHall|meeting traders','russianTradeHall|discussing orders','star|attending an evening gathering',null],sat:[null,'russianTradeHall|consulting visiting merchants',null,null],sun:[null,null,null,null]}
 });

 // These describe usual activities, never guaranteed appearances.
 // Off-duty whereabouts remain private until a real home/location is modeled.
 const DETAILS=Object.freeze({
  samuelTilden:['reviewing morning correspondence','meeting authorized petitioners','taking a short midday meal','conducting executive business',null,null,null],
  madamStar:['reviewing reservations and accounts','arranging the evening house','meeting staff over a midday meal','receiving callers','welcoming evening guests','attending to discreet club matters','concluding the night’s accounts'],
  luiDelacroix:[null,null,'taking a midday meal with staff','arranging the evening programme','overseeing patrons and performers','handling the late evening crowd','closing the house'],
  foremanSullivan:['checking tools and preparing components','assembling the day’s orders','taking a meal at the workshop','finishing ordered parts for dispatch',null,null,null],
  eddieDoyle:['reading racing entries','discussing entries with racegoers','taking a midday meal near the track','following the afternoon racing book','visiting acquaintances at the club','speaking quietly with regular patrons',null],
  inspectorHayes:['reviewing overnight incident reports','conducting police office business','taking a midday meal on duty','following up on reported incidents','observing a public sporting event','speaking with event staff',null],
  chenMei:['opening merchant stalls','meeting early customers','sharing a midday meal at the market','handling afternoon trade',null,null,null],
  liWen:['reviewing morning stock and orders','meeting visiting merchants','taking a midday meal nearby','settling afternoon trade',null,null,null],
  alexiRurik:['seeking legitimate courier work','arranging a delivery','taking a midday meal while travelling','checking on courier prospects','observing a public card game','speaking with acquaintances',null],
  annaPetrovna:['meeting visiting traders','reading trade correspondence','taking a midday meal','speaking with merchants and acquaintances',null,null,null],
  pavelOrlov:['reviewing trade correspondence','meeting prospective buyers','taking a midday meal','negotiating commercial arrangements','speaking with evening guests','maintaining commercial contacts',null]
 });
 const SEGMENTS=Object.freeze([
  Object.freeze({from:480,until:600,slot:0}),
  Object.freeze({from:600,until:720,slot:0}),
  Object.freeze({from:720,until:750,slot:1}),
  Object.freeze({from:750,until:1020,slot:1}),
  Object.freeze({from:1020,until:1170,slot:2}),
  Object.freeze({from:1170,until:1320,slot:2}),
  Object.freeze({from:1320,until:1920,slot:3})
 ]);
 function segmentAt(minute){
  if(!Number.isSafeInteger(minute)||minute<0||minute>=1440)throw Error('Valid saved NPC minute required');
  if(minute<480)return {...SEGMENTS[6],priorDay:true};
  return {...SEGMENTS.find(v=>minute>=v.from&&minute<v.until),priorDay:false};
 }
 function atMinute(def,weekday,minute){
  if(!Number.isInteger(weekday)||weekday<0||weekday>6)throw Error('Valid NPC weekday required');
  const segment=segmentAt(minute),day=segment.priorDay?(weekday+6)%7:weekday;
  const basic=at(def,day,segment.slot),index=SEGMENTS.findIndex(v=>v.from===segment.from);
  const detail=DETAILS[def.id]?.[index];
  return {locationId:basic.locationId,activity:basic.locationId?(detail||basic.activity):null,
   slot:segment.slot,from:segment.from,until:segment.until,priorDay:segment.priorDay,weekday:day};
 }

 function at(def,weekday,slot){
  if(!def||!Array.isArray(def.places)||!Array.isArray(def.activities)||!Number.isInteger(weekday)||weekday<0||weekday>6||!Number.isInteger(slot)||slot<0||slot>3)
   throw Error('Valid NPC weekly context required');
  const group=WEEK[def.id],row=group?(weekday===0?group.sun:weekday===6?group.sat:group.work):null;
  const cell=row?row[slot]:def.places[slot];
  if(!cell)return {locationId:null,activity:null};
  const split=cell.indexOf('|');
  return {locationId:split<0?cell:cell.slice(0,split),
   activity:split<0?def.activities[slot]||'visiting':cell.slice(split+1)};
 }
 const api=Object.freeze({at,atMinute,segmentAt,segments:SEGMENTS,registered:Object.freeze(Object.keys(WEEK))});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_WEEKLY=api;
})(typeof window!=='undefined'?window:globalThis);
