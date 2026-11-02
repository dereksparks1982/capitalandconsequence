/* Physical Federal Electric factory freight manifest controls.
 * Added within the Rail Editor finance panel, not a second railway map.
 */
(function(root){
'use strict';
const freight=root.FE_RAIL_FREIGHT;
if(!freight)throw Error('Physical rail freight module must load first.');
const $=id=>document.getElementById(id);
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function mount(){
 const parent=$('railCompanyPanel');if(!parent||$('railFreightPanel'))return;
 const pane=el('section');pane.id='railFreightPanel';
 pane.setAttribute('aria-label','Federal Electric real freight consignments');
 pane.innerHTML='<h4>Factory Cargo · Genuine Goods</h4>'+
 '<p>Cart actual completed components from the factory warehouse, dispatch on an owned paid line, then register them at the destination depot after arrival. This is an internal transfer, not a sale.</p>'+
 '<div id="railFreightOptions"></div><div id="railFreightManifests"></div>'+
 '<p id="railFreightNotice" role="status" aria-live="polite"></p>';
 parent.appendChild(pane);
 pane.addEventListener('click',e=>{
  const b=e.target.closest('[data-freight-action]');
  if(!b||b.disabled||typeof S==='undefined')return;
  const action=b.dataset.freightAction,where=root.FE_WASHINGTON_TIME?.now?.(S);
  const args={action,date:where?.date||S.gameDate};
  if(action==='load'){
   args.lineId=$('railFreightLine')?.value;
   args.productId=$('railFreightProduct')?.value;
   args.quantity=Number($('railFreightQty')?.value);
  }else args.manifestId=b.dataset.manifestId;
  const pre=freight.preflight(S,args);
  if(!pre.ok){$('railFreightNotice').textContent=pre.reason;return;}
  b.disabled=true;
  const elapsed=root.advanceWorldTime(pre.seconds,true);
  if(elapsed!==pre.seconds){$('railFreightNotice').textContent='Freight work interrupted; no inventory or money transferred.';render();return;}
  const seq=(S.railFreightReceiptSequence||0)+1;
  const receipt=freight.transact(S,{...args,token:'railfreight:'+seq,spentSeconds:elapsed});
  if(receipt.ok&&!receipt.repeated){S.railFreightReceiptSequence=seq;save(true);}
  $('railFreightNotice').textContent=receipt.ok?receipt.description:receipt.reason;
  render();root.FE_RAIL_COMPANY_UI?.render?.();
 });
}
function select(id,options){
 const input=el('select');input.id=id;
 for(const [value,text] of options){const opt=el('option',text);opt.value=value;input.appendChild(opt);}
 return input;
}
function render(){
 if(typeof document==='undefined'||typeof S==='undefined')return;
 mount();
 const host=$('railFreightOptions');if(!host)return;
 const company=root.FE_RAIL_COMPANY?.read?.(S),works=root.FE_COMPONENT_WORKS;
 const lines=company?.lines?.filter(x=>x.status==='open')||[];
 const products=Object.entries(works?.PRODUCTS||{}).filter(([id])=>
  Number.isSafeInteger(S.componentWorks?.warehouse?.[id])&&S.componentWorks.warehouse[id]>0);
 host.replaceChildren();
 if(lines.length&&products.length){
  const line=select('railFreightLine',lines.map(x=>[x.id,x.stations.map(s=>s.name).join(' to ')]));
  const sku=select('railFreightProduct',products.map(([id,p])=>[id,p.name+' · '+S.componentWorks.warehouse[id]+' finished units']));
  const count=select('railFreightQty',[[1,'1 unit'],[5,'5 units'],[10,'10 units'],[25,'25 units']]);
  const b=el('button','Cart stock to railway platform · 30 min');b.dataset.freightAction='load';
  function update(){
   const q=freight.preflight(S,{action:'load',lineId:line.value,productId:sku.value,quantity:Number(count.value),
    date:root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate});
   b.disabled=!q.ok;b.title=q.ok?'Cost $'+(q.costCents/100).toFixed(2):q.reason;
  }
  for(const selector of [line,sku,count])selector.addEventListener('change',update);
  host.append(el('p','Choose a completed railway line, finished factory item and number of pieces.'),
   line,sku,count,b);update();
 }else host.textContent='Complete and own a railway line, and manufacture actual stock, before booking freight.';
 const list=$('railFreightManifests');list.replaceChildren();
 const data=freight.manifests(S);
 for(const item of data.slice(-20).reverse()){
  const row=el('p',item.id+' · '+item.quantity+' '+item.productId+' · '+
   item.destinationName+' · '+item.status+' · $0 customer revenue. ');
  if(item.status==='in-transit'){
   const b=el('button','Receive verified depot delivery · 10 min');
   b.dataset.freightAction='receive';b.dataset.manifestId=item.id;
   const p=freight.preflight(S,{action:'receive',manifestId:item.id,
    date:root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate});
   b.disabled=!p.ok;b.title=p.reason||'';
   row.appendChild(b);
  }
  list.appendChild(row);
 }
 if(!data.length)list.textContent='No factory freight has been loaded yet.';
}
root.FE_RAIL_FREIGHT_UI=Object.freeze({mount,render});
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{mount();render()},{once:true});
 else {mount();render();}
}
})(typeof window!=='undefined'?window:globalThis);
