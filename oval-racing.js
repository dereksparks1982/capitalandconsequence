(()=> {
const CFG={
 dog:{key:'dogRacing',activity:'dog',venue:'Potomac Kennel Track',module:'dogRacingModule',meta:'dogRacingMeta',bank:'dogRacingBankroll',board:'dogRacingBoard',live:'dogRacingLive',ledger:'dogRacingLedger',note:'dogRacingNote',names:['Fleet Shadow','Potomac Flash','Blue Streak','Capitol Dash','Copper Rocket','Night Whistle','District Flyer','Liberty Lad','Silver Arrow','Red Signal','Chesapeake Joe','Federal Queen','River Bolt','Union Scout','White Comet','Market Prince'],schedule:[{id:'D1',label:'Heat 1',threshold:2400,distance:'440 yards',laps:2,stage:'heat'},{id:'D2',label:'Heat 2',threshold:1400,distance:'440 yards',laps:2,stage:'heat'},{id:'DF',label:'Final',threshold:420,distance:'550 yards',laps:3,stage:'final'}]},
 car:{key:'midgetCarRacing',activity:'car',venue:'Capital Speedway',module:'midgetCarRacingModule',meta:'midgetCarRacingMeta',bank:'midgetCarRacingBankroll',board:'midgetCarRacingBoard',live:'midgetCarRacingLive',ledger:'midgetCarRacingLedger',note:'midgetCarRacingNote',names:['Red Comet','Blue Bullet','Federal Special','Potomac Flyer','Copper Head','Capitol Ace','Silver Spark','District Special','Liberty No. 9','Washington Flyer','Tungsten Special','Union Rocket','Commerce Kid','Foundry Flash','Columbia Special','Electric Ace'],schedule:[{id:'C1',label:'Heat 1',threshold:2600,distance:'10 laps',laps:10,stage:'heat'},{id:'C2',label:'Heat 2',threshold:1600,distance:'10 laps',laps:10,stage:'heat'},{id:'CF',label:'Feature Race',threshold:500,distance:'20 laps',laps:20,stage:'final'}]}
};
const ERA_START=Object.freeze({dog:'1919-01-01',car:'1933-01-01'});
function canRace(kind){return !!ERA_START[kind]&&typeof S.gameDate==='string'&&S.gameDate>=ERA_START[kind]}
const DRIVERS=['Eddie Marsh','Tom Vale','Ray Collins','Frank Dwyer','Sam Burke','Johnny Hale','Mickey Dean','Arthur Cole','Bill Mercer','Lou Grant','Harry Webb','Joe Pike'];
const $o=id=>document.getElementById(id),rand=(a,b)=>a+Math.random()*(b-a),avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
const fmt=n=>{n=Math.max(0,Math.ceil(n));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};
const ordinal=n=>{const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])};
const frac=d=>{const f=Math.max(.2,d-1);return f<1?Math.max(1,Math.round(f*4))+':4':Math.max(1,Math.round(f))+':1'};
const anim={dog:null,car:null},timers={dog:null,car:null};

