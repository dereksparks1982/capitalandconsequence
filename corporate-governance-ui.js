/* Federal Electric corporate papers and stockbroker underwriting desk. No map geometry changes. */
(function(root){
'use strict';
const get=id=>document.getElementById(id);
const $=n=>'$'+Number(n||0).toFixed(2);
const corp=()=>root.FE_CORPORATE;
const context=()=>root.FE_CORPORATE_CONTEXT?.();
let latestResult='';
function node(tag,text){const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);return e;}
function button(text,handler,enabled=true){
 const el=node('button',text);el.type='button';el.disabled=!enabled;el.addEventListener('click',handler);return el;
}
function label(text,input){const e=node('label');e.append(document.createTextNode(text+' '),input);return e;}
function selection(options){const s=node('select');for(const [value,title] of options){const o=node('option',title);o.value=value;s.appendChild(o)}return s;}
function numeric(value,min,max,step=1){const n=node('input');n.type='number';n.min=String(min);n.max=String(max);n.step=String(step);n.value=String(value);return n;}
function message(host,text){const p=node('p',text);p.className='fine';p.setAttribute('role','status');host.appendChild(p);return p;}
function perform(name,fn){
 const ctx=context(),api=corp();if(!ctx?.save||!api)return;
 const token='corp:'+name+':'+api.ensure(ctx.save).nextId;
 const seconds=name.startsWith('offer')||name.startsWith('tender')||name.startsWith('squeeze')?900:
   name.startsWith('elect')||name.startsWith('charter')?600:300;
 if(!root.FE_WASHINGTON_TIME?.canSpend?.(ctx.save,seconds)){
  ctx.finish({ok:false,reason:'Not enough Washington business time remains to complete these corporate papers.'});return;
 }
 let result;
 try{result=fn(ctx.save,token,api)}catch(err){result={ok:false,reason:err.message}}
 if(result?.ok){
  const elapsed=root.advanceWorldTime?.(seconds,true);
  if(elapsed!==seconds)result={...result,message:result.message+' The corporate record was saved, but the clock could not complete the expected interval.'};
 }
 latestResult=result?.message||result?.reason||'Corporate instructions not completed.';
 ctx.finish(result);
}
function desk(){
 const host=get('ipoScaffold'),ctx=context(),api=corp();
 if(!host||!ctx?.save||!api)return;
 const save=ctx.save,c=api.ensure(save),own=api.ownership(save);
 host.replaceChildren();
 const head=node('div');head.className='ipo-scaffold-head';
 head.append(node('h4','Federal Electric · Corporate Affairs'),button('Close',()=>get('exploreIpo')?.click()));
 host.appendChild(head);
 message(host,'Charter: '+c.status.toUpperCase()+' · President: '+(c.president==='charles'?'Charles Whitcomb':'Edwin Harlow')+
  ' · Ownership: '+own.founderPercent.toFixed(2)+'% of '+own.issued.toLocaleString()+' shares ('+own.founder.toLocaleString()+' held).');
 message(host,c.status==='private'?'Private sole ownership: incorporate at the factory before issuing public securities.':
  c.status==='chartered'?'Board approval and a physical underwriter visit precede a public offering.':
  'Ticker FEC trades through the broker. Share ownership and the presidency are separate.');
 const actions=node('div');actions.className='trade-buttons';
 if(c.status==='private'){
  actions.appendChild(button('Incorporate · $75',()=>perform('charter',(s,t,a)=>a.incorporate(s,t)),save.characterRoute==='industrialist'));
 }else{
  actions.appendChild(button('Board Vote: Approve IPO',()=>perform('ipo-vote',(s,t,a)=>a.vote(s,'ipo',t)),c.status==='chartered'));
  actions.appendChild(button('Board Vote: Dividend',()=>perform('dividend',(s,t,a)=>a.vote(s,'dividend',t)),c.status==='public'));
  actions.appendChild(button('Board Vote: Restore Charles',()=>perform('reinstate',(s,t,a)=>a.vote(s,'reinstate',t)),c.president!=='charles'));
 }
 host.appendChild(actions);
 if(c.directors.length){
  host.append(node('h5','Board of Directors'));
  const roster=node('div');
  for(const d of c.directors){
   const line=node('p',d.name+' · '+d.temperament+' · relationship '+d.loyalty+'/100');
   line.className='fine';roster.appendChild(line);
   if(d.id!=='charles')roster.append(button('Meet '+d.name+' · $25',()=>perform('lobby-'+d.id,(s,t,a)=>a.lobby(s,d.id,t))));
  }host.appendChild(roster);
  const elected=c.directors.filter(d=>d.id!=='charles');
  const replace=selection(elected.map((d,i)=>[String(i+1),d.name]));
  const candidates=selection(api.PEOPLE.filter(p=>!c.directors.some(d=>d.id===p.id)).map(p=>[p.id,p.name]));
  const election=node('div');election.className='trade-buttons';election.append(label('Replace director',replace),label('Candidate',candidates),
    button('Hold Shareholder Election',()=>perform('elect',(s,t,a)=>a.appoint(s,candidates.value,Number(replace.value),t)),!!candidates.options.length));
  host.appendChild(election);
 }
 if(c.bid){
  const status=c.bid.active?'HOSTILE ACQUISITION IN PROGRESS':(c.bid.outcome||'closed');
  message(host,status+' · Rival voting stake '+own.rivalPercent.toFixed(2)+'% · Financial backer: '+c.bid.financing+'.');
 }
 if(c.acquisitions.length){
  host.append(node('h5','Controlled Companies'));
  for(const a of c.acquisitions){
   message(host,a.ticker+' · '+a.ownershipPercent+'% · '+a.status+' · acquisition debt '+$(a.debtCents/100));
  }
 }
 if(c.events.length){
  host.append(node('h5','Corporate Minute Book'));
  for(const event of c.events.slice(-6).reverse())message(host,event.date+' · '+event.message);
 }
}
function broker(){
 const panel=get('cityRoomBrokerage'),ctx=context(),api=corp();
 if(!panel||!ctx?.save||!api)return;
 let host=get('brokerCorporateAffairs');
 if(!host){host=node('section');host.id='brokerCorporateAffairs';host.className='broker-quotation-sheet';panel.appendChild(host);}
 host.replaceChildren();
 const save=ctx.save,c=api.ensure(save),own=api.ownership(save);
 host.append(node('h4','Federal Electric · Underwriting & Corporate Control'));
 if(latestResult)message(host,latestResult);
 message(host,'Current state: '+c.status.toUpperCase()+' · FEC ownership '+own.founderPercent+'% · '+own.public+' public shares · '+own.rival+' held by hostile interests.');
 if(save.characterRoute!=='industrialist'){
  message(host,'These company instructions belong to Charles Whitcomb. Other careers can trade ordinary securities.');
  return;
 }
 if(c.status==='chartered'){
  const price=api.quote(save);
  const newQty=numeric(3000,500,10000),oldQty=numeric(500,0,c.founderShares);
  const offer=numeric(Math.max(1,price.priceCents/100),1,25,.01);
  const controls=node('div');controls.className='trade-buttons';
  controls.append(label('New company shares',newQty),label('Existing founder shares',oldQty),label('Offer price per share ($)',offer));
  controls.append(button('Arrange Federal Electric IPO',()=>perform('offer',(s,t,a)=>a.listing(s,Number(newQty.value),Number(oldQty.value),Math.round(Number(offer.value)*100),t)),!!c.authorizations.ipo));
  host.appendChild(controls);
  message(host,'An IPO requires 4 closed business records, reputation 50+, $750 operating cash and two broker visits. The board must approve. New issues pay Federal Electric, founder sales pay Charlie; the underwriter charges 5%.');
 }
 if(c.status==='public'){
  const controls=node('div');controls.className='trade-buttons';
  controls.append(button('Solicit Shareholder Proxies · $100',()=>perform('proxy',(s,t,a)=>a.proxy(s,t))));
  if(c.bid?.active)controls.append(button('Defend Against Takeover · $150',()=>perform('defense',(s,t,a)=>a.counterBid(s,t))));
  host.appendChild(controls);
 }
 const targets=Object.entries(save.stocks||{}).filter(([id,v])=>id!=='FEC'&&v.issuedShares&&v.price>0&&Array.isArray(v.history)&&v.history.length>0);
 if(c.status!=='private'&&targets.length){
  host.append(node('h5','Acquire a Rival Company'));
  const target=selection(targets.map(([id,v])=>[id,id+' · '+v.name]));
  const leverage=numeric(0,0,70,5),controls=node('div');controls.className='trade-buttons';
  controls.append(label('Target security',target),label('Borrowed portion (%)',leverage));
  controls.append(button('Tender for 51% Control',()=>perform('tender',(s,t,a)=>a.tender(s,target.value,Number(leverage.value),t))));
  host.appendChild(controls);
  message(host,'Tender offered at a 15% premium. Personal equity is paid immediately; debt remains attached to the purchased business. Excessive leverage creates exposure.');
 }
 if(c.acquisitions.length){
  host.append(node('h5','Minority Buyouts'));
  for(const a of c.acquisitions){
   const row=node('div');row.className='trade-buttons';
   row.append(node('span',a.ticker+' · '+a.ownershipPercent+'% controlled · debt '+$(a.debtCents/100)));
   if(a.debtCents>0&&a.status!=='foreclosed')row.append(button('Repay Up to $100',()=>perform('repay-'+a.ticker,(s,t,x)=>x.repayDebt(s,a.ticker,10000,t))));
   if(a.status==='controlled'){
    row.append(button('Tender to 75% · 50% Loan',()=>perform('tender75-'+a.ticker,(s,t,x)=>x.increaseStake(s,a.ticker,75,50,t)),a.ownershipPercent<75));
    row.append(button('Tender to 90% · 50% Loan',()=>perform('tender90-'+a.ticker,(s,t,x)=>x.increaseStake(s,a.ticker,90,50,t)),a.ownershipPercent<90));
   }
   row.append(button('Buy Out Remaining Holders',()=>perform('squeeze-'+a.ticker,(s,t,x)=>x.squeezeOut(s,a.ticker,t)),a.status==='controlled'&&a.ownershipPercent>=90));
   host.appendChild(row);
  }
 }
 if(c.events.length){
  host.append(node('h5','Latest Corporate Notices'));
  for(const event of c.events.slice(-4).reverse())message(host,event.date+' · '+event.message);
 }
}
const api=Object.freeze({desk,broker});
root.FE_CORPORATE_UI=api;
})(typeof window!=='undefined'?window:globalThis);
