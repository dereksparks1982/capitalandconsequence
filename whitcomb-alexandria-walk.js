/* A small, fictionalized playable slice of Alexandria for Charles's existing
 * four-scene family prologue. No new Alexandria world-map bitmap, historical
 * street claim, fare, vessel voyage or Washington world-clock change.
 */
(function(root){
'use strict';
const SHAPE=Object.freeze({
 office:{name:'Family Trading Office',features:[[7,4,'F'],[4,3,'R'],[8,3,'T'],[8,5,'T'],[3,6,'T']]},
 courtyard:{name:'Merchant Courtyard',features:[[6,2,'H'],[4,3,'T'],[8,5,'T'],[6,6,'M']]},
 warehouse:{name:'Overland Storehouse',features:[[6,2,'H'],[3,3,'T'],[4,3,'T'],[7,5,'T'],[8,5,'T'],[5,6,'R']]},
 quay:{name:'Alexandria Quayside',features:[[3,1,'~'],[4,1,'~'],[5,1,'~'],[6,1,'~'],[7,1,'~'],[8,1,'~'],[9,1,'~'],
 [3,2,'~'],[4,2,'~'],[5,2,'~'],[6,2,'~'],[7,2,'~'],[8,2,'~'],[9,2,'~'],[8,5,'P'],[7,6,'T']]},
 cabin:{name:'Introductory Passenger Cabin',features:[[3,3,'B'],[8,4,'T'],[4,5,'R'],[6,6,'T']]}
});
const PASSABLE=new Set(['.','D','H','F','R','M','P','B']);
const INSPECT=Object.freeze({
 F:'Your father keeps the contracts in his own hand. His financing of Federal Electric is a loan AND a voting investment, never a gift.',
 R:'The family accounts concern existing overland trade. No sea-freight business, free cargo or guaranteed American customer is recorded here.',
 M:'Caravan workers have brought goods into the courtyard by land. None of these wares belongs to Charlie without an actual purchase.',
 P:'Passenger departure papers and a crowded quay. This staging scene does not issue a fictional voyage receipt or unlock an unverified port.',
 B:'A simple cabin during the authored crossing. The complete route and elapsed days have not yet been integrated with the shipping chart.'
});
const no=reason=>({ok:false,reason});
const yes=(reason,extra={})=>({ok:true,reason,...extra});
function rows(zone){
 if(!SHAPE[zone])return null;
 const grid=Array.from({length:9},(_,y)=>Array.from({length:12},(_,x)=>x===0||x===11||y===0||y===8?'#':'.'));
 for(const [x,y,t] of SHAPE[zone].features)grid[y][x]=t;
 if(zone!=='cabin'){grid[4][1]='D';grid[4][10]='D'}
 return grid.map(r=>r.join(''));
}
function scene(save){
 if(save?.characterRoute!=='industrialist')return null;
 const c=root.FE_WHITCOMB_INTRO?.current?.(save);
 return c&&['alexandria','departure','cabin'].includes(c.id)?c.id:null;
}
function ensure(save){
 const current=scene(save);if(!current)return null;
 const state=root.FE_WHITCOMB_INTRO.ensure(save);
 const zone=current==='cabin'?'cabin':current==='departure'?'quay':'office';
 let map=state.alexandriaWalk;
 if(!map||map.version!==1)map=state.alexandriaWalk={version:1,scene:current,zone,x:3,y:4,visited:[zone],observations:[]};
 if(map.scene!==current){map.scene=current;map.zone=zone;map.x=3;map.y=4;if(!map.visited.includes(zone))map.visited.push(zone)}
 if(!SHAPE[map.zone]||!PASSABLE.has(rows(map.zone)?.[map.y]?.[map.x])){
  map.zone=zone;map.x=3;map.y=4;
 }
 if(!Array.isArray(map.observations))map.observations=[];
 if(!Array.isArray(map.visited))map.visited=[map.zone];
 return map;
}
function passable(t){return PASSABLE.has(t)}
function canWalk(save,x,y){
 const m=ensure(save),grid=m&&rows(m.zone);
 if(!m)return no('Only Charles can explore his currently active prelude.');
 if(save.paused)return no('Prelude movement is paused.');
 if(!Number.isInteger(x)||!Number.isInteger(y)||Math.abs(m.x-x)+Math.abs(m.y-y)!==1)return no('Walk to one adjacent tile.');
 return passable(grid?.[y]?.[x])?yes('Open path.'):no('A wall, storage crate or water blocks this tile.');
}
function move(save,x,y){
 const quote=canWalk(save,x,y);if(!quote.ok)return quote;
 const m=ensure(save);m.x=x;m.y=y;
 return yes('Moved through '+SHAPE[m.zone].name+'.',{position:{zone:m.zone,x,y}});
}
function exits(save){
 const m=ensure(save);if(!m)return [];
 const tile=rows(m.zone)[m.y][m.x];
 const route=[];
 if(tile==='D'&&m.zone!=='cabin'){
  if(m.x===1){if(m.zone==='courtyard')route.push('office');if(m.zone==='quay')route.push('courtyard')}
  if(m.x===10){if(m.zone==='office')route.push('courtyard');if(m.zone==='courtyard')route.push('quay')}
 }
 if(tile==='H'){if(m.zone==='courtyard')route.push('warehouse');if(m.zone==='warehouse')route.push('courtyard')}
 return route;
}
function cross(save,target){
 const m=ensure(save);
 if(!m||!exits(save).includes(target))return no('Reach the connected door or storehouse passage before entering.');
 if(save.paused)return no('Prelude movement is paused.');
 const from=m.zone;
 if(from==='courtyard'&&target==='warehouse'||from==='warehouse'&&target==='courtyard'){m.x=6;m.y=2}
 else {m.x=m.x===10?1:10;m.y=4}
 m.zone=target;if(!m.visited.includes(target))m.visited.push(target);
 return yes('Entered '+SHAPE[target].name+'.',{position:{zone:target,x:m.x,y:m.y}});
}
function inspect(save){
 const m=ensure(save);if(!m)return no('Not in a playable introductory scene.');
 if(save.paused)return no('Introductory inspections are paused.');
 const code=rows(m.zone)[m.y][m.x],message=INSPECT[code];
 if(!message)return no('Nothing specific to inspect on this square.');
 const record=m.zone+':'+m.x+':'+m.y;
 if(!m.observations.includes(record))m.observations.push(record);
 return yes(message,{code});
}
const api=Object.freeze({SHAPE,rows,scene,ensure,passable,canWalk,move,exits,cross,inspect});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_ALEXANDRIA_WALK=api;
})(typeof window!=='undefined'?window:globalThis);
