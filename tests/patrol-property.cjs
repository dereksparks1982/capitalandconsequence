'use strict';
const assert=require('node:assert/strict');
const property=require('../patrol-property.js');
const patrol=require('../patrol-duty.js');
const STATION='metropolitanPolice',ROOM='station-duty-room',DATE='1878-02-05';
function start(){
 const s={characterRoute:'investigator',phase:'day',paused:false,gameDate:DATE,notes:[]};
 assert.equal(patrol.shift(s,STATION,ROOM,true).ok,true);
 return s;
}
function find(choice){
 for(let n=0;n<300;n++){
  const s=start(),result=patrol.walk(s,{locationId:'hillsdale',date:DATE,profileId:'property-fixture-'+n,spentSeconds:600});
  if(result.scene.id!=='lost-property')continue;
  const response=patrol.respond(s,{locationId:'hillsdale',choiceId:choice,spentSeconds:300});
  assert.equal(response.ok,true);
  return s;
 }
 throw Error('No deterministic lost-property fixture');
}
const witness=find('witness');
assert.equal(Object.keys(property.read(witness).items).length,0,'A finder statement cannot create a physical object.');
const witnessFile=patrol.report(witness,{locationId:STATION,roomId:ROOM,spentSeconds:300});
assert.equal(witnessFile.ok,true);
assert.equal(Object.keys(property.read(witness).items).length,0);
const s=find('custody');
let data=property.read(s);
assert.equal(Object.keys(data.items).length,1);
const id=Object.keys(data.items)[0];
assert.equal(data.items[id].status,'officer-custody');
assert.equal(data.items[id].reportFiled,false);
assert.equal(data.items[id].chain.length,1);
assert.equal(property.preview(s,{id,kind:'seal',date:DATE,locationId:STATION,roomId:ROOM}).ok,false,
 'A street seizure cannot be treated as logged at the station yet.');
const filed=patrol.report(s,{locationId:STATION,roomId:ROOM,spentSeconds:300});
assert.equal(filed.ok,true);
assert.equal(filed.record.propertyId,id);
data=property.read(s);
assert.equal(data.items[id].status,'station-intake');
assert.equal(data.items[id].chain.length,2);
const before=JSON.stringify(s);
assert.equal(property.preview(s,{id,kind:'transfer',date:DATE,locationId:STATION,roomId:ROOM}).ok,false,
 'Unsealed/uninspected property must not be transferred.');
assert.equal(JSON.stringify(s),before,'Reading denied action never changes a case.');
assert.equal(property.manage(s,{id,kind:'seal',token:'property:invalid-charge',date:DATE,
 locationId:STATION,roomId:ROOM,spentSeconds:0}).ok,false);
assert.equal(JSON.stringify(s),before);
assert.equal(property.preview(s,{id,kind:'seal',date:DATE,locationId:'hillsdale',roomId:ROOM}).ok,false);
assert.equal(property.preview(s,{id,kind:'seal',date:DATE,locationId:STATION,roomId:ROOM}).seconds,300);
const a={id,kind:'seal',token:'property:seal:1',date:DATE,
 locationId:STATION,roomId:ROOM,spentSeconds:300};
const seal=property.manage(s,a);
assert.equal(seal.ok,true);
assert.equal(property.manage(s,a).repeated,true);
assert.equal(property.read(s).items[id].chain.length,3);
const inspect=property.manage(s,{...a,kind:'inspect',token:'property:inspect:2'});
assert.equal(inspect.ok,true);
const custody=property.manage(s,{...a,kind:'transfer',token:'property:transfer:3'});
assert.equal(custody.ok,true);
data=property.read(s);
assert.equal(data.items[id].status,'clerk-custody');
assert.equal(data.items[id].chain.length,5);
assert.equal(data.items[id].claimedOwner,null);
assert.equal(data.items[id].verifiedOwner,false);
assert.equal(property.manage(s,{...a,token:'property:seal:again'}).ok,false);
assert.equal(property.manage(s,{...a,kind:'transfer',token:'property:transfer:again'}).ok,false);
assert.equal(property.manage(s,{...a,kind:'transfer',token:'property:transfer:3'}).repeated,true);
const persisted=JSON.parse(JSON.stringify(s));
assert.equal(property.read(persisted).items[id].chain.length,5);
assert.equal(property.read(persisted).receipts['property:transfer:3'].status,'clerk-custody');
persisted.characterRoute='criminal';
assert.equal(property.preview(persisted,{id,kind:'seal',date:DATE,locationId:STATION,roomId:ROOM}).ok,false);
assert.equal(property.preview(s,{id,kind:'seal',date:'1878-99-99',locationId:STATION,roomId:ROOM}).ok,false);
console.log('PASS Hillsdale item vs witness, collection, station intake, sealed custody, inspection, audited clerk transfer, no fake owner, duplicate safety');
