/* Read-only merchant chart placed inside the existing Industrial Holdings sheet.
 * The chart uses the bundled, unmodified reference image and saved voyage records.
 * This is not a new map scene or a replacement for Washington's printed city map.
 */
(function(root){
 'use strict';
 const nav=typeof module==='object'&&module.exports?require('./merchant-navigation.js'):root.FE_MERCHANT_NAV;
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const number=n=>Math.round(n).toLocaleString('en-US');
 function shipSymbol(ship,x,y,selected){
  const id=esc(ship.id),name=esc(ship.name),kind=ship.type==='steamer'?'steamer':'schooner';
  const shape=kind==='steamer'?
   '<path d="M-11 3h22l-4 7h-14z" fill="#1e3440" stroke="#f8eccd" stroke-width="1.1"/><path d="M-6-4h12v7h-12z" fill="#fff2da"/><path d="M-1-9h4v5h-4z" fill="#70462a"/>':
   '<path d="M-10 5h20l-4 5h-12z" fill="#213847" stroke="#fff6e5" stroke-width="1"/><path d="M0-13V5M-1-11L-9 3H-1zM2-9L8 3H2z" fill="#f7edd9" stroke="#213847" stroke-width="1.1"/>';
  return '<g class="merchant-ship'+(selected?' is-selected':'')+'" transform="translate('+x.toFixed(2)+' '+y.toFixed(2)+')" role="button" tabindex="0" data-empire-action="ship-info:'+id+'" aria-label="'+name+', '+(ship.status==='at-sea'?'underway':'in port')+'"><title>'+name+'</title><circle r="15" fill="'+(selected?'#f0d987':'#fff6df')+'" fill-opacity=".87" stroke="#273543" stroke-width="'+(selected?'2.5':'1.3')+'"/>'+shape+'</g>';
 }
 function chart(save,fleet,selectedId,expanded){
  const vessels=Array.isArray(fleet?.ships)?fleet.ships:[];
  const selected=vessels.find(s=>String(s.id)===String(selectedId))||vessels.find(s=>s.status!=='lost')||vessels[0];
  const inService=vessels.filter(s=>s.status!=='lost');
  let svg='<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EcoClipper shipping lines with saved positions of the merchant fleet"><image href="'+esc(nav.MAP)+'" x="0" y="0" width="800" height="600"/>';
  const portSet=new Set(fleet.ports||[]);
  for(const [port,xy] of Object.entries(nav.PORTS)){
   const active=portSet.has(port);
   svg+='<circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="'+(active?4.4:2.5)+'" fill="'+(active?'#123d3e':'#75634b')+'" stroke="#fff8e9" stroke-width="1.2"><title>'+esc(port)+(active?' (trade access)':' (not yet verified)')+'</title></circle>';
  }
  for(const ship of vessels){
   if(ship.status!=='at-sea'||!ship.trip)continue;
   const p=ship.trip.routePoints||nav.route(ship.trip.from,ship.trip.to)?.points;
   if(!p?.length)continue;
   svg+='<polyline points="'+p.map(x=>x.map(n=>Number(n).toFixed(1)).join(',')).join(' ')+'" class="merchant-active-route" '+(selected?.id===ship.id?'data-selected="true"':'')+'><title>'+esc(ship.name)+' route</title></polyline>';
  }
  const portCounts={};
  for(const ship of vessels){
   const point=nav.position(ship,save);
   if(!point)continue;
   const inPort=ship.status!=='at-sea';
   const overlap=inPort?(portCounts[ship.port]=(portCounts[ship.port]||0)+1)-1:0;
   const dx=inPort&&overlap?Math.cos(overlap*2.4)*8:0;
   const dy=inPort&&overlap?Math.sin(overlap*2.4)*8:0;
   svg+=shipSymbol(ship,point.x+dx,point.y+dy,selected?.id===ship.id);
  }
  svg+='</svg>';
  let detail='<p class="fine">There are no purchased vessels yet. Acquire a schooner or steamship above to see it on this chart.</p>';
  if(selected){
   const point=nav.position(selected,save),trip=selected.trip;
   const route=trip?nav.route(trip.from,trip.to):null;
   const distance=trip?.nauticalMiles||route?.nauticalMiles||null;
   const state=selected.status==='lost'?'Lost at sea':selected.status==='at-sea'?'Under sail':'In port';
   detail='<h5>'+esc(selected.name)+'</h5><dl><dt>Status</dt><dd>'+esc(state)+'</dd><dt>Type</dt><dd>'+esc(selected.type)+'</dd><dt>Location / voyage</dt><dd>'+esc(trip?trip.from+' → '+trip.to:selected.port)+'</dd><dt>Hull</dt><dd>'+Number(selected.condition||0).toFixed(0)+'%</dd>';
   if(trip){
    detail+='<dt>Cargo</dt><dd>'+esc(trip.cargo==='electric'?'Federal Electric components':'Merchant freight')+'</dd><dt>Departure</dt><dd>'+esc(trip.depart)+'</dd><dt>Estimated arrival</dt><dd>'+esc(trip.eta)+'</dd><dt>Sea distance</dt><dd>'+(distance===null?'Uncharted':number(distance)+' nautical miles')+'</dd><dt>Voyage progress</dt><dd>'+(point?Math.floor(point.progress*100):0)+'%</dd>';
   }
   detail+='</dl>';
  }
  const options=vessels.map(s=>'<option value="'+esc(s.id)+'"'+(selected?.id===s.id?' selected':'')+'>'+esc(s.name)+(s.status==='lost'?' (lost)':'')+'</option>').join('');
  const selector=vessels.length?'<label for="merchantChartShip">Select vessel </label><select id="merchantChartShip" data-merchant-ship-select>'+options+'</select>':'';
  return '<details class="merchant-chart"'+(expanded?' open':'')+'><summary>Fleet Sailing Chart · '+inService.length+' vessels</summary><p class="fine">Historical-style EcoClipper reference image, preserved as supplied. The vessel paths are an initial manually traced approximation of its printed lines, not a verified 1878 navigation survey. Ships advance only when the saved game clock advances.</p><div class="merchant-chart-layout"><div class="merchant-chart-map">'+svg+'</div><aside class="merchant-chart-details">'+selector+detail+'</aside></div><p class="fine">Click a ship icon or choose a vessel to inspect it. White-backed markers represent your ships; the original chart remains unedited.</p></details>';
 }
 const api=Object.freeze({render:chart});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_MERCHANT_CHART=api;
})(typeof window!=='undefined'?window:globalThis);
