/* Physical provisions carried from the finite Washington market.
 * The journal exposes the existing saved bag, never sells or spawns stock.
 */
(function(root){
'use strict';
if(typeof document==='undefined')return;
const rootNode=document.getElementById('notebook');
if(!rootNode)return;
const host=document.createElement('section');host.id='carriedProvisions';
host.className='sheet carried-provisions';
host.setAttribute('aria-label','Carried food and drink');
host.innerHTML='<h3>Carried Provisions</h3>'+
 '<p class="fine">Food you already purchased at a real Washington market. Eating takes ten minutes and does not change merchant stock twice.</p>'+
 '<p id="carriedProvisionsStatus" role="status" aria-live="polite"></p>'+
 '<div id="carriedProvisionsList"></div>';
rootNode.append(host);
const status=host.querySelector('#carriedProvisionsStatus');
const list=host.querySelector('#carriedProvisionsList');
let current=null;
function permitted(save){
 return !!save&&save.phase!=='report'&&!save.paused&&!root.FE_CITY?.isDevRoom?.()&&
  typeof activeProfileId==='function'&&!!activeProfileId();
}
function refresh(save){
 current=save;
 list.replaceChildren();
 if(!save)return;
 const model=root.FE_WASHINGTON_COMMERCE,needs=root.FE_CHARACTER_NEEDS;
 if(!model||!needs)return;
 const items=model.ensure(save).playerBag.filter(item=>Object.hasOwn(needs.PROVISIONS,item.good));
 if(!items.length){
  const empty=document.createElement('p');empty.textContent='No purchased food or drink is currently carried.';list.append(empty);return;
 }
 for(const item of items){
  const row=document.createElement('div');row.className='carried-provision-row';
  const label=document.createElement('span');label.textContent=item.label+' · Purchased '+item.date;
  const button=document.createElement('button');button.type='button';button.textContent='Eat / Drink';
  const availability=needs.provisionAvailability(save,item.good);
  button.disabled=!permitted(save)||!availability.ok;
  button.title=availability.reason||'';
  button.dataset.purchaseId=item.id;
  row.append(label,button);list.append(row);
 }
}
host.addEventListener('click',event=>{
 const button=event.target.closest('button[data-purchase-id]');
 if(!button||button.disabled||!current)return;
 const state=current,model=root.FE_WASHINGTON_COMMERCE,needs=root.FE_CHARACTER_NEEDS;
 if(!permitted(state)){status.textContent='Food is unavailable right now.';return;}
 const id=button.dataset.purchaseId,item=model.ensure(state).playerBag.find(x=>x.id===id);
 if(!item||!Object.hasOwn(needs.PROVISIONS,item.good)){status.textContent='That provision is no longer carried.';refresh(state);return;}
 const allowed=needs.provisionAvailability(state,item.good);
 if(!allowed.ok){status.textContent=allowed.reason;refresh(state);return;}
 if(!root.FE_WASHINGTON_TIME?.canSpend?.(state,600)){status.textContent='Not enough Washington time to eat.';return;}
 if(root.advanceWorldTime(600,true)!==600){status.textContent='Could not spend time eating.';return;}
 const removed=model.consume(state,id);
 if(!removed.ok){status.textContent=removed.reason;refresh(state);return;}
 const outcome=needs.eatProvision(state,removed.good.good);
 status.textContent=outcome.ok?'You ate '+removed.good.label+'. Your condition has changed.':outcome.reason;
 if(Array.isArray(state.notes))state.notes.push({date:state.gameDate,source:'Personal provisions',
  text:'Ate food carried from the Washington market: '+removed.good.label+'.'});
 if(typeof save==='function')save(true);
 refresh(state);
 if(typeof render==='function')render();
});
root.FE_CARRIED_PROVISIONS=Object.freeze({refresh});
if(typeof S!=='undefined')refresh(S);
})(typeof window!=='undefined'?window:globalThis);
