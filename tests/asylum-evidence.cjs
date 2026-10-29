'use strict';
const assert=require('node:assert/strict'),bridge=require('../calendar-bridge.js');
globalThis.FE_SHARED_WORLD=require('../shared-world.js');
globalThis.FE_ASYLUM_INCIDENT=require('../asylum-incident.js');
const e=globalThis.FE_ASYLUM_EVIDENCE=require('../asylum-evidence.js');
for(let i=0;i<48;i++){
 const s={gameDate:'1878-01-05',phase:'day',turnSerial:1,sharedWorldId:'wseed'+i};
 bridge.start(s,'1878-01-05');
 const w=FE_SHARED_WORLD.create(s.sharedWorldId,s);
 FE_ASYLUM_INCIDENT.start(w,{id:e.CASE,at:'1878-01-05T09:00',victimId:'resident'});
 const scene=e.ensure(w);
 assert.equal(scene.persons.length,4);
 assert.equal(scene.persons.filter(p=>p.moments.some(x=>x.time.endsWith('T09:00')&&x.at==='private-ward')).length,1);
 assert.equal(JSON.stringify(scene),JSON.stringify(e.ensure(w)));
 assert.equal(e.roster(w).length,4);
 assert.equal(e.roster(w).some(x=>Object.hasOwn(x,'culprit')),false);
 const folio=e.statementFolio(w);
 assert.equal(folio.description.includes('culprit'),false);
 assert.equal(folio.description.includes('uncorroborated'),true);
 const seen=e.describe(w,'clothingAccount').description;
 assert.equal(seen.includes('witness could not identify'),true);
 assert.equal(FE_ASYLUM_INCIDENT.publicFile(w,e.CASE).culpritRole,undefined);
}
console.log('PASS 48 unique world seeds, consistent positions, ambiguous coats and honest statements');
