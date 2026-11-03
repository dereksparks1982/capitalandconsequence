/* Whitcomb family investment and secured founding loan.
 * Provisional economics, established character canon. No new game clock.
 * The debt is ALREADY reflected in the seeded factory, property and capital:
 * never add borrowed cash to the save a second time.
 */
(function(root){
'use strict';
const LOAN_CENTS=750000,MONTHLY_CENTS=4500,APR_BPS=400;
const FAMILY_ID='whitcomb-father';
const validDay=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'));
const money=n=>'$'+(n/100).toFixed(2);
function nextMonth(day){
 const y=Number(day.slice(0,4)),m=Number(day.slice(5,7));
 const date=new Date(Date.UTC(y,m,2)); // date's month argument is zero-based; m is previous month + 1.
 return date.toISOString().slice(0,10);
}
function initial(day='1878-01-02'){
 if(!validDay(day))throw Error('A legitimate loan signing date is required.');
 return {version:1,lenderId:FAMILY_ID,origin:'Alexandria, Egypt',signed:day,
  principalCents:LOAN_CENTS,originalPrincipalCents:LOAN_CENTS,
  aprBps:APR_BPS,monthlyCents:MONTHLY_CENTS,nextDue:nextMonth(day),
  interestDueCents:0,principalDueCents:0,installments:[],payments:[],
  letters:[{id:1,date:day,kind:'investment',message:'Your father has arranged the American factory financing as a secured loan and a separate voting ownership interest. He expects punctual accounts, honest business conduct, and repayment, not gratitude for a gift.'}],
  dividendIncomeCents:0,consecutiveMisses:0,status:'current',personalStanding:'recognized',
  confidence:50,introDecisions:[],introTokens:{},
  lastAdvanceDate:null,receipts:{},nextId:2};
}
function ensure(save){
 if(!save||typeof save!=='object')throw Error('A saved campaign is required.');
 if(!save.whitcombFamily)save.whitcombFamily=initial(save.gameDate||'1878-01-02');
 const f=save.whitcombFamily;
 if(!Number.isSafeInteger(f.confidence))f.confidence=50;
 if(!Array.isArray(f.introDecisions))f.introDecisions=[];
 if(!f.introTokens||typeof f.introTokens!=='object')f.introTokens={};
 if(f.version!==1||!Number.isSafeInteger(f.principalCents)||f.principalCents<0||
  !Number.isSafeInteger(f.interestDueCents)||f.interestDueCents<0||
  !Number.isSafeInteger(f.principalDueCents)||f.principalDueCents<0||
  !Number.isSafeInteger(f.monthlyCents)||f.monthlyCents<0||!validDay(f.nextDue)||
  !Array.isArray(f.installments)||!Array.isArray(f.payments)||!Array.isArray(f.letters)||
  !f.receipts||!['current','warning','demand','repossessed','settled'].includes(f.status))
  throw Error('Unknown Whitcomb family contract. The saved agreement has not been reset.');
 return f;
}
function overdue(f){return f.interestDueCents+f.principalDueCents;}
const CHOICES=Object.freeze({
 'clear-accounts':{scene:'alexandria',confidence:6},'independence':{scene:'alexandria',confidence:-2},
 consult:{scene:'alexandria',confidence:5},'mother-letter':{scene:'departure',confidence:1},
 manifest:{scene:'departure',confidence:2},quiet:{scene:'departure',confidence:0},
 reserve:{scene:'cabin',confidence:4},workshop:{scene:'cabin',confidence:2},
 aspiration:{scene:'cabin',confidence:-1},'start-books':{scene:'washington',confidence:4},
 'start-works':{scene:'washington',confidence:2},'start-future':{scene:'washington',confidence:1}
});
function recordChoice(save,id,token){
 if(save?.characterRoute!=='industrialist')return {ok:false,reason:'Only Charles has this father-son relationship.'};
 const definition=CHOICES[id],state=save.whitcombIntro;
 if(!definition||!state?.started||state.finished||!Array.isArray(state.history)||
    token!=='intro:'+definition.scene+':'+id||
    root.FE_WHITCOMB_INTRO?.current?.(save)?.id!==definition.scene)
  return {ok:false,reason:'The choice does not belong to the current introduction scene.'};
 const f=ensure(save);
 if(f.introTokens[token])return {ok:false,reason:'This relationship choice has already been recorded.'};
 f.introTokens[token]=true;
 f.introDecisions.push({id,scene:definition.scene,confidenceDelta:definition.confidence});
 f.confidence=Math.max(0,Math.min(100,f.confidence+definition.confidence));
 return {ok:true,confidence:f.confidence};
}

function report(save){
 const f=ensure(save);
 return {status:f.status,principalCents:f.principalCents,interestDueCents:f.interestDueCents,
  principalDueCents:f.principalDueCents,overdueCents:overdue(f),paymentCents:f.monthlyCents,
  nextDue:f.nextDue,consecutiveMisses:f.consecutiveMisses,
  dividendIncomeCents:f.dividendIncomeCents,personalStanding:f.personalStanding,
  confidence:f.confidence,introDecisions:f.introDecisions.slice(),letters:f.letters.slice(-5)};
}
function notice(f,date,kind,message){
 const row={id:f.nextId++,date,kind,message};f.letters.push(row);
 f.letters=f.letters.slice(-90);
 return row;
}
function advanceDay(save){
 const f=ensure(save),date=save.gameDate;
 if(!validDay(date)||f.lastAdvanceDate===date)return null;
 f.lastAdvanceDate=date;
 if(f.status==='repossessed'||f.status==='settled')return null;
 if(f.principalCents<=0&&overdue(f)===0){f.status='settled';return null;}
 let processed=0,outcome=null;
 // Replay-safe handling for player-controlled long time jumps. No additional
 // clock, compound monthly penalties or manufactured company cash.
 while(date>=f.nextDue&&processed++<120&&f.principalCents>0){
  const due=f.nextDue;f.nextDue=nextMonth(due);
  const previousDue=overdue(f);
  const interest=Math.ceil(f.principalCents*f.aprBps/120000);
  const installment=Math.min(f.monthlyCents,f.principalCents+interest);
  const principal=Math.max(0,Math.min(f.principalCents,installment-interest));
  f.interestDueCents+=interest;f.principalDueCents+=principal;
  f.installments.push({date:due,interestCents:interest,principalCents:principal,
   amountCents:interest+principal,unpaidBeforeCents:previousDue});
  if(previousDue>0)f.consecutiveMisses++;
  else f.consecutiveMisses=0;
  // First due is a bill, not a missed payment. Default is based on
  // consecutive *past-due* cycles, with actual dated notices.
  if(f.consecutiveMisses>=3&&f.status==='current'){
   f.status='warning';f.confidence=Math.max(0,f.confidence-6);notice(f,due,'warning',
    'Alexandria requests overdue installments and an explanation of the factory accounts.');
  }
  if(f.consecutiveMisses>=5&&f.status!=='demand'){
   f.status='demand';f.confidence=Math.max(0,f.confidence-10);notice(f,due,'demand',
    'The secured creditor gives formal notice that the outstanding business loan is in default.');
  }
  if(f.consecutiveMisses>=6){
   f.confidence=0;f.status='repossessed';f.personalStanding='disowned';notice(f,due,'foreclosure',
    'After repeated unpaid installments, the Whitcomb lender enforces the secured factory interest. Charles loses management authority and is disowned; his life continues outside control of the family firm.');
   outcome={kind:'family-foreclosure',message:'The Whitcomb family enforced its secured factory loan after sustained default.'};
   break;
  }
 }
 if(processed>120&&date>=f.nextDue)throw Error('Loan catch-up exceeded the safe calendar horizon.');
 f.installments=f.installments.slice(-180);
 return outcome;
}
function pay(save,amountCents,token){
 const f=ensure(save);
 if(save.characterRoute!=='industrialist'||save.paused||save.phase!=='day'||
  save.currentLocation?.locationId!=='factory'||save.currentLocation?.roomId!=='executive-office')
  return {ok:false,reason:'Family debt payments require Charles in his Federal Electric executive office during business hours.'};
 if(f.status==='repossessed')return {ok:false,reason:'The secured factory has already been repossessed.'};
 if(save.corporateGovernance?.president&&save.corporateGovernance.president!=='charles')
  return {ok:false,reason:'A former president cannot spend Federal Electric company money on a family loan.'};
 if(typeof token!=='string'||!/^[a-z0-9:_-]{1,90}$/i.test(token))
  return {ok:false,reason:'A valid dated payment receipt is required.'};
 if(f.receipts[token])return {...f.receipts[token],repeated:true};
 if(!Number.isSafeInteger(amountCents)||amountCents<1)
  return {ok:false,reason:'Enter a positive whole-cent payment.'};
 const payable=overdue(f);
 if(payable===0)return {ok:false,reason:'No monthly installment is due. Prepayment is a separate company decision.'};
 if(amountCents>payable)return {ok:false,reason:'This installment exceeds the outstanding family invoice.'};
 if(!Number.isFinite(save.companyCash)||Math.round(save.companyCash*100)<amountCents)
  return {ok:false,reason:'Federal Electric has insufficient company cash for the loan payment.'};
 const interestPaid=Math.min(amountCents,f.interestDueCents);
 const principalPaid=amountCents-interestPaid;
 f.interestDueCents-=interestPaid;f.principalDueCents-=principalPaid;
 f.principalCents-=principalPaid;
 save.companyCash=Math.round((save.companyCash-amountCents/100)*100)/100;
 if(save.componentWorks&&Number.isFinite(save.companyCash))
  save.componentWorks.cashCents=Math.round(save.companyCash*100);
 if(overdue(f)===0){
  const onTime=f.installments.length>0&&save.gameDate===f.installments.at(-1).date;
  f.confidence=Math.min(100,f.confidence+(onTime?3:1));
  f.consecutiveMisses=0;f.status=f.principalCents===0?'settled':'current';
 }
 const receipt={ok:true,date:save.gameDate,amountCents,interestPaidCents:interestPaid,
  principalPaidCents:principalPaid,balanceCents:f.principalCents,
  message:'Paid '+money(amountCents)+' to the family lender. Remaining principal '+money(f.principalCents)+'.'};
 f.payments.push({id:f.nextId++,date:save.gameDate,...receipt});
 f.payments=f.payments.slice(-180);f.receipts[token]=receipt;
 return receipt;
}
function dividend(save,amountCents){
 if(!Number.isSafeInteger(amountCents)||amountCents<0)throw Error('Invalid family dividend');
 const f=ensure(save);f.dividendIncomeCents+=amountCents;
 return f.dividendIncomeCents;
}
const api=Object.freeze({FAMILY_ID,LOAN_CENTS,MONTHLY_CENTS,APR_BPS,initial,ensure,overdue,report,recordChoice,advanceDay,pay,dividend});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WHITCOMB_FAMILY=api;
})(typeof window!=='undefined'?window:globalThis);
