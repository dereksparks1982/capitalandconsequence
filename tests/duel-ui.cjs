'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../duel-ui.js'),'utf8');
const real=require('../duel-engine.js');
const save={gameDate:'1878-04-02',characterSkills:{version:1,values:{marksmanship:45,observation:30}}};
const challenge=real.offer(save,{sessionId:'session-77',circle:'working',conduct:'rude',hands:2});
const ids=['cityRoomDuel','cityRoomDuelChallenge','cityRoomDuelNotice','capitalDuelOverlay',
 'capitalDuelClose','capitalDuelShoot','capitalDuelWide','capitalDuelYield',
 'capitalDuelAgain','capitalDuelAccept','capitalDuelTitle','capitalDuelResult',
 'capitalDuelStory','capitalDuelField','capitalDuelSignal','capitalDuelAim'];
const nodes=Object.fromEntries(ids.map(id=>[id,{id,hidden:id!=='cityRoomDuel',textContent:'',
 disabled:false,style:{},onclick:null,innerHTML:''}]));
delete nodes.capitalDuelOverlay;
let overlayCreated=null,location='workingPoker',settled=0,calls=0,invoked=[];
const queues=[],frames=[];
const doc={getElementById:id=>nodes[id]||null,
 createElement:tag=>({tag,style:{},hidden:true,innerHTML:'',id:''}),
 body:{appendChild(node){overlayCreated=node;nodes[node.id]=node}}};
const engine={...real,exchange:opts=>{
  calls++;invoked.push(opts);
  return calls===1?{action:'shoot',player:'missed',opponent:'missed',result:'honor-exchanged'}:
   {action:'yield',player:'yielded',opponent:'held-fire',result:'yielded'};
}};
const ctx={window:{FE_DUELS:engine,FE_SKILLS:{level:(state,id)=>state.characterSkills.values[id]}},
 document:doc,setTimeout:fn=>(queues.push(fn),queues.length),clearTimeout:()=>{},
 requestAnimationFrame:fn=>(frames.push(fn),frames.length),cancelAnimationFrame:()=>{},
 performance:{now:()=>10},console:{warn(){}}};
vm.runInNewContext(src,ctx);
assert.equal(ctx.window.FE_DUEL_UI.bind({getSave:()=>save,getLocation:()=>location,
 onSettle:(pending,result,rounds)=>{
  settled++;assert.equal(pending.id,challenge.id);assert.equal(rounds,2);
  assert.equal(result.result,'yielded');return true;
 }}),true);
assert.equal(nodes.cityRoomDuel.hidden,false,'Challenge appears at the real card room');
assert.match(nodes.cityRoomDuelNotice.textContent,/Mickey Dunn/);
location='star';ctx.window.FE_DUEL_UI.refresh();
assert.equal(nodes.cityRoomDuel.hidden,true,'Do not display a card-room dispute in a different venue');
location='workingPoker';ctx.window.FE_DUEL_UI.refresh();
nodes.cityRoomDuelChallenge.onclick();
assert.equal(ctx.window.FE_DUEL_UI.active,true,'First-person challenge opens');
assert.equal(overlayCreated.hidden,false);
assert.match(overlayCreated.innerHTML,/capital-duel-opponent/,'Full-body first-person silhouette renders');
function countdown(){for(let i=0;i<5;i++){const fn=queues.shift();assert.ok(fn);fn()}}
countdown();
assert.equal(nodes.capitalDuelSignal.textContent,'SHOOT!');
nodes.capitalDuelShoot.onclick();
assert.equal(nodes.capitalDuelAgain.hidden,false,'Both misses permit a second exchange');
assert.equal(settled,0,'A continued duel cannot be settled early');
nodes.capitalDuelAgain.onclick();
countdown();
nodes.capitalDuelYield.onclick();
assert.equal(settled,1,'A completed duel is committed once');
assert.equal(nodes.capitalDuelSignal.textContent,'CONCLUDED');
assert.equal(invoked[0].marksmanship,45);
assert.equal(invoked[0].observation,30);
nodes.capitalDuelClose.onclick();
assert.equal(ctx.window.FE_DUEL_UI.active,false);
console.log('PASS first-person challenge UI, countdown, aiming, second exchange, yield, one settlement and room gating');
