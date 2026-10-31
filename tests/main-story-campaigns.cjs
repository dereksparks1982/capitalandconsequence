'use strict';
const assert=require('node:assert/strict');
const stories=require('../main-story.js');
const routes=['industrialist','investigator','criminal','wardman'];
assert.deepEqual(Object.keys(stories.CAMPAIGNS),routes);
const basic=route=>({characterRoute:route,gameDate:'1878-01-05',
 personalBookNotes:'I secretly know the killer',notes:[]});
for(const route of routes){
 const save=basic(route),record=stories.inspect(save);
 assert.equal(record.acts.length,5);
 assert.equal(record.acts[0].status,'available');
 assert.equal(record.acts[1].status,record.acts[1].implemented?'awaiting-previous':'planned');
 assert.equal(record.recordedMilestones,0);
 const doc=stories.pages(save)[0];
 assert.equal(doc.section,'Main Story');
 assert.equal(JSON.stringify(doc).includes(save.personalBookNotes),false,'private annotations cannot become story evidence');
 assert.equal(JSON.stringify(doc).includes('culpritRole'),false,'never expose hidden culprit');
 assert.equal(stories.inspect(save).recordedMilestones,0,'reading story does not grant progress');
}
const business=basic('industrialist');
business.componentWorks={receipts:{s1:{kind:'shipment',date:'1878-01-05'}}};
business.corporateGovernance={charterDate:'1878-01-06',offeringDate:'1878-02-08',status:'public'};
assert.deepEqual(stories.inspect(business).acts.slice(0,3).map(x=>x.status),Array(3).fill('milestone-recorded'));
business.componentWorks.receipts.s1.kind='quotation';
assert.equal(stories.inspect(business).acts[0].status,'available','unsent order cannot count as shipment');
const cop=basic('investigator');
cop.patrolDuty={reportsFiled:2};
cop.casePermissions={'asylum-ward-death-1878':{issuedBy:'station-sergeant'}};
cop.incidentObservations={records:[
 {incidentId:'asylum-ward-death-1878',eventId:'asylum:stationMemo'},
 {incidentId:'asylum-ward-death-1878',eventId:'asylum:policeMemo'},
 {incidentId:'asylum-ward-death-1878',eventId:'asylum:policeWardmanCertify'}]};
assert.deepEqual(stories.inspect(cop).acts.slice(0,4).map(x=>x.status),Array(4).fill('milestone-recorded'));
const favoured=basic('criminal');
favoured.doormanDuty={totalSegments:2};
favoured.peacockStory={stage:'resolved',finishedAt:'1878-01-08'};
assert.equal(stories.inspect(favoured).acts[1].status,'milestone-recorded');
const heard=basic('wardman');heard.familyRecords={hearing:{result:'dismissed'}};
assert.equal(stories.inspect(heard).acts[3].status,'milestone-recorded');
const network=basic('criminal');
network.doormanDuty={totalSegments:2};network.peacockStory={stage:'resolved',finishedAt:'1878-01-08'};
network.peacockNetwork={stage:'resolved',completedAt:'1878-01-11'};
assert.equal(stories.inspect(network).acts[2].status,'milestone-recorded');
const doorman=basic('criminal');
doorman.doormanDuty={totalSegments:2};
assert.equal(stories.inspect(doorman).acts[0].status,'milestone-recorded');
assert.equal(stories.inspect(doorman).acts[1].status,'available');
const edmund=basic('wardman');
edmund.orderlyDuty={totalAssignments:1};
edmund.incidentObservations={records:[{incidentId:'asylum-ward-death-1878',eventId:'asylum:wardMemo'}]};
edmund.wardmanStanding={petition:{status:'enforced'},careerEnded:'experimental-lobotomy'};
assert.deepEqual(stories.inspect(edmund).acts.slice(0,3).map(x=>x.status),Array(3).fill('milestone-recorded'));
assert.match(stories.pages(edmund)[0].paragraphs.join(' '),/playable career has ended/);
assert.equal(stories.inspect(basic('intruder')),null,'unknown character has no story');
console.log('PASS four distinct main campaigns, 5 acts, honest playable flags, earned milestones, endings and private knowledge isolation');
