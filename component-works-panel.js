/* 1878 Component Workshop UI. The founding workshop is authoritative. */
(function(root){
 'use strict';
 const engine=root.FE_COMPONENT_WORKS,live=root.FE_COMPONENT_LIVE;
 if(!engine||!live)throw Error('Component workshop requires its two engines');
 function setup(){
  if(document.getElementById('componentWorkshop'))return;
  const factory=document.getElementById('factory');if(!factory)return;
  const panel=document.createElement('section');
  panel.id='componentWorkshop';panel.className='sheet component-workshop';
  panel.innerHTML='<h3>Federal Electric · 1878 Component Works</h3><p>Telegraph apparatus and electrical components. Incandescent lamps are not yet available.</p>'+
   '<p id="componentBalance"></p><p id="componentStaff"></p>'+
   '<form id="cwOrder"><h4>Accept a customer order</h4><label>Customer <select name="customer"></select></label><label>Product <select name="productId"></select></label><label>Units <input type="number" name="quantity" min="1" max="1000" value="4" required></label><button type="submit">Accept order · 5 min</button></form>'+
   '<form id="cwBuy"><h4>Buy stock</h4><label>Material <select name="materialId"></select></label><label>Units <input type="number" name="quantity" min="1" max="1000" value="20" required></label><button type="submit">Buy materials · 5 min</button></form>'+
   '<form id="cwAssemble"><h4>Assemble goods</h4><label>Order <select name="orderId"></select></label><label>Units <input type="number" name="quantity" min="1" max="1000" value="1" required></label><button type="submit">Assemble · real work minutes</button></form>'+
   '<form id="cwShip"><h4>Ship finished goods</h4><label>Order <select name="orderId"></select></label><label>Units <input type="number" name="quantity" min="1" max="1000" value="1" required></label><button type="submit">Ship · 15 min</button></form>'+
   '<p id="cwMessage" role="status" aria-live="polite"></p><h4>Component order register</h4><div id="cwOrders"></div>';
  factory.insertBefore(panel,factory.children[1]||null);
  for(const id of ['warehouse','contracts']){
   const tab=document.getElementById(id);if(!tab)continue;
   const notice=document.createElement('p');notice.className='component-era-notice sheet';
   notice.textContent='Component inventory, orders, workshop assembly and shipping are in Factory → Component Works. The previous bulb-era records are not used in 1878.';
   tab.insertBefore(notice,tab.children[1]||null);
  }
  function choices(form,field,items){
   const sel=panel.querySelector('#'+form+' [name="'+field+'"]');
   for(const [key,label] of items){const opt=document.createElement('option');opt.value=key;opt.textContent=label;sel.appendChild(opt)}
  }
  choices('cwOrder','customer',engine.CUSTOMERS.map(n=>[n,n]));
  choices('cwOrder','productId',Object.entries(engine.PRODUCTS).filter(([k])=>k!=='incandescent-lamp').map(([k,v])=>[k,v.name]));
  choices('cwBuy','materialId',Object.entries(engine.MATERIALS).map(([k,v])=>[k,v.name]));
  for(const [formId,kind] of Object.entries({cwOrder:'order',cwBuy:'purchase',cwAssemble:'assemble',cwShip:'ship'})){
   panel.querySelector('#'+formId).addEventListener('submit',ev=>{
    ev.preventDefault();
    if(typeof S==='undefined'||!S.componentWorks||S.characterRoute!=='industrialist')return;
    const form=ev.currentTarget,btn=form.querySelector('button');
    if(btn.disabled)return;
    const fd=new FormData(form),quantity=Number(fd.get('quantity'));
    if(!Number.isSafeInteger(quantity)||quantity<1||quantity>1000){
     panel.querySelector('#cwMessage').textContent='Quantity must be between 1 and 1000';return
    }
    const details={quantity};
    if(kind==='order'){
     details.customer=fd.get('customer');details.productId=fd.get('productId');
     const iso=root.FE_WASHINGTON_TIME?.now?.(S)?.date;
     if(!iso){panel.querySelector('#cwMessage').textContent='Game date unavailable';return}
     const d=new Date(iso+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+30);
     details.deadline=d.toISOString().slice(0,10);
    }
    if(kind==='purchase')details.materialId=fd.get('materialId');
    if(kind==='assemble'||kind==='ship')details.orderId=fd.get('orderId');
    btn.disabled=true;
    try{
     const token='cw:'+String((S.componentTransactionSequence||0)+1);
     const result=live.transact(S,kind,details,token,(sec,away)=>root.advanceWorldTime(sec,away));
     panel.querySelector('#cwMessage').textContent=result.ok?
      'Recorded '+kind+'. '+result.elapsedSeconds/60+' game minutes elapsed.':result.reason||'Transaction refused';
     if(result.ok&&!result.repeated){S.componentTransactionSequence=(S.componentTransactionSequence||0)+1;save(true)}
     render();
    }catch(err){panel.querySelector('#cwMessage').textContent='Workshop action failed: '+String(err.message||err).slice(0,150)}
    finally{btn.disabled=false}
   });
  }
 }
 function renderPanel(){
  if(typeof document==='undefined'||typeof S==='undefined')return;
  setup();
  const active=!!S.componentWorks;document.body.classList.toggle('component-era',active);
  if(!active)return;
  const state=engine.verify(S.componentWorks),panel=document.getElementById('componentWorkshop');
  if(!panel)return;
  panel.querySelector('#componentBalance').textContent='Company balance: $'+S.companyCash.toFixed(2)+
   ' · Workstations: '+state.stations.bench+' bench, '+state.stations.winder+' winder · Materials: '+
   Object.entries(state.materials).map(([k,v])=>k+' '+v).join(', ');
  const assistant=S.npcSimulation?.agents?.foremanSullivan;
  const unpaid=S.workshopPayroll?.owedCents||0;
  panel.querySelector('#componentStaff').textContent='Staff: Charlie Whitcomb (owner, working) + Sullivan (one paid assistant) · assistant wage $1.00 per worked day'+
   (unpaid?' · outstanding wages $'+(unpaid/100).toFixed(2):'')+
   (assistant?.status==='present'&&assistant.locationId==='factory'?' · assistant at the works':' · assistant not currently at the works');
  const out=panel.querySelector('#cwOrders');out.replaceChildren();
  if(!state.orders.length)out.textContent='No component orders accepted yet.';
  for(const o of state.orders){
   const p=document.createElement('p');
   p.textContent=o.id+' · '+engine.PRODUCTS[o.productId].name+' · '+o.customer+
    ' · '+o.made+' assembled · '+o.delivered+'/'+o.quantity+' shipped · deadline '+o.deadline;
   out.appendChild(p);
  }
  for(const [id,filter] of [['cwAssemble',o=>o.made<o.quantity],['cwShip',o=>o.delivered<o.quantity]]){
   const sel=panel.querySelector('#'+id+' [name="orderId"]'),previous=sel.value;
   sel.replaceChildren();
   const accepted=state.orders.filter(filter);
   for(const o of accepted){
    const option=document.createElement('option');option.value=o.id;option.textContent=o.id+' · '+engine.PRODUCTS[o.productId].name;
    sel.appendChild(option)
   }
   if(accepted.some(o=>o.id===previous))sel.value=previous;
  }
  const allowed=S.characterRoute==='industrialist'&&!S.paused&&S.phase==='day';
  panel.querySelectorAll('button').forEach(b=>b.disabled=!allowed);
 }
 root.FE_COMPONENT_PANEL=Object.freeze({render:renderPanel});
 if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderPanel,{once:true});
  else renderPanel();
 }
})(typeof window!=='undefined'?window:globalThis);
