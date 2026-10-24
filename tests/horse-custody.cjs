'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const custody=require('../horse-custody.js');
const save={paused:false,gameDate:'1878-01-02',personalCash:90,companyCash:500,
 currentLocation:{locationId:'eastLivery',roomId:'service-desk'},
 transport:{version:2,assets:[{id:'h1',kind:'horse',name:'Workhorse',owner:'personal',
  locationId:'eastLivery',status:'stabled'}],events:[],journeys:[]}};
assert.equal(custody.prepare(save,'not-owned','eastLivery').ok,false);
assert.equal(custody.prepare(save,'h1','westLivery').ok,false);
assert.equal(custody.prepare(save,'h1','eastLivery').ok,true);
assert.equal(save.transport.assets[0].locationId,'eastLivery','Preparation does not teleport horse');
assert.equal(custody.prepare(save,'h1','eastLivery').repeated,true);
let saved=JSON.stringify(save);
assert.equal(custody.onArrival(save,'eastLivery','factory',false).ok,false);
assert.equal(JSON.stringify(save),saved,'Unpaid travel cannot move animal');
assert.equal(custody.onArrival(save,'eastLivery','factory',true).ok,false,'Cannot fake a paid journey');
save.transport.journeys.push({id:'j1',from:'eastLivery',to:'factory',calendarApplied:true,temporaryGameMinutes:60});
assert.equal(custody.onArrival(save,'eastLivery','factory',true).ok,true);
assert.equal(save.transport.assets[0].locationId,'factory');
assert.equal(save.transport.assets[0].status,'stabled');
assert.equal(save.personalCash,90);assert.equal(save.companyCash,500,'No duplicate travel payment or company cash');
assert.equal(save.transport.events.length,1);
assert.equal(save.horseCustody,undefined);
saved=JSON.stringify(save);
assert.equal(custody.onArrival(save,'eastLivery','factory',true).ok,false);
assert.equal(JSON.stringify(save),saved,'Reload cannot replay the horse transfer');
save.currentLocation={locationId:'factory',roomId:'executive-office'};
assert.equal(custody.prepare(save,'h1','eastLivery').ok,false,'Horse cannot be conjured back to livery');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
assert.ok(app.includes('onArrival?.(S,priorLocation.locationId,location.id,!!journeyPaid)'));
assert.ok(app.includes("onArrival?.(S,previous.locationId,'factory',!!journeyPaid)"));
console.log('PASS physical horse journey from seller to factory, paid travel witness, no teleport and stable replay');
