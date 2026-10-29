/* Federal Electric Poker Engine - browser-native Texas Hold'em */
(()=>{'use strict';
const rooms={
 working:{name:'The Boiler Room',className:'poker-poor',stake:25,blind:1,npcs:[['Mickey Dunn','loose'],['Joe Rourke','bluff'],['Frank Bell','steady']]},
 middle:{name:'The Commerce Club',className:'poker-middle',stake:100,blind:2,npcs:[['Walter Briggs','steady'],['Charles Webb','tight'],['Eddie Doyle','bluff']]},
 elite:{name:'The Embassy Room',className:'poker-elite',stake:500,blind:10,npcs:[['Harrison Vale','tight'],['Sen. Robert Whitmore','steady'],['August Belmont III','aggressive']]}
};
let G=null,sessionStarted=Date.now(),clockTimer=null,sessionSettled=false;
const ranks='23456789TJQKA',suits='♣♦♥♠';
function deck(){let d=[];for(let r of ranks)for(let s of suits)d.push({r,s,v:ranks.indexOf(r)+2});for(let i=d.length-1;i;i--){let j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}return d}
function combos(a,k){let out=[];function go(start,x){if(x.length===k){out.push(x.slice());return}for(let i=start;i<a.length;i++){x.push(a[i]);go(i+1,x);x.pop()}}go(0,[]);return out}
function five(cs){let vals=cs.map(c=>c.v).sort((a,b)=>b-a),cnt={};vals.forEach(v=>cnt[v]=(cnt[v]||0)+1);let uniq=[...new Set(vals)];if(uniq[0]===14)uniq.push(1);let hi=0;for(let i=0;i<=uniq.length-5;i++)if(uniq[i]-uniq[i+4]===4){hi=uniq[i];break}let flush=cs.every(c=>c.s===cs[0].s),groups=Object.entries(cnt).map(([v,n])=>[+v,n]).sort((a,b)=>b[1]-a[1]||b[0]-a[0]);let cat,tie,name;if(flush&&hi){cat=8;tie=[hi];name='Straight Flush'}else if(groups[0][1]===4){cat=7;tie=[groups[0][0],groups[1][0]];name='Four of a Kind'}else if(groups[0][1]===3&&groups[1][1]===2){cat=6;tie=[groups[0][0],groups[1][0]];name='Full House'}else if(flush){cat=5;tie=vals;name='Flush'}else if(hi){cat=4;tie=[hi];name='Straight'}else if(groups[0][1]===3){cat=3;tie=[groups[0][0],...groups.filter(x=>x[1]===1).map(x=>x[0]).sort((a,b)=>b-a)];name='Three of a Kind'}else if(groups[0][1]===2&&groups[1][1]===2){let ps=groups.filter(x=>x[1]===2).map(x=>x[0]).sort((a,b)=>b-a);cat=2;tie=[...ps,groups.find(x=>x[1]===1)[0]];name='Two Pair'}else if(groups[0][1]===2){cat=1;tie=[groups[0][0],...groups.filter(x=>x[1]===1).map(x=>x[0]).sort((a,b)=>b-a)];name='Pair'}else{cat=0;tie=vals;name='High Card'}return{score:[cat,...tie],name}}
function eval7(cs){return combos(cs,5).map(five).sort((a,b)=>cmp(b.score,a.score))[0]}
function cmp(a,b){for(let i=0;i<Math.max(a.length,b.length);i++){let d=(a[i]||0)-(b[i]||0);if(d)return d}return 0}
function card(c,hide=false){return '<span class="p-card '+(hide?'back':((c.s==='♥'||c.s==='♦')?'red':''))+'">'+(hide?'FE':c.r+'<i>'+c.s+'</i>')+'</span>'}
function clockText(n){n=Math.max(0,Math.ceil(n));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function updateClock(){const elapsed=Math.max(0,Math.floor((Date.now()-sessionStarted)/1000));const el=document.querySelector('#pokerBusinessClock');if(el)el.textContent=clockText(elapsed)}
function patronAvailable(roomKey,name){
 try{
  const status=window.opener?.FE_POKER_OPPONENT_STATUS?.(roomKey,name)||'unharmed';
  return !['injured','deceased'].includes(status);
 }catch(error){return true} // Offline table must not depend on parent availability.
}
function start(roomKey){
 sessionSettled=false;
 sessionStarted=Date.now();
 // No artificial remaining business-day timer; time at the table counts upward.
 clearInterval(clockTimer);clockTimer=setInterval(updateClock,250);updateClock();
 const R=rooms[roomKey];if(!R)return;
 G={roomKey,R,etiquette:'courteous',completedHands:0,deck:deck(),board:[],pot:0,street:0,currentBet:0,minRaise:R.blind*2,handNo:0,dealer:-1,turnIndex:0,done:false,log:[],players:[
  {name:'You',style:'human',chips:R.stake,hole:[],fold:false,bet:0,committed:0,allIn:false,acted:false,raiseOpen:true},
  ...R.npcs.filter(n=>patronAvailable(roomKey,n[0])).map(n=>({name:n[0],style:n[1],chips:R.stake,hole:[],fold:false,bet:0,committed:0,allIn:false,acted:false,raiseOpen:true}))
 ]};
 document.querySelector('#pokerModal').className='poker-modal open '+R.className;
 document.querySelector('#pokerRoomName').textContent=R.name;
 newHand();
}
function liveIndexes(){return G.players.map((p,i)=>!p.fold?i:-1).filter(i=>i>=0)}
function nextSeat(from,predicate){
 for(let step=1;step<=G.players.length;step++){
  const i=(from+step+G.players.length)%G.players.length;
  if(predicate(G.players[i],i))return i;
 }
 return -1;
}
function actionEligible(p){return !!p&&!p.fold&&!p.allIn&&p.chips>0}
function needsAction(p){return actionEligible(p)&&(!p.acted||p.bet<G.currentBet)}
function post(i,n){
 const p=G.players[i],x=Math.max(0,Math.min(n,p.chips));
 p.chips-=x;p.bet+=x;p.committed+=x;G.pot+=x;
 if(p.chips===0)p.allIn=true;
 return x;
}
function log(s){G.log.unshift(s);G.log=G.log.slice(0,9)}
function newHand(){
 if(!G)return;
 G.deck=deck();G.board=[];G.pot=0;G.street=0;G.currentBet=0;G.minRaise=G.R.blind*2;G.handNo++;G.done=false;G.log=[];
 G.players.forEach(p=>{
  p.fold=p.chips<=0;p.bet=0;p.committed=0;p.allIn=p.chips<=0;p.acted=false;p.raiseOpen=!p.fold;p.hole=[];
  if(!p.fold)p.hole=[G.deck.pop(),G.deck.pop()];
 });
 const live=liveIndexes();
 if(live.length<2){log('The table cannot continue with fewer than two funded players.');G.done=true;render(true);return}
 G.dealer=nextSeat(G.dealer,p=>!p.fold);
 let sb,bb,first;
 if(live.length===2){
  sb=G.dealer;bb=nextSeat(sb,p=>!p.fold);first=sb;
 }else{
  sb=nextSeat(G.dealer,p=>!p.fold);bb=nextSeat(sb,p=>!p.fold);first=nextSeat(bb,p=>actionEligible(p));
 }
 const small=G.R.blind,big=G.R.blind*2;
 post(sb,small);post(bb,big);
 G.currentBet=Math.max(...G.players.map(p=>p.bet));
 G.minRaise=big;
 G.turnIndex=first>=0?first:nextSeat(bb,p=>actionEligible(p));
 log('Blinds posted. Cards are dealt.');
 runTable();
}
function strength(p){
 if(G.street===0){
  const a=p.hole[0].v,b=p.hole[1].v,pair=a===b,suited=p.hole[0].s===p.hole[1].s;
  return pair?.55+a/35:(a+b)/35+(suited?.08:0);
 }
 return eval7([...p.hole,...G.board]).score[0]/8+Math.max(...p.hole.map(c=>c.v))/80;
}
function markFullRaise(raiser,raiseSize){
 G.minRaise=Math.max(G.R.blind*2,raiseSize);
 G.players.forEach((p,i)=>{
  if(i!==raiser&&actionEligible(p)){p.acted=false;p.raiseOpen=true}
 });
}
function callOrCheck(i){
 const p=G.players[i],need=Math.max(0,G.currentBet-p.bet);
 const paid=post(i,need);
 p.acted=true;p.raiseOpen=false;
 if(need===0)log(p.name+(i===0?' check.':' checks.'));
 else if(p.allIn)log(p.name+(i===0?' call all-in for $':' calls all-in for $')+paid+'.');
 else log(p.name+(i===0?' call $':' calls $')+paid+'.');
}
function foldPlayer(i){
 const p=G.players[i];p.fold=true;p.acted=true;p.raiseOpen=false;
 log(p.name+(i===0?' fold.':' folds.'));
}
function raisePlayer(i,desiredRaise){
 const p=G.players[i],oldBet=G.currentBet,need=Math.max(0,oldBet-p.bet);
 if(!p.raiseOpen){callOrCheck(i);return}
 const paid=post(i,need+Math.max(G.minRaise,desiredRaise));
 const newBet=p.bet;
 p.acted=true;p.raiseOpen=false;
 if(newBet<=oldBet){
  if(need===0)log(p.name+(i===0?' check.':' checks.'));
  else if(p.allIn)log(p.name+(i===0?' call all-in for $':' calls all-in for $')+paid+'.');
  else log(p.name+(i===0?' call $':' calls $')+paid+'.');
  return;
 }
 const raiseSize=newBet-oldBet;
 G.currentBet=newBet;
 if(raiseSize>=G.minRaise){
  markFullRaise(i,raiseSize);
  p.acted=true;p.raiseOpen=false;
  log(p.name+(p.allIn?(i===0?' raise all-in to $':' raises all-in to $'):(i===0?' raise to $':' raises to $'))+p.bet+'.');
 }else{
  log(p.name+(i===0?' move all-in to $':' moves all-in to $')+p.bet+'; the short raise does not reopen betting.');
 }
}
function botAct(i){
 const p=G.players[i];if(!needsAction(p))return;
 const need=Math.max(0,G.currentBet-p.bet),s=strength(p),noise=Math.random(),agg={tight:-.1,steady:0,loose:.08,bluff:.02,aggressive:.14}[p.style]||0;
 if(need>0&&s+agg+noise*.22<.38){foldPlayer(i);return}
 const wantsRaise=p.raiseOpen&&p.chips>need&&((s+agg>.72&&Math.random()<.45)||(p.style==='bluff'&&Math.random()<.14));
 if(wantsRaise){
  const raise=Math.max(G.minRaise,Math.round(G.pot*.3),G.R.blind*2);
  raisePlayer(i,raise);
 }else callOrCheck(i);
}
function bettingRoundComplete(){
 const live=G.players.filter(p=>!p.fold);
 if(live.length<=1)return true;
 const actors=live.filter(actionEligible);
 if(!actors.length)return true;
 return actors.every(p=>p.acted&&p.bet===G.currentBet);
}
function dealNextStreet(){
 G.players.forEach(p=>{p.bet=0;if(actionEligible(p)){p.acted=false;p.raiseOpen=true}});
 G.currentBet=0;G.minRaise=G.R.blind*2;
 if(G.street===0){
  G.deck.pop();G.board.push(G.deck.pop(),G.deck.pop(),G.deck.pop());G.street=1;log('The flop is dealt.');
 }else if(G.street===1){
  G.deck.pop();G.board.push(G.deck.pop());G.street=2;log('The turn is dealt.');
 }else if(G.street===2){
  G.deck.pop();G.board.push(G.deck.pop());G.street=3;log('The river is dealt.');
 }
 G.turnIndex=nextSeat(G.dealer,p=>actionEligible(p));
}
function runOutBoard(){
 while(G.board.length<5){
  G.deck.pop();
  if(G.board.length===0)G.board.push(G.deck.pop(),G.deck.pop(),G.deck.pop());
  else G.board.push(G.deck.pop());
 }
 G.street=3;
 log('The remaining board is run out for the all-in players.');
}
function finishBettingRound(){
 const live=G.players.filter(p=>!p.fold);
 if(live.length<=1){showdown();return}
 if(G.street===3){showdown();return}
 const actors=live.filter(actionEligible);
 if(actors.length<=1){runOutBoard();showdown();return}
 dealNextStreet();
}
function runTable(){
 if(!G||G.done)return;
 for(let guard=0;guard<100;guard++){
  const live=G.players.filter(p=>!p.fold);
  if(live.length<=1){showdown();return}
  if(bettingRoundComplete()){
   finishBettingRound();
   if(!G||G.done)return;
   continue;
  }
  if(G.turnIndex<0||!needsAction(G.players[G.turnIndex])){
   const next=nextSeat(G.turnIndex<0?G.dealer:G.turnIndex,p=>needsAction(p));
   if(next<0){finishBettingRound();if(!G||G.done)return;continue}
   G.turnIndex=next;
  }
  if(G.turnIndex===0){render();return}
  const acted=G.turnIndex;
  botAct(acted);
  G.turnIndex=nextSeat(acted,p=>needsAction(p));
 }
 throw new Error('Poker betting loop exceeded safety limit');
}
function player(action){
 if(!G||G.done||G.turnIndex!==0||!needsAction(G.players[0]))return;
 const p=G.players[0];
 if(action==='fold')foldPlayer(0);
 else if(action==='call')callOrCheck(0);
 else if(action==='raise'){
  if(!p.raiseOpen){log('Betting has not reopened; you may only call or fold.');render();return}
  const amt=Math.max(G.minRaise,Math.floor(G.pot*.35),G.R.blind*2);
  raisePlayer(0,amt);
 }
 G.turnIndex=nextSeat(0,q=>needsAction(q));
 runTable();
}
function buildSidePots(){
 const levels=[...new Set(G.players.map(p=>p.committed).filter(n=>n>0))].sort((a,b)=>a-b);
 const pots=[];let previous=0;
 for(const level of levels){
  const contributors=G.players.filter(p=>p.committed>=level);
  const amount=(level-previous)*contributors.length;
  if(amount>0)pots.push({amount,eligible:contributors.filter(p=>!p.fold)});
  previous=level;
 }
 return pots;
}
function awardPot(pot,label){
 if(!pot.amount||!pot.eligible.length)return;
 if(pot.eligible.length===1){
  pot.eligible[0].chips+=pot.amount;
  log(pot.eligible[0].name+' wins '+label+' $'+pot.amount+'.');
  return;
 }
 const ranked=pot.eligible.map(p=>({p,e:eval7([...p.hole,...G.board])})).sort((a,b)=>cmp(b.e.score,a.e.score));
 const best=ranked[0].e.score,winners=ranked.filter(x=>cmp(x.e.score,best)===0);
 const share=Math.floor(pot.amount/winners.length),remainder=pot.amount-share*winners.length;
 winners.forEach((x,i)=>x.p.chips+=share+(i<remainder?1:0));
 log(winners.map(x=>x.p.name).join(' & ')+' win '+label+' $'+pot.amount+' with '+ranked[0].e.name+'.');
}
function showdown(){
 if(!G||G.done)return;
 const live=G.players.filter(p=>!p.fold);
 if(live.length===1){
  live[0].chips+=G.pot;
  log(live[0].name+' takes the $'+G.pot+' pot.');
 }else{
  if(G.board.length<5)runOutBoard();
  const pots=buildSidePots();
  pots.forEach((pot,i)=>awardPot(pot,i===0?'main pot':'side pot '+i));
 }
 G.pot=0;G.done=true;G.completedHands++;render(true);
}
// Temporary CSS silhouettes; approved portrait art may replace these later.
function pokerPortrait(i){
 return '<span class="poker-portrait'+(i===0?' poker-portrait-player':'')+
  '" aria-hidden="true"><span class="poker-portrait-shoulders"></span>'+
  '<span class="poker-portrait-head"></span>'+
  '<span class="poker-portrait-hat"></span></span>';
}
function revealOpponentCards(p,done){
 // Opponents reveal only at a contested showdown; folded cards stay secret.
 return !!done&&!p.fold&&G.players.filter(q=>!q.fold).length>=2;
}
function render(done=false){
 if(!G)return;
 document.querySelector('#pokerPot').textContent='$'+G.pot;
 document.querySelector('#pokerBoard').innerHTML=G.board.map(c=>card(c)).join('')||'<span class="board-empty">PRE-FLOP</span>';
 const seats=document.querySelector('#pokerSeats');
 seats.innerHTML=G.players.map((p,i)=>{
  const acting=!done&&G.turnIndex===i&&needsAction(p);
  const dealer=i===G.dealer?'<span class="poker-dealer" title="Dealer button" aria-label="Dealer button">D</span>':'';
  const status=p.fold?'FOLDED':p.allIn?'ALL-IN':acting?'TO ACT':'';
  return '<div class="p-seat seat-'+i+(p.fold?' folded':'')+(p.allIn?' all-in':'')+
   (acting?' is-turn':'')+'">'+dealer+pokerPortrait(i)+'<b>'+p.name+
   '</b><div class="cards">'+p.hole.map(c=>card(c,i!==0&&!revealOpponentCards(p,done))).join('')+
   '</div><small>$'+p.chips+' · '+(i===0?'Your seat':p.style)+
   (status?' · '+status:'')+'</small></div>';
 }).join('');
 document.querySelector('#pokerLog').innerHTML=G.log.map(x=>'<div>'+x+'</div>').join('');
 const p=G.players[0],need=Math.max(0,G.currentBet-p.bet),humanTurn=!done&&G.turnIndex===0&&needsAction(p);
 const call=document.querySelector('#pokerCall');
 if(need&&p.chips<=need)call.textContent='Call All-In $'+p.chips;
 else call.textContent=need?'Call $'+need:'Check';
 const raise=document.querySelector('#pokerRaise');
 if(raise)raise.disabled=!humanTurn||!p.raiseOpen||p.chips<=need;
 document.querySelector('#pokerActions').style.display=humanTurn?'flex':'none';
 document.querySelector('#pokerNext').style.display=done?'inline-block':'none';
}
function settleSession(){
 if(!G||sessionSettled)return false;
 sessionSettled=true;
 clearInterval(clockTimer);
 const delta=G.players[0].chips-G.R.stake;
 const elapsed=Math.max(1,Math.floor((Date.now()-sessionStarted)/1000));
 if(window.FE_POKER_EXIT)window.FE_POKER_EXIT(G.roomKey,delta,G.completedHands,elapsed,G.etiquette);
 return true;
}
function leave(){
 if(!G)return;
 settleSession();
 document.querySelector('#pokerModal').className='poker-modal';
 G=null;
}
window.addEventListener('pagehide',settleSession);
window.addEventListener('beforeunload',settleSession);
function setEtiquette(value){if(G&&['courteous','generous','quiet','rude'].includes(value))G.etiquette=value}
window.FE_POKER={start,action:player,newHand,leave,setEtiquette};})();