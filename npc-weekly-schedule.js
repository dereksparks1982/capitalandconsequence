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
 const api=Object.freeze({at,registered:Object.freeze(Object.keys(WEEK))});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_WEEKLY=api;
})(typeof window!=='undefined'?window:globalThis);
