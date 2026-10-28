(()=> {
const CARD=[
 {id:'B1',label:'Opening Bout',threshold:2700,rounds:6},
 {id:'B2',label:'Featured Bout',threshold:1800,rounds:8},
 {id:'B3',label:'Co-Main Event',threshold:900,rounds:10},
 {id:'B4',label:'Main Event',threshold:300,rounds:10}
];
const NAMES=[
 'Tommy Keane','Willie Mercer','Johnny Vale','Sammy Burke','Eddie Flynn','Frankie Cole',
 'Ray Hanlon','Mickey Ross','Joe Carver','Danny Pike','Lou Marino','Benny Shaw',
 'Artie Nolan','Jimmy Wade','Charlie Moss','Nate Brooks','Vic Donnelly','Harry Quinn',
 'Paul Dugan','Leo Carter'
];
const STYLES=['Boxer','Pressure fighter','Counterpuncher','Slugger','Defensive boxer'];
const WEIGHTS=['Welterweight','Middleweight','Light Heavyweight'];
const $b=id=>document.getElementById(id);
let lastPhase=null;
const rand=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
const fmt=n=>{n=Math.max(0,Math.ceil(n));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};

function makeFighter(name,id){
 return {id,name,age:19+Math.floor(rand(0,14)),weightClass:WEIGHTS[id%WEIGHTS.length],style:pick(STYLES),
  power:rand(48,92),speed:rand(48,92),stamina:rand(50,94),chin:rand(46,94),defense:rand(46,93),
  condition:rand(84,100),confidence:rand(48,70),injury:null,wins:0,losses:0,draws:0,knockouts:0,form:[]};
}
function fighter(id){return S.boxing.roster.find(x=>x.id===id)}
function rating(f){
 let r=f.power*.22+f.speed*.2+f.stamina*.2+f.chin*.16+f.defense*.22+(f.condition-80)*.15+(f.confidence-50)*.08;
 if(f.injury)r-=10;
 return clamp(r,20,110);
}
function decimalOdds(a,b){
 const ra=rating(a),rb=rating(b),pa=Math.exp(ra/14)/(Math.exp(ra/14)+Math.exp(rb/14));
 return {[a.id]:+clamp(.92/pa,1.25,12).toFixed(2),[b.id]:+clamp(.92/(1-pa),1.25,12).toFixed(2)};
}
function frac(d){const f=Math.max(.2,d-1);return f<1?Math.max(1,Math.round(f*4))+':4':Math.max(1,Math.round(f))+':1'}
function recover(){
 if(!S.boxing?.roster)return;
 for(const f of S.boxing.roster){f.condition=clamp((f.condition||80)+rand(2,6),50,100);f.confidence=clamp(f.confidence||50,20,95);if(f.injury&&f.condition>90&&Math.random()<.4)f.injury=null}
}
function buildCard(){
 S.sportsChampionships=window.FE_CHAMPIONSHIPS.init(S.sportsChampionships);
 const championship=window.FE_BOXING_CHAMPIONSHIP.next(S.sportsChampionships,S.gameDate,S.boxing.roster,window.FE_CHAMPIONSHIPS);
 const byWeight={};
 for(const f of S.boxing.roster){(byWeight[f.weightClass] ||= []).push(f)}
 const used=new Set(championship?.fighters||[]),bouts={};
 for(let i=0;i<CARD.length;i++){
   const d=CARD[i];
   if(championship&&d.id==='B4'){
    const a=S.boxing.roster.find(f=>f.id===championship.fighters[0]);
    const b=S.boxing.roster.find(f=>f.id===championship.fighters[1]);
    bouts[d.id]={fighters:[a.id,b.id],odds:decimalOdds(a,b),result:null};
    continue;
   }
   const weight=WEIGHTS[i%WEIGHTS.length],pool=(byWeight[weight]||S.boxing.roster).filter(f=>!used.has(f.id));
   pool.sort(()=>Math.random()-.5);
   const a=pool[0],b=pool[1]||S.boxing.roster.find(f=>!used.has(f.id)&&f.id!==a.id);
   used.add(a.id);used.add(b.id);
   bouts[d.id]={fighters:[a.id,b.id],odds:decimalOdds(a,b),result:null};
 }
 return {date:S.gameDate,bouts,bets:{},created:true,championship};
}
function ensureState(){
 let changed=false;
 if(!S.boxing){S.boxing={roster:NAMES.map((n,i)=>makeFighter(n,i+1)),card:null,lastPreparedDate:null};changed=true}
 if(!Array.isArray(S.boxing.roster)||S.boxing.roster.length<12){S.boxing.roster=NAMES.map((n,i)=>makeFighter(n,i+1));changed=true}
 if(S.boxing.lastPreparedDate!==S.gameDate){recover();S.boxing.card=buildCard();S.boxing.lastPreparedDate=S.gameDate;changed=true}
 if(!S.boxing.card||S.boxing.card.date!==S.gameDate){S.boxing.card=buildCard();changed=true}
 if(changed)save(true);
 return S.boxing.card;
}
function boutDef(id){return CARD.find(x=>x.id===id)}
function styleEdge(a,b){
 if(a.style==='Boxer'&&b.style==='Slugger')return 2.5;
 if(a.style==='Counterpuncher'&&b.style==='Pressure fighter')return 2.5;
 if(a.style==='Pressure fighter'&&b.style==='Boxer')return 1.5;
 if(a.style==='Slugger'&&b.style==='Defensive boxer')return -1.5;
 return 0;
}
function simulateBout(id){
 const card=ensureState(),bout=card.bouts[id],d=boutDef(id);if(bout.result)return bout.result;
 const a=fighter(bout.fighters[0]),b=fighter(bout.fighters[1]),rounds=[];
 let aPts=0,bPts=0,aStam=100,bStam=100,method='Decision',winnerId=null,finishRound=d.rounds;
 for(let round=1;round<=d.rounds;round++){
   aStam=Math.max(15,aStam-(100-a.stamina)*.05-rand(2,5));bStam=Math.max(15,bStam-(100-b.stamina)*.05-rand(2,5));
   const as=rating(a)+styleEdge(a,b)+(aStam-50)*.05+rand(-8,8);
   const bs=rating(b)+styleEdge(b,a)+(bStam-50)*.05+rand(-8,8);
   const diff=as-bs;
   if(diff>2){aPts+=10;bPts+=diff>10?8:9}else if(diff<-2){bPts+=10;aPts+=diff<-10?8:9}else{aPts+=10;bPts+=10}
   rounds.push({round,aScore:as,bScore:bs});
   const aStop=clamp(((a.power-b.chin)+20)/1000 + Math.max(0,60-bStam)/2200,.002,.09);
   const bStop=clamp(((b.power-a.chin)+20)/1000 + Math.max(0,60-aStam)/2200,.002,.09);
   const roll=Math.random();
   if(roll<aStop){winnerId=a.id;method=Math.random()<.58?'TKO':'KO';finishRound=round;break}
   if(roll>aStop&&roll<aStop+bStop){winnerId=b.id;method=Math.random()<.58?'TKO':'KO';finishRound=round;break}
 }
 if(!winnerId){
   const diff=aPts-bPts;
   if(Math.abs(diff)<=1&&Math.random()<.18){method='Draw'}
   else winnerId=diff>=0?a.id:b.id;
   if(method==='Decision'&&Math.abs(diff)<8)method='Split Decision';
   else if(method==='Decision')method='Unanimous Decision';
 }
 const loserId=winnerId?(winnerId===a.id?b.id:a.id):null;
 bout.result={winnerId,loserId,method,round:finishRound,aPts,bPts,rounds};
 if(winnerId){
   const w=fighter(winnerId),l=fighter(loserId);w.wins++;l.losses++;if(method==='KO'||method==='TKO')w.knockouts++;
   w.confidence=clamp(w.confidence+rand(2,5),20,95);l.confidence=clamp(l.confidence-rand(1,4),20,95);
   w.form.push('W');l.form.push('L');if(w.form.length>8)w.form.shift();if(l.form.length>8)l.form.shift();
   w.condition=clamp(w.condition-rand(4,10),45,100);l.condition=clamp(l.condition-rand(6,14),40,100);
   if(Math.random()<.025){l.injury='Medical suspension';l.condition=Math.min(l.condition,70)}
 }else{a.draws++;b.draws++;a.form.push('D');b.form.push('D')}
 settleBet(id,bout.result);
 if(id==='B4'&&card.championship&&winnerId){
  const c=card.championship;
  const advance=window.FE_CHAMPIONSHIPS.round(S.sportsChampionships,{
   tournamentId:c.tournamentId,roundId:c.roundId,
   order:[String(winnerId),String(loserId)],date:S.gameDate
  });
  if(advance.payout.credit)S.personalCash+=advance.payout.credit;
  if(c.roundId==='final'){
   S.notes.push({date:displayDate(),text:fighter(winnerId).name+' won the D.C. Boxing Championship.',source:'licensed boxing championship'});
  }
 }
 // A draw requires a rematch on a future Saturday, not automatic advancement.
 const attending=document.getElementById('racing')?.classList.contains('active');
 if(attending&&!S.contacts.promoter?.met&&Math.random()<.18){
   S.contacts.promoter.met=true;S.contacts.promoter.trust=1;
   S.notes.push({date:displayDate(),text:'Met Marty Kane in the licensed boxing crowd. He hinted that he also knows where private bouts are held.',source:'ringside conversation'});
   if(Math.random()<.55&&window.unlockPrivateFightsFromBoxing)window.unlockPrivateFightsFromBoxing('Marty Kane at licensed boxing');
 }
 save(true);
 if(id==='B4'){
   const text=winnerId?fighter(winnerId).name+' won the licensed boxing main event by '+method+(method.includes('Decision')?'':(' in round '+finishRound))+'.':'The licensed boxing main event ended in a draw.';
   S.lastBoxingResult=winnerId?'At Washington Arena, '+fighter(winnerId).name+' won the licensed boxing main event by '+method+(method.includes('Decision')?'.':' in round '+finishRound+'.'):'The Washington Arena main event ended in a draw.';
   S.notes.push({date:displayDate(),text,source:'boxing results'});save(true);
 }
 return bout.result;
}
function settleBet(id,result){
 const card=S.boxing.card,bet=card.bets[id];if(!bet||bet.settled)return;
 const odds=card.bouts[id].odds?.[bet.fighterId]||2;
 const payout=result.winnerId===bet.fighterId?Math.round(bet.wager*odds):0;
 if(bet.custodyTicket){
  const settled=window.FE_CASH_CUSTODY?.settle?.(S,bet.custodyTicket,payout);
  if(!settled?.ok)throw Error('Could not settle owned boxing stake: '+(settled?.reason||'custody service unavailable'));
 }else if(payout)S.personalCash+=payout;
 bet.settled=true;bet.payout=payout;bet.net=payout-bet.wager;window.updateCashHeader?.();
}
function processSchedule(){
 if(S.phase!=='night')return false;
 const card=ensureState();let changed=false;
 for(const d of CARD){const bout=card.bouts[d.id];if(!bout.result&&S.dayRemaining<=d.threshold){simulateBout(d.id);changed=true}}
 return changed;
}
window.finishBoxingNight=()=>{
 const card=ensureState();
 for(const d of CARD){if(!card.bouts[d.id].result)simulateBout(d.id)}
 save(true);
};
function placeBet(id){
 if(!window.FE_VENUES?.canUse('boxing'))return setNote('Visit Washington Arena to wager on boxing.');
 if(S.phase!=='night')return setNote('Licensed boxing betting opens during Washington Night.');
 const card=ensureState(),bout=card.bouts[id],d=boutDef(id);
 if(!d||bout.result||S.dayRemaining<=d.threshold)return setNote('Betting is closed for '+d.label+'.');
 if(card.bets[id])return setNote('You already have a ticket on '+d.label+'.');
 const fighterId=Number($b('boxingPick_'+id)?.value),wager=Math.max(1,Math.floor(Number($b('boxingWager_'+id)?.value)||0));
 if(!bout.fighters.includes(fighterId))return setNote('Choose a fighter.');
 const funding=$b('boxingFunding_'+id)?.value==='company'?'company':'personal';
 if(!window.FE_BETTING_TIME?.canPlace?.())return setNote('The clock is paused or the bet cannot be entered right now.');
 const paid=window.FE_CASH_CUSTODY?.stake?.(S,funding,wager,'washingtonArena');
 if(!paid?.ok)return setNote(paid?.reason||'You do not have the selected carried cash.');
 card.bets[id]={fighterId,wager,settled:false,funding,custodyTicket:paid.ticket};
 window.FE_BETTING_TIME.chargeMinute();
 save(true);window.updateCashHeader?.();render();
 setNote('Wager accepted: '+fighter(fighterId).name+' to win '+d.label+' · '+cash(wager)+' · '+(funding==='company'?'Federal Electric carried funds':'personal cash')+'.');
}
function setNote(t){const el=$b('boxingNote');if(el)el.textContent=t}
function recordLine(f){return f.wins+'-'+f.losses+(f.draws?'-'+f.draws:'')+(f.knockouts?' · '+f.knockouts+' KO':'')}
function boutCard(d){
 const card=S.boxing.card,b=card.bouts[d.id],a=fighter(b.fighters[0]),c=fighter(b.fighters[1]),bet=card.bets[d.id];
 if(b.result){
   const result=b.result,winner=result.winnerId?fighter(result.winnerId):null;
   const headline=winner?escapeHtml(winner.name)+' · '+result.method+(result.method.includes('Decision')?'':' · Round '+result.round):'DRAW',score=result.method.includes('Decision')?' · Score '+result.aPts+'-'+result.bPts:'';
   return '<article class="boxing-bout complete"><header><div><h4>'+d.label+'</h4><small>'+escapeHtml(a.weightClass)+' · '+d.rounds+' rounds scheduled</small></div><b>FINAL</b></header><p><strong>'+headline+'</strong>'+score+'</p>'+(bet?'<p class="boxing-ticket">Your ticket: '+escapeHtml(fighter(bet.fighterId).name)+' · '+cash(bet.wager)+' · '+(bet.net>=0?'NET +':'NET ')+cash(bet.net)+'</p>':'<p class="muted">No wager.</p>')+'</article>';
 }
 const post=Math.max(0,S.dayRemaining-d.threshold);
 return '<article class="boxing-bout"><header><div><h4>'+d.label+'</h4><small>'+escapeHtml(a.weightClass)+' · '+d.rounds+' rounds scheduled</small></div><div class="boxing-countdown" data-bout="'+d.id+'"><small>BELL IN</small><b>'+fmt(post)+'</b></div></header>'+
 '<div class="boxing-matchup"><div><b>'+escapeHtml(a.name)+'</b><small>'+escapeHtml(a.style)+' · '+recordLine(a)+'</small><strong>'+frac(b.odds[a.id])+'</strong></div><span>vs.</span><div><b>'+escapeHtml(c.name)+'</b><small>'+escapeHtml(c.style)+' · '+recordLine(c)+'</small><strong>'+frac(b.odds[c.id])+'</strong></div></div>'+
 (bet?'<p class="boxing-ticket">Ticket: '+escapeHtml(fighter(bet.fighterId).name)+' · '+cash(bet.wager)+'</p>':
 '<div class="boxing-bet"><label>Fighter<select id="boxingPick_'+d.id+'"><option value="'+a.id+'">'+escapeHtml(a.name)+' ('+frac(b.odds[a.id])+')</option><option value="'+c.id+'">'+escapeHtml(c.name)+' ('+frac(b.odds[c.id])+')</option></select></label><label>Funding<select id="boxingFunding_'+d.id+'"><option value="personal">Personal cash</option>'+(S.characterRoute==='industrialist'?'<option value="company">Carried company cash</option>':'')+'</select></label><label>Wager<input id="boxingWager_'+d.id+'" type="number" min="1" step="1" value="25"></label><button class="boxing-bet-btn" data-bout="'+d.id+'">Place Bet</button></div>')+'</article>';
}
function renderRoster(){
 const el=$b('boxingRoster');if(!el)return;
 const rows=[...S.boxing.roster].sort((a,b)=>a.weightClass.localeCompare(b.weightClass)||(b.wins-a.wins)||(a.losses-b.losses));
 el.innerHTML='<div class="table-wrap"><table><thead><tr><th>Fighter</th><th>Class</th><th>Age</th><th>Style</th><th>Record</th><th>Condition</th><th>Status</th></tr></thead><tbody>'+rows.map(f=>'<tr><td><b>'+escapeHtml(f.name)+'</b></td><td>'+escapeHtml(f.weightClass)+'</td><td>'+f.age+'</td><td>'+escapeHtml(f.style)+'</td><td>'+recordLine(f)+'</td><td>'+Math.round(f.condition)+'%</td><td>'+(f.injury?escapeHtml(f.injury):'Cleared')+'</td></tr>').join('')+'</tbody></table></div>';
}
function renderLedger(){
 const el=$b('boxingLedger');if(!el)return;const card=S.boxing.card;let running=0;
 const done=CARD.filter(d=>card.bouts[d.id].result);
 el.innerHTML=done.length?done.map(d=>{const b=card.bouts[d.id],r=b.result,w=r.winnerId?fighter(r.winnerId):null,bet=card.bets[d.id];if(bet)running+=bet.net||0;return '<div class="boxing-ledger-row"><b>'+d.label+': '+(w?escapeHtml(w.name):'Draw')+'</b><small>'+r.method+(r.method.includes('Decision')?'':' · Round '+r.round)+(bet?' · Your bet '+(bet.net>=0?'+':'')+cash(bet.net)+' · Running '+(running>=0?'+':'')+cash(running):' · No wager')+'</small></div>'}).join(''):'<p class="muted">No licensed bouts have been completed tonight.</p>';
}
function render(){
 const box=$b('boxingModule');if(!box)return;ensureState();
 $b('boxingMeta').textContent=(S.boxing.card?.championship?'D.C. BOXING CHAMPIONSHIP · '+S.boxing.card.championship.roundId.toUpperCase()+' · ':'')+(S.phase==='night'?'Washington Arena · Tonight\'s licensed card · Opening bout at 45:00 remaining · Main event at 05:00':S.phase==='report'?'Washington Arena · Tonight\'s card is complete.':'Washington Arena · Licensed boxing opens during Washington Night.');
 $b('boxingBankroll').textContent=cash(S.personalCash)+' personal · '+cash(window.FE_CASH_CUSTODY?.balances?.(S)?.companyCarried||0)+' carried company';
 if(S.phase==='day')$b('boxingCard').innerHTML='<p class="muted">The arena opens during Washington Night. The announced card will be available for wagering after the Business Day closes.</p>';
 else{$b('boxingCard').innerHTML=CARD.map(boutCard).join('');$b('boxingCard').querySelectorAll('.boxing-bet-btn').forEach(btn=>btn.addEventListener('click',()=>placeBet(btn.dataset.bout)))}
 renderRoster();renderLedger();
}
function tick(){
 if(document.hidden)return;
 if(lastPhase!==S.phase){lastPhase=S.phase;render()}
 const changed=processSchedule();
 if(changed)render();
 else if(S.phase==='night'){$b('boxingCard')?.querySelectorAll('.boxing-countdown[data-bout]').forEach(el=>{const d=boutDef(el.dataset.bout),clock=el.querySelector('b');if(d&&clock)clock.textContent=fmt(Math.max(0,S.dayRemaining-d.threshold))});const bank=$b('boxingBankroll');if(bank)bank.textContent=cash(S.personalCash)+' personal · '+cash(window.FE_CASH_CUSTODY?.balances?.(S)?.companyCarried||0)+' carried company'}
}
document.addEventListener('click',e=>{if(e.target?.dataset?.tab==='racing'||e.target?.dataset?.activityTarget==='boxing')setTimeout(render,0)});
ensureState();lastPhase=S.phase;render();setInterval(tick,1000);
})();