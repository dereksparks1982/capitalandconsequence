/* Capital & Consequence: permissions in the fictional District government. */
(function(root){'use strict';
const permit=Object.freeze({id:'dc-poker-challenge-five-card',issuer:'District Government',venueId:'dc-poker-challenge',game:'five-card',eventKind:'tournament'});
const unauthorized=Object.freeze(['working-poker','commerce-poker','embassy-poker','lui-club','horse-racing','dog-racing','midget-car-racing','boxing-wagers','private-fights']);
function dateOK(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T00:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s}
function classify(r){
 r=r&&typeof r==='object'?r:{};
 if(r.venueId==='star'||r.venueId==='star-club')return {allowed:false,legal:false,permitId:null,reason:'The Star Club forbids gambling.'};
 if(r.venueId===permit.venueId){
  const month=dateOK(r.date)?r.date.slice(0,7):'';
  const legal=!!month&&r.game===permit.game&&r.eventKind===permit.eventKind&&r.tournamentId==='dc-poker-challenge-'+month&&typeof r.eventId==='string'&&r.eventId.length>0&&r.eventId.length<=100;
  return {allowed:legal,legal,permitId:legal?permit.id:null,reason:legal?'Government-sanctioned five-card tournament event.':'The permit covers only official five-card D.C. Poker Challenge tournament events.'};
 }
 if(unauthorized.includes(r.venueId))return {allowed:true,legal:false,permitId:null,reason:'This gambling activity is not permitted by the District government.'};
 return {allowed:false,legal:false,permitId:null,reason:'Unrecognized gambling venue.'};
}
const api=Object.freeze({version:1,permit,classify,canLegallyGamble:request=>classify(request).legal});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_GAMBLING_LAW=api;
})(typeof window!=='undefined'?window:globalThis);
