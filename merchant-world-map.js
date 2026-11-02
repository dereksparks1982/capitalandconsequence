/* Interactive merchant map. Original EcoClipper bitmap is unchanged.
 * Ships, port markers, saved owner annotations and generic harbor scenes are overlays.
 * Operations delegate to the original industrial merchant fleet economy.
 */
(function(root){
'use strict';
const nav=typeof module==='object'&&module.exports?require('./merchant-navigation.js'):root.FE_MERCHANT_NAV;
const regions=typeof module==='object'&&module.exports?require('./merchant-regions.js'):root.FE_MERCHANT_REGIONS;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cash=v=>'$'+(Number(v)||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
let host=null,session=null,ticker=null;
const action=(key,label)=>'<button type="button" data-ocean-action="'+esc(key)+'">'+esc(label)+'</button>';
function ensuredHost(){
 if(host)return host;
 host=document.createElement('section');host.id='merchantWorldViewer';host.className='merchant-world-viewer';
 host.hidden=true;host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.setAttribute('aria-labelledby','merchantWorldHeading');
 document.body.appendChild(host);
 host.addEventListener('click',onClick);
 host.addEventListener('change',onChange);
 host.addEventListener('keydown',onKey);
 host.addEventListener('pointerdown',onPointerDown);
 host.addEventListener('pointermove',onPointerMove);
 host.addEventListener('pointerup',onPointerUp);
 host.addEventListener('pointercancel',onPointerUp);
 host.addEventListener('contextmenu',e=>{if(e.target.closest('.merchant-world-viewport'))e.preventDefault()});
 host.addEventListener('wheel',onWheel,{passive:false});
 host.addEventListener('click',e=>{if(e.target===host)close()});
 return host;
}
function fleet(){return root.FE_EMPIRE.ensure(session.save).fleet}
function state(){return regions.ensure(session.save)}
function selectedShip(){return fleet().ships.find(s=>String(s.id)===String(session.shipId))}
function setStatus(message){const el=host?.querySelector('#merchantWorldStatus');if(el)el.textContent=message}
function open(save,onChange){
 if(save?.characterRoute!=='industrialist'||!root.FE_EMPIRE||!nav||!regions)return false;
 if(!session||session.save!==save)session={save,onChange,selection:{type:'port',id:'Baltimore'},mode:'inspect',
  shipId:null,scene:null,zone:'quay',scale:1,x:0,y:0,drag:null,ready:false,focus:null};
 else session.onChange=onChange;
 session.focus=document.activeElement;
 session.ready=false;
 ensuredHost();host.hidden=false;
 document.body.classList.add('merchant-world-open');
 draw(true);
 if(ticker!==null)root.clearInterval(ticker);
 ticker=root.setInterval(()=>{
  if(host?.hidden||!session)return;
  const overlay=host.querySelector('svg.merchant-world-overlays');
  if(overlay)overlay.outerHTML=plot(); // display-only; no time or money advanced
 },2500);
 host.querySelector('[data-ocean-action="close"]')?.focus();
 return true;
}
function close(){
 if(!host||host.hidden)return;
 persistView();
 host.hidden=true;document.body.classList.remove('merchant-world-open');
 if(ticker!==null){root.clearInterval(ticker);ticker=null}
 session?.focus?.focus?.();
}
function persistView(){
 if(!host||host.hidden||!session?.ready)return;
 const vp=host.querySelector('.merchant-world-viewport');if(!vp)return;
 const fit=Math.max(.25,Math.min((vp.clientWidth-12)/800,(vp.clientHeight-12)/600));
 const view=state().view;
 view.zoom=Math.round(session.scale/fit*10000)/10000;
 view.cx=Math.max(0,Math.min(800,(vp.clientWidth/2-session.x)/session.scale));
 view.cy=Math.max(0,Math.min(600,(vp.clientHeight/2-session.y)/session.scale));
 session.onChange?.();
}
function resize(first=false){
 if(!session||!host||host.hidden)return;
 const vp=host.querySelector('.merchant-world-viewport'),stage=host.querySelector('.merchant-world-stage');
 if(!vp||!stage)return;
 if(!session.ready||first){
  const restore=!session.ready,fit=Math.max(.25,Math.min((vp.clientWidth-12)/800,(vp.clientHeight-12)/600));
  session.scale=fit;session.x=(vp.clientWidth-800*fit)/2;
  session.y=(vp.clientHeight-600*fit)/2;
  const view=state().view;
  if(restore&&Number.isFinite(view.zoom)&&view.zoom>0&&Number.isFinite(view.cx)&&Number.isFinite(view.cy)){
   session.scale=Math.max(.3,Math.min(3.5,fit*view.zoom));
   session.x=vp.clientWidth/2-view.cx*session.scale;
   session.y=vp.clientHeight/2-view.cy*session.scale;
  }
  session.ready=true;
 }
 stage.style.transform='translate('+session.x+'px,'+session.y+'px) scale('+session.scale+')';
 host.querySelector('#merchantWorldZoom')?.replaceChildren(document.createTextNode(Math.round(session.scale*100)+'%'));
}
function zoom(factor,clientX,clientY){
 const vp=host?.querySelector('.merchant-world-viewport');if(!vp)return;
 const rect=vp.getBoundingClientRect();
 const px=Number.isFinite(clientX)?clientX-rect.left:vp.clientWidth/2;
 const py=Number.isFinite(clientY)?clientY-rect.top:vp.clientHeight/2;
 const old=session.scale,next=Math.max(.3,Math.min(3.5,old*factor));
 session.x=px-(px-session.x)*next/old;session.y=py-(py-session.y)*next/old;
 session.scale=next;resize();
}
function plot(){
 const e=fleet(),m=state();
 let svg='<svg class="merchant-world-overlays" viewBox="0 0 800 600" role="group" aria-label="Chart ports, owned vessels and personal map pins">';
 if(session.quote?.ok&&Array.isArray(session.quote.points)){
  svg+='<polyline class="ocean-quoted-route" points="'+session.quote.points.map(p=>p.join(',')).join(' ')+'"><title>Proposed voyage from '+esc(session.quote.from)+' to '+esc(session.quote.to)+'</title></polyline>';
 }
 for(const ship of e.ships){
  if(ship.status!=='at-sea'||!ship.trip)continue;
  const line=ship.trip.routePoints||nav.route(ship.trip.from,ship.trip.to)?.points;
  if(!Array.isArray(line)||line.length<2)continue;
  svg+='<polyline class="ocean-route" points="'+line.map(p=>p.map(n=>Number(n).toFixed(1)).join(',')).join(' ')+'"/>';
 }
 for(const [name,p]of Object.entries(nav.PORTS)){
  const selected=session.selection.type==='port'&&session.selection.id===name;
  const active=e.ports.includes(name);
  svg+='<g class="ocean-port'+(selected?' selected':'')+(active?' open-port':' locked-port')+'" data-ocean-port="'+esc(name)+'" tabindex="0" role="button" aria-label="Inspect '+esc(name)+' port"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="11"/><text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="middle">⚓</text><title>'+esc(name)+(active?' established':' unverified')+'</title></g>';
 }
 for(const pin of m.pins){
  svg+='<g class="ocean-custom-pin'+(session.selection.type==='pin'&&+session.selection.id===pin.id?' selected':'')+'" data-ocean-pin="'+pin.id+'" tabindex="0" role="button" aria-label="Chart mark '+esc(pin.name)+'"><path d="M'+pin.x+' '+(pin.y+10)+' l-9-14 a11 11 0 1 1 18 0z"/><circle cx="'+pin.x+'" cy="'+(pin.y-6)+'" r="3"/><title>'+esc(pin.name)+'</title></g>';
 }
 const portCount={};
 for(const ship of e.ships){
  if(ship.status==='lost')continue;
  const p=nav.position(ship,session.save);if(!p)continue;
  const offset=ship.status==='in-port'?(portCount[ship.port]=(portCount[ship.port]||0)+1)-1:0;
  const x=p.x+(offset?Math.cos(offset*2.4)*12:0),y=p.y+(offset?Math.sin(offset*2.4)*12:0);
  svg+='<g class="ocean-ship'+(String(ship.id)===String(session.shipId)?' selected':'')+'" data-ocean-ship="'+ship.id+'" role="button" tabindex="0" aria-label="Select '+esc(ship.name)+'"><circle cx="'+x+'" cy="'+y+'" r="13"/><path d="M'+(x-9)+' '+(y+3)+'h18l-4 6h-10z M'+x+' '+(y-13)+'v16 M'+(x-1)+' '+(y-10)+'l-8 11h8z" stroke-width="1.2"/><title>'+esc(ship.name)+'</title></g>';
 }
 return svg+'</svg>';
}
function portMiniScene(){
 let html='<div class="ocean-port-scene" aria-label="Small simplified harbour district">';
 const tiles=['water','water','quay','quay','warehouse','warehouse','water','water','quay','quay','customs','street',
  'water','water','quay','street','street','street','water','quay','quay','street','market','market',
  'water','quay','quay','street','lodging','lodging','water','quay','quay','street','street','street'];
 for(const t of tiles){
  html+=t==='water'?'<span class="ocean-tile water" aria-label="Water"></span>':
   '<button type="button" class="ocean-tile '+t+(session.zone===t?' selected':'')+'" data-ocean-action="zone:'+t+'" title="'+esc(t)+'" aria-pressed="'+(session.zone===t?'true':'false')+'" aria-label="'+esc(t)+'">'+
   ({quay:'║',warehouse:'▣',customs:'▤',street:'·',market:'▥',lodging:'⌂'}[t]||'')+'</button>';
 }
 return html+'</div>';
}
function focusPoint(point,minimumScale=1){
 const viewport=host?.querySelector('.merchant-world-viewport');
 if(!point||!viewport)return;
 session.scale=Math.max(session.scale,minimumScale);
 session.x=viewport.clientWidth/2-point[0]*session.scale;
 session.y=viewport.clientHeight/2-point[1]*session.scale;
 resize(false);
}
function chartDirectory(){
 const marks=state().pins,ports=Object.keys(nav.PORTS),opened=new Set(fleet().ports);
 let html='<details class="ocean-chart-directory"'+(session.directoryOpen?' open':'')+'><summary>Ports & Your Chart Marks · '+(ports.length+marks.length)+'</summary>';
 html+='<h4>Known ports</h4><div class="ocean-directory-links">'+ports.map(port=>
  action('focus-port:'+port,(opened.has(port)?'● ':'○ ')+port)).join('')+'</div>';
 if(marks.length)html+='<h4>My marked areas</h4><div class="ocean-directory-links">'+marks.map(pin=>
  action('focus-pin:'+pin.id,(pin.kind==='harbor'?'⚓ ':pin.kind==='coast'?'◇ ':pin.kind==='sea'?'≈ ':'◆ ')+pin.name)).join('')+'</div>';
 html+='</details>';return html;
}
function harborRegister(name,zone){
 const f=fleet(),e=root.FE_EMPIRE.ensure(session.save),valid=Object.prototype.hasOwnProperty.call(nav.PORTS,name);
 if(!valid)return'';
 if(zone==='quay'){
  const vessels=f.ships.filter(ship=>ship.status==='in-port'&&ship.port===name);
  return '<h5>Harbour Berth Register</h5>'+
   (vessels.length?vessels.map(ship=>'<p>'+esc(ship.name)+' · '+esc(ship.type)+
    ' · Hull '+Number(ship.condition).toFixed(0)+'%</p>').join(''):'<p>No owned ships are currently berthed here.</p>');
 }
 if(zone==='warehouse'){
  const crates=Array.isArray(f.electric?.[name])?f.electric[name]:[];
  return '<h5>Recorded Federal Electric Cargo</h5>'+
   (crates.length?crates.map(c=>'<p>'+esc(c.units)+' '+esc(c.productId)+' · awaiting local sale</p>').join(''):
    '<p>No delivered Federal Electric cargo is recorded at this port.</p>');
 }
 if(zone==='customs'){
  const receipts=(e.log||[]).filter(line=>line.includes(' in '+name)||line.includes(' to '+name)).slice(0,3);
  return '<h5>Existing Voyage Notices</h5>'+
   (receipts.length?receipts.map(ln=>'<p>'+esc(ln)+'</p>').join(''):
    '<p>There are no relevant saved voyage notices here.</p>')+
   '<p class="fine">These are commercial log entries, not a customs clearance.</p>';
 }
 if(zone==='market'){
  const known=f.ports.includes(name);
  return '<h5>Commercial Access</h5><p>'+(known?
   'Trade access has been verified through the existing port-agent system.':
   'Trade access is not yet verified. Inspecting a market cannot authorize a shipment.')+'</p>';
 }
 if(zone==='lodging')return'<h5>Accommodation</h5><p>No passenger booking or paid berth is recorded. Overnight stays require future travel mechanics.</p>';
 return'<h5>Local Streets</h5><p>No player location transition is authorized by a survey of this district.</p>';
}
function portPanel(name){
 const data=regions.port(name);if(!data)return '<p>Port not found.</p>';
 const authorized=fleet().ports.includes(name),inPort=fleet().ships.filter(s=>s.status==='in-port'&&s.port===name);
 let html='<h3>'+esc(name)+'</h3><p>'+ (authorized?'Established commercial port':'Not yet verified as a commercial destination')+'.</p>';
 html+='<p>'+inPort.length+' owned ship(s) currently berthed.</p>';
 const quote=nav.plan('Baltimore',name,'schooner'),steam=nav.plan('Baltimore',name,'steamer');
 if(quote&&steam){
  html+='<div class="ocean-voyage-quote"><h4>Passage estimate from Baltimore</h4>'+
   '<p>'+quote.nauticalMiles.toLocaleString('en-US')+' nautical miles along '+quote.legs.length+
   ' chart leg(s)</p><p>Schooner: <strong>'+quote.days+' days</strong> · Steamship: <strong>'+
   steam.days+' days</strong></p><p class="fine">This is a route estimate, not a booked journey or verified period sailing schedule.</p></div>';
 }
 html+=action('port-scene:'+name,'Explore Harbour Layout')+action('walk-open:'+name,'Open Walkable Harbour Survey');
 if(session.scene===name){
  const zone=regions.inspectZone(name,session.zone)||data.zones[0];
  html+=portMiniScene();
  html+='<h4>'+esc(zone.name)+'</h4><p>'+esc(zone.description)+'</p>'+
   '<div class="ocean-harbor-register">'+harborRegister(name,zone.id)+'</div>'+
   '<p class="fine">This survey does not move Charles to the port. Physical character travel and on-site interactions require a separate integration.</p>';
 }
 return html;
}
function pinPanel(id){
 const pin=state().pins.find(p=>p.id===+id);
 if(!pin)return'<p>Chart mark is missing.</p>';
 const kind=pin.kind||'study';
 let html='<h3>Personal Chart Mark</h3><p>Image position '+pin.x+', '+pin.y+'</p>'+
  '<label>Name <input id="merchantPinName" maxlength="64" value="'+esc(pin.name)+'"></label>'+
  action('rename-pin:'+pin.id,'Save Pin Name')+action('move-pin:'+pin.id,'Reposition Mark')+action('remove-pin:'+pin.id,'Remove Mark')+
  '<label>Area type <select id="merchantPinKind">'+['study','harbor','coast','sea'].map(k=>'<option value="'+k+'"'+(kind===k?' selected':'')+'>'+({study:'Unclassified study mark',harbor:'Harbour candidate',coast:'Coastline',sea:'Open sea'})[k]+'</option>').join('')+'</select></label>'+
  action('classify-pin:'+pin.id,'Save Area Type')+
  '<p class="fine">A chart mark is a personal annotation, not a verified commercial port or a visited location.</p>';
 if(kind==='harbor')html+=action('inspect-mark:'+pin.id,'Examine Harbour Sections')+action('walk-open:mark:'+pin.id,'Open Walkable Harbour Survey');
 if(session.scene==='mark:'+pin.id){
  const zone=regions.ZONES.find(z=>z.id===session.zone)||regions.ZONES[0];
  html+='<h4>Proposed Harbour District</h4>'+portMiniScene()+
   '<h4>'+esc(zone.name)+'</h4><p>'+esc(zone.description)+'</p>'+
   '<p class="fine">Preview only: no physical visit, trading entitlement or named resident is created.</p>';
 }
 return html;
}
function shipPanel(id){
 const s=fleet().ships.find(v=>String(v.id)===String(id));if(!s)return'<p>Ship not found.</p>';
 const p=nav.position(s,session.save);
 let html='<h3>'+esc(s.name)+'</h3><p><strong>'+esc(s.status.toUpperCase())+'</strong> · '+esc(s.type)+' · Hull '+Number(s.condition).toFixed(0)+'%</p>';
 if(s.status==='at-sea'&&s.trip){
  const trip=s.trip,seaMiles=trip.nauticalMiles||nav.route(trip.from,trip.to)?.nauticalMiles||0;
  const cargo=trip.cargo==='electric'?trip.consignment?
   trip.consignment.units+' '+trip.consignment.productId+' Federal Electric components':'Federal Electric consignment':
   'Merchant freight';
  html+='<p>'+esc(trip.from)+' → '+esc(trip.to)+'</p>'+
   '<dl class="ocean-voyage-facts"><dt>Cargo</dt><dd>'+esc(cargo)+'</dd>'+
   '<dt>Departure</dt><dd>'+esc(trip.depart)+'</dd>'+
   '<dt>Expected arrival</dt><dd>'+esc(trip.eta)+'</dd>'+
   '<dt>Distance</dt><dd>'+Math.round(seaMiles).toLocaleString('en-US')+' nautical miles</dd>'+
   '<dt>Passage</dt><dd>'+Math.floor((p?.progress||0)*100)+'% complete; '+(p?.remainingDays??'unknown')+' days remaining</dd>'+
   '<dt>Hull insurance</dt><dd>'+(trip.insured?'Covered':'Not purchased')+'</dd></dl>';
 }
 else if(s.status==='in-port'){
  const destinations=fleet().ports.filter(v=>v!==s.port);
  html+='<p>Berth: '+esc(s.port)+'</p><div class="ocean-form"><label>Destination<select data-ocean-destination="'+s.id+'">'+
   destinations.map(v=>'<option value="'+esc(v)+'"'+(session.quote?.shipId===s.id&&session.quote.to===v?' selected':'')+'>'+esc(v)+'</option>').join('')+'</select></label>'+
   '<label>Cargo<select data-ocean-cargo="'+s.id+'"><option value="freight"'+(session.quote?.cargo==='freight'?' selected':'')+'>Merchant freight</option><option value="electric"'+(session.quote?.cargo==='electric'?' selected':'')+'>Federal Electric finished goods</option></select></label>'+
   '<label><input type="checkbox" data-ocean-insurance="'+s.id+'"'+(session.quote?.insured?' checked':'')+'> Hull insurance</label>'+
   action('quote:'+s.id,'Preview Voyage')+action('dispatch:'+s.id,'Dispatch Voyage')+action('repair:'+s.id,'Repair Hull')+'</div>';
  if(session.quote?.ok&&session.quote.shipId===s.id){
   const q=session.quote;
   html+='<section class="ocean-quote-details"><h4>Route Proposal · Not Dispatched</h4><p>'+esc(q.from)+' → '+esc(q.to)+' · '+q.nauticalMiles.toLocaleString('en-US')+' nautical miles</p>'+
    '<p>Sailing estimate: <strong>'+q.days+' days</strong>. Arrival '+esc(q.eta)+'.</p>'+
    '<p>Departure charges: '+cash(q.fee)+'; insurance '+cash(q.insurance)+'; total '+cash(q.due)+' from fleet treasury.</p>'+
    '<p>Manifest: '+esc(q.cargoDescription)+'</p><ol>'+q.legs.map(v=>'<li>'+esc(v.from)+' → '+esc(v.to)+' · '+v.nm.toLocaleString('en-US')+' nautical miles</li>').join('')+'</ol>'+
    '<p class="fine">This is an estimate; no ship moved and no cash or cargo was transferred.</p></section>';
  }
 }
 return html;
}
function business(){
 const e=fleet(),opened=e.ships.filter(s=>s.status!=='lost');
 let html='<h3>Merchant Shipping Office</h3><p>Fleet cash '+cash(e.cash)+' · '+opened.length+' active vessels</p>'+
  '<div class="ocean-business-actions">'+action('buy:schooner','Buy Schooner · '+cash(root.FE_EMPIRE.PRICE.schooner))+action('buy:steamer','Buy Steamship · '+cash(root.FE_EMPIRE.PRICE.steamer))+'</div>';
 for(const s of e.ships)html+=action('select-ship:'+s.id,s.name+' · '+(s.status==='at-sea'?'At sea':s.status==='lost'?'Lost':s.port));
 if(e.leads.length){html+='<h4>Captain Leads</h4>';for(const lead of e.leads)
  html+='<p>'+esc(lead.port)+' (heard at '+esc(lead.from)+') '+action('verify:'+lead.port,'Verify · $35')+'</p>'}
 for(const [port,goods]of Object.entries(e.electric))if(Array.isArray(goods)&&goods.length)
  html+='<p>Federal Electric cargo at '+esc(port)+': '+goods.map(g=>esc(g.units+' '+g.productId)).join(', ')+
   ' '+action('sell:'+port,'Complete Local Sale')+'</p>';
 html+='<h4>Trade Ports</h4><p>'+e.ports.map(esc).join(' · ')+'</p>';
 const history=root.FE_EMPIRE.ensure(session.save).log||[];
 if(history.length)html+='<details class="ocean-voyage-log"><summary>Shipping Office Journal · '+history.length+' entries</summary>'+
  history.slice(0,20).map(line=>'<p>'+esc(line)+'</p>').join('')+'</details>';
 const receipts=(e.ledger||[]).slice(-18).reverse();
 if(receipts.length)html+='<details class="ocean-voyage-log"><summary>Fleet Expenses & Earnings · '+e.ledger.length+' receipts</summary>'+
  receipts.map(row=>'<p>'+esc(row.date)+' · '+esc(row.label)+' · '+cash(row.amount)+'</p>').join('')+'</details>';
 return html;
}
function draw(reset){
 if(!session||host?.hidden)return;
 root.FE_EMPIRE.advance(session.save);
 const directory=host.querySelector('.ocean-chart-directory');
 if(directory)session.directoryOpen=directory.open;
 host.innerHTML='<div class="merchant-world-card"><header class="merchant-world-head"><div><small>CHARLES WHITCOMB · MERCHANT NAVIGATION</small><h2 id="merchantWorldHeading">World Shipping Chart</h2><p>'+esc(session.save.gameDate)+' · Ships move with the saved Washington clock</p></div><div class="merchant-world-tools">'+
  action('mark',session.mode==='mark'?'Cancel Marking':'Mark Area')+action('zoom-out','−')+action('fit','Fit')+action('zoom-in','+')+
  '<output id="merchantWorldZoom">100%</output>'+action('close','✕')+'</div></header>'+
  '<div class="merchant-world-columns"><div class="merchant-world-viewport" tabindex="0" aria-label="Shipping chart. Right drag to pan; wheel or buttons to zoom; select a port or ship.">'+
  '<div class="merchant-world-stage"><img draggable="false" src="'+esc(nav.MAP)+'" alt="Original EcoClipper shipping-lines world map">'+plot()+'</div>'+
  (session.walking&&root.FE_MERCHANT_HARBOR_UI?.render?.(session.save,session.walking)||'')+'</div>'+ 
  '<aside class="merchant-world-sidebar">'+chartDirectory()+'<div class="ocean-tabs">'+action('tab:selection','Inspect & Regions')+action('tab:commerce','Shipping Office')+'</div>'+
  '<section id="merchantWorldSelection">'+(session.selection.type==='port'?portPanel(session.selection.id):
   session.selection.type==='pin'?pinPanel(session.selection.id):shipPanel(session.selection.id))+'</section>'+
  '<section id="merchantWorldCommerce">'+business()+'</section></aside></div>'+
  '<footer><span id="merchantWorldStatus" role="status" aria-live="polite">'+
  (session.mode==='mark'?'Click the chart to drop a personal pin.':session.mode==='move-pin'?'Click the chart to place the selected pin at its new location.':'Right drag pans · wheel zooms · left click inspects · select Shipping Office to trade.')+
  '</span><span>Reference routes are illustrative; voyage durations are estimates.</span></footer></div>';
 const sel=host.querySelector('#merchantWorldSelection'),commerce=host.querySelector('#merchantWorldCommerce');
 const onCommerce=session.tab==='commerce';sel.hidden=!!onCommerce;commerce.hidden=!onCommerce;
 if(reset||!session.ready)requestAnimationFrame(()=>resize(true));
 else requestAnimationFrame(()=>resize(false));
}
function changed(outcome){
 if(!outcome)return;
 setStatus(outcome.message||outcome.reason||'No change');
 if(outcome.ok){session.onChange?.();draw(false)}
}
function onClick(e){
 if(!session)return;
 const command=e.target.closest('[data-ocean-action]')?.dataset.oceanAction;
 if(command){
  if(command==='close')return close();
  if(command==='walk-close'){session.walking=null;return draw(false)}
  if(command.startsWith('walk-open:')){
   const name=command.slice(10),survey=root.FE_MERCHANT_HARBOR_WALK?.preview?.(session.save,name);
   if(!survey){setStatus('No supported harbour survey is registered here.');return}
   session.walking=name;return draw(false);
  }
  if(command.startsWith('walk-zone:')){
   if(!session.walking)return;
   const name=command.slice(10),survey=root.FE_MERCHANT_HARBOR_WALK?.preview?.(session.save,session.walking,name);
   if(survey){session.onChange?.();draw(false)}
   return;
  }
  if(command.startsWith('walk-step:')||command.startsWith('walk-cell:')){
   if(!session.walking)return;
   const coords=command.split(':');
   const result=coords[0]==='walk-step'?
    root.FE_MERCHANT_HARBOR_WALK?.step?.(session.save,session.walking,Number(coords[1]),Number(coords[2])):
    root.FE_MERCHANT_HARBOR_WALK?.walkTo?.(session.save,session.walking,Number(coords[1]),Number(coords[2]));
   if(result?.ok){session.onChange?.();draw(false)}
   else setStatus(result?.reason||'Blocked by harbour scenery.');
   return;
  }
  if(command==='zoom-in')return zoom(1.25);
  if(command==='zoom-out')return zoom(.8);
  if(command==='fit')return resize(true);
  if(command==='mark'){session.mode=session.mode==='inspect'?'mark':'inspect';return draw(false)}
  if(command.startsWith('move-pin:')){session.mode='move-pin';session.movingPin=+command.slice(9);return draw(false)}
  if(command.startsWith('tab:')){session.tab=command.slice(4);return draw(false)}
  if(command.startsWith('focus-port:')){
   const port=command.slice(11),p=nav.PORTS[port];if(!p)return;
   session.selection={type:'port',id:port};session.tab='selection';session.scene=null;
   draw(false);root.requestAnimationFrame(()=>focusPoint(p,1.1));return;
  }
  if(command.startsWith('focus-pin:')){
   const id=+command.slice(10),pin=state().pins.find(p=>p.id===id);
   if(!pin)return;
   session.selection={type:'pin',id};session.tab='selection';
   draw(false);root.requestAnimationFrame(()=>focusPoint([pin.x,pin.y],1.1));return;
  }
  if(command.startsWith('select-ship:')){session.shipId=command.slice(12);session.selection={type:'ship',id:session.shipId};session.quote=null;session.tab='selection';return draw(false)}
  if(command.startsWith('port-scene:')){session.scene=command.slice(11);session.tab='selection';return draw(false)}
  if(command.startsWith('zone:')){session.zone=command.slice(5);return draw(false)}
  if(command.startsWith('rename-pin:')){
   const id=+command.slice(11),name=host.querySelector('#merchantPinName')?.value;
   return changed(regions.rename(session.save,id,name));
  }
  if(command.startsWith('classify-pin:')){
   const id=+command.slice(13),kind=host.querySelector('#merchantPinKind')?.value;
   return changed(regions.classify(session.save,id,kind));
  }
  if(command.startsWith('inspect-mark:')){session.scene='mark:'+command.slice(13);session.zone='quay';return draw(false)}
  if(command.startsWith('remove-pin:')){
   const id=+command.slice(11),out=regions.remove(session.save,id);
   if(out.ok){session.selection={type:'port',id:'Baltimore'};session.onChange?.();draw(false)}
   else setStatus(out.reason);return;
  }
  if(command.startsWith('quote:')){
   const id=+command.slice(6),quote=root.FE_MERCHANT_ROUTE_QUOTE?.quote?.(
    session.save,id,host.querySelector('[data-ocean-destination="'+id+'"]')?.value,
    host.querySelector('[data-ocean-cargo="'+id+'"]')?.value,
    !!host.querySelector('[data-ocean-insurance="'+id+'"]')?.checked);
   if(quote?.ok){session.quote=quote;draw(false)}else setStatus(quote?.reason||'Voyage could not be quoted.');
   return;
  }
  let out=null;const empire=root.FE_EMPIRE;
  if(command.startsWith('buy:'))out=empire.buyShip(session.save,command.slice(4));
  else if(command.startsWith('verify:'))out=empire.verifyLead(session.save,command.slice(7));
  else if(command.startsWith('sell:'))out=empire.sellElectric(session.save,command.slice(5));
  else if(command.startsWith('repair:'))out=empire.repairShip(session.save,+command.slice(7));
  else if(command.startsWith('dispatch:')){
   const id=+command.slice(9);
   out=empire.dispatch(session.save,id,
    host.querySelector('[data-ocean-destination="'+id+'"]')?.value,
    host.querySelector('[data-ocean-cargo="'+id+'"]')?.value,
    !!host.querySelector('[data-ocean-insurance="'+id+'"]')?.checked);
  }
  if(out){
   if(out.ok&&command.startsWith('buy:')){
    session.shipId=String(fleet().ships.at(-1)?.id||'');session.selection={type:'ship',id:session.shipId};
   }
   if(out.ok&&command.startsWith('dispatch:'))session.quote=null;
   changed(out);return;
  }
 }
 const port=e.target.closest('[data-ocean-port]')?.dataset.oceanPort;
 if(port){session.selection={type:'port',id:port};session.tab='selection';session.scene=null;return draw(false)}
 const pin=e.target.closest('[data-ocean-pin]')?.dataset.oceanPin;
 if(pin){session.selection={type:'pin',id:pin};session.tab='selection';return draw(false)}
 const ship=e.target.closest('[data-ocean-ship]')?.dataset.oceanShip;
 if(ship){session.shipId=ship;session.selection={type:'ship',id:ship};session.tab='selection';return draw(false)}
 if((session.mode==='mark'||session.mode==='move-pin')&&e.target.closest('.merchant-world-stage')){
  const box=host.querySelector('.merchant-world-stage').getBoundingClientRect();
  const x=(e.clientX-box.left)*800/box.width,y=(e.clientY-box.top)*600/box.height;
  const out=session.mode==='move-pin'?regions.move(session.save,session.movingPin,x,y):regions.addPin(session.save,x,y);
  if(out.ok){session.selection={type:'pin',id:out.pin.id};session.mode='inspect';session.tab='selection';session.onChange?.();draw(false)}
  else setStatus(out.reason);
 }
}
function onChange(){}
function onKey(e){
 if(session?.walking&&!(e.target.closest('input,textarea,select,[contenteditable]'))){
  if(e.key==='Escape'){e.preventDefault();session.walking=null;draw(false);return}
  const keys={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};
  const step=keys[e.key];if(step){
   e.preventDefault();
   const result=root.FE_MERCHANT_HARBOR_WALK?.step?.(session.save,session.walking,...step);
   if(result?.ok){session.onChange?.();draw(false)}else setStatus(result?.reason||'Blocked by harbour scenery.');
   return;
  }
 }
 const p=e.target.closest('[data-ocean-port],[data-ocean-ship],[data-ocean-pin]');
 if(p&&(e.key==='Enter'||e.key===' ')){
  e.preventDefault();
  p.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
  return;
 }
 if(e.key==='Escape'){e.preventDefault();close()}
}
function onPointerDown(e){
 if(!session||e.button!==2)return;
 const vp=e.target.closest('.merchant-world-viewport');if(!vp)return;
 session.drag={id:e.pointerId,x:e.clientX,y:e.clientY,oldX:session.x,oldY:session.y};
 try{vp.setPointerCapture(e.pointerId)}catch(_){}
 e.preventDefault();
}
function onPointerMove(e){
 const d=session?.drag;if(!d||d.id!==e.pointerId)return;
 session.x=d.oldX+e.clientX-d.x;session.y=d.oldY+e.clientY-d.y;
 resize(false);
}
function onPointerUp(e){if(session?.drag?.id===e.pointerId)session.drag=null}
function onWheel(e){
 if(!e.target.closest('.merchant-world-viewport')||!session||e.target.closest('.merchant-harbor-walk'))return;
 e.preventDefault();zoom(e.deltaY>0?.85:1.15,e.clientX,e.clientY);
}
root.addEventListener?.('resize',()=>{if(host&&!host.hidden)resize(true)});
const api=Object.freeze({open,close,isOpen:()=>!!host&&!host.hidden,refresh:()=>{if(host&&!host.hidden)draw(false)}});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_MERCHANT_MAP=api;
})(typeof window!=='undefined'?window:globalThis);
