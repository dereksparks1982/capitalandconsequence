/* The hawker is not a vending machine: hear the boast, inspect the item,
 * decide whether it is worth the asking price, then buy a physical object.
 */
(function(root){
'use strict';
if(typeof document==='undefined')return;
let host=null,profile=null,actions=null;
function create(){
 if(host?.isConnected)return host;
 const room=document.querySelector('#cityRoomOverlay .city-room-placeholder');
 if(!room)return null;
 host=document.createElement('section');host.id='ccTravelingSalesman';host.className='cc-traveling-salesman';host.hidden=true;
 host.setAttribute('aria-label','Traveling peddler goods');
 host.innerHTML='<h4>THE TRAVELING PEDDLER</h4>'+
  '<p>Silas Pike promises rarities and wonders. Ask to inspect his wares before believing every story.</p>'+
  '<div class="cc-peddler-goods" data-peddler-goods></div><p data-peddler-status role="status" aria-live="polite"></p>';
 room.prepend(host);
 host.addEventListener('click',e=>{
  const button=e.target.closest('button[data-peddler-id][data-peddler-action]');
  if(!button||!actions)return;
  const id=button.dataset.peddlerId,kind=button.dataset.peddlerAction;
  const result=kind==='inspect'?actions.inspect?.(id):actions.buy?.(id);
  host.querySelector('[data-peddler-status]').textContent=result?.ok?
   (kind==='inspect'?result.truth:'Purchased '+result.good.name+'.'):
   result?.reason||'Silas refuses.';
  refresh();
 });
 return host;
}
function refresh(){
 if(!host||host.hidden||!profile)return;
 const goods=root.FE_TRAVELING_SALESMAN?.stock?.(profile)||[];
 const panel=host.querySelector('[data-peddler-goods]');panel.replaceChildren();
 for(const item of goods){
  const card=document.createElement('article');card.className='cc-peddler-item';
  const title=document.createElement('strong');title.textContent=item.name+' · '+item.priceCents+'¢';
  const claim=document.createElement('p');claim.textContent='Silas: “‘'+item.pitch+'”';
  const inspected=document.createElement('p');
  inspected.textContent=item.examined?'Your inspection: '+item.proof:'You have not examined this object.';
  const buttons=document.createElement('div');buttons.className='cc-peddler-actions';
  const inspect=document.createElement('button');inspect.type='button';
  inspect.dataset.peddlerAction='inspect';inspect.dataset.peddlerId=item.id;
  inspect.textContent='Inspect';
  const buy=document.createElement('button');buy.type='button';
  buy.dataset.peddlerAction='buy';buy.dataset.peddlerId=item.id;
  buy.disabled=item.owned;buy.textContent=item.owned?'Sold':'Buy';
  buttons.append(inspect,buy);card.append(title,claim,inspected,buttons);panel.appendChild(card);
 }
}
function render(save,onActions,{locationId,dev=false}={}){
 profile=save;actions=onActions;
 const node=create();if(!node)return;
 const event=root.FE_TRAVELING_SALESMAN?.present?.(save);
 node.hidden=!event||dev||locationId!==event.locationId||
  !!document.getElementById('cityRoomOverlay')?.hidden;
 if(!node.hidden)refresh();
}
root.FE_TRAVELING_SALESMAN_UI=Object.freeze({render,refresh});
})(typeof window!=='undefined'?window:globalThis);
