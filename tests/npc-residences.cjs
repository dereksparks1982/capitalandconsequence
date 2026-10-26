'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const homes=require('../npc-residences.js'),access=require('../city-access.js');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../city.js'),'utf8'),scope);
const city=scope.window.FederalElectricCity;
const resident={id:'foremanSullivan'};
const when=(date,minuteOfDay)=>({date,minuteOfDay});
assert.deepEqual(homes.registered,['foremanSullivan'],'Unknown NPC residences cannot be invented');
assert.equal(homes.nightStay(resident,when('1878-01-02',1320),city)?.roomId,'workers-lodging');
assert.equal(homes.nightStay(resident,when('1878-01-03',120),city)?.locationId,'factory');
assert.equal(homes.nightStay(resident,when('1878-01-03',479),city)?.roomId,'workers-lodging');
assert.equal(homes.nightStay(resident,when('1878-01-03',480),city),null);
assert.equal(homes.nightStay(resident,when('1878-01-03',1100),city),null);
assert.equal(homes.nightStay({id:'madamStar'},when('1878-01-03',1320),city),null);
assert.equal(homes.nightStay({id:'samHarlan'},when('1878-01-03',1320),city),null);
assert.equal(access.canRoom(city,{kind:'npc',id:'samHarlan',onDuty:false},'factory','workers-lodging','1878-01-03').ok,false);
assert.equal(homes.nightStay(resident,when('1878-01-03',1320),{
 getLocation:city.getLocation,getRoom:()=>null
}),null,'No room means no permission');
assert.throws(()=>homes.nightStay(resident,when('bad-date',1320),city));
const projection=require('../workshop-presence.js');
const lodging={id:'foremanSullivan',status:'present',locationId:'factory',
 roomId:'workers-lodging',activity:'resting in his rented room'};
const saved={componentWorks:{}};
assert.equal(projection.position(saved,lodging,'foremanSullivan',{
 date:'1878-01-03',minuteOfDay:120
}),lodging,'Workshop attendance cannot hide Sullivan asleep at the factory');
console.log('PASS rented bedroom at night, restricted access, honest unknown addresses and read-only presence');
