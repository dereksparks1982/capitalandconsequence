/* Actual prepaid-on-delivery household orders, once per calendar date.
 * Horse-drawn milk and ice deliveries come from existing Eastern Market
 * vendor stocks and credit the same merchant tills. No generated goods.
 */
(function(root){'use strict';
const OPTIONS=Object.freeze({
 milk:Object.freeze({label:'Milkman · milk bottles',good:'milk',site:'easternMarket',maximum:4,period:'daily'}),
 cream:Object.freeze({label:'Milkman · fresh cream',good:'cream',site:'easternMarket',maximum:3,period:'daily'}),
 ice:Object.freeze({label:'Iceman · block ice',good:'ice-block',site:'easternMarket',maximum:6,period:'daily'}),
 flour:Object.freeze({label:'Flour merchant · white flour',good:'wheat-flour',site:'centerMarket',maximum:6,period:'weekly'}),
 eggs:Object.freeze({label:'Egg carrier · dozen eggs',good:'eggs',site:'centerMarket',maximum:4,period:'weekly'})
});
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s);
const dateFromMinute=t=>new Date(t*60000).toISOString().slice(0,10);
function state(save){
 if(!save||typeof save!=='object')return null;
 if(!save.homeDeliveries||save.homeDeliveries.version!==1){
  save.homeDeliveries={version:1,orders:{},receipts:[],lastCheckedDate:null};
 }
 const s=save.homeDeliveries;
 if(!s.orders||typeof s.orders!=='object')s.orders={};
 if(!Array.isArray(s.receipts))s.receipts=[];
 return s;
}
function setOrder(save,key,packages){
 const data=state(save),option=OPTIONS[key];
 if(!data||!option||!Number.isSafeInteger(packages)||packages<0||packages>option.maximum)
  return {ok:false,reason:'Choose a valid order quantity.'};
 const now=save?.worldCalendar?.worldMinute;
 if(!Number.isSafeInteger(now))return {ok:false,reason:'Washington time unavailable.'};
 const date=dateFromMinute(now),morning=((now%1440)+1440)%1440<8*60;
 const startDate=morning?date:dateFromMinute(now+1440);
 data.orders[key]={packages,startDate};
 return {ok:true,order:{key,packages,startDate}};
}
function dueOn(date,period){
 const day=new Date(date+'T12:00:00Z').getUTCDay();
 return period==='daily'||day===1;
}
function tick(save){
 const data=state(save),now=save?.worldCalendar?.worldMinute;
 if(!data||!Number.isSafeInteger(now))return {ok:false,reason:'No Washington clock.'};
 const date=dateFromMinute(now),minutes=((now%1440)+1440)%1440;
 if(minutes<8*60)return {ok:true,processed:[],reason:'Morning delivery rounds have not begun.'};
 if(!validDate(date))return {ok:false,reason:'No valid date.'};
 const market=root.FE_WASHINGTON_COMMERCE,kitchen=root.FE_KITCHEN;
 if(!market?.ensure||!kitchen?.acceptDelivery)return {ok:false,reason:'Food commerce unavailable.'};
 const book=market.ensure(save),results=[];
 // NEVER charge and add twice. Failed deliveries may retry if stock or
 // player funds later change, but successful ones are date-scoped receipts.
 for(const [key,order] of Object.entries(data.orders)){
  const option=OPTIONS[key],n=Number(typeof order==='object'?order?.packages:order);
  const starts=typeof order==='object'?order?.startDate:null;
  if(!option||!Number.isSafeInteger(n)||n<=0||
    (validDate(starts)&&date<starts)||!dueOn(date,option.period))continue;
  if(data.receipts.some(x=>x.date===date&&x.key===key&&x.ok))continue;
  const good=market.GOODS.find(x=>x.id===option.good);
  const stock=book.siteStocks?.[option.site],cost=good?.cents*n,cash=Math.round(Number(save.personalCash||0)*100);
  if(!good||!stock||stock[good.id]<n||!Number.isSafeInteger(cost)||cash<cost){
   results.push({key,ok:false,reason:!good?'Supplier unavailable':stock?.[good?.id]<n?'No stock for delivery':'Insufficient household cash'});
   continue;
  }
  // Validate capacity before transaction so a full icebox doesn't eat cash.
  const target=kitchen.ledger(save);
  if(!target||target.k.goods.length+n>350){results.push({key,ok:false,reason:'Kitchen full'});continue;}
  const oldCash=save.personalCash,oldStock=stock[good.id],oldCount=target.k.goods.length,oldIce=target.k.iceUntil;
  try{
   if(key==='ice'){
    const ice=kitchen.ice(save,n);if(!ice.ok)throw Error(ice.reason);
   }else{
    // Receipt quantities reflect purchased packages, not imaginary units.
    for(let i=0;i<n;i++){
     const delivered=kitchen.acceptDelivery(save,good.id,good.units,'wagon:'+key+':'+date);
     if(!delivered.ok)throw Error(delivered.reason);
    }
   }
   save.personalCash=(cash-cost)/100;
   stock[good.id]-=n;
   const account=option.site+':'+good.vendor;
   book.accounts[account]=(book.accounts[account]||0)+cost;
   const receipt={date,key,packages:n,costCents:cost,minute:now,ok:true,source:'horse-drawn '+(key==='ice'?'iceman':'delivery')};
   data.receipts.push(receipt);data.receipts=data.receipts.slice(-240);results.push(receipt);
  }catch(e){
   target.k.goods.length=oldCount;target.k.iceUntil=oldIce;
   save.personalCash=oldCash;stock[good.id]=oldStock;
   results.push({key,ok:false,reason:String(e.message||e)});
  }
 }
 data.lastCheckedDate=date;
 return {ok:true,processed:results};
}
const api=Object.freeze({OPTIONS,state,setOrder,tick,dueOn});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_HOME_DELIVERIES=api;
})(typeof window!=='undefined'?window:globalThis);
