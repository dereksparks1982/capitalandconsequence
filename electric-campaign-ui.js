/* Federal Electric 1878 streetlighting, bulb R&D and Fair contract controls.
 * Added within the existing Component Works tab. No overlay/map redesign.
 */
(function(root){
'use strict';
const engine=root.FE_ELECTRIC_CAMPAIGN;
if(!engine)throw Error('Electric campaign engine must load before its controls');
function setup(){
 const workshop=document.getElementById('componentWorkshop');
 if(!workshop||document.getElementById('electricCampaignPanel'))return;
 const section=document.createElement('section');
 section.id='electricCampaignPanel';section.className='sheet electric-contracts';
 section.setAttribute('aria-label','Municipal electric contracts and incandescent lamp development');
 section.innerHTML=[
 '<h3>Washington Electricity · 1878</h3>',
 '<p>The District already has electric power. Federal Electric begins with electrical components; the streetlighting improvement tender comes first, then laboratory bulbs and the late-year World’s Fair.</p>',
 '<p id="ecStatus" role="status"></p>',
 '<section><h4>1 · District streetlighting tender</h4>',
 '<p>50 light sites in the provisional campaign scenario. Each site needs one finished insulated wire, switch contact and insulator. The District pays only after physical Saturday dispatch and weekday inspection. Rival electrical firms bid independently.</p>',
 '<p id="ecStreet"></p>',
 '<label>Bid per site <select id="ecStreetPrice"><option value="1450">$14.50 · low margin</option><option value="1650" selected>$16.50 · competitive</option><option value="1850">$18.50 · premium</option></select></label>',
 '<button type="button" data-electric-action="street-bid">Submit competitive tender · 30 min, $10 fee</button>',
 '<label>Streetlight sites <input id="ecStreetQuantity" type="number" min="1" max="10" value="5"></label>',
 '<button type="button" data-electric-action="street-dispatch">Dispatch actual component sets · Saturday, 15 min</button>',
 '<button type="button" data-electric-action="street-certify">Confirm installation and invoice · weekday, 90 min</button></section>',
 '<section><h4>2 · Experimental incandescent lamps</h4>',
 '<p id="ecResearch"></p>',
 '<button type="button" data-electric-action="research">Attempt next research stage · time and material cost</button>',
 '<button type="button" data-electric-action="license">Secure lamp-making rights · $90, 60 min</button>',
 '<button type="button" data-electric-action="prototype-line">Fit prototype vacuum/glass station · $225, 240 min</button>',
 '<button type="button" data-electric-action="hire-crew">Hire two specialist lamp workers · $50, 120 min</button>',
 '<button type="button" data-electric-action="upgrade-line">Install staffed batch-production line · $650, 360 min</button>',
 '<p>After the prototype bench opens, choose <strong>Experimental incandescent lamps</strong> in the regular customer-order form. Assemble them through the same material bins, clock and warehouse. Faulty bulbs consume materials and never enter finished inventory. Specialist wages settle every Saturday.</p></section>',
 '<section><h4>3 · Late-1878 World’s Fair electrical supply</h4>',
 '<p id="ecFair"></p>',
 '<label>Bid per proven bulb <select id="ecFairPrice"><option value="240">$2.40 · low margin</option><option value="285" selected>$2.85 · competitive</option><option value="330">$3.30 · premium</option></select></label>',
 '<button type="button" data-electric-action="fair-bid">Bid for 100 tested bulbs · 30 min, $15 fee</button>',
 '<label>Finished bulbs <input id="ecFairQuantity" type="number" min="1" max="25" value="10"></label>',
 '<button type="button" data-electric-action="fair-dispatch">Ship real bulbs to the Fair · Saturday, 20 min</button>',
 '<p>The Fair exists whether Charles wins or loses. The proposed October 1 eligibility date is not an official opening ceremony.</p></section>',
 '<p id="ecMessage" role="status" aria-live="polite"></p>'
 ].join('');
 workshop.appendChild(section);
 section.addEventListener('click',event=>{
  const button=event.target.closest('[data-electric-action]');
  if(!button||button.disabled||!root.FE_WASHINGTON_TIME||typeof S==='undefined'||!S.componentWorks)return;
  const kind=button.dataset.electricAction,qty=Number(document.getElementById(kind==='fair-dispatch'?'ecFairQuantity':'ecStreetQuantity')?.value);
  const price=Number(document.getElementById(kind==='fair-bid'?'ecFairPrice':'ecStreetPrice')?.value);
  const details={quantity:qty,priceCents:price};
  const sequence=(S.componentTransactionSequence||0)+1,token='cw:'+String(sequence);
  button.disabled=true;
  try{
   const result=engine.transact(S,kind,details,token,
    (seconds,away)=>root.advanceWorkshopTime(seconds,away),()=>{
     // Preserve the action token in the 5 PM autosave before daily settlement.
     S.componentTransactionSequence=Math.max(S.componentTransactionSequence||0,sequence);
     return root.finishWorkshopClosingBell();
    });
   const message=section.querySelector('#ecMessage');
   message.textContent=result.ok?result.message:result.reason;
   if(result.ok&&!result.repeated){
    S.componentTransactionSequence=sequence;
    save(true);
   }
   render();
  }catch(error){
   section.querySelector('#ecMessage').textContent='Electric workshop action failed: '+String(error.message||error).slice(0,170);
  }finally{render()}
 });
}
function render(){
 if(typeof document==='undefined'||typeof S==='undefined')return;
 setup();
 const panel=document.getElementById('electricCampaignPanel');
 if(!panel)return;
 const active=!!S.componentWorks&&S.characterRoute==='industrialist';
 panel.hidden=!active;
 if(!active)return;
 const e=engine.read(S),st=e.street,lab=e.lamps,f=e.fair,stock=S.componentWorks.warehouse;
 const clock=root.FE_WASHINGTON_TIME?.now?.(S),day=clock?.date||S.gameDate;
 const week=new Date(day+'T12:00:00Z').getUTCDay();
 const workshop=S.currentLocation?.locationId==='factory'&&S.phase==='day'&&!S.paused&&!S.workshopOperations?.hold;
 panel.querySelector('#ecStatus').textContent='Game date '+day+' · '+(workshop?'At Federal Electric':'Visit Federal Electric to transact')+
  ' · Working stock: '+(stock['insulated-wire']||0)+' wires, '+(stock['switch-contact']||0)+
  ' contacts, '+(stock.insulator||0)+' insulators, '+(stock['incandescent-lamp']||0)+' accepted lamps.';
 panel.querySelector('#ecStreet').textContent='Tender '+st.status+' · dispatched '+st.shipped+'/'+st.sites+
  ' · inspected and paid '+st.certified+'/'+st.sites+' · contract deadline '+(st.deadline||'1878-09-30')+
  (st.rivalBidCents!=null?' · rival price $'+(st.rivalBidCents/100).toFixed(2):'');
 const step=engine.RESEARCH[lab.stage];
 const development=S.componentWorks.lampDevelopment||{};
 panel.querySelector('#ecResearch').textContent='Lab stages '+lab.stage+'/'+engine.RESEARCH.length+
  (step?' · Next: '+step.name+' · '+step.minutes+' min · $'+(step.costCents/100).toFixed(2)+
   ' + '+Object.entries(step.materials).map(([id,qty])=>qty+' '+id).join(', '):' · all experimental stages recorded')+
  ' · Rights '+(lab.license?'secured':'missing')+' · Prototype bench '+(lab.prototype?'installed':'missing')+
  ' · Specialist crew '+lab.crew+' · Batch line '+(lab.upgraded?'running':'not installed')+
  ' · sound bulbs '+(development.good||0)+' · scrapped '+(development.rejected||0)+
  ' · outstanding specialist wages $'+(e.payroll.owedCents/100).toFixed(2)+'.';
 panel.querySelector('#ecFair').textContent='Fair supply contract '+f.status+' · shipment deadline 1878-12-31'+
  ' · bulbs physically dispatched '+f.shipped+'/'+f.bulbs+
  (f.rivalBidCents!=null?' · rival bulb price $'+(f.rivalBidCents/100).toFixed(2):'');
 for(const button of panel.querySelectorAll('[data-electric-action]')){
  const kind=button.dataset.electricAction;
  let eligible=workshop;
  if(kind.endsWith('dispatch'))eligible=eligible&&week===6;
  else eligible=eligible&&week!==0&&week!==6;
  if(kind==='street-bid')eligible=eligible&&st.status==='open'&&day>='1878-02-01'&&day<='1878-06-30';
  if(kind==='street-dispatch')eligible=eligible&&(st.status==='awarded'||st.status==='in-progress');
  if(kind==='street-certify')eligible=eligible&&(st.status==='awarded'||st.status==='in-progress')&&st.shipped>st.certified;
  if(kind==='research')eligible=eligible&&lab.stage<engine.RESEARCH.length&&st.status!=='open'&&day>='1878-03-01';
  if(kind==='license')eligible=eligible&&lab.stage===engine.RESEARCH.length&&!lab.license;
  if(kind==='prototype-line')eligible=eligible&&lab.license&&!lab.prototype;
  if(kind==='hire-crew')eligible=eligible&&lab.prototype&&!lab.crew;
  if(kind==='upgrade-line')eligible=eligible&&lab.crew>=2&&!lab.upgraded&&(development.good||0)>=3;
  if(kind==='fair-bid')eligible=eligible&&day>='1878-08-01'&&day<='1878-11-30'&&f.status==='not-open'&&lab.upgraded&&(development.good||0)>=5;
  if(kind==='fair-dispatch')eligible=eligible&&day>='1878-10-01'&&(f.status==='awarded'||f.status==='in-progress');
  button.disabled=!eligible;
  if(!eligible)button.title='The contract, materials, workshop shift, qualification or calendar date does not allow this action yet.';
  else button.removeAttribute('title');
 }
}
root.FE_ELECTRIC_CAMPAIGN_UI=Object.freeze({render});
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
 else render();
}
})(typeof window!=='undefined'?window:globalThis);