function makeEntry(kind,name,id){
 if(kind==='dog')return {id,name,speed:rand(48,94),start:rand(45,93),stamina:rand(46,92),consistency:rand(45,92),fitness:rand(84,100),starts:0,wins:0,places:0,shows:0,form:[]};
 return {id,name,number:id,driver:DRIVERS[(id-1)%DRIVERS.length],speed:rand(48,94),acceleration:rand(45,93),handling:rand(45,92),reliability:rand(72,98),driverSkill:rand(48,93),condition:rand(86,100),starts:0,wins:0,places:0,shows:0,form:[]};
}
function state(kind){return S[CFG[kind].key]}
function entry(kind,id){return state(kind).roster.find(x=>x.id===id)}
function rating(kind,e){return kind==='dog'?e.speed*.34+e.start*.22+e.stamina*.2+e.consistency*.18+(e.fitness-80)*.3:e.speed*.27+e.acceleration*.2+e.handling*.2+e.reliability*.14+e.driverSkill*.19+(e.condition-80)*.2}
function odds(kind,ids){const rs=ids.map(id=>rating(kind,entry(kind,id))),mean=avg(rs),ws=rs.map(r=>Math.exp((r-mean)/12)),sum=ws.reduce((a,b)=>a+b,0),out={};ids.forEach((id,i)=>{const p=clamp(ws[i]/sum,.045,.62);out[id]=+clamp(.9/p,1.3,24).toFixed(2)});return out}
function recover(kind){const st=state(kind);if(!st)return;for(const e of st.roster){if(kind==='dog')e.fitness=clamp((e.fitness||85)+rand(2,7),60,100);else e.condition=clamp((e.condition||88)+rand(1,5),55,100)}}
function buildMeeting(kind){
 const cfg=CFG[kind],pool=[...state(kind).roster].sort(()=>Math.random()-.5).slice(0,12),races={};
 races[cfg.schedule[0].id]={participants:pool.slice(0,6).map(x=>x.id),result:null,odds:null,failures:[]};
 races[cfg.schedule[1].id]={participants:pool.slice(6,12).map(x=>x.id),result:null,odds:null,failures:[]};
 races[cfg.schedule[2].id]={participants:[],result:null,odds:null,failures:[]};
 const meeting={date:S.gameDate,phase:kind==='car'?(Math.random()<.5?'day':'night'):'day',races,bets:{}};
 if(window.FE_OVAL_CHAMPIONSHIPS?.isChampionship(kind,S.gameDate)&&window.FE_CHAMPIONSHIPS){
  S.sportsChampionships=window.FE_CHAMPIONSHIPS.init(S.sportsChampionships);
  meeting.championshipId=window.FE_OVAL_CHAMPIONSHIPS.open(S.sportsChampionships,kind,S.gameDate,pool.map(x=>x.id),window.FE_CHAMPIONSHIPS);
 }
 return meeting;
}
function ensure(kind){if(!canRace(kind))return null;const cfg=CFG[kind];let st=S[cfg.key],changed=false;if(!st){st=S[cfg.key]={roster:cfg.names.map((n,i)=>makeEntry(kind,n,i+1)),meeting:null,lastPreparedDate:null};changed=true}if(!Array.isArray(st.roster)||st.roster.length<12){st.roster=cfg.names.map((n,i)=>makeEntry(kind,n,i+1));changed=true}if(st.lastPreparedDate!==S.gameDate){recover(kind);st.meeting=buildMeeting(kind);st.lastPreparedDate=S.gameDate;changed=true}if(!st.meeting||st.meeting.date!==S.gameDate){st.meeting=buildMeeting(kind);changed=true}if(kind==='car'&&!['day','night'].includes(st.meeting.phase)){st.meeting.phase=Math.random()<.5?'day':'night';changed=true}if(kind==='dog')st.meeting.phase='day';if(changed)save(true);return st.meeting}
function def(kind,id){return CFG[kind].schedule.find(x=>x.id===id)}
function ensureOdds(kind,id){const m=ensure(kind),r=m.races[id];if(r.participants.length&&!r.odds){r.odds=odds(kind,r.participants);save(true)}return r.odds||{}}
function qualifiers(kind){const cfg=CFG[kind],m=ensure(kind),a=m.races[cfg.schedule[0].id],b=m.races[cfg.schedule[1].id],f=m.races[cfg.schedule[2].id];if(a.result&&b.result&&!f.participants.length){f.participants=[...a.result.slice(0,3),...b.result.slice(0,3)];ensureOdds(kind,cfg.schedule[2].id)}}
function payout(decimal,type,wager,place){if(type==='win')return place===1?Math.round(wager*decimal):0;if(type==='place')return place<=2?Math.round(wager*(1+(decimal-1)*.52)):0;return place<=3?Math.round(wager*(1+(decimal-1)*.31)):0}
function settle(kind,id,result){const m=state(kind).meeting,bet=m.bets[id];if(!bet||bet.settled)return;const place=result.indexOf(bet.pickId)+1,decimal=m.races[id].odds?.[bet.pickId]||2,pay=payout(decimal,bet.type,bet.wager,place);bet.settled=true;bet.place=place;bet.payout=pay;bet.net=pay-bet.wager;if(pay)S.personalCash+=pay}
function updateEntry(kind,e,place,failed){e.starts++;if(!failed){if(place===1)e.wins++;if(place<=2)e.places++;if(place<=3)e.shows++}e.form.push(failed?'DNF':String(place));if(e.form.length>10)e.form.shift();if(kind==='dog')e.fitness=clamp(e.fitness-rand(2,7),55,100);else e.condition=clamp(e.condition-rand(failed?6:2,failed?15:7),45,100)}
function label(kind,id){const e=entry(kind,id);return kind==='car'?'No. '+e.number+' '+e.name+' · '+e.driver:e.name}
function resolve(kind,id,animate){
 const cfg=CFG[kind],m=ensure(kind),r=m.races[id],d=def(kind,id);if(r.result||!r.participants.length)return;
 const failures=[],scores=r.participants.map(pid=>{const e=entry(kind,pid);let failed=false;if(kind==='car'){const chance=clamp((100-e.reliability)/500+(100-e.condition)/900,.006,.09);failed=Math.random()<chance;if(failed)failures.push(pid)}return {id:pid,score:failed?-1000-rand(0,50):rating(kind,e)+rand(-8,8)}}).sort((a,b)=>b.score-a.score);
 r.result=scores.map(x=>x.id);r.failures=failures;r.result.forEach((pid,i)=>updateEntry(kind,entry(kind,pid),i+1,failures.includes(pid)));settle(kind,id,r.result);qualifiers(kind);
 if(m.championshipId){
  const outcome=window.FE_OVAL_CHAMPIONSHIPS.result(S.sportsChampionships,kind,S.gameDate,m.championshipId,id,r.result,window.FE_CHAMPIONSHIPS);
  if(outcome.payout.credit)S.personalCash+=outcome.payout.credit;
 }
 if(d.stage==='final'){const w=entry(kind,r.result[0]),title=m.championshipId?(kind==='dog'?' and earned the D.C. Kennel Championship':' and earned the D.C. Motor Racing Championship'):'';const text=kind==='dog'?'At Potomac Kennel Track, '+w.name+' won the final'+title+'.':'At Capital Speedway, '+w.name+' driven by '+w.driver+' won the Midget Car feature'+title+'.';S.lastRaceResult=(S.lastRaceResult?S.lastRaceResult+' ':'')+text;S.notes.push({date:displayDate(),text,source:kind==='dog'?'dog-racing results':'midget-car racing results'})}
 save(true);const watching=S.phase===m.phase&&document.getElementById('racing')?.classList.contains('active')&&window.isPastimeActivityOpen?.('legal',cfg.activity);if(animate&&watching)startAnimation(kind,id);
}
function process(kind){if(!canRace(kind))return false;const cfg=CFG[kind],m=ensure(kind);if(S.phase!==m.phase)return false;let changed=false;for(const d of cfg.schedule){qualifiers(kind);const r=m.races[d.id];if(!r.result&&S.dayRemaining<=d.threshold&&r.participants.length){resolve(kind,d.id,true);changed=true}}return changed}
function finish(kind,phase){if(!canRace(kind))return;const cfg=CFG[kind],m=ensure(kind);if(phase&&m.phase!==phase)return;for(const d of cfg.schedule){qualifiers(kind);const r=m.races[d.id];if(!r.result&&r.participants.length)resolve(kind,d.id,false)}}
function note(kind,t){const el=$o(CFG[kind].note);if(el)el.textContent=t}
function bet(kind,id){
 if(!canRace(kind))return note(kind,'This sport is not available in this year.');
 const venue=kind==='dog'?'dog-racing':'midget-racing';
 if(!window.FE_VENUES?.canUse(venue))return note(kind,'You must be at the correct racing venue to wager.');
 const m=ensure(kind);if(S.phase!==m.phase)return note(kind,'Betting opens during '+(m.phase==='day'?'the Business Day':'Washington Night')+' for this meeting.');const r=m.races[id],d=def(kind,id);if(!r.participants.length)return note(kind,'That field has not been established yet.');if(r.result||S.dayRemaining<=d.threshold)return note(kind,'Betting is closed for '+d.label+'.');if(m.bets[id])return note(kind,'You already have a wager on '+d.label+'.');
 const pickId=Number($o(kind+'_pick_'+id)?.value),type=$o(kind+'_type_'+id)?.value||'win',wager=Math.max(1,Math.floor(Number($o(kind+'_wager_'+id)?.value)||0));if(!r.participants.includes(pickId))return;if(S.personalCash<wager)return note(kind,'Not enough personal cash for that wager.');if(!window.FE_BETTING_TIME?.canPlace?.())return note(kind,'The clock is paused or unavailable.');S.personalCash-=wager;m.bets[id]={pickId,type,wager,settled:false};window.FE_BETTING_TIME.chargeMinute();save(true);render(kind);note(kind,'Wager accepted for '+d.label+': '+label(kind,pickId)+' · '+type.toUpperCase()+' · '+cash(wager)+'.');
}
function finishLabel(kind,r,pid,index){
 return kind==='car'&&r.failures?.includes(pid)?'DNF':ordinal(index+1);
}
function resultOrderMarkup(kind,r,bet){
 return '<div class="race-final-order"><b>Final order</b>'+r.result.map((pid,i)=>'<div class="'+(bet&&bet.pickId===pid?'your-selection':'')+'"><span>'+finishLabel(kind,r,pid,i)+'</span><strong>'+escapeHtml(label(kind,pid))+(bet&&bet.pickId===pid?' · YOUR PICK':'')+'</strong></div>').join('')+'</div>';
}
function card(kind,d){
 const m=ensure(kind),r=m.races[d.id],bet=m.bets[d.id];
 if(r.result){
  const w=entry(kind,r.result[0]),fails=kind==='car'&&r.failures?.length?' · '+r.failures.length+' mechanical DNF'+(r.failures.length===1?'':'s'):'',pickFinish=bet?(r.failures?.includes(bet.pickId)?'DNF':ordinal((r.result.indexOf(bet.pickId)+1))):'';
  return '<article class="race-bet-card closed"><div class="race-bet-card-head"><div><h4>'+d.label+'</h4><small>'+d.distance+' · '+d.laps+' laps'+fails+'</small></div><b>COMPLETE</b></div><p><b>Winner:</b> '+escapeHtml(label(kind,w.id))+'</p>'+resultOrderMarkup(kind,r,bet)+(bet?'<p class="race-bet-locked">Your selection: '+escapeHtml(label(kind,bet.pickId))+' · Finished '+pickFinish+' · '+bet.type.toUpperCase()+' · Wager '+cash(bet.wager)+' · Payout '+cash(bet.payout||0)+' · '+(bet.net>=0?'NET +':'NET ')+cash(bet.net)+'</p>':'<p class="muted">No wager placed.</p>')+'</article>';
 }
 if(!r.participants.length)return '<article class="race-bet-card pending"><div class="race-bet-card-head"><div><h4>'+d.label+'</h4><small>'+d.distance+' · '+d.laps+' laps</small></div><b>FIELD PENDING</b></div><p class="muted">Field opens after qualifying.</p></article>';
 const os=ensureOdds(kind,d.id),phaseLabel=m.phase==='day'?'BUSINESS DAY':'WASHINGTON NIGHT',activePhase=S.phase===m.phase,countdown=activePhase?fmt(Math.max(0,S.dayRemaining-d.threshold)):fmt(d.threshold);
 return '<article class="race-bet-card open"><div class="race-bet-card-head"><div><h4>'+d.label+'</h4><small>'+d.distance+' · '+d.laps+' laps · '+phaseLabel+'</small></div><div class="race-countdown" data-kind="'+kind+'" data-race="'+d.id+'"><small>'+(activePhase?'POST TIME IN':phaseLabel+' POST')+'</small><b>'+countdown+'</b></div></div><div class="race-field compact">'+r.participants.map(pid=>'<div class="race-field-row"><span>'+escapeHtml(label(kind,pid))+'</span><small class="oval-entry-meta">Form '+(entry(kind,pid).form.slice(-4).join('-')||'—')+'</small><b>'+frac(os[pid])+'</b></div>').join('')+'</div>'+(bet?'<p class="race-bet-locked">Ticket: '+escapeHtml(label(kind,bet.pickId))+' · '+bet.type.toUpperCase()+' · '+cash(bet.wager)+'</p>':'<div class="race-bet-panel"><label>Entry<select id="'+kind+'_pick_'+d.id+'">'+r.participants.map(pid=>'<option value="'+pid+'">'+escapeHtml(label(kind,pid))+' ('+frac(os[pid])+')</option>').join('')+'</select></label><label>Bet<select id="'+kind+'_type_'+d.id+'"><option value="win">Win</option><option value="place">Place</option><option value="show">Show</option></select></label><label>Wager<input id="'+kind+'_wager_'+d.id+'" type="number" min="1" step="1" value="25"></label><button class="oval-bet-btn" data-kind="'+kind+'" data-race="'+d.id+'">Place Bet</button></div>')+'</article>';
}

