/* Capital & Consequence v0.6.54: deterministic autonomous NPC activity economy.
 * Each recorded calendar slot can settle exactly one privately held action:
 * work/earn, track visit/wager, expenses, credit/repayment, or rest.
 * Activity is bounded, tied to visited venues, and never affects player cash.
 * No progress occurs during autosave, render, pause, or offline absence.
 */
(function(root){
 'use strict';
 const SETTINGS=Object.freeze({
  madamStar:{occupation:'club proprietor',workplace:'star',opening:8500,pay:185,betting:16},
  foremanSullivan:{occupation:'workshop assistant',workplace:'factory',opening:2100,pay:0,betting:9},
  eddieDoyle:{occupation:'bookmaker',workplace:'races',opening:3800,pay:120,betting:36},
  inspectorHayes:{occupation:'police inspector',workplace:'metropolitanPolice',opening:4100,pay:125,betting:12},
  chenMei:{occupation:'merchant',workplace:'oldChinatown',opening:2900,pay:95,betting:8},
  liWen:{occupation:'merchant',workplace:'oldChinatown',opening:3000,pay:103,betting:19},
  pavelOrlov:{occupation:'trade representative',workplace:'russianTradeHall',opening:7000,pay:150,betting:18},
  alexiRurik:{occupation:'courier',workplace:'russianTradeHall',opening:950,pay:89,betting:23}
 });
 const hash=value=>{let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function ensure(actor,def){
  if(!actor||!def||typeof def.id!=='string')throw Error('NPC identity required');
  const cfg=SETTINGS[def.id]||{occupation:def.occupation||'worker',workplace:null,opening:2200,pay:90,betting:12};
  let ec=actor.economy;
  if(!ec||ec.version!==1){
   ec={version:1,balanceCents:cfg.opening,debtCents:0,earnedCents:0,wageredCents:0,
    betsWon:0,betsLost:0,shiftsWorked:0,shiftsMissed:0,lastKey:null,lastAction:null,history:[]};
   actor.economy=ec;
  }
  ec.balanceCents=clamp(Number.isSafeInteger(ec.balanceCents)?ec.balanceCents:cfg.opening,0,10000000);
  ec.debtCents=clamp(Number.isSafeInteger(ec.debtCents)?ec.debtCents:0,0,1000000);
  for(const k of ['earnedCents','wageredCents','betsWon','betsLost','shiftsWorked','shiftsMissed']){
   if(!Number.isSafeInteger(ec[k])||ec[k]<0)ec[k]=0;
  }
  if(!Array.isArray(ec.history))ec.history=[];
  return ec;
 }
 function pressure(ec){
  if(!ec)return 0;
  const balance=clamp(+ec.balanceCents||0,0,10000000),debt=clamp(+ec.debtCents||0,0,1000000);
  return clamp(Math.round((balance<600?(600-balance)/8:0)+debt/30),0,100);
 }
 function readable(cents){
  const v=Math.abs(Math.round(cents));
  return (cents<0?'−':'')+'$'+(v/100).toFixed(2);
 }
 function actionFor(def,actor,context){
  if(!def||!actor||!context||typeof context.key!=='string'||!context.key)throw Error('NPC action context required');
  const cfg=SETTINGS[def.id]||{occupation:def.occupation||'worker',workplace:null,opening:2200,pay:90,betting:12};
  const ec=ensure(actor,def);
  if(context.key===ec.lastKey)return {repeated:true,action:ec.lastAction};
  if(!Number.isInteger(context.slot)||context.slot<0||context.slot>3||
     !Number.isInteger(context.weekday)||context.weekday<0||context.weekday>6||
     typeof context.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(context.date))
   throw Error('Action needs an observed saved-calendar period');
  const tag=String(context.seed||'local')+'|'+context.key+'|'+def.id;
  let locationId=context.rest?null:context.defaultLocation||null;
  let activity=context.rest?null:context.defaultActivity||null;
  let amount=0,kind='rest',description='Taking personal time away from public work.';
  const work=!!cfg.workplace&&locationId===cfg.workplace&&
   // Club evening staff and bookmaker at race meetings follow different shifts.
   (def.id==='madamStar'?context.slot>=1:context.slot<2);
  const trackOpen=context.slot===1&&context.weekday!==0;
  const canLeave=!!locationId&&context.slot===1;
  const weekend=context.weekday===6;
  const appetite=clamp(cfg.betting+Math.round((100-(+def.traits?.caution||70))/5),1,75);
  const chase=trackOpen&&canLeave&&ec.balanceCents>=60&&
   hash(tag+'|visit')%100<(weekend?clamp(appetite+25,0,80):Math.floor(appetite/3));
  if(chase){
   locationId='races';
   const stake=clamp(30+hash(tag+'|stake')%171,30,Math.min(200,ec.balanceCents));
   const win=hash(tag+'|finish')%100<34;
   amount=win?Math.round(stake*2):(-stake);
   ec.balanceCents+=amount;
   ec.wageredCents+=stake;
   if(win)ec.betsWon++;else ec.betsLost++;
   if(work)ec.shiftsMissed++;
   kind=win?'wager-win':'wager-loss';
   activity='following the afternoon race card';
   description=win?'Placed a wager and collected winnings at the race grounds.':
    'Placed a wager and lost at the race grounds.';
  }else if(work&&!context.rest){
   // Federal Electric pays its assistant at close from actual company cash.
    // Never mint independent NPC wages for the same shift.
    const pay=def.id==='foremanSullivan'?0:cfg.pay+hash(tag+'|job')%46;
   const repaid=Math.min(ec.debtCents,Math.floor(pay/4));
   ec.debtCents-=repaid;
   amount=pay-repaid;
   ec.balanceCents+=amount;
   ec.earnedCents+=pay;
   ec.shiftsWorked++;
   kind='work';
   activity=def.id==='foremanSullivan'?'assisting Charlie with component work and supplies':
    def.id==='inspectorHayes'?'reviewing District police duties':
    def.id==='eddieDoyle'?'taking bets and reviewing the racing books':
    def.id==='madamStar'?'overseeing the Star Club accounts':
    'handling business orders and receipts';
   description='Completed a scheduled '+cfg.occupation+' work period'+(repaid?' and repaid a portion of an earlier loan.':'.');
  }else if(context.slot===3){
   // A small household cost once per actually observed late-night period.
   amount=-Math.min(ec.balanceCents,35);
   ec.balanceCents+=amount;
   kind='household';
   description='Settled ordinary household expenses.';
   // Credit is explicit and bounded, not an unexplained negative balance.
   if(ec.balanceCents<80&&ec.debtCents<650&&(+def.traits?.caution||60)>=50){
    const advance=Math.min(240,650-ec.debtCents);
    ec.balanceCents+=advance;
    ec.debtCents+=advance;
    kind='credit';
    description='Received a small personal credit advance to cover expenses.';
   }
  }else if(locationId){
   kind='personal';
   description='Visited '+locationId+' on personal business.';
  }
  ec.balanceCents=clamp(ec.balanceCents,0,10000000);
  ec.lastKey=context.key;
  const action={key:context.key,date:context.date,slot:context.slot,kind,
   locationId,activity,amountCents:amount,
   // Public statement is said only in-person; amount and private balances stay private.
   publicLine:kind==='wager-win'?'I had a fortunate afternoon at the races.':
    kind==='wager-loss'?'The horses were not kind to me today.':
    kind==='work'?'I have been occupied with my usual duties.':
    kind==='credit'?'I had private accounts to settle.':
    'Nothing remarkable. I have been attending to ordinary matters.',
   description};
  ec.lastAction=action;
  ec.history.push(action);
  if(ec.history.length>24)ec.history.splice(0,ec.history.length-24);
  return {repeated:false,action};
 }
 const api=Object.freeze({SETTINGS,ensure,pressure,actionFor,readable});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NPC_ECONOMY=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
