/* Capital & Consequence: ice delivery and hanging beef for Crowe Family Butchers.
 * Game abstractions, NOT real-world meat preservation or food-safety guidance.
 * The cousin performs ordinary upkeep automatically; there is NO calendar
 * expiration on sound, properly maintained hanging beef.
 */
(function(root){'use strict';
 const DAY=1440,STANDARD_AGING_DAYS=30,ICE_PRICE_CENTS=5,ICE_DELIVERY_BLOCKS=10,
  SIDE_WEIGHT_LBS=320,SIDE_COST_CENTS=4480;
 const fail=reason=>({ok:false,reason});
 const money=c=>(c/100).toFixed(2);
 const clock=save=>Number.isSafeInteger(save?.worldCalendar?.worldMinute)?
  save.worldCalendar.worldMinute:Math.floor(Date.parse((save?.gameDate||'1878-01-02')+'T08:00:00Z')/60000);
 const day=minute=>Math.floor(minute/DAY);
 const date=minute=>new Date(minute*60000).toISOString().slice(0,10);
 function note(shop,at,type,label,amountCents=0){
  const record={id:shop.nextEntry++,date:date(at),type,label,amountCents};
  shop.ledger.push(record);if(shop.ledger.length>140)shop.ledger.splice(0,shop.ledger.length-140);
  return record;
 }
 function ensure(shop,save){
  if(!shop||typeof shop!=='object')return null;
  if(!shop.coldRoom||shop.coldRoom.version!==1){
   const now=clock(save);
   shop.coldRoom={version:1,iceBlocks:12,iceCapacity:18,iceDeliveries:0,iceSpentCents:0,
    autoDelivery:true,lastDay:day(now),dryDays:0,cleanliness:96,condition:'stable',
    inspectionHold:false,sideSequence:2,
    sides:[{id:1,kind:'beef',weightLbs:SIDE_WEIGHT_LBS,hungMinute:now-18*DAY,receivedDate:date(now-18*DAY)}],
    lastDeliveryDate:null,lastInspectionDate:null,notices:[]};
  }
  return shop.coldRoom;
 }
 function remark(c,at,message){
  const id=date(at)+'|'+message;
  if(c.notices.at(-1)?.id!==id)c.notices.push({id,date:date(at),text:message});
  if(c.notices.length>30)c.notices.shift();
 }
 function iceWeatherUse(at){
  const month=Number(date(at).slice(5,7));
  return month>=6&&month<=8?3:month<=2||month>=11?1:2;
 }
 function payDelivery(shop,c,at,automatic){
  const blocks=Math.min(ICE_DELIVERY_BLOCKS,c.iceCapacity-c.iceBlocks),
   amount=blocks*ICE_PRICE_CENTS;
  if(blocks<=0)return fail('The ice compartment is full.');
  if(shop.tillCents<amount)return fail('The shop till cannot cover an ice delivery.');
  shop.tillCents-=amount;shop.bookTillCents-=amount;
  c.iceBlocks+=blocks;c.iceDeliveries++;c.iceSpentCents+=amount;
  c.lastDeliveryDate=date(at);
  note(shop,at,'ice-delivery',(automatic?'Cousin received':'Elias received')+
   ' '+blocks+' blocks of ice from the iceman.',-amount);
  return {ok:true,blocks,costCents:amount};
 }
 function step(shop,save,at){
  const c=ensure(shop,save),toDay=day(at);
  if(toDay<=c.lastDay)return c;
  // The existing game clock advances by one hour; capped catchup retains the
  // unprocessed day on large jumps instead of pretending it was processed.
  let count=0;
  while(c.lastDay<toDay&&count<180){
   c.lastDay++;count++;
   const t=c.lastDay*DAY+8*60;
   c.iceBlocks=Math.max(0,c.iceBlocks-iceWeatherUse(t));
   c.cleanliness=Math.max(0,c.cleanliness-1);
   if(c.autoDelivery&&c.iceBlocks<=6){
    const delivery=payDelivery(shop,c,t,true);
    if(!delivery.ok&&c.iceBlocks<=3)remark(c,t,'The iceman could not be paid. Shop cash is needed.');
   }
   // The cousin handles ordinary sanitation without a player chore.
   if(c.cleanliness<=80)c.cleanliness=96;
   c.dryDays=c.iceBlocks>0?0:c.dryDays+1;
   if(c.dryDays>=3){
    c.inspectionHold=true;
    remark(c,t,'Extended loss of cooling: hanging beef is held for inspection, not automatically discarded.');
   }else if(c.iceBlocks<=3)remark(c,t,'Ice is running low. The cousin has requested the next delivery.');
   c.condition=c.inspectionHold?'inspection required':c.iceBlocks>0?'stable':'ice shortage';
  }
  return c;
 }
 function sideAgeDays(side,at){return Math.max(0,Math.floor((at-side.hungMinute)/DAY))}
 function available(shop,save,sideId){
  const c=ensure(shop,save);
  return c.sides.find(s=>s.id===Number(sideId))||null;
 }
 function preview(shop,save,action,opts={}){
  const c=ensure(shop,save),room=save?.currentLocation?.roomId;
  const side=available(shop,save,opts.sideId),at=clock(save);
  if(!['iceDelivery','cleanRoom','receiveSide','cutSide'].includes(action))return fail('Unknown cold-room task.');
  if(save?.phase!=='day')return fail('The iceman and butcher work during daytime hours.');
  if(action==='iceDelivery'){
   if(!['ice-room','back-door'].includes(room))return fail('Receive the iceman at the ice room or delivery door.');
   if(c.iceBlocks>8)return fail('The ice compartment has sufficient ice.');
   const cents=Math.min(ICE_DELIVERY_BLOCKS,c.iceCapacity-c.iceBlocks)*ICE_PRICE_CENTS;
   if(shop.tillCents<cents)return fail('Not enough shop cash for ice.');
   return {ok:true,seconds:300,cents};
  }
  if(action==='cleanRoom'){
   if(room!=='ice-room')return fail('Inspect and clean the hanging-meat room itself.');
   return {ok:true,seconds:900,cents:0};
  }
  if(action==='receiveSide'){
   if(!['ice-room','back-door'].includes(room))return fail('Receive the side at the delivery door or hanging room.');
   if(c.sides.length>=4)return fail('The hanging rails are full.');
   if(c.iceBlocks<=0||c.inspectionHold)return fail('Restore and inspect cooling before taking more beef.');
   if(shop.tillCents<SIDE_COST_CENTS)return fail('The shop till cannot pay for another side of beef.');
   return {ok:true,seconds:900,cents:SIDE_COST_CENTS};
  }
  if(!['ice-room','cutting-room'].includes(room))return fail('Go to the hanging room or cutting room to take a beef cut.');
  if(!side)return fail('That side of beef is no longer on the rail.');
  if(c.inspectionHold||c.iceBlocks<=0)return fail('The hanging room must be cooled and inspected first.');
  const ageDays=sideAgeDays(side,at);
  if(ageDays<STANDARD_AGING_DAYS&&!opts.early)
   return fail('This side is still aging. A specific customer may request an earlier cut.');
  if(side.weightLbs<1)return fail('No meat remains on this side.');
  return {ok:true,seconds:1800,cents:0,sideId:side.id,early:!!opts.early,ageDays};
 }
 function perform(shop,save,action,opts={},spentSeconds){
  const q=preview(shop,save,action,opts);
  if(!q.ok)return q;
  if(q.seconds!==spentSeconds)return fail('The full task time must pass before recording cold-room work.');
  const at=clock(save),c=ensure(shop,save);let message='';
  if(action==='iceDelivery'){
   const receipt=payDelivery(shop,c,at,false);if(!receipt.ok)return receipt;
   c.dryDays=0;
   c.condition=c.inspectionHold?'inspection required':'stable';
   message='Iceman delivered '+receipt.blocks+' ice blocks for $'+money(receipt.costCents)+'.';
  }else if(action==='cleanRoom'){
   c.cleanliness=100;c.lastInspectionDate=date(at);
   if(c.iceBlocks>0){c.inspectionHold=false;c.dryDays=0;c.condition='stable'}
   else c.condition='ice shortage';
   note(shop,at,'room-maintenance','Inspected drainage, hooks and meat-room cleanliness.');
   message=c.iceBlocks>0?'Cleaned and inspected the hanging room. Cooling is in order.':
    'Room cleaned, but ice must be restored before hanging meat can be cut.';
  }else if(action==='receiveSide'){
   shop.tillCents-=SIDE_COST_CENTS;shop.bookTillCents-=SIDE_COST_CENTS;
   const id=c.sideSequence++;
   c.sides.push({id,kind:'beef',weightLbs:SIDE_WEIGHT_LBS,hungMinute:at,receivedDate:date(at)});
   note(shop,at,'hanging-side','Received side #'+id+' ('+SIDE_WEIGHT_LBS+' lb) for hanging and aging.',-SIDE_COST_CENTS);
   message='Hung a '+SIDE_WEIGHT_LBS+' lb side of beef. Standard aging: 30 days, with early customer orders allowed.';
  }else{
   const side=available(shop,save,q.sideId);
   const cutLbs=Math.min(24,side.weightLbs);
   side.weightLbs-=cutLbs;
   shop.raw.beef+=cutLbs;
   const description='Taken '+cutLbs+' lb from side #'+side.id+' at '+q.ageDays+' days'+
    (q.early&&q.ageDays<STANDARD_AGING_DAYS?' on a customer’s early request':'')+'.';
   note(shop,at,'hanging-cut',description);
   if(side.weightLbs===0)c.sides.splice(c.sides.indexOf(side),1);
   message=description+' Ready for further cutting at the block.';
  }
  return {ok:true,message};
 }
 function summary(shop,save){
  const c=ensure(shop,save),at=clock(save);
  return {iceBlocks:c.iceBlocks,iceCapacity:c.iceCapacity,condition:c.condition,
   cleanliness:c.cleanliness,autoDelivery:c.autoDelivery,inspectionHold:c.inspectionHold,
   deliveries:c.iceDeliveries,spentCents:c.iceSpentCents,lastDeliveryDate:c.lastDeliveryDate,
   lastInspectionDate:c.lastInspectionDate,notices:c.notices.slice(-5).map(v=>({...v})),
   standardAgingDays:STANDARD_AGING_DAYS,
   sides:c.sides.map(s=>({id:s.id,kind:s.kind,weightLbs:s.weightLbs,
    receivedDate:s.receivedDate,ageDays:sideAgeDays(s,at),
    standardReady:sideAgeDays(s,at)>=STANDARD_AGING_DAYS,
    cutAllowed:!c.inspectionHold&&c.iceBlocks>0}))};
 }
 const api=Object.freeze({STANDARD_AGING_DAYS,ICE_PRICE_CENTS,ICE_DELIVERY_BLOCKS,
  SIDE_WEIGHT_LBS,SIDE_COST_CENTS,ensure,step,preview,perform,summary});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_CROWE_COLD_ROOM=api;
})(typeof window!=='undefined'?window:globalThis);
