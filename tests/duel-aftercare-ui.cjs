'use strict';
const assert=require('node:assert/strict');
const aftermath=require('../duel-aftermath.js');
const source=require('node:fs').readFileSync(require('node:path').join(__dirname,'../duel-aftercare-ui.js'),'utf8');
const save={gameDate:'1878-05-03'};
const duel={id:'card-dispute:1',status:'resolved',opponent:'Mickey Dunn',
 locationId:'workingPoker',endedOn:'1878-05-03',playerShot:'wounded',opponentShot:'wounded'};
aftermath.record(save,duel);
const elements={},make=tag=>({
 tag,id:'',children:[],textContent:'',hidden:false,disabled:false,onclick:null,
 append(...nodes){this.children.push(...nodes)},
 insertAdjacentElement(where,el){elements[el.id]=el},
});
elements.cityRoomDuel=make('section');
elements.cityRoomDuel.parentElement=make('div');
const doc={getElementById:id=>elements[id]||null,
 createElement:tag=>{
  const v=make(tag);
  Object.defineProperty(v,'id',{get(){return this._id||''},set(id){this._id=id;elements[id]=this}});
  return v;
 }};
let room='workingPoker',actions=[];
const ctx={window:{FE_DUEL_AFTERMATH:aftermath},document:doc};
new Function(...Object.keys(ctx),source)(...Object.values(ctx));
ctx.window.FE_DUEL_AFTERCARE_UI.bind({getSave:()=>save,getLocation:()=>room,
 onAction:(id,place)=>{actions.push([id,place]);return true}});
assert.equal(elements.cityRoomDuelAftercare.hidden,true);
room='governmentHospital';ctx.window.FE_DUEL_AFTERCARE_UI.render();
assert.equal(elements.cityRoomDuelAftercare.hidden,false);
assert.match(elements.cityRoomAftercareAct.textContent,/20 minutes/);
elements.cityRoomAftercareAct.onclick();
assert.deepEqual(actions[0],[duel.id,'governmentHospital']);
aftermath.treat(save,duel.id,save.gameDate);
ctx.window.FE_DUEL_AFTERCARE_UI.render();
assert.equal(elements.cityRoomDuelAftercare.hidden,true,'No second treatment offered');
room='metropolitanPolice';ctx.window.FE_DUEL_AFTERCARE_UI.render();
assert.match(elements.cityRoomAftercareAct.textContent,/10 minutes/);
elements.cityRoomAftercareAct.onclick();
assert.deepEqual(actions[1],[duel.id,'metropolitanPolice']);
aftermath.report(save,duel.id,save.gameDate);
ctx.window.FE_DUEL_AFTERCARE_UI.render();
assert.equal(elements.cityRoomDuelAftercare.hidden,true,'No second report offered');
console.log('PASS hospital/police aftercare only appears at real venues and aftercare actions do not duplicate');