function ledger(kind){const cfg=CFG[kind],m=ensure(kind),el=$o(cfg.ledger);if(!el)return;let running=0;const done=cfg.schedule.filter(d=>m.races[d.id].result);el.innerHTML=done.length?done.map(d=>{const r=m.races[d.id],w=entry(kind,r.result[0]),b=m.bets[d.id];if(b)running+=b.net||0;return '<div class="race-history-item"><b>'+d.label+': '+escapeHtml(label(kind,w.id))+'</b><small>'+d.distance+(kind==='car'&&r.failures?.length?' · Mechanical DNFs '+r.failures.length:'')+(b?' · Your bet '+(b.net>=0?'+':'')+cash(b.net)+' · Running '+(running>=0?'+':'')+cash(running):' · No wager')+'</small></div>'}).join(''):'<p class="muted">No races have been completed yet.</p>'}
function trackMarkup(kind,trackId,ids,result=null){
 const rank=result?new Map(result.map((id,i)=>[id,i])):null;
 return '<div class="oval-race-stage"><div class="oval-race-course" id="'+trackId+'"><svg viewBox="0 0 760 360" aria-hidden="true"><ellipse class="oval-track-outer" cx="380" cy="180" rx="315" ry="125"/><ellipse class="oval-track-inner" cx="380" cy="180" rx="245" ry="72"/><ellipse id="'+trackId+'_progress" class="oval-track-progress" pathLength="100" cx="380" cy="180" rx="280" ry="98"/><line class="oval-finish-line" x1="660" y1="142" x2="660" y2="218"/></svg>'+ids.map((id,i)=>{const place=rank?.get(id),top=result?34+Math.min(6,place||0)*5:44+i*2.3;return '<span class="oval-marker '+kind+'" data-runner="'+id+'" title="'+escapeHtml(label(kind,id))+'" style="left:86.8%;top:'+top+'%">'+(i+1)+'</span>'}).join('')+'<span class="oval-start-label">START / FINISH</span></div><div class="oval-race-key">'+ids.map((id,i)=>{const place=result?(rank.get(id)??ids.length-1):null;return '<span><b>'+(i+1)+'</b> '+escapeHtml(label(kind,id))+' <i data-progress="'+id+'">'+(result?finishLabel(kind,{failures:[]},id,place):'READY')+'</i></span>'}).join('')+'</div></div>';
}
function draw(kind,t){
 const a=anim[kind];if(!a)return;const course=$o(kind+'OvalTrack'),race=ensure(kind).races[a.raceId],ids=race.participants,d=def(kind,a.raceId),laps=Math.max(2,d.laps||2);if(!course)return;
 const rank=new Map(a.ids.map((id,i)=>[id,i]));let leaderLapFraction=0;
 ids.forEach((id,lane)=>{
  const place=rank.get(id)??ids.length-1,finishBonus=(ids.length-place)*.006,noise=Math.sin(t*22+Number(id)*1.17)*.004,overall=Math.min(1,Math.max(0,t+finishBonus*t*t+noise)),lapTravel=overall*laps,lapIndex=Math.min(laps,Math.floor(lapTravel)+1),lapFraction=t>=1?1:(lapTravel%1),angle=(t>=1?1:lapFraction)*Math.PI*2,rx=40-lane*.72,ry=31-lane*.52,x=50+rx*Math.cos(angle),y=50+ry*Math.sin(angle),marker=course.querySelector('[data-runner="'+id+'"]');
  leaderLapFraction=Math.max(leaderLapFraction,lapFraction);if(marker){marker.style.left=x+'%';marker.style.top=y+'%'}
  const out=course.parentElement?.querySelector('[data-progress="'+id+'"]');if(out)out.textContent=t>=1?finishLabel(kind,race,id,place):'LAP '+lapIndex+'/'+laps;
 });
 const progressEl=$o(kind+'OvalTrack_progress');if(progressEl)progressEl.style.strokeDashoffset=String(100-(t>=1?100:leaderLapFraction*100));
}
function startAnimation(kind,id){clearInterval(timers[kind]);const r=ensure(kind).races[id],start=Date.now(),duration=kind==='car'?22000:18000;anim[kind]={raceId:id,start,duration,ids:[...r.result]};renderLive(kind);timers[kind]=setInterval(()=>{const a=anim[kind];if(!a)return;const t=Math.min(1,(Date.now()-a.start)/a.duration);draw(kind,t);if(t>=1){clearInterval(timers[kind]);timers[kind]=null;anim[kind]=null;render(kind)}},200)}
function renderLive(kind){const cfg=CFG[kind],a=anim[kind],d=def(kind,a.raceId),r=ensure(kind).races[d.id],el=$o(cfg.live);if(!el)return;el.innerHTML='<h3>'+d.label+' · '+(kind==='car'?'GREEN FLAG':'THEY\'RE OFF')+'</h3><p>'+d.distance+' · '+d.laps+' laps · '+cfg.venue+'</p>'+trackMarkup(kind,kind+'OvalTrack',r.participants);draw(kind,Math.min(1,(Date.now()-a.start)/a.duration))}
function renderPersistentTrack(kind){
 const cfg=CFG[kind],m=ensure(kind),el=$o(cfg.live);if(!el||anim[kind])return;
 const next=cfg.schedule.find(d=>!m.races[d.id].result&&m.races[d.id].participants.length);
 const last=[...cfg.schedule].reverse().find(d=>m.races[d.id].result);
 if(next){const r=m.races[next.id];el.innerHTML='<h3>Oval Track · '+next.label+'</h3><p class="fine">'+next.distance+' · '+next.laps+' laps · field staged at the start/finish line.</p>'+trackMarkup(kind,kind+'OvalTrack',r.participants);return}
 if(last){const r=m.races[last.id];el.innerHTML='<h3>Oval Track · '+last.label+' Final Positions</h3><p class="fine">The track remains posted after the race.</p>'+trackMarkup(kind,kind+'OvalTrack',r.participants,r.result);return}
 el.innerHTML='<h3>Oval Track</h3><p class="fine">The track is open. The next field will appear here when qualifying is complete.</p>'+trackMarkup(kind,kind+'OvalTrack',[]);
}

