(()=> {
const $u=id=>document.getElementById(id);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const rand=(a,b)=>a+Math.random()*(b-a);
const fmt=n=>{n=Math.max(0,Math.ceil(n));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};
const PRIVATE_NAMES=['Jack Malloy','Rudy Fenwick','Cal Mercer','Tommy Graves','Earl Benton','Mick Driscoll','Frank Voss','Johnny Rusk','Ben Crowley','Sam Delaney'];
const BIRD_NAMES=['Red Banner','Copper Spur','Black Jack','Whitecap','Old Dominion','Iron Wing','Blue Crest','Capitol Red'];
const testClicks={private:[],cock:[]};
let lastPhase=null,lastDate=null;

function makePrivateFighter(name,id){return {id,name,power:rand(45,92),speed:rand(42,90),stamina:rand(45,92),toughness:rand(45,94),wins:0,losses:0,form:[]}}
function makeBird(name,id){return {id,name,speed:rand(45,92),strength:rand(45,92),stamina:rand(45,92),wins:0,losses:0}}
function privateRating(f){return f.power*.31+f.speed*.24+f.stamina*.22+f.toughness*.23}
function birdRating(b){return b.speed*.34+b.strength*.34+b.stamina*.32}
function oddsPair(a,b,fn){
 const ra=fn(a),rb=fn(b),pa=Math.exp(ra/13)/(Math.exp(ra/13)+Math.exp(rb/13));
 return {[a.id]:+clamp(.9/pa,1.25,15).toFixed(2),[b.id]:+clamp(.9/(1-pa),1.25,15).toFixed(2)};
}
function frac(d){const f=Math.max(.2,d-1);return f<1?Math.max(1,Math.round(f*4))+':4':Math.max(1,Math.round(f))+':1'}
function buildEvents(){
 const fighters=[...S.underworld.fighters].sort(()=>Math.random()-.5),birds=[...S.underworld.birds].sort(()=>Math.random()-.5);
 const pf=[fighters[0],fighters[1]],cb=[birds[0],birds[1]],privatePhase=Math.random()<.48?'day':'night';
 const privateThreshold=pick([3000,2400,1800,1200,600]),cockThreshold=pick([2400,1800,1200,600]);
 return {
  date:S.gameDate,
  privateFight:{phase:privatePhase,threshold:privateThreshold,fighters:pf.map(x=>x.id),odds:oddsPair(pf[0],pf[1],privateRating),result:null,bet:null},
  cockfight:{phase:'night',threshold:cockThreshold,birds:cb.map(x=>x.id),odds:oddsPair(cb[0],cb[1],birdRating),result:null,bet:null}
 };
}
function ensureState(){
 let changed=false;
 if(!S.underworld){
   S.underworld={privateFightsUnlocked:false,cockfightsUnlocked:false,fighters:PRIVATE_NAMES.map((n,i)=>makePrivateFighter(n,i+1)),birds:BIRD_NAMES.map((n,i)=>makeBird(n,i+1)),events:null,lastPreparedDate:null,bookieAskedDate:null,starAskedDate:null};
   changed=true;
 }
 if(!Array.isArray(S.underworld.fighters)||S.underworld.fighters.length<6){S.underworld.fighters=PRIVATE_NAMES.map((n,i)=>makePrivateFighter(n,i+1));changed=true}
 if(!Array.isArray(S.underworld.birds)||S.underworld.birds.length<4){S.underworld.birds=BIRD_NAMES.map((n,i)=>makeBird(n,i+1));changed=true}
 if(S.underworld.lastPreparedDate!==S.gameDate||!S.underworld.events||S.underworld.events.date!==S.gameDate){
   S.underworld.events=buildEvents();S.underworld.lastPreparedDate=S.gameDate;S.underworld.bookieAskedDate=null;S.underworld.starAskedDate=null;changed=true;
 }
 if(changed)save(true);
 return S.underworld;
}
function pf(id){return S.underworld.fighters.find(x=>x.id===id)}
function bird(id){return S.underworld.birds.find(x=>x.id===id)}
function secondsUntilEvent(e){
 if(e.result)return 0;
 if(S.phase===e.phase)return Math.max(0,S.dayRemaining-e.threshold);
 if(S.phase==='day'&&e.phase==='night')return Math.max(0,S.dayRemaining)+Math.max(0,NIGHT_SECONDS-e.threshold);
 return 0;
}
function eventTime(e){return (e.phase==='day'?'Business Day':'Washington Night')+' · '+(e.result?'COMPLETE':'event in '+fmt(secondsUntilEvent(e)))}
function eventCountdownMarkup(e,label){return '<div class="underground-countdown" data-event-phase="'+e.phase+'" data-event-threshold="'+e.threshold+'"><small>'+label+'</small><b>'+fmt(secondsUntilEvent(e))+'</b><span>'+escapeHtml(e.phase==='day'?'BUSINESS DAY':'WASHINGTON NIGHT')+'</span></div>'}
function spendLeadTime(seconds=120){
 if(S.phase==='report')return false;
 if(S.dayRemaining<seconds){setNote('There is not enough time remaining to chase that lead.');return false}
 if(window.advanceWorldTime)window.advanceWorldTime(seconds,true);else{advanceProduction(seconds,true);S.dayRemaining=Math.max(0,S.dayRemaining-seconds)}return true;
}
function resolvePrivate(){
 const e=ensureState().events.privateFight;if(e.result)return e.result;
 const a=pf(e.fighters[0]),b=pf(e.fighters[1]),as=privateRating(a)+rand(-10,10),bs=privateRating(b)+rand(-10,10),winner=as>=bs?a:b,loser=winner.id===a.id?b:a;
 const method=Math.abs(as-bs)>14&&Math.random()<.55?'Stoppage':'Decision';
 winner.wins++;loser.losses++;winner.form.push('W');loser.form.push('L');if(winner.form.length>8)winner.form.shift();if(loser.form.length>8)loser.form.shift();
 e.result={winnerId:winner.id,method};settle(e,'private');save(true);return e.result;
}
function resolveCock(){
 const e=ensureState().events.cockfight;if(e.result)return e.result;
 const a=bird(e.birds[0]),b=bird(e.birds[1]),as=birdRating(a)+rand(-12,12),bs=birdRating(b)+rand(-12,12),winner=as>=bs?a:b,loser=winner.id===a.id?b:a;
 winner.wins++;loser.losses++;e.result={winnerId:winner.id,duration:2+Math.floor(rand(0,10))};settle(e,'cock');save(true);return e.result;
}
function settle(e,kind){
 const bet=e.bet;if(!bet||bet.settled)return;
 const won=e.result.winnerId===bet.pickId,decimal=e.odds[bet.pickId]||2,payout=won?Math.round(bet.wager*decimal):0;
 bet.settled=true;bet.payout=payout;bet.net=payout-bet.wager;if(payout)S.personalCash+=payout;
 S.notes.push({date:displayDate(),text:(kind==='private'?'Private prizefight':'Cockfight')+' wager settled '+(bet.net>=0?'ahead ':'down ')+cash(Math.abs(bet.net))+'.',source:'personal betting record'});
}
function process(){
 const u=ensureState(),p=u.events.privateFight,c=u.events.cockfight;let changed=false;
 if(S.phase===p.phase&&!p.result&&S.dayRemaining<=p.threshold){resolvePrivate();changed=true}
 if(S.phase===c.phase&&!c.result&&S.dayRemaining<=c.threshold){resolveCock();changed=true}
 return changed;
}
window.finishUnderworldDay=()=>{const u=ensureState(),e=u.events.privateFight;if(e.phase==='day'&&!e.result)resolvePrivate();save(true)};
window.finishUnderworldNight=()=>{const u=ensureState(),p=u.events.privateFight,c=u.events.cockfight;if(p.phase==='night'&&!p.result)resolvePrivate();if(c.phase==='night'&&!c.result)resolveCock();save(true)};

function unlock(kind,source,silent=false){
 const u=ensureState(),key=kind==='private'?'privateFightsUnlocked':'cockfightsUnlocked';if(u[key])return false;u[key]=true;
 if(!silent){const label=kind==='private'?'private prizefights':'cockfighting';S.notes.push({date:displayDate(),text:'Gained access to '+label+' through '+source+'.',source:'personal recollection'})}
 save(true);return true;
}
window.unlockPrivateFightsFromBoxing=(source='a boxing contact')=>{const changed=unlock('private',source);if(changed){render();setNote('A contact from the fight crowd has given you access to private prizefights.')}return changed};

function askBookie(){
 if(!window.FE_VENUES?.canUse('star'))return setNote('You must be at the Star Club to ask for underground introductions.');
 const u=ensureState();if(!S.contacts.bookie?.met)return setNote('You do not know a bookmaker well enough to ask.');
 if(!spendLeadTime())return;u.bookieAskedDate=S.gameDate;
 const r=Math.random();let msg='';
 if(r<.34&&!u.privateFightsUnlocked){unlock('private','Eddie Doyle');msg='Eddie Doyle gives you the location and time of a private prizefight.'}
 else if(r<.64&&!u.cockfightsUnlocked){unlock('cock','Eddie Doyle');msg='Eddie Doyle tells you where a cockfight is taking bets.'}
 else if(r<.82){const p=u.events.privateFight,c=u.events.cockfight;msg='Eddie says the private bout is set for '+eventTime(p)+(u.cockfightsUnlocked?' and the bird match is set for '+eventTime(c)+'.':'.')}
 else msg='Eddie has nothing worth chasing right now.';
 setNote(msg);S.notes.push({date:displayDate(),text:msg,source:'Eddie Doyle'});save(true);render();
}
function askPromoter(){
 if(!window.FE_VENUES?.canUse('star'))return setNote('You must be at the Star Club to ask for underground introductions.');
 if(!S.contacts.promoter?.met)return setNote('You have not met a fight promoter who can make that introduction.');
 if(!spendLeadTime())return;
 const changed=unlock('private','Marty Kane');setNote(changed?'Marty Kane quietly gives you an invitation to a private prizefight.':'Marty Kane confirms the next private prizefight: '+eventTime(S.underworld.events.privateFight)+'.');render();
}
function askMadam(){
 if(!window.FE_VENUES?.canUse('star'))return setNote('You must be at the Star Club to ask for underground introductions.');
 const u=ensureState();if(!S.contacts.madamStar?.met||S.contacts.madamStar.trust<2)return setNote('Madam Star does not know you well enough to share that kind of information.');
 if(!spendLeadTime())return;u.starAskedDate=S.gameDate;
 let msg;if(!u.cockfightsUnlocked&&Math.random()<.55){unlock('cock','Madam Star');msg='Madam Star gives you a discreet introduction to a cockfighting circle.'}
 else if(!u.privateFightsUnlocked){unlock('private','Madam Star');msg='Madam Star points you toward a private prizefight.'}
 else msg='Madam Star says the useful rooms are already the ones you know about tonight.';
 setNote(msg);S.notes.push({date:displayDate(),text:msg,source:'Madam Star'});save(true);render();
}
function placePrivateBet(){
 if(!window.FE_VENUES?.canUse('private-fight'))return setNote('A private prizefight requires your presence at its concealed venue.');
 const u=ensureState(),e=u.events.privateFight;if(!u.privateFightsUnlocked)return;
 if(e.result)return setNote('That private fight is already over.');
 if(S.phase===e.phase&&S.dayRemaining<=e.threshold)return setNote('Betting is closed for that private fight.');
 if(e.bet)return setNote('You already have a wager on the private fight.');
 const id=Number($u('privateFightPick')?.value),wager=Math.max(1,Math.floor(Number($u('privateFightWager')?.value)||0));if(!e.fighters.includes(id))return;if(S.personalCash<wager)return setNote('Not enough personal cash.');
 S.personalCash-=wager;e.bet={pickId:id,wager,settled:false};save(true);render();setNote('Private-fight wager accepted on '+pf(id).name+' · '+cash(wager)+'.');
}
function placeCockBet(){
 if(!window.FE_VENUES?.canUse('cockfight'))return setNote('You must visit the private cockfighting venue.');
 const u=ensureState(),e=u.events.cockfight;if(!u.cockfightsUnlocked)return;
 if(e.result)return setNote('That cockfight is already over.');
 if(S.phase===e.phase&&S.dayRemaining<=e.threshold)return setNote('Betting is closed for that match.');
 if(e.bet)return setNote('You already have a wager on the cockfight.');
 const id=Number($u('cockfightPick')?.value),wager=Math.max(1,Math.floor(Number($u('cockfightWager')?.value)||0));if(!e.birds.includes(id))return;if(S.personalCash<wager)return setNote('Not enough personal cash.');
 S.personalCash-=wager;e.bet={pickId:id,wager,settled:false};save(true);render();setNote('Cockfight wager accepted on '+bird(id).name+' · '+cash(wager)+'.');
}
function setNote(t){const el=$u('underworldNote');if(el)el.textContent=t}
function privateMarkup(){
 const u=S.underworld,e=u.events.privateFight;
 if(!u.privateFightsUnlocked)return '<h4>Private Prizefights</h4><p class="muted">Invitation required.</p>';
 const a=pf(e.fighters[0]),b=pf(e.fighters[1]);
 if(e.result){const w=pf(e.result.winnerId);return '<h4>Private Prizefights</h4><p><b>Latest result:</b> '+escapeHtml(w.name)+' by '+e.result.method+'.</p>'+(e.bet?'<p class="underground-ticket">Wager '+cash(e.bet.wager)+' · Payout '+cash(e.bet.payout||0)+' · Net '+(e.bet.net>=0?'+':'')+cash(e.bet.net)+'</p>':'')}
 const ticket=e.bet?'<p class="underground-ticket">Ticket: '+escapeHtml(pf(e.bet.pickId).name)+' · Wager '+cash(e.bet.wager)+' · Potential payout '+cash(Math.round(e.bet.wager*(e.odds[e.bet.pickId]||2)))+'</p>':'<div class="underground-bet"><select id="privateFightPick"><option value="'+a.id+'">'+escapeHtml(a.name)+'</option><option value="'+b.id+'">'+escapeHtml(b.name)+'</option></select><input id="privateFightWager" type="number" min="1" step="1" value="25"><button id="privateFightBet">Place Bet</button></div>';
 return '<h4>Private Prizefights</h4>'+eventCountdownMarkup(e,'FIGHT IN')+'<p class="fine">'+eventTime(e)+'. The bout settles automatically whether this panel is open or closed.</p><div class="underground-match"><span>'+escapeHtml(a.name)+' <b>'+frac(e.odds[a.id])+'</b></span><span>vs.</span><span>'+escapeHtml(b.name)+' <b>'+frac(e.odds[b.id])+'</b></span></div>'+ticket;
}

function cockMarkup(){
 const u=S.underworld,e=u.events.cockfight;
 if(!u.cockfightsUnlocked)return '<h4>Cockfighting</h4><p class="muted">Invitation required.</p>';
 const a=bird(e.birds[0]),b=bird(e.birds[1]);
 if(e.result){const w=bird(e.result.winnerId);return '<h4>Cockfighting</h4><p><b>Latest result:</b> '+escapeHtml(w.name)+' won after '+e.result.duration+' minutes.</p>'+(e.bet?'<p class="underground-ticket">Wager '+cash(e.bet.wager)+' · Payout '+cash(e.bet.payout||0)+' · Net '+(e.bet.net>=0?'+':'')+cash(e.bet.net)+'</p>':'')}
 const ticket=e.bet?'<p class="underground-ticket">Ticket: '+escapeHtml(bird(e.bet.pickId).name)+' · Wager '+cash(e.bet.wager)+' · Potential payout '+cash(Math.round(e.bet.wager*(e.odds[e.bet.pickId]||2)))+'</p>':'<div class="underground-bet"><select id="cockfightPick"><option value="'+a.id+'">'+escapeHtml(a.name)+'</option><option value="'+b.id+'">'+escapeHtml(b.name)+'</option></select><input id="cockfightWager" type="number" min="1" step="1" value="25"><button id="cockfightBet">Place Bet</button></div>';
 return '<h4>Cockfighting</h4>'+eventCountdownMarkup(e,'MATCH IN')+'<p class="fine">'+eventTime(e)+'.</p><div class="underground-match"><span>'+escapeHtml(a.name)+' <b>'+frac(e.odds[a.id])+'</b></span><span>vs.</span><span>'+escapeHtml(b.name)+' <b>'+frac(e.odds[b.id])+'</b></span></div>'+ticket;
}

function renderLedger(){
 const el=$u('underworldLedger');if(!el)return;
 const u=ensureState(),events=[
   {label:'Private Prizefight',e:u.events.privateFight,phase:u.events.privateFight.phase,threshold:u.events.privateFight.threshold,kind:'private'},
   {label:'Cockfight',e:u.events.cockfight,phase:u.events.cockfight.phase,threshold:u.events.cockfight.threshold,kind:'cock'}
 ].filter(x=>x.e.result).sort((a,b)=>a.phase===b.phase?b.threshold-a.threshold:(a.phase==='day'?-1:1));
 el.innerHTML=events.length?events.map(x=>{
   const winner=x.kind==='private'?pf(x.e.result.winnerId):bird(x.e.result.winnerId),bet=x.e.bet;
   return '<div class="boxing-ledger-row"><b>'+x.label+': '+escapeHtml(winner.name)+'</b><small>'+(x.phase==='day'?'Business Day':'Washington Night')+(bet?' · Your bet '+(bet.net>=0?'+':'')+cash(bet.net):' · No wager')+'</small></div>'
 }).join(''):'<p class="muted">No underground events have been completed today.</p>';
}
function hiddenUnlock(kind){
 const now=Date.now(),a=testClicks[kind];a.push(now);while(a.length&&now-a[0]>5000)a.shift();if(a.length>=7){a.length=0;unlock(kind,'',true);render()}
}
function updateUnderworldCountdowns(){
 document.querySelectorAll('.underground-countdown').forEach(el=>{
  const phase=el.dataset.eventPhase,threshold=Number(el.dataset.eventThreshold)||0,b=el.querySelector('b');if(!b)return;
  b.textContent=fmt(secondsUntilEvent({phase,threshold,result:null}));
 });
}
function render(){
 const u=ensureState(),bookie=$u('askBookie'),promoter=$u('askPromoter'),madam=$u('askMadamUnderground');
 if(bookie){bookie.hidden=!S.contacts.bookie?.met;bookie.disabled=S.phase==='report'}
 if(promoter){promoter.hidden=!S.contacts.promoter?.met;promoter.disabled=S.phase==='report'}
 if(madam){madam.hidden=!(S.contacts.madamStar?.met&&S.contacts.madamStar.trust>=2);madam.disabled=S.phase==='report'}
 const p=$u('privateFightCard'),c=$u('cockfightCard');if(p)p.innerHTML=privateMarkup();if(c)c.innerHTML=cockMarkup();
 $u('privateFightBet')?.addEventListener('click',placePrivateBet);$u('cockfightBet')?.addEventListener('click',placeCockBet);renderLedger();
}
const bookieBtn=$u('askBookie');if(bookieBtn)bookieBtn.addEventListener('click',askBookie);
const promoterBtn=$u('askPromoter');if(promoterBtn)promoterBtn.addEventListener('click',askPromoter);
const madamBtn=$u('askMadamUnderground');if(madamBtn)madamBtn.addEventListener('click',askMadam);
$u('privateFightCard')?.addEventListener('click',()=>{if(!S.underworld?.privateFightsUnlocked)hiddenUnlock('private')});
$u('cockfightCard')?.addEventListener('click',()=>{if(!S.underworld?.cockfightsUnlocked)hiddenUnlock('cock')});
document.addEventListener('click',e=>{if(e.target?.dataset?.tab==='washington')setTimeout(render,0)});
ensureState();lastPhase=S.phase;lastDate=S.gameDate;render();setInterval(()=>{if(document.hidden)return;const changed=process(),phaseChanged=lastPhase!==S.phase,dateChanged=lastDate!==S.gameDate;if(changed||phaseChanged||dateChanged){lastPhase=S.phase;lastDate=S.gameDate;render()}else updateUnderworldCountdowns()},1000);
})();