'use strict';
const assert=require('node:assert/strict');
require('../casebook-pages.js');
const personal=require('../personal-book-pages.js');
function p(save){const copy=JSON.stringify(save),pages=personal.buildPages(save);
 assert.equal(JSON.stringify(save),copy,'Opening a private journal must be read-only');
 return pages;
}
const ordinary={
 characterRoute:'industrialist',gameDate:'1878-05-01',companyCash:800,personalCash:15,
 componentWorks:{version:1,orders:[{id:'FE-1878-ARC-insulator',customer:'District Streetlighting Office',
 productId:'insulator',quantity:50,made:9,delivered:3,deadline:'1878-09-30'}],
 ledger:[{date:'1878-04-04',kind:'assembly',orderId:'FE-1878-ARC-insulator',goodUnits:9,rejectedUnits:0,token:'real:one'}],
 lampDevelopment:{good:3,rejected:2},factoryCapacity:{version:1,
  staff:{bench:{count:1,trained:true},winder:{count:0,trained:false}},
  machines:{bench:2,winder:1},payroll:{owedCents:300}}},
 electricCampaign:{version:1,street:{status:'awarded',shipped:3,certified:2},
 fair:{status:'not-open',shipped:0},lamps:{stage:2}}
};
let pages=p(ordinary);
for(const id of ['actual-factory-orders','actual-factory-receipts','factory-capacity-record','municipal-electric-register'])
 assert.ok(pages.some(x=>x.id===id),'Missing owner-only business page: '+id);
assert.equal(pages.find(x=>x.id==='municipal-electric-register').items[0].text.includes('2 accepted'),true);
assert.ok(pages.find(x=>x.id==='actual-factory-orders').items[0].text.includes('9 made'));
assert.equal(pages.some(x=>x.id==='station-property'||x.id==='door-custody'||x.id==='asylum-supply-requests'),false);
const cop={
 characterRoute:'investigator',gameDate:'1878-02-05',
 patrolDuty:{logs:[{id:'PAT-0001',date:'1878-02-05',status:'filed',locationId:'hillsdale',reportText:'Received unidentified item'}]},
 patrolProperty:{version:1,items:{'PROP-PAT-0001':{id:'PROP-PAT-0001',date:'1878-02-05',
  description:'Unidentified item',status:'station-intake',sealed:true,inspected:false,
  verifiedOwner:false,chain:[{stage:'collected'},{stage:'intake'}]}}}
};
pages=p(cop);
assert.ok(pages.some(x=>x.id==='station-property'));
assert.ok(pages.find(x=>x.id==='station-property').paragraphs[0].includes('does not establish guilt'));
assert.equal(pages.some(x=>x.id==='actual-factory-orders'||x.id==='door-custody'),false);
const criminal={
 characterRoute:'criminal',gameDate:'1878-02-05',doormanDuty:{totalSegments:4,wagesEarnedCents:120,logs:[]},
 peacockDoorRegister:{version:1,parcels:{'DOOR-0003':{id:'PARCEL-DOOR-0003',date:'1878-02-05',
 description:'Sealed unknown parcel',status:'held-at-door',chain:[{kind:'received'}]}},
 shiftReports:{'1878-02-05':{date:'1878-02-05',contacts:4,requestsForManager:1,tenseContacts:0,
  untransferredParcels:['PARCEL-DOOR-0003'],status:'filed-with-outstanding-custody'}}}
};
pages=p(criminal);
assert.ok(pages.some(x=>x.id==='door-custody'));
assert.ok(pages.some(x=>x.id==='door-shift-reports'));
assert.ok(pages.find(x=>x.id==='door-custody').paragraphs[0].includes('not personal possessions'));
assert.equal(pages.some(x=>x.id==='station-property'||x.id==='municipal-electric-register'),false);
const edmund={
 characterRoute:'wardman',gameDate:'1878-02-07',orderlyDuty:{totalAssignments:3,wagesEarnedCents:105,logs:[]},
 wardServiceRegister:{version:1,requests:{'SUP-WARD-0001':{
  id:'SUP-WARD-0001',created:'1878-02-05',description:'Missing unspecified supplies',
  status:'referred-to-supervisor',received:false,events:[{kind:'filed'},{kind:'followup'}]}},
 handover:{'1878-02-05':{date:'1878-02-05',services:['WARD-0001','WARD-0002','WARD-0003'],
  supplyRequests:['SUP-WARD-0001'],status:'submitted-to-ward-supervisor',managerDecision:null}}}
};
pages=p(edmund);
assert.ok(pages.some(x=>x.id==='asylum-supply-requests'));
assert.ok(pages.some(x=>x.id==='asylum-daily-handover'));
assert.ok(pages.find(x=>x.id==='asylum-supply-requests').items[0].text.includes('no supplies received'));
assert.equal(pages.some(x=>x.id==='station-property'||x.id==='door-custody'),false);
console.log('PASS private books show verified manufacturing, police custody, nightclub parcels and asylum service without profile leakage or invented outcomes');
