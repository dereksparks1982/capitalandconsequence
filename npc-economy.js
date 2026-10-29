/* Capital & Consequence v0.6.54: deterministic autonomous NPC activity economy.
 * Each recorded calendar slot can settle exactly one privately held action:
 * work/earn, track visit/wager, expenses, credit/repayment, or rest.
 * Activity is bounded, tied to visited venues, and never affects player cash.
 * No progress occurs during autosave, render, pause, or offline absence.
 */
(function(root){
 'use strict';
 const SETTINGS=Object.freeze({
  // Unselected protagonists have real routine records, but their canonical
  // personal starting cash, wages and household budgets are undecided.
  // Never manufacture wealth or debt for them just for being off-camera.
  charlieWhitcomb:{occupation:'workshop owner',workplace:'factory',opening:0,pay:0,betting:0,credit:false,monetary:false},
  samHarlan:{occupation:'patrolman',workplace:'hillsdale',opening:0,pay:0,betting:0,credit:false,monetary:false},
  eliCrowe:{occupation:'doorman',workplace:'secondNightclub',opening:0,pay:0,betting:0,credit:false,monetary:false},
  edmundWardman:{occupation:'orderly',workplace:'blackwoodAsylum',opening:0,pay:0,betting:0,credit:false,monetary:false},
  samuelTilden:{occupation:'president',workplace:'whiteHouse',opening:9000,pay:0,betting:0},
  madamStar:{occupation:'club proprietor',workplace:'star',opening:8500,pay:185,betting:16},
  foremanSullivan:{occupation:'workshop assistant',workplace:'factory',opening:2100,pay:0,betting:9},
  boyMercer:{occupation:'occasional liquor delivery laborer and gambler',workplace:null,opening:340,pay:0,betting:0,credit:false,monetary:false},
  eddieDoyle:{occupation:'bookmaker',workplace:'races',opening:3800,pay:120,betting:36},
  inspectorHayes:{occupation:'police inspector',workplace:'metropolitanPolice',opening:4100,pay:125,betting:12},
  chenMei:{occupation:'merchant',workplace:'oldChinatown',opening:2900,pay:95,betting:8},
  liWen:{occupation:'merchant',workplace:'oldChinatown',opening:3000,pay:103,betting:19},
  annaPetrovna:{occupation:'independent visitor',workplace:null,opening:2200,pay:0,betting:0},
  pavelOrlov:{occupation:'trade representative',workplace:'russianTradeHall',opening:7000,pay:150,betting:18},
  edwinBooth:{occupation:'stage actor',workplace:'nationalTheatre',opening:0,pay:0,betting:0,monetary:false},
  josephJefferson:{occupation:'stage actor',workplace:'nationalTheatre',opening:0,pay:0,betting:0,monetary:false},
  johnMcCullough:{occupation:'stage actor',workplace:'nationalTheatre',opening:0,pay:0,betting:0,monetary:false},
  claraMorris:{occupation:'stage actress',workplace:'nationalTheatre',opening:0,pay:0,betting:0,monetary:false},
  johnTRaymond:{occupation:'stage actor',workplace:'nationalTheatre',opening:0,pay:0,betting:0,monetary:false},
  charlesHanford:{occupation:'theatre apprentice',workplace:'nationalTheatre',opening:0,pay:0,betting:0,monetary:false},
  williamRapley:{occupation:'theatre proprietor',workplace:'nationalTheatre',opening:0,pay:0,betting:0,monetary:false},
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
 function boyAction(def,actor,context,ec,tag){
  // A cash-strapped card sharp. Only one financial settlement per actual
  // calendar period; the global clock remains controlled solely by the player.
  // Opponents are anonymous card-room patrons; no named NPC or player is robbed
  // or charged without a shared counterparty transaction.
  const venue=context.rest?null:context.defaultLocation||null;
  let kind='personal',activity=context.rest?null:context.defaultActivity||null;
  let amount=0,stake=0,caught=false,description='Keeping out of sight; where he sleeps is unknown.';
  const isDelivery=venue==='secondNightclub'&&context.weekday===3&&context.slot===1;
  if(isDelivery){
   const wages=80+hash(tag+'|dray-wages')%56;
   ec.balanceCents+=wages;ec.earnedCents+=wages;ec.shiftsWorked++;
   kind='odd-job';amount=wages;
   activity='unloading casks and crates from the tavern liquor delivery wagon';
   description='Earned a small cash payment for unloading a delivery wagon. No standing employment.';
  }else if(venue==='workingPoker'&&ec.balanceCents>=18){
   stake=Math.min(ec.balanceCents,24+hash(tag+'|stake')%90);
   const roll=hash(tag+'|cards')%100,skill=64;
   const win=roll<skill;
   amount=win?Math.round(stake*(.5+(hash(tag+'|reward')%81)/100)):-stake;
   // He sometimes palms cards or cheats; getting caught costs him money.
   const cheat=hash(tag+'|cheat')%100<24;
   caught=cheat&&hash(tag+'|noticed')%100<17;
   if(caught)amount=-stake;
   ec.balanceCents+=amount;ec.wageredCents+=stake;
   if(amount>0)ec.betsWon++;else ec.betsLost++;
   kind=caught?'card-cheating-caught':cheat?'card-cheating':win?'card-win':'card-loss';
   activity=caught?'being challenged over a suspicious hand':cheat?'concealing a crooked card trick':
    win?'bluffing a card-table opponent into folding':'losing money at cards';
   description=caught?'Caught trying to cheat at an ordinary card table and lost his stake.':
    cheat?'Attempted a crooked hand; his table winnings or losses were recorded.':
    win?'Won a small card-table pot with a well-timed bluff.':'Lost a hand at the card table.';
  }else if(venue==='races'&&ec.balanceCents>=20){
   stake=Math.min(ec.balanceCents,20+hash(tag+'|racing-stake')%55);
   const win=hash(tag+'|race')%100<39;
   amount=win?Math.round(stake*(.8+hash(tag+'|race-pay')%31/100)):-stake;
   ec.balanceCents+=amount;ec.wageredCents+=stake;
   if(win)ec.betsWon++;else ec.betsLost++;
   kind=win?'wager-win':'wager-loss';
   activity='following a wager at the race grounds';
   description=win?'Collected modest winnings on a wager.':'Lost a small wager at the races.';
  }else if(venue&&hash(tag+'|lift')%100<28){
   // Petty theft is risky and not a reliable source of income. These are
   // minor amounts from unnamed passersby; no imaginary named victim records.
   const success=hash(tag+'|lift-result')%100<34;
   caught=!success&&hash(tag+'|caught-lifting')%100<29;
   amount=success?(8+hash(tag+'|coins')%27):caught?-Math.min(ec.balanceCents,15):0;
   ec.balanceCents+=amount;
   kind=success?'petty-theft':caught?'petty-theft-caught':'petty-theft-failed';
   activity=success?'slipping away with small change':caught?'fleeing after an attempted theft':'looking for an easy mark';
   description=success?'Stole loose change from an unnamed passerby.':
    caught?'Failed at a theft and paid a small immediate penalty.':'Tried to steal and obtained nothing.';
  }else if(venue){
   description='Hanging about with no steady employment; his claims are not evidence.';
  }
  // Modest living expenses make occasional wins a necessity, not a license to
  // accumulate limitless wealth, and are not fictitiously charged to a player.
  if(context.slot===3&&ec.balanceCents>0){
   const spend=Math.min(ec.balanceCents,19+hash(tag+'|meals')%28);
   ec.balanceCents-=spend;amount-=spend;
   description+=' Spent a little of his own cash on food and necessities.';
  }
  ec.balanceCents=clamp(ec.balanceCents,0,10000000);
  const action={key:context.key,date:context.date,slot:context.slot,kind,
   locationId:venue,activity,amountCents:amount,stakeCents:stake,
   cheatingDetected:caught,marketReceiptId:null,
   // His speeches and private activity claims should not be treated as facts
   // just because he invented a tale in dialogue with the protagonist.
   publicLine:'Boy Mercer claims it was his lucky day, but the story changes every time.',
   description};
  ec.lastKey=context.key;ec.lastAction=action;ec.history.push(action);
  if(ec.history.length>24)ec.history.splice(0,ec.history.length-24);
  return {repeated:false,action};
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
  if(def.id==='boyMercer')return boyAction(def,actor,context,ec,tag);
  let locationId=context.rest?null:context.defaultLocation||null;
  let activity=context.rest?null:context.defaultActivity||null;
  let amount=0,kind='rest',description='Taking personal time away from public work.';
  const work=!!cfg.workplace&&locationId===cfg.workplace&&
   // Club evening staff and bookmaker at race meetings follow different shifts.
   (def.id==='madamStar'?context.slot>=1:def.id==='eliCrowe'?context.slot>=2:
   cfg.workplace==='nationalTheatre'?context.slot<=2:context.slot<2);
  const trackOpen=context.slot===1&&context.weekday!==0;
  const canLeave=!!locationId&&context.slot===1;
  const weekend=context.weekday===6;
  const appetite=clamp(cfg.betting+Math.round((100-(+def.traits?.caution||70))/5),1,75);
  const chase=cfg.betting!==0&&trackOpen&&canLeave&&ec.balanceCents>=60&&
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
    const pay=cfg.pay===0?0:cfg.pay+hash(tag+'|job')%46;
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
    cfg.workplace==='nationalTheatre'?(context.defaultActivity||'attending rehearsals and theatre duties'):
    'handling business orders and receipts';
   description='Completed a scheduled '+cfg.occupation+' work period'+(repaid?' and repaid a portion of an earlier loan.':'.');
  }else if(context.slot===3&&cfg.monetary!==false){
   // For live saves, purchases already moved cash/stock at the observed market.
   // Legacy isolated action tests without a market keep the old bounded allowance.
   const recordedMarket=!!context.save&&!!root.FE_WASHINGTON_COMMERCE;
   amount=recordedMarket?0:-Math.min(ec.balanceCents,35);
   ec.balanceCents+=amount;
   kind='household';
   description=recordedMarket?'Reviewed household bills already paid from recorded market purchases.':'Settled ordinary household expenses.';
   // Credit is explicit and bounded, not an unexplained negative balance.
   if(cfg.credit!==false&&ec.balanceCents<80&&ec.debtCents<650&&(+def.traits?.caution||60)>=50){
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
  // Independent household shopping at the observed daytime market period.
  // Real goods, finite stocks and merchant tills are shared with player orders
  // and Sullivan's Saturday groceries. Never advance world time for NPC actions.
  let purchased=null;
  const market=context.save&&root.FE_WASHINGTON_COMMERCE;
  if(market&&cfg.monetary!==false&&context.slot===1&&!context.rest&&ec.balanceCents>=4&&
   ['oldChinatown','hillsdale'].includes(locationId)&&
   /market|shopping|supplies|grocer/i.test(String(activity||''))){
   const shopping=['bread','soap','onions','milk','potatoes','eggs','produce','bacon'];
   const start=hash(tag+'|shop')%shopping.length;
   for(let i=0;i<shopping.length;i++){
    const goodId=shopping[(start+i)%shopping.length];
    const result=market.purchase(context.save,def.id,goodId,
     {date:context.date,token:'npc|'+context.key+'|'+def.id+'|'+goodId});
    if(!result.ok)continue;
    purchased=result.receipt;
    amount-=purchased.cents;
    description+=' Bought '+purchased.label+' from a local merchant.';
    break;
   }
  }
  ec.balanceCents=clamp(ec.balanceCents,0,10000000);
  ec.lastKey=context.key;
  const action={key:context.key,date:context.date,slot:context.slot,kind,
   locationId,activity,amountCents:amount,marketReceiptId:purchased?.id||null,
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
