/* Passenger travel interface: explicit boarding, normal daily-report advancement,
 * and actual saved foreign-port room/position. No private NPCs or fake commerce.
 */
(function(root){
'use strict';
const sea=typeof module==='object'&&module.exports?require('./merchant-passenger-sea.js'):root.FE_PASSENGER_SEA;
const ship=typeof module==='object'&&module.exports?require('./merchant-shipboard.js'):root.FE_SHIPBOARD;
const life=typeof module==='object'&&module.exports?require('./merchant-shipboard-life.js'):root.FE_SHIPBOARD_LIFE;
const nav=typeof module==='object'&&module.exports?require('./merchant-navigation.js'):root.FE_MERCHANT_NAV;
const walk=typeof module==='object'&&module.exports?require('./merchant-harbor-walk.js'):root.FE_MERCHANT_HARBOR_WALK;
const regions=typeof module==='object'&&module.exports?require('./merchant-regions.js'):root.FE_MERCHANT_REGIONS;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>'$'+Number(v||0).toFixed(2);
let host=null,save=null,actions=null,booking=false,shipType='steamer',dest='Liverpool',status='',checkersSelected=null;
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
function showBooking(s,handlers,target=null){
 if(!s||s.characterRoute!=='industrialist')return false;
 if(target&&Object.prototype.hasOwnProperty.call(nav.PORTS,target)&&target!=='Baltimore'&&target!=='Philadelphia')dest=target;
 save=s;actions=handlers;booking=true;
 ensureHost();draw();return true;
}
function notify(message){status=message||'';const output=host?.querySelector('#merchantPassengerStatus');if(output)output.textContent=status}
function quote(){
 const st=sea.ensure(save);const next=st.port?'Baltimore':dest;
 return sea.quote(save,next,shipType);
}
function localRecords(port,zone){
 if(zone==='lodging')return'<h4>Sailors’ Lodging</h4><p>A simple bed costs '+money(sea.LODGING_COST)+' personal cash per rest (provisional price). The normal world clock and energy rules apply.</p>'+button('harbor-rest','Pay for Bed & Rest · '+money(sea.LODGING_COST));
 const fleet=root.FE_EMPIRE?.ensure?.(save)?.fleet;
 if(!fleet)return'<p>Fleet records are unavailable.</p>';
 if(zone==='quay'){
  const ships=fleet.ships.filter(v=>v.status==='in-port'&&v.port===port);
  return '<h4>Ships Actually Alongside</h4>'+(ships.length?ships.map(v=>'<p>'+esc(v.name)+' · hull '+Number(v.condition||0).toFixed(0)+'%</p>').join(''):'<p>No personally owned merchant vessel is at this quay.</p>');
 }
 if(zone==='warehouse'){
  const goods=Array.isArray(fleet.electric?.[port])?fleet.electric[port]:[];
  const lots=Array.isArray(fleet.tradeHold?.[port])?fleet.tradeHold[port]:[];
  return '<h4>Recorded Federal Electric Goods</h4>'+(goods.length?goods.map(v=>'<p>'+esc(v.units)+' '+esc(v.productId)+' units</p>').join(''):'<p>No Federal Electric consignment has reached this storehouse.</p>')+
   '<h4>Physical Merchant Cargo</h4>'+(lots.length?lots.map(v=>'<p>'+esc(v.units+' '+v.name)+' · landed by '+esc(v.shipName||'merchant vessel')+' · invoice #'+esc(v.id)+'</p>').join(''):
    '<p>No merchant cargo has actually been landed here.</p>');
 }
 if(zone==='market'){
  const lots=Array.isArray(fleet.tradeHold?.[port])?fleet.tradeHold[port]:[];
  const authorized=fleet.ports.includes(port);
  return '<h4>Harbour Trade Agent</h4><p>'+(authorized?
   'Port trade authorization is on record. Real merchant cargo can be sold here, with local commission and customs duty.':
   'This destination is not verified for commercial shipments. Visiting does not create a trade license.')+'</p>'+
   (authorized?lots.map(lot=>{
    const quote=root.FE_MERCHANT_TRADE?.saleQuote?.(save,port,lot);
    return '<p>'+esc(lot.units+' '+lot.name)+' · manifest #'+esc(lot.id)+
     (quote?.ok?' · net receipt '+money(quote.net):'')+
     ' '+button('sell-trade:'+lot.id,'Sell Actual Landed Cargo · 15 min')+'</p>';
   }).join(''):'')+(authorized&&!lots.length?'<p>No delivered merchant cargo is currently available to sell.</p>':'');
 }
 if(zone==='customs')return'<h4>Customs</h4><p>Formal cargo inspection and customs payments are not yet simulated. No clearance is automatically granted.</p>';
  return'<h4>Harbour Street</h4><p>The district is open for short walks. No fabricated merchants or resident schedules are present.</p>';
}
function nearbyPeople(){
 if(!save?.passengerSea?.voyage)return '';
 const friends=life.nearby(save);
 return friends.length?friends.map(p=>'<div class="shipboard-nearby-person"><strong>'+
  esc(p.label)+'</strong><p>'+esc(p.description)+'</p>'+
  button('ship-talk:'+p.id+':voyage','Ask About the Voyage · 2 min')+
  button('ship-talk:'+p.id+':ship','Ask About Life Aboard · 2 min')+
  button('ship-talk:'+p.id+':cards','Ask About Cards · 2 min')+'</div>').join(''):
  '<p class="fine">Walk beside another passenger or steward to talk.</p>';
}
function shipCheckers(){
 const game=root.FE_SHIP_CHECKERS,engine=root.FE_CHECKERS,match=game?.ensure?.(save);
 if(!match||!engine)return '';
 let result='<section class="shipboard-draughts"><h4>American Draughts · Casual Checkers</h4>';
 if(!match.active){
  result+=game.opponentClose(save,save.worldCalendar?.worldMinute||0)?
   button('ship-draughts-start','Challenge the Card-Table Passenger · 10 min'):
   '<p class="fine">The other passenger must be at the table to begin draughts.</p>';
  const record=match.results.at(-1);if(record)result+='<p class="fine">Last game: '+
    (record.winner==='r'?'Charles won.':record.winner==='b'?'The passenger won.':'Drawn game.')+' '+record.ply+' half-moves.</p>';
  return result+'</section>';
 }
 const pos=match.active.position,legal=engine.options(pos);
 const sources=new Set(legal.map(m=>m.from));
 const destinations=new Set(legal.filter(m=>m.from===checkersSelected).map(m=>m.to));
 result+='<p>Red pieces are yours. Captures are compulsory. A crowned king moves both ways.</p>'+
  '<div class="shipboard-draughts-grid" role="group" aria-label="Eight by eight playable shipboard checkers game">';
 for(let i=0;i<64;i++){
  const piece=pos.board[i],dark=(Math.floor(i/8)+i%8)%2===1;
  const canPick=dark&&(sources.has(i)||destinations.has(i)||checkersSelected===i);
  const mark=piece?(piece.toLowerCase()==='r'?'●':'○')+(piece===piece.toUpperCase()?'★':''):'';
  const klass='shipboard-draughts-cell '+(dark?'dark':'light')+
   (sources.has(i)?' source':'')+(destinations.has(i)?' destination':'')+
   (checkersSelected===i?' selected':'');
  const desc='Row '+(Math.floor(i/8)+1)+' column '+(i%8+1)+', '+
   (piece?(piece.toLowerCase()==='r'?'red':'black')+(piece===piece.toUpperCase()?' king':' man'):'empty');
  if(canPick)result+='<button type="button" class="'+klass+'" data-passenger-action="ship-draughts-square:'+i+
   '" aria-label="'+desc+'">'+mark+'</button>';
  else result+='<span class="'+klass+'" aria-label="'+desc+'">'+mark+'</span>';
 }
 result+='</div><p class="fine">'+(pos.forced!==null?'Continue your compulsory capture with the same piece.':
   'Choose a highlighted red piece, then a legal destination. Each move advances the voyage by five minutes.')+'</p>'+
  '<p>Half-moves: '+pos.ply+' · No money wagered.</p>'+
  button('ship-draughts-resign','Resign & Leave Table')+'</section>';
 return result;
}
function shipScene(){
 const st=ship.ensure(save),decks=ship.decks(save);
 if(!st)return '';
 const layout=ship.deck(save,st.deck),r=st.game.round,people=life.onDeck(save,st.deck);
 let h='<section class="shipboard-scene"><h3>Walk Aboard · '+esc(layout.name)+'</h3>'+
  '<p class="fine">This entire vessel sails while you explore. One tile or staircase costs one game minute on the same world clock.</p>'+
  '<div class="shipboard-deck-list">'+decks.map(d=>'<span class="'+(d.id===st.deck?'selected':'')+'">'+esc(d.name)+'</span>').join('')+'</div>'+
  '<div class="shipboard-grid" role="grid" aria-label="Walkable passenger ship deck">';
 for(let y=0;y<9;y++)for(let x=0;x<12;x++){
  const t=layout.rows[y][x],here=st.x===x&&st.y===y,occupants=people.filter(p=>p.x===x&&p.y===y);
  const adj=Math.abs(st.x-x)+Math.abs(st.y-y)===1&&ship.allowed(t);
  const base=({'#':'▓','.':'','H':'↕','B':'▰','G':'▤','W':'◉','C':'♣','O':'◎','X':'×','~':'≈'}[t]??'');
  const sym=here?'♟':occupants.length?'◇':base;
  const label=here?'Charles':occupants.length?occupants.map(p=>p.label).join(', '):({'#':'Wall','.':'Deck','H':'Stairs','B':'Passenger berth','G':'Galley',
   'W':'Drinking water','C':'Card table','O':'Lookout','X':'Crew only','~':'Water'}[t]||'Tile')+' at '+(x+1)+','+(y+1);
  const klass='shipboard-cell tile-'+({'#':'wall','.':'floor','X':'restricted','~':'sea'}[t]||t.toLowerCase())+(here?' traveler':occupants.length?' shipmate':'');
  const data=' data-ship-square="'+x+':'+y+'" data-ship-base="'+esc(base)+'"';
  if(adj)h+='<button type="button" class="'+klass+'"'+data+' data-passenger-action="ship-walk:'+x+':'+y+'" aria-label="'+esc(label)+'">'+sym+'</button>';
  else h+='<span class="'+klass+'"'+data+' aria-label="'+esc(label)+'">'+sym+'</span>';
 }
 h+='</div><div class="shipboard-people"><h4>Travelers Aboard</h4>'+
  '<p class="fine">These are ordinary fellow travelers, not introduced Washington residents. Their deck positions follow the same game clock as the vessel.</p>'+
  '<div class="shipboard-people-list">'+life.onDeck(save,st.deck).map(p=>
   '<p>'+esc(p.label)+' · '+(p.moving?'walking across the vessel':'present on this deck')+'</p>').join('')+'</div>'+
  '<div class="shipboard-nearby">'+nearbyPeople()+'</div>'+
  '<section class="shipboard-conversation-book"><h4>Conversations This Crossing</h4>'+
  (life.ensure(save).conversations.length?life.ensure(save).conversations.slice(-5).reverse().map(e=>
    '<p>'+esc(life.PEOPLE.find(p=>p.id===e.id)?.label||'Traveler')+': '+esc(e.answer)+'</p>').join(''):
    '<p class="fine">No conversations recorded on this passage yet.</p>')+
  '</section></div><div class="shipboard-controls">';
 if(ship.tile(save,st.deck,st.x,st.y)==='H'){
  const i=decks.findIndex(d=>d.id===st.deck);
  if(i>0)h+=button('ship-deck:'+decks[i-1].id,'Climb to '+decks[i-1].name+' · 1 min');
  if(i<decks.length-1)h+=button('ship-deck:'+decks[i+1].id,'Climb to '+decks[i+1].name+' · 1 min');
 }else h+='<p class="fine">Move to ↕ for deck stairs. The × areas are reserved for the crew.</p>';
 h+='</div><div class="passenger-amenities"><h3>Things to Do Aboard</h3>'+
  '<p>Energy '+Math.round(save.characterNeeds?.meters?.energy??0)+'/100 · Hunger '+
  Math.round(save.characterNeeds?.meters?.hunger??0)+'/100 · Thirst '+
  Math.round(save.characterNeeds?.meters?.thirst??0)+'/100 · Personal cash '+money(save.personalCash)+'</p>';
 if(ship.at(save,'rest'))h+=button('cabin-rest','Sleep at Your Berth');
 if(ship.at(save,'meal'))h+=button('galley-meal','Galley Meal · $0.50');
 if(ship.at(save,'water'))h+=button('galley-water','Drinking Water · $0.10');
 if(ship.at(save,'lookout'))h+=button('ship-lookout','Watch the Sea · 5 min');
 if(ship.at(save,'cards')){
  h+=shipCheckers();
  h+='<h4>Twenty-One · Casual Game, No Wagers</h4>';
  if(!r||r.status!=='playing')h+=button('ship-card:start','Deal a Hand · 10 min');
  if(r){
   h+='<p>Your hand: '+esc(r.player.map(ship.cardLabel).join(' '))+' ('+ship.score(r.player)+
    ') · Opponent: '+(r.status==='playing'?esc(ship.cardLabel(r.house[0]))+' ?':
    esc(r.house.map(ship.cardLabel).join(' '))+' ('+ship.score(r.house)+')')+'</p>';
   if(r.status==='playing')h+=button('ship-card:hit','Draw · 5 min')+button('ship-card:stand','Stand · 10 min');
   else h+='<p>Result: <strong>'+esc(r.status)+'</strong>. No cash has changed hands.</p>';
  }
 }
 if(!['rest','meal','water','lookout','cards'].some(kind=>ship.at(save,kind)))
  h+='<p class="fine">Walk to a berth ▰, galley ▤, water ◉, card table ♣ or lookout ◎ to use its facilities.</p>';
 return h+'</div></section>';
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
 html+='</div><div class="passenger-local-register">'+localRecords(state.port,p.zone)+'</div><p class="fine">WASD or arrow keys walk one tile. Choose another section to move to its public approach (one game minute). Locked barriers remain impassable.</p>';
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
  const meters=save.characterNeeds?.meters||{};
  body='<div class="passenger-voyage-summary"><p>From <b>'+esc(trip.from)+'</b> to <b>'+esc(trip.to)+'</b> · '+esc(trip.type)+'</p>'+
   '<p>Estimated arrival: <b>'+esc(trip.etaDate)+'</b> · '+travel.daysRemaining+' days remaining.</p>'+
   '<p>'+(travel.feeder?(trip.returning?'On the final Baltimore-to-Washington river/coastal connection.':'On the initial Washington-to-Baltimore river/coastal connection.'):'At sea along the charted ocean route.')+
   ' · '+Math.floor(travel.progress*100)+'% of total passage elapsed.</p>'+
   (trip.weather?.observed&&trip.weather.delayMinutes?
    '<p class="passenger-weather-notice">Rough-sea delay recorded: '+(trip.weather.delayMinutes/60).toFixed(0)+' hours. Revised arrival: <strong>'+esc(trip.etaDate)+'</strong>.</p>':
    '<p class="fine">Arrival is an estimate. Rough seas may change the schedule during the crossing.</p>')+'</div>'+
   shipScene()+'<div class="passenger-sea-map"><svg viewBox="0 0 800 600" role="img" aria-label="Current passenger vessel on the original maritime route chart">'+
   '<image href="'+esc(nav.MAP)+'" width="800" height="600"/>'+
   '<polyline points="'+trip.points.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#7b2c24" stroke-width="4" stroke-dasharray="9 6"/>'+
   (travel.coordinates?'<circle id="passengerLiveShip" cx="'+travel.coordinates.x+'" cy="'+travel.coordinates.y+'" r="14" fill="#f4d16d" stroke="#432a1e" stroke-width="3"/>'+
   '<text id="passengerLiveLabel" x="'+travel.coordinates.x+'" y="'+(travel.coordinates.y+5)+'" text-anchor="middle" fill="#251f1b" font-size="17">♟</text>':'')+
   '</svg></div>'+
   '<div class="passenger-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.floor(travel.progress*100)+'"><span style="width:'+Math.floor(travel.progress*100)+'%"></span></div>'+
   '<div class="passenger-time-actions">'+
    button('shipping-map','Inspect Full World Shipping Chart')+
    button('advance-day',save.phase==='report'?'Review Complete · Begin Next Day':'Advance Through Current Phase')+
    '<p class="fine">All hours pass through the saved Washington clock. Daily reports, health, world events and expenses remain active. No real-time skipping.</p></div>';

  const notices=st.history.filter(e=>e.id===trip.id&&(e.kind==='embarked'||e.kind==='weather-delay')).slice(-3);
  if(notices.length)body+='<section class="passenger-voyage-notices"><h3>Captain’s Passage Register</h3>'+
    notices.map(e=>'<p>'+esc(e.date)+' · '+(e.kind==='weather-delay'?
     'Rough seas delayed arrival by '+Math.round(e.delayMinutes/60)+' hours.':'Fare paid and berth issued.')+'</p>').join('')+'</section>';
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
 if(cmd==='cabin-rest'){changed(actions?.cabinRest?.());return}
 if(cmd==='harbor-rest'){changed(actions?.harborRest?.());return}
 if(cmd.startsWith('sell-trade:')){changed(actions?.portTradeSale?.(cmd.slice(11)));return}
 if(cmd==='galley-meal'){changed(actions?.galleyMeal?.());return}
 if(cmd==='galley-water'){changed(actions?.galleyWater?.());return}
 if(cmd.startsWith('ship-walk:')){const [,x,y]=cmd.split(':');changed(actions?.shipWalk?.(+x,+y));return}
 if(cmd.startsWith('ship-deck:')){changed(actions?.shipDeck?.(cmd.slice(10)));return}
 if(cmd==='ship-draughts-start'){checkersSelected=null;changed(actions?.shipCheckerStart?.());return}
 if(cmd==='ship-draughts-resign'){checkersSelected=null;changed(actions?.shipCheckerResign?.());return}
 if(cmd.startsWith('ship-draughts-square:')){
  const to=Number(cmd.slice('ship-draughts-square:'.length));
  const game=root.FE_SHIP_CHECKERS?.ensure?.(save)?.active?.position;
  const engine=root.FE_CHECKERS;
  if(!game||!engine)return;
  const legal=engine.options(game);
  if(legal.some(m=>m.from===checkersSelected&&m.to===to)){
   const from=checkersSelected;
   const result=actions?.shipCheckerMove?.(from,to);
   checkersSelected=result?.ok&&result.continues?to:null;
   changed(result);return;
  }
  if(legal.some(m=>m.from===to)){checkersSelected=to;draw();return}
  checkersSelected=null;notify('Select a red piece with a legal move.');draw();return;
 }
 if(cmd.startsWith('ship-card:')){changed(actions?.shipCard?.(cmd.slice(10)));return}
 if(cmd==='ship-lookout'){changed(actions?.shipLookout?.());return}
 if(cmd.startsWith('ship-talk:')){const [,id,topic]=cmd.split(':');changed(actions?.shipTalk?.(id,topic));return}
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
 if(e.target?.closest('input,textarea,select,[contenteditable],.shipboard-draughts-grid'))return;
 if(e.key==='Escape'&&booking){booking=false;draw();return}
 const state=sea.ensure(save);
 if(!state.port&&!state.voyage)return;
 const moves={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],
  w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};
 const dir=moves[e.key];if(!dir)return;
 e.preventDefault();
 if(state.voyage){const pos=ship.ensure(save);if(pos)changed(actions?.shipWalk?.(pos.x+dir[0],pos.y+dir[1]));return}
 changed(actions?.move?.(state.position.zone,state.position.x+dir[0],state.position.y+dir[1]));
}
// Display-only refresher. The authoritative game tick moves the ship, never this interval.
// Browser-only: requiring the UI in Node regression tests must not leave a live timer.
if(typeof document!=='undefined')root.setInterval?.(()=>{
 if(!host||host.hidden||booking||!save?.passengerSea?.voyage)return;
 const live=sea.position(save),dot=host.querySelector('#passengerLiveShip');
 if(dot&&live.coordinates){dot.setAttribute('cx',live.coordinates.x);dot.setAttribute('cy',live.coordinates.y);const icon=host.querySelector('#passengerLiveLabel');if(icon){icon.setAttribute('x',live.coordinates.x);icon.setAttribute('y',live.coordinates.y+5)}}
 const pct=Math.floor((live.progress||0)*100),bar=host.querySelector('.passenger-progress');
 if(bar){bar.setAttribute('aria-valuenow',pct);const fill=bar.querySelector('span');if(fill)fill.style.width=pct+'%'}
 const board=ship.ensure(save);
 if(board){
  const occupants=life.onDeck(save,board.deck),nearby=host.querySelector('.shipboard-nearby');
  for(const cell of host.querySelectorAll('[data-ship-square]')){
   const [x,y]=cell.dataset.shipSquare.split(':').map(Number),other=occupants.filter(p=>p.x===x&&p.y===y);
   const here=board.x===x&&board.y===y;
   const glyph=here?'♟':other.length?'◇':cell.dataset.shipBase;
   if(cell.textContent!==glyph)cell.textContent=glyph;
   cell.classList.toggle('shipmate',!here&&other.length>0);
   if(other.length)cell.setAttribute('title',other.map(p=>p.label).join(', '));
   else cell.removeAttribute('title');
  }
  if(nearby){const next=nearbyPeople();if(nearby.innerHTML!==next)nearby.innerHTML=next}
 }

},1000);
const api=Object.freeze({refresh,updatePier,showBooking});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PASSENGER_UI=api;
})(typeof window!=='undefined'?window:globalThis);
