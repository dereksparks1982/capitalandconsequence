/* Passenger travel interface: explicit boarding, normal daily-report advancement,
 * and actual saved foreign-port room/position. No private NPCs or fake commerce.
 */
(function(root){
'use strict';
const sea=typeof module==='object'&&module.exports?require('./merchant-passenger-sea.js'):root.FE_PASSENGER_SEA;
const nav=typeof module==='object'&&module.exports?require('./merchant-navigation.js'):root.FE_MERCHANT_NAV;
const walk=typeof module==='object'&&module.exports?require('./merchant-harbor-walk.js'):root.FE_MERCHANT_HARBOR_WALK;
const regions=typeof module==='object'&&module.exports?require('./merchant-regions.js'):root.FE_MERCHANT_REGIONS;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>'$'+Number(v||0).toFixed(2);
let host=null,save=null,actions=null,booking=false,shipType='steamer',dest='Liverpool',status='';
function button(key,text){return '<button type="button" data-passenger-action="'+esc(key)+'">'+esc(text)+'</button>'}
function ensureHost(){
 if(host)return host;
 host=document.createElement('div');host.id='merchantPassengerOverlay';host.className='merchant-passenger-overlay';
 host.hidden=true;host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');
 host.setAttribute('aria-labelledby','merchantPassengerHeading');document.body.appendChild(host);
 host.addEventListener('click',click);host.addEventListener('change',change);host.addEventListener('keydown',keydown);
 return host;
}
function updatePier(s,handlers){
 save=s;actions=handlers;const rootNode=document.querySelector('#cityRoomOverlay .city-room-shell');
 if(!rootNode)return;
 let entry=rootNode.querySelector('#merchantPassengerPierAccess');
 if(!entry){entry=document.createElement('button');entry.type='button';entry.id='merchantPassengerPierAccess';
  entry.textContent='Passenger Pier · Book Sea Passage';rootNode.appendChild(entry);
  entry.addEventListener('click',()=>showBooking(save,actions));}
 const allowed=s.currentLocation?.locationId==='potomacFishingBank'&&
  s.currentLocation?.roomId==='passenger-pier'&&!sea.ensure(s).voyage;
 entry.hidden=!allowed;
}
function showBooking(s,handlers){
 if(!s||s.characterRoute!=='industrialist')return false;
 save=s;actions=handlers;booking=true;
 ensureHost();draw();return true;
}
function notify(message){status=message||'';const output=host?.querySelector('#merchantPassengerStatus');if(output)output.textContent=status}
function quote(){
 const st=sea.ensure(save);const next=st.port?'Baltimore':dest;
 return sea.quote(save,next,shipType);
}
function cargoScene(){
 const state=sea.ensure(save),p=state.position,grid=walk.tiles(p.zone);
 let html='<p class="passenger-stage-label">Actually ashore at '+esc(state.port)+'. Every movement uses the game clock.</p>'+
  '<div class="merchant-passenger-zones">'+regions.ZONES.map(v=>button('zone:'+v.id,
   (v.id===p.zone?'● ':'')+v.name)).join('')+'</div>'+
  '<div class="merchant-passenger-board" role="grid" aria-label="Playable 12 by 9 foreign port">';
 for(let y=0;y<9;y++)for(let x=0;x<12;x++){
  const cell=grid[y][x],active=p.x===x&&p.y===y;
  const allowed=Math.abs(p.x-x)+Math.abs(p.y-y)===1&&walk.passable(cell);
  const sym=active?'♟':({wall:'▓',water:'≈',dock:'═',road:'·',crate:'▣',
   counter:'▤',barrel:'◉',stall:'▦',bed:'▰',bollard:'●',books:'▥',table:'▪'}[cell]||'');
  const label=active?'Charles':cell+' '+(x+1)+','+(y+1);
  if(allowed)html+='<button type="button" class="passenger-cell '+esc(cell)+'" data-passenger-action="walk:'+x+':'+y+'" aria-label="'+esc(label)+'">'+sym+'</button>';
  else html+='<span class="passenger-cell '+esc(cell)+(active?' person':'')+'" aria-label="'+esc(label)+'">'+sym+'</span>';
 }
 html+='</div><p class="fine">WASD or arrow keys walk one tile. Choose another section to move to its public approach (one game minute). Locked barriers remain impassable.</p>';
 return html;
}
function draw(){
 if(!save)return;
 const st=sea.ensure(save),travel=sea.position(save),h=ensureHost();
 const shown=booking||travel.phase==='at-sea'||travel.phase==='ashore';
 if(!shown){h.hidden=true;return}
 h.hidden=false;
 let body='';
 if(booking){
  const home=!st.port,from=home?'Washington Passenger Pier':'Foreign Harbour at '+st.port;
  const destinations=Object.keys(nav.PORTS).filter(x=>x!=='Baltimore'&&x!=='Philadelphia');
  body='<h3>Passenger Ticket Office</h3><p>Departure: '+esc(from)+'</p><p class="fine">The Washington pier connects through an estimated two-day river and coastal transfer to Baltimore before a longer sea crossing. Returning includes the corresponding connection back to Washington.</p>'+
   (home?'<label>Destination <select id="passengerDestination">'+destinations.map(x=>'<option'+(dest===x?' selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label>':'<p>Destination: Baltimore, then Washington Passenger Pier.</p>')+
   '<label>Vessel <select id="passengerShipType"><option value="steamer"'+(shipType==='steamer'?' selected':'')+'>Steamship</option><option value="schooner"'+(shipType==='schooner'?' selected':'')+'>Schooner</option></select></label>';
  const q=quote();
  body+=q.ok?'<div class="passenger-quote"><p><strong>'+esc(q.from)+' → '+esc(q.to)+'</strong> · '+q.nauticalMiles.toLocaleString('en-US')+' nautical miles.</p>'+
   '<p>Sea passage '+q.seaDays+' days + '+q.transferDays+' days connection = <strong>'+q.days+' game days</strong>.</p>'+
   '<p>Estimated arrival: '+esc(q.etaDate)+' · Fare: <strong>'+money(q.fare)+'</strong> personal cash.</p>'+
   '<p class="fine">No ticket purchased and no game time advanced until you board.</p>'+button('board','Pay Fare & Board')+'</div>':
   '<p class="passenger-error">'+esc(q.reason)+'</p>';
  body+=button('booking-close','Close Ticket Office');
 }else if(travel.phase==='at-sea'){
  const trip=st.voyage;
  body='<div class="passenger-voyage-summary"><p>From <b>'+esc(trip.from)+'</b> to <b>'+esc(trip.to)+'</b> · '+esc(trip.type)+'</p>'+
   '<p>Estimated arrival: <b>'+esc(trip.etaDate)+'</b> · '+travel.daysRemaining+' days remaining.</p>'+
   '<p>'+(travel.feeder?'On the river/coastal transfer.':'At sea along the charted ocean route.')+
   ' · '+Math.floor(travel.progress*100)+'% of total passage elapsed.</p></div>'+
   '<div class="passenger-sea-map"><svg viewBox="0 0 800 600" role="img" aria-label="Current passenger vessel on the original maritime route chart">'+
   '<image href="'+esc(nav.MAP)+'" width="800" height="600"/>'+
   '<polyline points="'+trip.points.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#7b2c24" stroke-width="4" stroke-dasharray="9 6"/>'+
   (travel.coordinates?'<circle cx="'+travel.coordinates.x+'" cy="'+travel.coordinates.y+'" r="14" fill="#f4d16d" stroke="#432a1e" stroke-width="3"/>'+
   '<text x="'+travel.coordinates.x+'" y="'+(travel.coordinates.y+5)+'" text-anchor="middle" fill="#251f1b" font-size="17">♟</text>':'')+
   '</svg></div>'+
   '<div class="passenger-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.floor(travel.progress*100)+'"><span style="width:'+Math.floor(travel.progress*100)+'%"></span></div>'+
   '<div class="passenger-time-actions">'+
    button('shipping-map','Inspect Full World Shipping Chart')+
    button('advance-day',save.phase==='report'?'Review Complete · Begin Next Day':'Advance Through Current Phase')+
    '<p class="fine">All hours pass through the saved Washington clock. Daily reports, health, world events and expenses remain active. No real-time skipping.</p></div>';
  if(save.phase==='report')body+='<div class="passenger-day-report"><h3>Daily Report · '+esc(save.gameDate)+'</h3>'+
   '<p>Company close: '+money(save.dailyReport?.companyEnd??save.companyCash)+
   ' · Personal cash: '+money(save.dailyReport?.personalAtClose??save.personalCash)+'</p></div>';
 }else{
  body='<h3>Port of '+esc(st.port)+'</h3>'+cargoScene()+
   '<div class="passenger-port-actions">'+button('ticket','Book Return Passage')+
   button('shipping-map','Open Shipping Chart')+'</div>';
 }
 h.innerHTML='<div class="merchant-passenger-card"><header><div><small>CAPITAL & CONSEQUENCE · PASSENGER TRAVEL</small>'+
  '<h2 id="merchantPassengerHeading">'+(booking?'Maritime Passenger Office':travel.phase==='at-sea'?'Aboard the Passenger Vessel':'Overseas Harbour')+'</h2>'+
  '<p>Game date '+esc(save.gameDate)+' · '+(save.phase==='report'?'Daily Report':save.phase==='day'?'Day':'Night')+'</p></div></header>'+
  '<div class="merchant-passenger-body">'+
  (save.paused?button('toggle-pause','Resume Simulation'):'')+
  (root.FE_MEDICAL_RECORDS?.pending?.(save)?button('recover','Recover From Medical Emergency'):'')+
  body+'<p id="merchantPassengerStatus" role="status">'+esc(status)+'</p></div></div>';
}
function refresh(s,handlers){
 save=s;actions=handlers;ensureHost();
 if(sea.ensure(s).voyage||sea.ensure(s).port)booking=false;
 updatePier(s,handlers);draw();
}
function changed(out){
 if(!out)return;
 if(out.ok){booking=false;status=out.reason||'';actions?.changed?.();draw()}
 else notify(out.reason||'Passenger action refused.');
}
function click(e){
 const cmd=e.target.closest('[data-passenger-action]')?.dataset.passengerAction;if(!cmd||!save)return;
 if(cmd==='booking-close'){booking=false;draw();return}
 if(cmd==='ticket'){booking=true;draw();return}
 if(cmd==='shipping-map'){root.FE_MERCHANT_MAP?.open?.(save,()=>actions?.changed?.());return}
 if(cmd==='board'){changed(actions?.board?.(dest,shipType));return}
 if(cmd==='advance-day'){changed(actions?.advance?.());return}
 if(cmd==='toggle-pause'){changed(actions?.togglePause?.());return}
 if(cmd==='recover'){changed(actions?.recover?.());return}
 if(cmd.startsWith('zone:')){const next=cmd.slice(5);changed(actions?.move?.(next,6,7));return}
 if(cmd.startsWith('walk:')){
  const parts=cmd.split(':');changed(actions?.move?.(sea.ensure(save).position.zone,+parts[1],+parts[2]));
 }
}
function change(e){
 if(e.target?.id==='passengerDestination'){dest=e.target.value;draw()}
 if(e.target?.id==='passengerShipType'){shipType=e.target.value;draw()}
}
function keydown(e){
 if(e.target?.closest('input,textarea,select,[contenteditable]'))return;
 if(e.key==='Escape'&&booking){booking=false;draw();return}
 const state=sea.ensure(save);
 if(!state.port||state.voyage)return;
 const moves={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],
  w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};
 const dir=moves[e.key];if(!dir)return;
 e.preventDefault();
 changed(actions?.move?.(state.position.zone,state.position.x+dir[0],state.position.y+dir[1]));
}
const api=Object.freeze({refresh,updatePier,showBooking});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PASSENGER_UI=api;
})(typeof window!=='undefined'?window:globalThis);
