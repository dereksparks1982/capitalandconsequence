/* Map priorities for confirmed in-person leads, v0.6.48. */
(function(root){'use strict';
const rules={commercePoker:['star-bookie-introduction','race-bookie-introduction'],embassyPoker:['vale-invitation']};
const allowed=(loc,key)=>typeof loc==='string'&&Array.isArray(rules[loc])&&rules[loc].includes(key);
function migrate(raw){const pending=[],history=[],keys=new Set();
for(const a of Array.isArray(raw?.pending)?raw.pending:[]){if(!allowed(a?.locationId,a?.reason))continue;const k=a.locationId+'|'+a.reason;if(keys.has(k))continue;keys.add(k);pending.push({locationId:a.locationId,reason:a.reason,issuedTurn:Number.isSafeInteger(a.issuedTurn)&&a.issuedTurn>0?a.issuedTurn:1})}
for(const a of Array.isArray(raw?.history)?raw.history:[]){if(allowed(a?.locationId,a?.reason))history.push({locationId:a.locationId,reason:a.reason,visitedTurn:Number.isSafeInteger(a.visitedTurn)?a.visitedTurn:0})}
return {version:1,pending:pending.slice(-25),history:history.slice(-100)}}
function ensure(s){if(!s||typeof s!=='object')throw Error('Saved profile required');if(!s.mapLeads||s.mapLeads.version!==1||!Array.isArray(s.mapLeads.pending)||!Array.isArray(s.mapLeads.history))s.mapLeads=migrate(s.mapLeads);return s.mapLeads}
function flag(s,loc,reason){if(!allowed(loc,reason))return false;const e=ensure(s),match=x=>x.locationId===loc&&x.reason===reason;if(e.pending.some(match)||e.history.some(match))return false;e.pending.push({locationId:loc,reason,issuedTurn:Math.max(1,Math.floor(+s.turnSerial||1))});return true}
function visit(s,loc){const e=ensure(s),found=e.pending.filter(x=>x.locationId===loc);if(!found.length)return false;e.pending=e.pending.filter(x=>x.locationId!==loc);for(const x of found)e.history.push({locationId:x.locationId,reason:x.reason,visitedTurn:Math.max(1,Math.floor(+s.turnSerial||1))});if(e.history.length>100)e.history.splice(0,e.history.length-100);return true}
function highlighted(s,loc){return ensure(s).pending.some(x=>x.locationId===loc)}
const api=Object.freeze({migrate,ensure,flag,visit,highlighted});if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.FE_MAP_LEADS=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
