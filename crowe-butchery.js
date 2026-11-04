/* Capital & Consequence: Elias Crowe's inherited butcher shop.
 * All cash is in integer cents, separate from Federal Electric and personal funds.
 * Story secrets are deliberately NOT exposed by this operational model.
 */
(function(root){'use strict';
const SHOP='croweButcherShop';
const GOODS=Object.freeze({
 beef:Object.freeze({name:'Beef',wholesaleCents:17,defaultPriceCents:28}),
 pork:Object.freeze({name:'Pork',wholesaleCents:14,defaultPriceCents:24}),
 mutton:Object.freeze({name:'Mutton',wholesaleCents:12,defaultPriceCents:21})
});
const ITEMS=Object.keys(GOODS);
const deny=reason=>({ok:false,reason});
const whole=n=>Number.isSafeInteger(n)&&n>=0;
const money=n=>(n/100).toFixed(2);
function hash(s){let h=2166136261;for(const x of String(s)){h^=x.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function minute(save){return Number.isSafeInteger(save?.worldCalendar?.worldMinute)?save.worldCalendar.worldMinute:null}
function ensure(save){
 if(save?.characterRoute!=='criminal')return null;
 if(!save.croweButchery||save.croweButchery.version!==1){
  save.croweButchery={version:1,openedAt:save.gameDate||'1878-01-02',
   lastMinute:minute(save),tillCents:2400,bookTillCents:2400,
   raw:{beef:12,pork:10,mutton:8},prepared:{beef:4,pork:3,mutton:3},
   prices:{beef:28,pork:24,mutton:21},
   sales:0,salesCents:0,manualCuts:0,stockOrders:0,drawsCents:0,
   auditCount:0,lastAudit:null,ledger:[],
   cousin:{loyalty:62,resentment:28,suspicion:8,priceChanges:0,hiddenShortfallCents:0},
   hidden:{unbookedSalesCents:0,unenteredWithdrawalsCents:0},nextEntry:1};
 }
 return save.croweButchery;
}
function entry(s,save,type,label,amountCents=0){
 const e={id:s.nextEntry++,date:save.gameDate||'',type,label,amountCents};
 s.ledger.push(e);if(s.ledger.length>140)s.ledger.splice(0,s.ledger.length-140);
 return e;
}
function customerSale(s,save,key,qty,recorded=true){
 const available=Math.min(qty,s.prepared[key]);if(!available)return 0;
 const total=available*s.prices[key];
 s.prepared[key]-=available;s.tillCents+=total;s.sales+=available;s.salesCents+=total;
 if(recorded){s.bookTillCents+=total;entry(s,save,'sale','Sold '+available+' lb '+GOODS[key].name.toLowerCase(),total)}
 else{s.hidden.unbookedSalesCents+=total}
 return total;
}
function prepare(s,key,qty){const count=Math.min(s.raw[key],qty);s.raw[key]-=count;s.prepared[key]+=count;return count}
function inShop(save){return save.currentLocation?.locationId===SHOP}
function dateMinute(m){return new Date(m*60000)}
function clockStep(save,s,m){
 const day=dateMinute(m),hour=day.getUTCHours(),weekday=day.getUTCDay();
 const dated={gameDate:day.toISOString().slice(0,10)};
 if(weekday===0||hour<8||hour>=17)return;
 const away=!inShop(save)||save.currentLocation?.roomId==='loft';
 // The cousin opens and prepares stock when the player is away.
 if(hour===8&&day.getUTCMinutes()===0&&away){
  // The cousin replenishes actual inventory, paying from the shop till.
  // No phantom stock or infinite credit when money runs out.
  for(const key of ITEMS){
   if(s.raw[key]+s.prepared[key]<4){
    const expense=6*GOODS[key].wholesaleCents;
    if(s.tillCents>=expense){
     s.raw[key]+=6;s.tillCents-=expense;s.bookTillCents-=expense;s.stockOrders++;
     entry(s,dated,'supplier','Assistant ordered 6 lb '+GOODS[key].name.toLowerCase()+' from a supplier.',-expense);
    }
   }
   if(s.prepared[key]<2)prepare(s,key,Math.min(3,4-s.prepared[key]));
  }
 }
 if(hour>=9&&hour<=16&&day.getUTCMinutes()===0){
  const key=ITEMS[hash(m+'|customer')%ITEMS.length];
  if(s.prepared[key]<1&&away)prepare(s,key,Math.min(3,3-s.prepared[key]));
  // Once in a while a sale is not entered in the handwritten accounts.
  const offBook=away&&hash('book|'+m)%19===0;
  customerSale(s,dated,key,1, !offBook);
 }
 if(away&&hour===12&&day.getUTCMinutes()===0){
  const key=ITEMS[hash('authority|'+Math.floor(m/1440))%ITEMS.length],standard=GOODS[key].defaultPriceCents;
  if(s.prices[key]>standard&&s.cousin.resentment>=30&&hash('override|'+m)%3===0){
   s.prices[key]=standard;s.cousin.priceChanges++;
   entry(s,dated,'price','An assistant reset the posted '+GOODS[key].name.toLowerCase()+' price to $'+money(standard)+'.');
  }
 }
 // The shop can have unexplained small discrepancies, not automatic proof of their cause.
 if(away&&hour===16&&day.getUTCMinutes()===0&&weekday===3&&s.tillCents>=100&&hash('till|'+m)%3===0){
  s.tillCents-=25;s.hidden.unenteredWithdrawalsCents+=25;
  s.cousin.hiddenShortfallCents+=25;
 }
}
function sync(save){
 const s=ensure(save);if(!s)return null;
 const now=minute(save);if(now===null)return s;
 if(s.lastMinute===null){s.lastMinute=now;return s}
 if(now<=s.lastMinute){if(now<s.lastMinute)s.lastMinute=now;return s}
 // Clock simulation is synchronous. Each processed 60-minute boundary occurs once.
 // The cap prevents malicious/corrupt game dates from freezing the UI.
 let step=Math.floor(s.lastMinute/60)*60+60,processed=0;
 while(step<=now&&processed<30000){clockStep(save,s,step);step+=60;processed++}
 s.lastMinute=processed>=30000?step-60:now;
 return s;
}
function access(save,roomId=null){
 if(save?.characterRoute!=='criminal')return deny('Only Elias owns this shop.');
 if(save.paused||save.phase==='report')return deny('The accounts are closed while the game is paused or reporting.');
 if(!inShop(save))return deny('Visit the inherited butcher shop to do this.');
 const room=roomId||save.currentLocation.roomId;
 if(!['shop-floor','cutting-room','stock-room','back-door'].includes(room))
  return deny('Go downstairs to the shop floor, cutting room or stock room.');
 return {ok:true};
}
function quote(save,action,opts={}){
 const allowed=access(save);if(!allowed.ok)return allowed;
 const s=ensure(save),key=opts.key;
 if(!['audit','draw','unrecordedDraw','cut','restock','price','counter','confront','listen'].includes(action))return deny('Unknown butcher-shop action.');
 if(!['draw','unrecordedDraw','audit','confront','listen'].includes(action)&&!GOODS[key])return deny('Select a butcher-shop product.');
 if(['cut','restock','price','counter'].includes(action)&&save.phase!=='day')return deny('The shop is closed for daytime trade.');
 let cents=0,seconds=0;
 if(action==='cut'){if(s.raw[key]<1)return deny('There is no uncut '+key+' to prepare.');seconds=900}
 if(action==='counter'){if(s.prepared[key]<1)return deny('Prepare more '+key+' before selling.');seconds=900}
 if(action==='restock'){cents=6*GOODS[key].wholesaleCents;if(s.tillCents<cents)return deny('Not enough shop money to pay the supplier.');seconds=600}
 if(action==='price'){if(!whole(opts.cents)||opts.cents<GOODS[key].wholesaleCents||opts.cents>100)return deny('Choose a sensible price in whole cents above cost.');seconds=120}
 if(action==='audit')seconds=600;
 if(action==='confront'||action==='listen')seconds=300;
 if(action==='draw'||action==='unrecordedDraw'){
  cents=opts.cents;if(!whole(cents)||cents<1||cents>10000)return deny('Choose a positive amount no greater than $100.');
  if(s.tillCents<cents)return deny('Not enough cash in the shop till.');seconds=120;
 }
 return {ok:true,seconds,cents,key,action};
}
function apply(save,action,opts={},spentSeconds=0){
 const q=quote(save,action,opts);if(!q.ok)return q;
 if(spentSeconds!==q.seconds)return deny('The shop action must consume its full time.');
 const s=sync(save);let message='',result={};
 if(action==='cut'){
  const n=prepare(s,q.key,3);s.manualCuts+=n;message='Cut and prepared '+n+' lb of '+GOODS[q.key].name.toLowerCase()+'.';
  entry(s,save,'cut',message);
 }else if(action==='counter'){
  const total=customerSale(s,save,q.key,1,true);
  message='Served a customer; received $'+money(total)+' for '+GOODS[q.key].name.toLowerCase()+'.';
 }else if(action==='restock'){
  s.raw[q.key]+=6;s.tillCents-=q.cents;s.bookTillCents-=q.cents;s.stockOrders++;
  message='Purchased 6 lb uncut '+GOODS[q.key].name.toLowerCase()+' for $'+money(q.cents)+'.';
  entry(s,save,'restock',message,-q.cents);
 }else if(action==='price'){
  s.prices[q.key]=opts.cents;s.cousin.resentment=Math.min(95,s.cousin.resentment+3);
  message='Posted '+GOODS[q.key].name.toLowerCase()+' at $'+money(opts.cents)+' per lb.';
  entry(s,save,'price',message);
 }else if(action==='draw'||action==='unrecordedDraw'){
  s.tillCents-=q.cents;save.personalCash=(Math.round((Number(save.personalCash)||0)*100)+q.cents)/100;
  if(action==='draw'){
   s.bookTillCents-=q.cents;s.drawsCents+=q.cents;
   message='Recorded owner withdrawal of $'+money(q.cents)+' from shop takings.';
   entry(s,save,'owner-draw',message,-q.cents);
  }else{
   s.cousin.suspicion=Math.min(95,s.cousin.suspicion+3);
   message='You took $'+money(q.cents)+' from the till without entering it in the accounts.';
   // Player action is personally known but not present in the shop ledger.
   s.hidden.unenteredWithdrawalsCents+=q.cents;
  }
 }else if(action==='confront'){
  s.cousin.resentment=Math.min(95,s.cousin.resentment+8);
  s.cousin.loyalty=Math.max(0,s.cousin.loyalty-2);
  message='Your cousin claims he has kept this shop alive while you were gone. He insists he understands the customers better than you do.';
  entry(s,save,'conversation','Disputed who has authority over the butcher shop.');
 }else if(action==='listen'){
  s.cousin.resentment=Math.max(0,s.cousin.resentment-6);
  s.cousin.loyalty=Math.min(95,s.cousin.loyalty+3);
  message='You hear your cousin out. He says certain families will stop buying if their prices suddenly rise. You still control the books.';
  entry(s,save,'conversation','Discussed local customer prices with the assistant.');
 }else if(action==='audit'){
  s.auditCount++;const difference=s.tillCents-s.bookTillCents;
  s.lastAudit={date:save.gameDate,actualCents:s.tillCents,expectedCents:s.bookTillCents,differenceCents:difference};
  message='Counted the till. '+(difference===0?'The ledger balances.':difference<0?'Short by $'+money(-difference)+'.':'Over by $'+money(difference)+'.')+
   ' The count alone does not identify who made an entry or took cash.';
  result.audit={...s.lastAudit};
  entry(s,save,'audit','Performed a till count; difference $'+money(Math.abs(difference))+'.');
 }
 return {ok:true,message,...result,status:summary(save)};
}
function summary(save){
 const s=ensure(save);if(!s)return null;
 return {tillCents:s.tillCents,raw:{...s.raw},prepared:{...s.prepared},
  prices:{...s.prices},sales:s.sales,salesCents:s.salesCents,manualCuts:s.manualCuts,
  stockOrders:s.stockOrders,drawsCents:s.drawsCents,ledger:s.ledger.map(x=>({...x})),
  lastAudit:s.lastAudit?{...s.lastAudit}:null,
  cousin:{loyalty:s.cousin.loyalty,resentment:s.cousin.resentment,priceChanges:s.cousin.priceChanges},
  loftResidence:'Cousin’s permanent upstairs home'};
}
const api=Object.freeze({SHOP,GOODS,ensure,sync,access,quote,apply,summary});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CROWE_BUTCHERY=api;
})(typeof window!=='undefined'?window:globalThis);
