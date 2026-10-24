/* Narrow, in-room 1878 livery purchasing controls. No remote shopping. */
(function(root){
 'use strict';
 function render(locationId,roomId,save,changed,live=true){
  const overlay=document.getElementById('cityRoomOverlay');
  if(!overlay)return;
  let panel=document.getElementById('liveryService');
  if(!panel){panel=document.createElement('section');panel.id='liveryService';panel.className='sheet';
   overlay.appendChild(panel)}
  const trade=root.FE_LIVERY_TRADE;
  const stable=trade?.STABLES?.[locationId];
  const atDesk=!!stable&&roomId==='service-desk';
  panel.hidden=!atDesk;panel.replaceChildren();
  if(!atDesk)return;
  const title=document.createElement('h3');title.textContent=stable.name+' · horses and carriages';panel.appendChild(title);
  const note=document.createElement('p');note.textContent='The proprietors are competing brothers. Prices are 1878 game estimates. Purchases require personal money, not Federal Electric company funds. Bought animals and vehicles remain at this stable until physically moved. Personal feed, livery boarding and wagon storage bills accrue daily and settle on Saturday.';panel.appendChild(note);
  const cash=document.createElement('p');cash.textContent='Personal cash: $'+Number(save.personalCash||0).toFixed(2);panel.appendChild(cash);
  const status=document.createElement('p');status.setAttribute('role','status');panel.appendChild(status);
  for(const item of Object.keys(stable.prices)){
   const offer=trade.quote(locationId,item);
   const button=document.createElement('button');button.type='button';
   button.textContent='Buy '+offer.name+' · $'+(offer.priceCents/100).toFixed(2);
   button.disabled=!live||save.paused||save.phase!=='day';
   button.onclick=()=>{
    const next=(save.liveryPurchaseSequence||0)+1,token='stable:'+next;
    const result=trade.buy(save,locationId,item,token,(seconds,away)=>root.advanceWorldTime(seconds,away));
    status.textContent=result.ok?offer.name+' purchased and boarded at '+stable.name+'.':result.reason;
    if(result.ok&&!result.repeated){
     save.liveryPurchaseSequence=next;
     changed?.();
     cash.textContent='Personal cash: $'+Number(save.personalCash||0).toFixed(2);
    }
   };
   panel.appendChild(button);
  }
 }
 const api=Object.freeze({render});
 if(root)root.FE_LIVERY_UI=api;
})(typeof window!=='undefined'?window:globalThis);
