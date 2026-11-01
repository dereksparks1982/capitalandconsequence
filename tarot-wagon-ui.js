/* The traveling reader chooses the cards and interprets them.
 * This visiting circus pitch is a first playable encounter; a separately
 * roaming owned wagon and original card artwork will follow.
 */
(function(root){
'use strict';
if(typeof document==='undefined')return;
let panel=null,sessionSave=null,requestReading=null;
function ensurePanel(){
 if(panel?.isConnected)return panel;
 panel=document.createElement('section');panel.id='ccTarotWagon';panel.className='cc-tarot-wagon';panel.hidden=true;
 panel.setAttribute('aria-label','Traveling fortune-teller reading');
 panel.innerHTML='<h4>◈ THE FORTUNE-TELLER’S WAGON</h4>'+
  '<p>She shuffles the deck and chooses the cards. The reading concerns your life in Washington, not the person playing the game.</p>'+
  '<button type="button" data-tarot-request>Request a Three-Card Reading · 10¢ · 10 game min</button>'+
  '<div data-tarot-cards></div><p data-tarot-status role="status" aria-live="polite"></p>';
 document.querySelector('#cityRoomOverlay .city-room-placeholder')?.prepend(panel);
 panel.querySelector('[data-tarot-request]').addEventListener('click',()=>{
  const result=requestReading?.();
  const info=panel.querySelector('[data-tarot-status]');
  info.textContent=result?.ok?'The fortune-teller turns your cards one at a time.':result?.reason||'The reader cannot see you now.';
  renderRecent();
 });
 return panel;
}
function renderRecent(){
 if(!panel||panel.hidden||!sessionSave)return;
 const book=panel.querySelector('[data-tarot-cards]');book.replaceChildren();
 const engagement=root.FE_CIRCUS_TOUR?.active?.(sessionSave);
 const last=(sessionSave.tarotSessions||[]).filter(x=>x.readerId==='visiting-fortune-teller'&&
  typeof x.encounterId==='string'&&x.encounterId.includes(engagement?.id||'not-a-visit')).at(-1);
 if(!last||!Array.isArray(last.cards))return;
 const interpretation=last.interpretation||root.FE_TAROT_INTERPRETATION?.interpret?.(sessionSave,last)?.reading;
 if(!interpretation)return;
 const introduction=document.createElement('p');introduction.textContent=interpretation.intro;book.append(introduction);
 const row=document.createElement('div');row.className='cc-tarot-cards';
 for(let i=0;i<last.cards.length;i++){
  const card=last.cards[i],passage=interpretation.passages[i],slot=document.createElement('article');
  slot.className='cc-tarot-card';
  const glyph=document.createElement('div');glyph.className='cc-tarot-card-glyph';glyph.textContent='✧';
  const name=document.createElement('b');name.textContent=card.name;
  const label=document.createElement('small');label.textContent=card.position+(card.reversed?' · REVERSED':'');
  const text=document.createElement('p');text.textContent=passage?.meaning||'';
  slot.append(glyph,name,label,text);row.appendChild(slot);
 }
 book.appendChild(row);
 const end=document.createElement('p');end.textContent=interpretation.closing;book.appendChild(end);
}
function render(save,request,{locationId,dev=false}={}){
 sessionSave=save;requestReading=request;
 const node=ensurePanel(),show=root.FE_CIRCUS_TOUR?.active?.(save);
 node.hidden=!show||dev||locationId!==show.locationId||save.currentLocation?.locationId!==show.locationId||
  !!document.getElementById('cityRoomOverlay')?.hidden;
 if(!node.hidden)renderRecent();
}
root.FE_TAROT_WAGON_UI=Object.freeze({render,refresh:renderRecent});
})(typeof window!=='undefined'?window:globalThis);
