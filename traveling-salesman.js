/* A distinct traveling peddler with truth and salesmanship mixed together.
 * All purchases are from the real, saved personal-effects inventory.
 * The character must be encountered in-person at an active circus pitch.
 */
(function(root){
'use strict';
const MERCHANT=Object.freeze({id:'silasPike',name:'Silas Pike',occupation:'Traveling salesman'});
const GOODS=Object.freeze([
 {id:'brass-spyglass',name:'Brass Spyglass',priceCents:18,kind:'junk',rare:false,
  pitch:'A sea captain carried this glass around the world. Yours for pennies!',
  proof:'The lenses are cheap flat glass; the tube has been polished to hide its dents.',
  description:'A scratched, ordinary brass viewing tube passed off as a sea captain’s relic.'},
 {id:'patent-sketch',name:'Grand Electrical Patent Drawing',priceCents:40,kind:'collectible',rare:false,
  pitch:'A celebrated inventor drew this by hand, and only I have a copy.',
  proof:'The paper is ordinary printing stock and carries no original inventor’s mark.',
  description:'A decorative reproduction of a purported electrical patent sketch.'},
 {id:'tin-soldier',name:'Painted Tin Soldier',priceCents:6,kind:'souvenir',rare:false,
  pitch:'Cast for an officer of the Guard, they say. Finely made, sir.',
  proof:'A common cheap tin miniature with chipped hand-painted trousers.',
  description:'A small, ordinary tin soldier with a great many exaggerated claims.'},
 {id:'pocket-loupe',name:'Precision Pocket Loupe',priceCents:65,kind:'rare',rare:true,
  pitch:'This glass belonged to a great detective; it reveals the finest marks.',
  proof:'Although the story is unverified, the magnifier is genuinely well made and useful.',
  description:'A well-ground folding magnifying lens. Its past owner remains unknown.'},
 {id:'railway-guide',name:'Illustrated Railroad Guide',priceCents:22,kind:'collectible',rare:true,
  pitch:'A railway guide that a wise traveler ought to keep close.',
  proof:'Printed station tables and fares appear authentic, though not necessarily current.',
  description:'A bound railway travel guide showing historic station tables and prices.'}
]);
function ensure(save){
 if(!save||typeof save!=='object')return null;
 if(!save.travelingSalesman||save.travelingSalesman.version!==1)
  save.travelingSalesman={version:1,examinations:{},purchases:[],conversationCount:0};
 if(!Array.isArray(save.travelingSalesman.purchases))save.travelingSalesman.purchases=[];
 if(!save.travelingSalesman.examinations||typeof save.travelingSalesman.examinations!=='object')
  save.travelingSalesman.examinations={};
 return save.travelingSalesman;
}
function present(save){
 const event=root.FE_CIRCUS_TOUR?.active?.(save);
 if(!event||save?.currentLocation?.locationId!==event.locationId)return null;
 return event;
}
function stock(save){
 const event=present(save);if(!event)return [];
 const data=ensure(save);
 return GOODS.map(g=>({...g,examined:!!data.examinations[event.id+'|'+g.id],
  owned:data.purchases.some(p=>p.engagementId===event.id&&p.itemId===g.id)}));
}
function examine(save,id){
 const event=present(save),data=ensure(save),item=GOODS.find(x=>x.id===id);
 if(!event||!data||!item)return {ok:false,reason:'The peddler and his goods are not here.'};
 const key=event.id+'|'+id,already=!!data.examinations[key];
 data.examinations[key]={minute:save.worldCalendar?.worldMinute??null,observation:item.proof};
 return {ok:true,already,truth:item.proof,good:item.rare};
}
function buy(save,id,award){
 const event=present(save),data=ensure(save),item=GOODS.find(x=>x.id===id);
 if(!event||!data||!item)return {ok:false,reason:'This goods stall is not open.'};
 if(data.purchases.some(p=>p.engagementId===event.id&&p.itemId===id))
  return {ok:false,reason:'This one-off item has already been sold to you.'};
 const cents=Math.round((Number(save.personalCash)||0)*100);
 if(cents<item.priceCents)return {ok:false,reason:'Not enough personal cash.'};
 // First verify that real pockets can receive the item; a failed award cannot
 // create a bill or a phantom purchase. Before awarding, set the debit so
 // inventory's autosave sees the correct money balance.
 const original=save.personalCash;
 save.personalCash=(cents-item.priceCents)/100;
 const prize={id:'peddler-'+event.id+'-'+item.id,name:item.name,
  kind:item.kind,description:item.description+' Purchased from Silas Pike.'};
 let deposited;
 try{deposited=typeof award==='function'?award(prize):null}catch(e){deposited={ok:false,reason:'Inventory unavailable.'}}
 if(!deposited?.ok){save.personalCash=original;return {ok:false,reason:deposited?.reason||'No room to carry this purchase.'}}
 const receipt={engagementId:event.id,itemId:item.id,minute:save.worldCalendar?.worldMinute??null,
  priceCents:item.priceCents,examined:!!data.examinations[event.id+'|'+id]};
 data.purchases.push(receipt);
 return {ok:true,receipt,good:prize};
}
const api=Object.freeze({MERCHANT,GOODS,ensure,present,stock,examine,buy});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_TRAVELING_SALESMAN=api;
})(typeof window!=='undefined'?window:globalThis);
