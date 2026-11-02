/* Star Club seated meals in the already approved Dining Room.
 * Existing travel, admission, privacy and private-suite gates remain intact.
 */
(function(root){
'use strict';
const service=root.FE_STAR_DINING;
if(!service)throw Error('Star Club dining engine must load before menu.');
const id=n=>document.getElementById(n);
function mount(){
 let node=id('starDiningPanel');
 if(node?.isConnected)return node;
 const parent=document.querySelector('#cityRoomOverlay .city-room-placeholder');
 if(!parent)return null;
 node=document.createElement('section');node.id='starDiningPanel';
 node.className='sheet star-dining';
 node.setAttribute('aria-label','Star Club dining room menu');
 node.hidden=true;
 const title=document.createElement('h3');title.textContent='Star Club · Dining Room Service';
 const copy=document.createElement('p');copy.textContent=
  'A small paid menu, served only at your table. No cards, wagering or admission to private suites. All meals spend personal money and Washington time.';
 const status=document.createElement('p');status.id='starDiningStatus';status.setAttribute('role','status');
 const menu=document.createElement('div');menu.id='starDiningMenu';
 const notice=document.createElement('p');notice.id='starDiningNotice';notice.setAttribute('role','status');
 node.append(title,copy,status,menu,notice);
 parent.appendChild(node);
 node.addEventListener('click',e=>{
  const b=e.target.closest('[data-star-meal]');
  if(!b||b.disabled||typeof S==='undefined')return;
  const mealId=b.dataset.starMeal,place=root.FE_CITY?.currentLocation?.()||{};
  const can=service.preview(S,mealId,{locationId:place.locationId,roomId:place.roomId,
   dev:!!root.FE_CITY?.isDevRoom?.()});
  if(!can.ok){id('starDiningNotice').textContent=can.reason;return;}
  b.disabled=true;
  const spent=root.advanceWorldTime(can.seconds,true);
  if(spent!==can.seconds){
   id('starDiningNotice').textContent='Meal service interrupted. No receipt or payment was recorded.';
   render();return;
  }
  const count=(S.starDiningTransactionSequence||0)+1;
  const receipt=service.transact(S,{menuId:mealId,token:'starmeal:'+count,
   spentSeconds:spent,date:can.date,locationId:place.locationId,roomId:place.roomId});
  id('starDiningNotice').textContent=receipt.ok?receipt.message:receipt.reason;
  if(receipt.ok&&!receipt.repeated){S.starDiningTransactionSequence=count;save(true);}
  render();
  root.FE_CHARACTER_NEEDS_UI?.render?.(S);
 });
 return node;
}
function render(){
 if(typeof document==='undefined'||typeof S==='undefined')return;
 const panel=mount();if(!panel)return;
 const place=root.FE_CITY?.currentLocation?.()||{};
 const active=place.locationId==='star'&&place.roomId==='dining-room'&&
  !id('cityRoomOverlay')?.hidden&&!root.FE_CITY?.isDevRoom?.();
 panel.hidden=!active;if(!active)return;
 const day=root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate;
 id('starDiningStatus').textContent='Your available funds: $'+(Number(S.personalCash)||0).toFixed(2)+
  ' · Menu portions remaining today are limited and paid for individually.';
 const body=id('starDiningMenu');body.replaceChildren();
 for(const [mealId,meal] of Object.entries(service.MENU)){
  const row=document.createElement('p'),button=document.createElement('button');
  const text=document.createElement('span');
  text.textContent=meal.name+' · $'+(meal.cents/100).toFixed(2)+' · '+meal.minutes+
   ' game minutes · '+service.remaining(S,day,mealId)+' portions left. ';
  button.type='button';button.dataset.starMeal=mealId;button.textContent='Order meal';
  const valid=service.preview(S,mealId,{locationId:place.locationId,roomId:place.roomId,
   dev:!!root.FE_CITY?.isDevRoom?.()});
  button.disabled=!valid.ok;button.title=valid.ok?'':valid.reason;
  row.append(text,button);body.appendChild(row);
 }
}
root.FE_STAR_DINING_UI=Object.freeze({render});
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
 else render();
}
})(typeof window!=='undefined'?window:globalThis);
