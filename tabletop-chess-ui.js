/* Top-down tabletop chess UI, original generic portraits and CSS artwork.
   This is separate from vendor/chessjs: no upstream board art is imported. */
(function(root){'use strict';
const PIECE={'wk':'♔','wq':'♕','wr':'♖','wb':'♗','wn':'♘','wp':'♙',
 'bk':'♚','bq':'♛','br':'♜','bb':'♝','bn':'♞','bp':'♟'};
let chosen=null,first=null,lastMessage='',busy=false;
const el=id=>document.getElementById(id);
const chess=()=>root.FE_CHESS;
const current=()=>root.FE_CITY?.currentLocation?.();
const saveState=()=>typeof S==='object'?S:null;
function attendees(place){return (root.FE_NPC_AI?.visibleAt?.(place.locationId)||[])
 .filter(x=>x.roomId===place.roomId);}
function validRoom(){
 const here=current(),overlay=el('cityRoomOverlay');
 return !!here&&!overlay?.hidden&&chess()?.venue(here.locationId,here.roomId);
}
function persist(){if(typeof save==='function')save(true)}
function names(){
 const route=saveState()?.characterRoute||'industrialist';
 return root.FE_CHARACTERS?.get?.(route)?.characterName||'You';
}
function host(){
 const anchor=document.querySelector('#cityRoomOverlay .city-room-placeholder');
 if(!anchor)return null;
 let section=el('cityRoomChess');
 if(section)return section;
 section=document.createElement('section');
 section.id='cityRoomChess';section.className='fe-chess-salon';
 section.hidden=true;section.setAttribute('aria-label','Washington chess table');
 section.innerHTML='<div class="fe-chess-header"><div><span class="fe-chess-eyebrow">WASHINGTON PARLOR GAMES · NO WAGERS</span><h4>Chess Table</h4><p>Find a guest who is physically here. Each played turn costs one minute.</p></div><span class="fe-chess-mini-badge">1878 EDITION</span></div><div id="feChessLounge"></div><div id="feChessGame" hidden></div><p id="feChessNotice" class="fe-chess-notice" role="status" aria-live="polite"></p><div id="feChessResults"></div>';
 anchor.appendChild(section);return section;
}
function element(tag,cls,txt){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x}
function button(label,fn,cls){const b=element('button',cls,label);b.type='button';b.onclick=fn;return b}
function portrait(name,side){
 const wrap=element('figure','fe-chess-person fe-chess-person-'+side);
 const round=element('div','fe-chess-portrait');round.setAttribute('role','img');round.setAttribute('aria-label','Generic Victorian silhouette portrait of '+name);
 wrap.appendChild(round);wrap.appendChild(element('figcaption','',name));
 return wrap;
}
function lodgeGame(){
 const view=el('feChessLounge');view.replaceChildren();
 const here=current(),list=attendees(here),s=saveState();
 if(!s){view.appendChild(element('p','', 'Choose a career to play chess.'));return;}
 if(!list.length){view.appendChild(element('p','', 'No resident is presently seated in this room. Return when a potential opponent is here.'));return;}
 view.appendChild(element('p','', 'Guests present: '+list.map(x=>x.name).join(', ')));
 const box=element('div','fe-chess-intro');
 const select=element('select');select.setAttribute('aria-label','Choose a chess opponent');
 for(const x of list){const opt=element('option','',x.name);opt.value=x.id;select.appendChild(opt)}
 if(chosen&&list.some(x=>x.id===chosen))select.value=chosen;
 select.onchange=()=>chosen=select.value;
 box.appendChild(select);
 const start=button('Challenge to Chess · 1 min',()=>{
  if(busy)return;const target=list.find(x=>x.id===select.value);if(!target)return;
  const saveData=saveState(),place=current();
  if(!place||!validRoom()||saveData.paused||saveData.phase==='report')return;
  if(!root.FE_WASHINGTON_TIME?.canSpend?.(saveData,60)){notify('The clock cannot accommodate another turn.');return;}
  busy=true;
  try{
   const result=chess().start(saveData,{locationId:place.locationId,roomId:place.roomId,
    venueName:root.FederalElectricCity?.getLocation?.(place.locationId)?.name||place.locationId,
    playerId:'player:'+ (typeof activeProfileId==='function'?activeProfileId():'current'),
    playerName:names(),opponentId:target.id,opponentName:target.name,present:attendees(place)});
   if(!result.ok){notify(result.reason);return;}
   const elapsed=root.advanceWorldTime?.(60,true);
   if(elapsed!==60){chess().state(saveData).active=null;notify('Clock could not advance; the challenge was not registered.');return;}
   first=null;notify('The opening pieces are set. You play white.');
   persist();refresh();
  }finally{busy=false;}
 },'fe-chess-primary');
 box.appendChild(start);view.appendChild(box);
}
function notify(msg){lastMessage=msg;const node=el('feChessNotice');if(node)node.textContent=msg}
function makeBoard(game){
 const mount=el('feChessGame');mount.replaceChildren();
 const board=chess().reconstruct(game.moves);
 const table=element('div','fe-chess-overhead');
 const upper=portrait(game.opponentName,'top');
 table.appendChild(upper);
 const felt=element('div','fe-chess-felt');
 const surround=element('div','fe-chess-board-surround');
 const tiles=element('div','fe-chess-board');tiles.setAttribute('role','group');tiles.setAttribute('aria-label','Chess board viewed from above, white at bottom');
 const files='abcdefgh';
 for(let rank=8;rank>=1;rank--)for(let col=0;col<8;col++){
  const square=files[col]+rank,piece=board.get(square);
  const cell=button(piece?PIECE[piece.color+piece.type]:'',()=>tap(square),'fe-chess-square '+((rank+col)%2===0?'dark':'light')+
   (piece?' fe-chess-piece-'+piece.color:'')+(first===square?' chosen':''));
  cell.setAttribute('aria-label',square+(piece?' '+(piece.color==='w'?'white ':'black ')+piece.type:' empty'));
  cell.dataset.square=square;
  if(first&&chess().legal(saveState(),first).includes(square))cell.classList.add('possible');
  if(board.in_check()&&piece?.type==='k'&&piece.color===board.turn())cell.classList.add('check');
  tiles.appendChild(cell);
 }
 surround.appendChild(tiles);felt.appendChild(surround);table.appendChild(felt);
 table.appendChild(portrait(game.playerName,'bottom'));
 mount.appendChild(table);
 const control=element('div','fe-chess-commands');
 control.appendChild(element('p','',game.moves.length?'Moves: '+game.moves.join(' '):'White moves first. Select a piece, then a legal destination.'));
 control.appendChild(button('Resign & Leave Table',()=>{if(busy)return;const receipt=chess().abandon(saveState());if(receipt)persist();first=null;notify('You resigned the match.');refresh();},'fe-chess-resign'));
 mount.appendChild(control);
 const live=attendees(current());
 if(!live.some(x=>x.id===game.opponentId)){
  mount.appendChild(element('p','fe-chess-warning','Your opponent is no longer in this room. The game cannot continue.'));
  mount.appendChild(button('Record Opponent Departure',()=>{
   const receipt=chess().departed(saveState());
   if(receipt)persist();first=null;notify('The opponent departed; the match is recorded as a forfeit in your favor.');refresh();
  }));
 }
}
function tap(square){
 if(busy||!validRoom())return;
 const s=saveState(),g=s?.chessCircuit?.active;
 if(!g||s.paused||s.phase==='report')return;
 const board=chess().reconstruct(g.moves),p=board.get(square);
 if(!first){if(p?.color==='w'){first=square;refresh()}return}
 if(first===square){first=null;refresh();return}
 if(p?.color==='w'){first=square;refresh();return}
 const source=first;first=null;
 if(!chess().legal(s,source).includes(square)){notify('That move is not legal.');refresh();return;}
 if(!root.FE_WASHINGTON_TIME?.canSpend?.(s,60)){notify('There is no game time available.');return;}
 busy=true;
 try{
  const elapsed=root.advanceWorldTime?.(60,true);
  if(elapsed!==60){notify('The game clock did not advance.');return;}
  const receipt=chess().play(s,source,square,{...current(),present:attendees(current()),at:root.FE_WASHINGTON_TIME.now(s)?.iso});
  notify(receipt.ok?(receipt.receipt?'Match finished.':receipt.player+' · opponent '+receipt.opponent):receipt.reason);
  persist();refresh();
 }finally{busy=false}
}
function standings(){
 const panel=el('feChessResults');panel.replaceChildren();
 const s=saveState(),ledger=s?.chessCircuit;if(!ledger)return;
 panel.appendChild(element('h5','', 'Washington Chess Record'));
 const games=(ledger.results||[]).slice(-7).reverse();
 if(!games.length){panel.appendChild(element('p','', 'No completed chess matches recorded.'));return;}
 for(const match of games){
  panel.appendChild(element('p','fe-chess-ledger',match.at.slice(0,10)+' · '+match.white.name+' / '+match.black.name+
   ' · '+(match.winnerId?(match.winnerId===match.white.id?match.white.name:match.black.name)+' won': 'draw')+
   ' · '+match.reason));
 }
}
function refresh(){
 const panel=host();if(!panel)return;
 const on=validRoom();panel.hidden=!on;
 if(!on)return;
 const s=saveState(),g=s?.chessCircuit?.active,view=el('feChessGame'),lounge=el('feChessLounge');
 if(g&&g.locationId===current().locationId&&g.roomId===current().roomId){
  lounge.hidden=true;view.hidden=false;makeBoard(g);
 }else{view.hidden=true;lounge.hidden=false;lodgeGame();}
 el('feChessNotice').textContent=lastMessage;
 standings();
}
function beforeTravel(locationId,roomId){
 const s=saveState(),g=s?.chessCircuit?.active;
 if(g&&(g.locationId!==locationId||g.roomId!==roomId)){
  const receipt=chess().abandon(s);
  if(receipt)persist();
  first=null;lastMessage='Departing the room forfeited the active chess match.';
 }
}
function beforeClose(){beforeTravel(null,null)}
root.FE_CHESS_UI=Object.freeze({refresh,beforeTravel,beforeClose});
})(typeof window!=='undefined'?window:globalThis);
