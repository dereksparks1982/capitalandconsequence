/* One physical bedroom chest, backed by the same existing pocket/item ledger.
 * No duplicated saved inventory and no transfers from a developer preview.
 */
(function(root){
'use strict';
let node=null;
function make(){
 if(node?.isConnected)return node;
 node=document.createElement('section');node.id='ccBedroomChest';node.className='cc-bedroom-chest';node.hidden=true;
 node.setAttribute('aria-label','Bedroom chest for personal belongings');
 node.innerHTML='<h4>▣ BEDROOM CHEST</h4>'+
  '<p>The chest stays in your bedroom. Carry prizes in your pockets, then put them away here.</p>'+
  '<div class="cc-chest-columns"><div><b>Carried Belongings</b><div data-chest-list="pocket"></div></div>'+
  '<div><b>Bedroom Chest · <span data-chest-count>0</span>/64</b><div data-chest-list="chest"></div></div></div>'+
  '<p data-chest-status role="status" aria-live="polite"></p>';
 const room=document.querySelector('#cityRoomOverlay .city-room-placeholder');
 if(room)room.prepend(node);
 node.addEventListener('click',event=>{
  const b=event.target.closest('[data-item][data-destination]');
  if(!b)return;
  const api=root.FE_PERSONAL_EFFECTS;
  const result=api?.transfer?.(b.dataset.item,b.dataset.destination);
  node.querySelector('[data-chest-status]').textContent=result?.ok?'Belonging moved.':result?.reason||'Transfer failed.';
  refresh();
 });
 return node;
}
function paint(container,items,destination,text){
 const target=node.querySelector('[data-chest-list="'+container+'"]');
 target.replaceChildren();
 if(!items.length){const empty=document.createElement('p');empty.textContent=text;target.appendChild(empty);return}
 const ul=document.createElement('ul');
 for(const item of items){
  const li=document.createElement('li');
  const label=document.createElement('span');label.textContent=item.name;
  label.title=item.description||item.name;
  const btn=document.createElement('button');
  btn.type='button';btn.dataset.item=item.id;btn.dataset.destination=destination;
  btn.textContent=container==='pocket'?'Store →':'← Take';
  li.append(label,btn);ul.append(li);
 }
 target.appendChild(ul);
}
function refresh(){
 if(!node||node.hidden)return;
 const api=root.FE_PERSONAL_EFFECTS;if(!api)return;
 const items=api.carried?.()||[],chest=api.list?.('bedroom-chest')||[];
 paint('pocket',items,'bedroom-chest','Your pockets are empty.');
 paint('chest',chest,'left-pocket','The chest is empty.');
 node.querySelector('[data-chest-count]').textContent=String(chest.length);
}
function render(save,{locationId,roomId,dev=false}={}){
 const room=make(),overlay=document.getElementById('cityRoomOverlay');
 const atHome=locationId==='home'&&roomId==='bedroom'&&!dev&&
  save?.currentLocation?.locationId==='home'&&save?.currentLocation?.roomId==='bedroom';
 room.hidden=!atHome||!!overlay?.hidden;
 if(!room.hidden)refresh();
}
root.FE_BEDROOM_CHEST=Object.freeze({render,refresh});
})(typeof window!=='undefined'?window:globalThis);
