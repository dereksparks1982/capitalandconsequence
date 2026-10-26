/* Capital & Consequence: confirmed, permission-gated private NPC residences.
 * Only known canonical assignments belong here. Never infer a bedroom from
 * a workplace, a venue, an NPC's nationality, or an unconfirmed address.
 * Resolves a nightly destination; it does not advance time or teleport anyone.
 */
(function(root){
 'use strict';
 const access=typeof module==='object'&&module.exports?require('./city-access.js'):root.FE_CITY_ACCESS;
 const ASSIGNMENTS=Object.freeze({
  foremanSullivan:Object.freeze({locationId:'factory',roomId:'workers-lodging',
   activity:'resting in his rented room'})
 });
 function nightStay(def,moment,city){
  if(!def?.id||!moment||!Number.isInteger(moment.minuteOfDay)||
   moment.minuteOfDay<0||moment.minuteOfDay>=1440||
   !/^\d{4}-\d{2}-\d{2}$/.test(moment.date||'')||!city)
   throw Error('Saved NPC identity, date and city required for lodging');
  const place=ASSIGNMENTS[def.id];
  if(!place||moment.minuteOfDay>=480&&moment.minuteOfDay<1320)return null;
  const actor={kind:'npc',id:def.id,route:def.route||null,job:null,
   onDuty:false,permits:[],roomPermits:[],invitations:[],residences:[]};
  // Passing through the same authoritative restriction check is mandatory.
  // The existence of a room in the directory grants no one access.
  if(!access?.canRoom?.(city,actor,place.locationId,place.roomId,moment.date)?.ok)return null;
  return Object.freeze({...place,reason:'verified-rented-lodging'});
 }
 const api=Object.freeze({nightStay,registered:Object.freeze(Object.keys(ASSIGNMENTS))});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_RESIDENCES=api;
})(typeof window!=='undefined'?window:globalThis);
