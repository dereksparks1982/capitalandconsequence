'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const aftermath=require('../duel-aftermath.js');
const casework=require('../police-casework.js');
const src=fs.readFileSync(path.join(__dirname,'../duel-aftercare-ui.js'),'utf8');
const save={gameDate:'1878-04-15'};
aftermath.record(save,{id:'card-dispute:room',status:'resolved',opponent:'Walter Briggs',
 locationId:'commercePoker',endedOn:'1878-04-15',playerShot:'missed',opponentShot:'wounded'});
aftermath.report(save,'card-dispute:room','1878-04-15');
let place='metropolitanPolice',action=null;
const nodes={};
function node(tag){return {tag,children:[],hidden:false,textContent:'',disabled:false,
 append(...x){this.children.push(...x)},
 insertAdjacentElement(position,item){nodes[item.id]=item}}}
const anchor=node('section');anchor.parentElement=node('div');nodes.cityRoomDuel=anchor;
const doc={getElementById:id=>nodes[id]||null,createElement(tag){
 const el=node(tag);
 Object.defineProperty(el,'id',{get(){return this._id},set(id){this._id=id;nodes[id]=this}});
 return el;
}};
const ctx={window:{FE_DUEL_AFTERMATH:aftermath,FE_POLICE_CASEWORK:casework},document:doc};
vm.runInNewContext(src,ctx);
ctx.window.FE_DUEL_AFTERCARE_UI.bind({
 getSave:()=>save,getLocation:()=>place,
 onAction:(id,location,kind)=>{action={id,location,kind};return true}
});
assert.equal(nodes.cityRoomDuelAftercare.hidden,true,'No same-day review of a statement');
save.gameDate='1878-04-16';
ctx.window.FE_DUEL_AFTERCARE_UI.render();
assert.equal(nodes.cityRoomDuelAftercare.hidden,false);
assert.match(nodes.cityRoomAftercareAct.textContent,/12 minutes/);
nodes.cityRoomAftercareAct.onclick();
assert.deepEqual(action,{id:'police-intake:card-dispute:room',
 location:'metropolitanPolice',kind:'review'});
casework.review(save,action.id,save.gameDate,action.location);
ctx.window.FE_DUEL_AFTERCARE_UI.render();
assert.equal(nodes.cityRoomDuelAftercare.hidden,true,'Reviewed case cannot be re-reviewed');
place='workingPoker';ctx.window.FE_DUEL_AFTERCARE_UI.render();
assert.equal(nodes.cityRoomDuelAftercare.hidden,true,'Case desk is station-only');
console.log('PASS room-local case review appears the day after a real report and cannot be repeated');
