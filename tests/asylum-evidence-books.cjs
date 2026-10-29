'use strict';
const assert=require('node:assert/strict'),missions=require('../mission-engine.js');
const pages=require('../personal-book-pages.js'),casebook=require('../casebook-pages.js');
const edmund={characterRoute:'wardman',gameDate:'1878-01-06',orderlyDuty:{version:1,logs:[]},
 incidentObservations:{version:1,records:[{incidentId:'asylum-ward-death-1878',eventId:'asylum:wardCorridor',at:'1878-01-05T09:15',source:'ward scene',description:'Door was open'}]},
 wardmanStanding:{version:1,workplaceTrust:52,familyPressure:20,documentedConcerns:['asylum-ward-death-1878']}};
const ep=pages.buildPages(edmund,{});
assert.ok(ep.some(p=>p.id==='asylum-observations'&&p.items[0].text==='Door was open'));
assert.ok(ep.some(p=>p.id==='family'&&p.items[0].text==='52'));
const sam={characterRoute:'investigator',gameDate:'1878-01-06',
 incidentObservations:{version:1,records:[{eventId:'asylum:medical',at:'1878-01-05T14:00',source:'coroner',description:'Report reviewed'}]},
 morgueExaminations:[{caseId:'asylum-ward-death-1878',publicFinding:'Observed contusion'}]};
const sp=casebook.buildPages(sam,{});
assert.ok(sp.some(p=>p.id==='asylum-inquiry'&&p.items[0].text==='Report reviewed'));
assert.ok(sp.find(p=>p.id==='postmortem').items[0].text==='Observed contusion');
assert.equal(casebook.buildPages(edmund,{}).length,0,'Sam’s casebook is career-private');
const s={characterRoute:'wardman',gameDate:'1878-01-05'};
for(let i=0;i<61;i++){const id='ward:WARD-'+String(i).padStart(4,'0');
 missions.start(s,{id,templateId:'ward-round'});}
assert.equal(missions.pages(s).length,5,'Mission pages retain all entries instead of only most recent sixty');
console.log('PASS evidence pages remain role-private, standings are sourced and missions paginate lifetime records');
