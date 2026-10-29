'use strict';
const assert=require('node:assert/strict'),incident=require('../asylum-incident.js');
const save={sharedWorldId:'w123',gameDate:'1878-01-05'};
const first=incident.observe(save,{incidentId:'asylum-ward-death-1878',eventId:'asylum:wardRoster',
 source:'staff register',description:'A duty register was reviewed.',
 at:'1878-01-05T09:30',locationId:'blackwoodAsylum',roomId:'orderly-station'});
assert.equal(first.ok,true);
assert.equal(first.observation.locationId,'blackwoodAsylum');
assert.equal(first.observation.roomId,'orderly-station');
assert.equal(incident.observe(save,{incidentId:'asylum-ward-death-1878',eventId:'asylum:wardRoster',
 source:'staff register',description:'Anything else',locationId:'otherPlace'}).status,'duplicate');
assert.equal(save.incidentObservations.records[0].locationId,'blackwoodAsylum');
assert.equal(JSON.parse(JSON.stringify(save)).incidentObservations.records[0].roomId,'orderly-station');
console.log('PASS source-based private evidence records retain verified room provenance and no duplicate facts');
