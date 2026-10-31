/* Victorian overhead checkers table. Uses existing generic portrait frames;
 * no new character artwork or changes to approved Washington geometry. */
(function(root){'use strict';
const $=id=>document.getElementById(id);
const engine=()=>root.FE_CHECKERS;
const place=()=>root.FE_CITY?.currentLocation?.();
const attendees=p=>(root.FE_NPC_AI?.visibleAt?.(p.locationId)||[]).filter(x=>x.roomId===p.roomId);
const saveData=()=>typeof S==='object'?S:null;
let source=null,notice='',busy=false;
function allowed(){
 const p=place(),overlay=$('cityRoomOverlay');
 return !!p&&overlay?.hidden===false&&engine()?.venue(p.locationId,p.roomId);
}
function persist(){if(typeof save==='function')return save(true);return false}
function name(){return root.FE_CHARACTERS?.get?.(saveData()?.characterRoute||'industrialist')?.characterName||'You'}
function host(){
 let panel=$('cityRoomCheckers');if(panel)return panel;
 const anchor=document.querySelector('#cityRoomOverlay .city-room-placeholder');if(!anchor)return null;
 panel=document.createElement('section');panel.id='cityRoomCheckers';panel.className='fe-checkers-salon';
 panel.setAttribute('aria-label','Washington draughts and checkers table');
 panel.hidden=true;
 // Static, locally authored markup, without external HTML/assets.
 panel.innerHTML='<div class="fe-checkers-header"><span>WASHINGTON PARLOR GAMES · NO WAGERS</span><h4>Checkers · American Draughts</h4><p>Capture when possible. Complete every jump. A king moves both ways.</p></div><div id="feCheckersGuests"></div><div id="feCheckersMatch" hidden></div><p id="feCheckersNotice" role="status" aria-live="polite"></p><div id="feCheckersLedger"></div>';
 anchor.appendChild(panel);return panel;
}
function el(tag,cls,label){const x=document.createElement(tag);if(cls)x.className=cls;if(label!==undefined)x.textContent=label;return x}
function button(label,fn,cls){const x=el('button',cls,label);x.type='button';x.onclick=fn;return x}
function tell(message){notice=message;const node=$('feCheckersNotice');if(node)node.textContent=message}
function portrait(label,side){
 const fig=el('figure','fe-chess-person fe-chess-person-'+side);
 const picture=el('div','fe-chess-portrait');
 picture.setAttribute('role','img');picture.setAttribute('aria-label','Generic period portrait of '+label);
 fig.appendChild(picture);fig.appendChild(el('figcaption','',label));return fig;
}
function startBox(){
 const mount=$('feCheckersGuests');mount.replaceChildren();
 const p=place(),present=attendees(p),s=saveData();
 if(!s){mount.append(el('p','', 'Select a career before joining a table.'));return}
 if(!present.length){mount.append(el('p','', 'No named resident is currently present to challenge.'));return}
 mount.append(el('p','', 'Present residents: '+present.map(x=>x.name).join(', ')));
 const select=el('select');select.setAttribute('aria-label','Choose a checkers opponent');
 for(const resident of present){const o=el('option','',resident.name);o.value=resident.id;select.append(o)}
 const first=present[0];if(first)select.value=first.id;
 const strength=el('select');strength.setAttribute('aria-label','Checkers opponent difficulty');
 for(const [value,label] of [['2','Novice · 2 turns ahead'],['3','Club player · 3 turns ahead'],
   ['4','Strong · 4 turns ahead'],['5','Expert · 5 turns ahead']]){
  const item=el('option','',label);item.value=value;strength.append(item);
 }
 strength.value=String(Math.max(2,Math.min(5,Number(s.checkersAiDepth)||4)));
 const begin=button('Challenge to Checkers · 1 min',()=>{
  if(busy||!allowed()||s.paused||s.phase!=='day'&&s.phase!=='night')return;
  const here=place(),opponent=attendees(here).find(x=>x.id===select.value);
  if(!opponent){tell('That resident has left.');return}
  if(!root.FE_WASHINGTON_TIME?.canSpend?.(s,60)){tell('Insufficient time to open a match.');return}
  busy=true;
  try{
   const match=engine().start(s,{...here,venueName:root.FederalElectricCity?.getLocation?.(here.locationId)?.name||here.locationId,
    playerId:'player:'+(typeof activeProfileId==='function'?activeProfileId():'current'),
    playerName:name(),opponentId:opponent.id,opponentName:opponent.name,present:attendees(here)});
   if(!match.ok){tell(match.reason);return}
   const elapsed=root.advanceWorldTime?.(60,true);
   if(elapsed!==60){engine().state(s).active=null;tell('The clock did not accept the challenge.');return}
   s.checkersAiDepth=Number(strength.value);
   engine().state(s).active.aiDepth=s.checkersAiDepth;
   source=null;tell('The red pieces are yours. Select a piece to begin.');
   persist();refresh();
  }finally{busy=false}
 },'fe-checkers-primary');
 const actions=el('div','fe-checkers-start');actions.append(select,strength,begin);mount.append(actions);
}
function selectedMoves(game){return source===null?[]:engine().options(game.position).filter(m=>m.from===source)}
function renderBoard(game){
 const mount=$('feCheckersMatch');mount.replaceChildren();
 const table=el('div','fe-checkers-overhead');
 table.append(portrait(game.opponentName,'top'));
 const frame=el('div','fe-checkers-frame'),grid=el('div','fe-checkers-board');
 grid.setAttribute('role','group');grid.setAttribute('aria-label','Checkers board seen from above; red player at bottom, black NPC at top');
 const legal=selectedMoves(game),forced=game.position.forced;
 for(let r=0;r<8;r++)for(let c=0;c<8;c++){
  const index=r*8+c,piece=game.position.board[index];
  const dark=(r+c)%2===1;
  const cell=button('',()=>tap(index),'fe-checkers-square '+(dark?'fe-checkers-dark':'fe-checkers-light')+
   (source===index?' fe-checkers-selected':'')+(legal.some(m=>m.to===index)?' fe-checkers-legal':''));
  cell.dataset.index=String(index);
  cell.setAttribute('aria-label','row '+(r+1)+' column '+(c+1)+' · '+
   (piece?(piece.toLowerCase()==='r'?'red':'black')+(piece===piece.toUpperCase()?' king':' man'):'empty'));
  if(piece){
   const disc=el('span','fe-checkers-disc fe-checkers-disc-'+piece.toLowerCase()+(piece===piece.toUpperCase()?' fe-checkers-king':''));
   disc.setAttribute('aria-hidden','true');
   if(piece===piece.toUpperCase())disc.textContent='★';
   cell.append(disc);
  }
  grid.append(cell);
 }
 frame.append(grid);table.append(frame,portrait(game.playerName,'bottom'));
 mount.append(table);
 const moves=engine().options(game.position);
 const caption=forced!==null?'Multiple capture: the same piece must jump again.':
  moves.some(x=>x.capture!==null)?'Mandatory capture. Select a piece that can jump.':
   'Red to play. Select one of your pieces, then a highlighted square.';
 mount.append(el('p','fe-checkers-turn',caption+' · AI depth: '+(game.aiDepth||4)));
 mount.append(button('Resign & Leave Table',()=>{
  if(busy)return;const result=engine().abandon(saveData());
  if(result){persist();source=null;tell('You resigned. A real loss is recorded.');refresh();}
 },'fe-checkers-resign'));
 const present=attendees(place());
 if(!present.some(x=>x.id===game.opponentId)){
  mount.append(el('p','fe-checkers-warning','Your opponent has left this table.'));
  mount.append(button('Record Opponent Departure',()=>{
   if(busy)return;const result=engine().departed(saveData());
   if(result){persist();source=null;tell('Opponent absent; a forfeit was recorded.');refresh();}
  }));
 }
}
function tap(index){
 if(busy||!allowed())return;
 const s=saveData(),game=s?.checkersCircuit?.active;
 if(!game||s.paused||s.phase==='report')return;
 const p=game.position,b=p.board[index],options=engine().options(p);
 if(source===null){
  if(b&&b.toLowerCase()==='r'&&options.some(x=>x.from===index)){source=index;refresh()}
  return;
 }
 if(index===source&&p.forced===null){source=null;refresh();return}
 if(b&&b.toLowerCase()==='r'&&p.forced===null&&options.some(x=>x.from===index)){source=index;refresh();return}
 const selected=options.find(x=>x.from===source&&x.to===index);
 if(!selected){tell('Illegal move. Captures and further jumps are compulsory.');return}
 if(!root.FE_WASHINGTON_TIME?.canSpend?.(s,60)){tell('Not enough time for another move.');return}
 const elapsed=root.advanceWorldTime?.(60,true);
 if(elapsed!==60){tell('The move was not recorded because time did not advance.');return}
 busy=true;
 try{
  const reply=engine().play(s,source,index,{...place(),present:attendees(place()),at:root.FE_WASHINGTON_TIME.now(s)?.iso});
  if(reply.ok){
   source=reply.continues?index:null;
   tell(reply.receipt?'Match finished and recorded.':
    reply.continues?'Continue jumping with the highlighted piece.':
    'Your move accepted. The opponent played '+reply.opponent.length+' legal step(s).');
  }else{source=null;tell(reply.reason)}
  persist();refresh();
 }finally{busy=false}
}
function recent(){
 const mount=$('feCheckersLedger');mount.replaceChildren();
 mount.append(el('h5','', 'Washington Checkers Record'));
 const results=(saveData()?.checkersCircuit?.results||[]).slice(-6).reverse();
 if(!results.length){mount.append(el('p','', 'No completed checkers matches recorded.'));return}
 for(const r of results)mount.append(el('p','fe-checkers-ledger',
  r.at.slice(0,10)+' · '+r.red.name+' v. '+r.black.name+' · '+
  (r.winnerId?(r.winnerId===r.red.id?r.red.name:r.black.name)+' won':'Draw')+' ('+r.reason+')'));
}
function refresh(){
 const panel=host();if(!panel)return;
 const active=allowed();panel.hidden=!active;
 if(!active)return;
 const g=saveData()?.checkersCircuit?.active,guests=$('feCheckersGuests'),match=$('feCheckersMatch'),here=place();
 if(g&&g.locationId===here.locationId&&g.roomId===here.roomId){
  guests.hidden=true;match.hidden=false;renderBoard(g);
 }else{match.hidden=true;guests.hidden=false;startBox();}
 $('feCheckersNotice').textContent=notice;recent();
}
function beforeTravel(locationId,roomId){
 const s=saveData(),g=s?.checkersCircuit?.active;
 if(g&&(g.locationId!==locationId||g.roomId!==roomId)){
  const result=engine().abandon(s);
  if(result)persist();source=null;notice='Leaving the table forfeited the match.';
 }
}
function beforeClose(){beforeTravel(null,null)}
root.FE_CHECKERS_UI=Object.freeze({refresh,beforeTravel,beforeClose});
})(typeof window!=='undefined'?window:globalThis);