function render(kind){
 const cfg=CFG[kind];if(!$o(cfg.module))return;
 if(!canRace(kind)){
  $o(cfg.meta).textContent=cfg.venue+' is unavailable until '+ERA_START[kind].slice(0,4)+'.';
  $o(cfg.bank).textContent=cash(S.personalCash);
  $o(cfg.board).textContent='No events or wagers in this year.';
  $o(cfg.live).textContent='This competition has not begun.';
  $o(cfg.ledger).textContent='No race results.';
  return;
 }
 const m=ensure(kind);qualifiers(kind);const phaseLabel=m.phase==='day'?'Business Day':'Washington Night';$o(cfg.meta).textContent=(m.championshipId?'D.C. '+(kind==='dog'?'Kennel':'Motor Racing')+' Championship · ':'')+cfg.venue+' · '+phaseLabel+' meeting · scheduled races continue whether this panel is open or closed';$o(cfg.bank).textContent=cash(S.personalCash);$o(cfg.board).innerHTML=cfg.schedule.map(d=>card(kind,d)).join('');$o(cfg.board).querySelectorAll('.oval-bet-btn').forEach(btn=>btn.addEventListener('click',()=>bet(btn.dataset.kind,btn.dataset.race)));ledger(kind);if(!anim[kind])renderPersistentTrack(kind)}
