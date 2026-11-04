'use strict';
const assert=require('node:assert/strict');
const door=require('../doorman-duty.js');
const register=require('../peacock-door-register.js');
const PLACE={locationId:door.VENUE,roomId:door.ROOM},DAY='1878-02-05';
const fresh=()=>{
 const s={characterRoute:'criminal',phase:'night',paused:false,gameDate:DAY,
 personalCash:2.50,notes:[],currentLocation:{locationId:door.VENUE,roomId:'main-room'}};
 assert.equal(door.takeOffer(s,'door',300).ok,true);
 s.currentLocation.roomId=door.ROOM;
 return s;
};
function scenario(choice){
 for(let i=0;i<180;i++){
  const save=fresh();
  const begin=door.begin(save,{...PLACE,date:DAY,profileId:'courier-variant-'+i,spentSeconds:600});
  if(begin.encounter.id!=='coat-parcel')continue;
  const completed=door.respond(save,{...PLACE,choiceId:choice,spentSeconds:300});
  assert.equal(completed.ok,true);
  return save;
 }
 throw Error('Cannot create a verified courier contact');
}
const witness=scenario('manager');
assert.equal(Object.keys(register.read(witness).parcels).length,0,'Asking manager to collect does not give Eli imaginary parcel custody');
assert.equal(register.read(witness).events.length,1);
const held=scenario('receipt');
const book=register.read(held);
assert.equal(book.events.length,1);
assert.equal(Object.keys(book.parcels).length,1);
const parcelId=Object.keys(book.parcels)[0];
assert.equal(book.parcels[parcelId].status,'held-at-door');
assert.equal(book.parcels[parcelId].chain.length,1);
assert.equal(book.parcels[parcelId].receivedBy,'Elias Crowe');
const where={...PLACE,date:DAY,parcelId,kind:'handover'};
assert.equal(register.preview(held,{...where,locationId:'factory'}).ok,false);
assert.equal(register.preview(held,where).seconds,300);
const snapshot=JSON.stringify(held);
assert.equal(register.transact(held,{...where,spentSeconds:0,token:'parcel:wrong'}).ok,false);
assert.equal(JSON.stringify(held),snapshot);
const hand=register.transact(held,{...where,spentSeconds:300,token:'parcel:one'});
assert.equal(hand.ok,true);
assert.equal(register.read(held).parcels[parcelId].status,'manager-custody');
assert.equal(register.read(held).parcels[parcelId].chain.length,2);
assert.equal(register.transact(held,{...where,spentSeconds:300,token:'parcel:one'}).repeated,true);
assert.equal(register.transact(held,{...where,spentSeconds:300,token:'parcel:twice'}).ok,false);
assert.equal(register.read(held).parcels[parcelId].chain.length,2);
const badShift=register.preview(held,{...PLACE,date:DAY,kind:'report'});
assert.equal(badShift.ok,false,'One paid contact is not a complete nightly report');
// Work three more actual contacts without granting extra compensation.
for(let n=0;n<3;n++){
 const opened=door.begin(held,{...PLACE,date:DAY,profileId:'courier-variant-0',spentSeconds:600});
 assert.equal(opened.ok,true);
 assert.equal(door.respond(held,{...PLACE,choiceId:opened.encounter.choices[0].id,spentSeconds:300}).ok,true);
}
assert.equal(door.summary(held).totalSegments,4);
assert.equal(register.read(held).events.length,4);
assert.equal(held.personalCash,3.70);
const before=JSON.stringify(held);
const preview=register.preview(held,{...PLACE,date:DAY,kind:'report'});
assert.equal(preview.ok,true);
assert.equal(JSON.stringify(held),before,'Reading a proposed manager report does not change the save');
const submitted=register.transact(held,{...PLACE,date:DAY,kind:'report',token:'doorbook:night1',spentSeconds:300});
assert.equal(submitted.ok,true);
assert.equal(submitted.report.contacts,4);
assert.equal(submitted.report.promotion,false);
assert.equal(submitted.report.managerDecision,null);
assert.equal(register.transact(held,{...PLACE,date:DAY,kind:'report',token:'doorbook:night1',spentSeconds:300}).repeated,true);
assert.equal(register.transact(held,{...PLACE,date:DAY,kind:'report',token:'doorbook:again',spentSeconds:300}).ok,false);
assert.equal(register.read(JSON.parse(JSON.stringify(held))).shiftReports[DAY].contacts,4);
assert.equal(register.read(held).events.every(x=>x.wageCents===30),true);
assert.equal(register.read(held).parcels[parcelId].transferredTo,'Floor manager');
const untransferred=scenario('receipt');
for(let i=0;i<3;i++){
 const opened=door.begin(untransferred,{...PLACE,date:DAY,profileId:'variant-'+i,spentSeconds:600});
 door.respond(untransferred,{...PLACE,choiceId:opened.encounter.choices[0].id,spentSeconds:300});
}
const deferred=register.transact(untransferred,{...PLACE,date:DAY,kind:'report',token:'doorbook:unresolved',spentSeconds:300});
assert.equal(deferred.ok,true);
assert.equal(deferred.report.untransferredParcels.length,1,'Manager receives an actual unresolved delivery, not a falsely signed handoff.');
assert.equal(deferred.report.status,'filed-with-outstanding-custody');
assert.equal(untransferred.peacockDoorRegister.parcels[Object.keys(untransferred.peacockDoorRegister.parcels)[0]].status,'held-at-door');
console.log('PASS Golden Peacock real parcel custody, no fabricated intake, 4-contact shift report, unpaid unresolved responsibilities, no forced promotion, token safety');
