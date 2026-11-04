/* Elias Crowe's butcher-shop controls; visible only at his owned shop.
 * The shop ledger intentionally never exposes the family mystery's secret truth.
 */
(function(root){'use strict';
const shop=root.FE_CROWE_BUTCHERY;
if(!shop)throw Error('Butcher shop system must load before its UI.');
const el=id=>document.getElementById(id);
const fmt=cents=>(cents<0?'-$':'$')+(Math.abs(cents)/100).toFixed(2);
const names=Object.keys(shop.GOODS);
let message='';
function button(label,onClick){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=onClick;return b}
function mount(){
 const desk=el('careerDesk');
 if(desk&&!el('croweDeskSummary')){
  const box=document.createElement('section');box.id='croweDeskSummary';box.className='doorman-work-box';
  box.setAttribute('aria-label','Crowe family butcher shop ownership');
  const anchor=desk.querySelector('.career-desk-actions');
  if(anchor)anchor.before(box);else desk.appendChild(box);
 }
 const room=document.querySelector('.city-room-placeholder');
 if(room&&!el('croweButcheryPanel')){
  const box=document.createElement('section');box.id='croweButcheryPanel';box.className='doorman-work-box';
  box.setAttribute('aria-label','Crowe butcher shop counter, inventory and accounts');
  room.appendChild(box);
 }
}
function doAction(action,options={}){
 if(!S||S.characterRoute!=='criminal')return;
 const before=S,profile=activeProfileId(),q=shop.quote(S,action,options);
 if(!q.ok){message=q.reason;refresh();return}
 if(!root.FE_WASHINGTON_TIME?.canSpend?.(S,q.seconds)||S.dayRemaining<=q.seconds){
  message='Not enough time remains for this shop task.';refresh();return;
 }
 const elapsed=root.advanceWorldTime(q.seconds,true);
 if(elapsed!==q.seconds||before!==S||profile!==activeProfileId()){
  message='The shop task was interrupted. No transaction was completed.';refresh();return;
 }
 const done=shop.apply(S,action,options,elapsed);
 message=done.message||done.reason;
 if(!done.ok){refresh();return}
 if(!save(true)){message+=' Autosave failed; keep the game open.'}
 render();refresh();
}
function shopReturn(){
 if(S?.characterRoute!=='criminal'||S.paused||S.phase==='report')return;
 const current=root.FE_CITY?.currentLocation?.();
 if(current?.locationId!==shop.SHOP){
  const travel=1800;
  if(!root.FE_WASHINGTON_TIME?.canSpend?.(S,travel)||S.dayRemaining<=travel){
   message='There is not enough time left to return to the shop.';refresh();return;
  }
  const spent=root.advanceWorldTime(travel,true);
  if(spent!==travel){message='The journey home was interrupted.';refresh();return}
 }
 const ok=root.FE_CITY?.openRoom?.(shop.SHOP,'shop-floor');
 if(!ok){message='The shop entrance could not be opened.';refresh();return}
 save(true);render();
}
function refresh(){
 mount();
 const on=S?.characterRoute==='criminal'&&!!activeProfileId();
 const desk=el('croweDeskSummary'),panel=el('croweButcheryPanel');
 if(desk)desk.hidden=!on;
 const loc=root.FE_CITY?.currentLocation?.()||{};
 const here=on&&loc.locationId===shop.SHOP&&!el('cityRoomOverlay')?.hidden&&!root.FE_CITY?.isDevRoom?.();
 if(panel)panel.hidden=!here;
 if(!on)return;
 shop.sync(S);
 const s=shop.summary(S);
 if(desk){
  desk.replaceChildren();
  const title=document.createElement('h3');title.textContent='Crowe Family Butchers · Owner’s Book';desk.appendChild(title);
  const cash=document.createElement('p');cash.textContent='Shop till: '+fmt(s.tillCents)+' · Sold: '+s.sales+' lb · Owner drawings: '+fmt(s.drawsCents);
  desk.appendChild(cash);
  const detail=document.createElement('p');detail.textContent='Your cousin lives in the upstairs loft and runs the counter when you are away. He has opinions about prices and accounts.';desk.appendChild(detail);
  const toShop=button(loc.locationId===shop.SHOP?'Enter Shop Floor':'Return to Shop · 30 min',shopReturn);
  toShop.disabled=S.paused||S.phase==='report';desk.appendChild(toShop);
 }
 if(!panel||panel.hidden)return;
 panel.replaceChildren();
 const h=document.createElement('h3');h.textContent='Crowe Family Butchers · Working Counter';panel.appendChild(h);
 const notice=document.createElement('p');notice.textContent=message||'Cut meat, stock the counter, set your own prices, serve customers, and keep an eye on the till.';notice.setAttribute('role','status');panel.appendChild(notice);
 if(S.currentLocation.roomId==='loft'){
  const upstairs=document.createElement('p');
  upstairs.textContent='Your cousin lives here permanently. The bed, washstand and wardrobe are his. Go downstairs to manage the meat and accounts.';
  panel.appendChild(upstairs);return;
 }
 const cousin=document.createElement('section');cousin.className='sheet';
 const titleC=document.createElement('h4');titleC.textContent='Your Cousin · Acting Butcher';cousin.appendChild(titleC);
 const mood=document.createElement('p');
 mood.textContent='He knows the work and the local customers. Loyalty: '+s.cousin.loyalty+
  '/100 · Resentment: '+s.cousin.resentment+'/100 · Price changes over your head: '+s.cousin.priceChanges+'.';
 cousin.appendChild(mood);
 cousin.appendChild(button('Hear His Opinion · 5 min',()=>doAction('listen')));
 cousin.appendChild(button('Remind Him Who Owns the Shop · 5 min',()=>doAction('confront')));
 panel.appendChild(cousin);
 const summary=document.createElement('p');
 summary.textContent='Cash in till: '+fmt(s.tillCents)+' · Meat sold: '+s.sales+' lb · Your cousin '+(S.currentLocation.roomId==='loft'?'is upstairs.':'handles the shop when you step away.');
 panel.appendChild(summary);
 for(const key of names){
  const config=shop.GOODS[key],row=document.createElement('section');row.className='sheet';
  const heading=document.createElement('h4');heading.textContent=config.name+' · '+fmt(s.prices[key])+'/lb';row.appendChild(heading);
  const stock=document.createElement('p');stock.textContent='Uncut: '+s.raw[key]+' lb · Ready for the counter: '+s.prepared[key]+' lb';row.appendChild(stock);
  row.appendChild(button('Cut 3 lb · 15 min',()=>doAction('cut',{key})));
  row.appendChild(button('Buy 6 lb uncut · '+fmt(6*config.wholesaleCents)+' · 10 min',()=>doAction('restock',{key})));
  row.appendChild(button('Serve 1 lb · 15 min',()=>doAction('counter',{key})));
  const price=document.createElement('input');price.type='number';price.step='1';price.min=String(config.wholesaleCents);price.max='100';price.value=String(s.prices[key]);price.setAttribute('aria-label',config.name+' price in cents');row.appendChild(price);
  row.appendChild(button('Set Price (¢) · 2 min',()=>doAction('price',{key,cents:Number(price.value)})));
  panel.appendChild(row);
 }
 const accounts=document.createElement('section');accounts.className='sheet';panel.appendChild(accounts);
 const title=document.createElement('h4');title.textContent='Till & Handwritten Accounts';accounts.appendChild(title);
 const draw=document.createElement('input');draw.type='number';draw.min='0.01';draw.step='0.01';draw.value='1.00';draw.setAttribute('aria-label','Cash to take in dollars');
 accounts.appendChild(draw);
 function amount(){return Math.round(Number(draw.value)*100)}
 accounts.appendChild(button('Record Owner Draw · 2 min',()=>doAction('draw',{cents:amount()})));
 accounts.appendChild(button('Take Cash Without Entry · 2 min',()=>doAction('unrecordedDraw',{cents:amount()})));
 accounts.appendChild(button('Count Till Against Book · 10 min',()=>doAction('audit')));
 const audit=document.createElement('p');
 audit.textContent=s.lastAudit?'Last count '+s.lastAudit.date+': '+(s.lastAudit.differenceCents<0?'short ':s.lastAudit.differenceCents>0?'over ':'balanced ')+fmt(Math.abs(s.lastAudit.differenceCents))+'. A shortfall is not proof of who caused it.':'No till audit performed yet.';
 accounts.appendChild(audit);
 const log=document.createElement('ol');log.setAttribute('aria-label','Recent shop transactions');
 for(const e of s.ledger.slice(-10).reverse()){const li=document.createElement('li');li.textContent=e.date+' · '+e.label;log.appendChild(li)}
 accounts.appendChild(log);
}
root.FE_CROWE_BUTCHERY_UI=Object.freeze({refresh});
})();