function updateCountdowns(kind){
 if(!canRace(kind))return;
 const cfg=CFG[kind],module=$o(cfg.module);if(!module)return;
 const m=ensure(kind);module.querySelectorAll('.race-countdown[data-race]').forEach(el=>{const d=def(kind,el.dataset.race),clock=el.querySelector('b'),label=el.querySelector('small');if(d&&clock){const active=S.phase===m.phase;clock.textContent=active?fmt(Math.max(0,S.dayRemaining-d.threshold)):fmt(d.threshold);if(label)label.textContent=active?'POST TIME IN':(m.phase==='day'?'BUSINESS DAY POST':'WASHINGTON NIGHT POST')}});
}
let observedPhase=S.phase;
function tick(){
 if(document.hidden)return;
 const phaseChanged=observedPhase!==S.phase;observedPhase=S.phase;
 const dc=process('dog'),cc=process('car');
 if(document.getElementById('racing')?.classList.contains('active')){
  if((dc||phaseChanged)&&!anim.dog)render('dog');else updateCountdowns('dog');
  if((cc||phaseChanged)&&!anim.car)render('car');else updateCountdowns('car');
  const db=$o('dogRacingBankroll'),cb=$o('midgetCarRacingBankroll');if(db)db.textContent=cash(S.personalCash);if(cb)cb.textContent=cash(S.personalCash)
 }
}
const finishHorse=window.finishRaceMeeting;window.finishRaceMeeting=()=>{if(finishHorse)finishHorse();finish('dog','day');finish('car','day');save(true)};
window.finishMidgetCarNight=()=>{finish('car','night');save(true)};
document.addEventListener('click',e=>{if(e.target?.dataset?.tab==='racing'||e.target?.dataset?.activityTarget==='dog'||e.target?.dataset?.activityTarget==='car')setTimeout(()=>{render('dog');render('car')},0)});
ensure('dog');ensure('car');process('dog');process('car');render('dog');render('car');setInterval(tick,1000);
})();