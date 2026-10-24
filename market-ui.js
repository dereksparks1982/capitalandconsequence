/* v0.6.88: Chinatown market counter shared with simulated households. */
(function(){
'use strict';
const $=id=>document.getElementById(id),commerce=()=>window.FE_WASHINGTON_COMMERCE;
let message='';
function permitted(){
 const p=window.FE_CITY?.currentLocation?.(),t=window.FE_WASHINGTON_TIME?.now?.(S);
 return !!p&&p.locationId==='oldChinatown'&&p.roomId==='market-street'&&!window.FE_CITY?.isDevRoom?.()&&S.phase==='day'&&!S.paused&&t?.minuteOfDay>=480&&t.minuteOfDay<1020&&typeof activeProfileId==='function'&&!!activeProfileId();
}
function buy(id){
 if(!permitted()){message='The market is closed or you are not at its counter.';render();return;}
 const model=commerce(),m=model.ensure(S),good=model.GOODS.find(x=>x.id===id);
 if(!good||m.stock[id]<1){message='Sold out. Await the next physical delivery.';render();return;}
 if(Math.round(S.personalCash*100)<good.cents){message='Not enough personal cash.';render();return;}
 if(window.advanceWorldTime(300)!==300){message='Trading hours ended before the purchase.';render();return;}
 const sale=model.purchase(S,'player',id,{date:S.gameDate});
 message=sale.ok?'Purchased '+good.label+' for '+good.cents+'¢. Merchant stock and cash updated.':sale.reason;
 save(true);render();
}
function use(id){
 if(!permitted()){message='You must be at the market to sort your shopping bag.';render();return;}
 if(window.advanceWorldTime(60)!==60){message='Could not complete this action.';render();return;}
 const consumed=commerce().consume(S,id);
 message=consumed.ok?'Used '+consumed.good.label+'.':consumed.reason;
 save(true);render();
}
function render(){
 const panel=$('cityRoomMarket');if(!panel)return;
 const current=window.FE_CITY?.currentLocation?.();
 const here=current?.locationId==='oldChinatown'&&current?.roomId==='market-street'&&!window.FE_CITY?.isDevRoom?.();
 panel.hidden=!here;if(!here)return;
 const m=commerce().ensure(S),open=permitted(),list=$('cityRoomMarketGoods'),bag=$('cityRoomMarketBag');
 const note=$('cityRoomMarketNote');if(note)note.textContent=message||'Cash purchases use your personal account. Every sale reduces the actual merchant stock.';
 if(list){
  list.replaceChildren();
  for(const g of commerce().GOODS){
   const row=document.createElement('div'),text=document.createElement('span'),button=document.createElement('button');
   text.textContent=g.label+' · '+g.cents+'¢ · '+m.stock[g.id]+' in stock';
   button.type='button';button.textContent='Buy';button.disabled=!open||m.stock[g.id]<1||Math.round(S.personalCash*100)<g.cents||m.playerBag.length>=24;
   button.onclick=()=>buy(g.id);row.append(text,button);list.appendChild(row);
  }
 }
 if(bag){
  bag.replaceChildren();
  const title=document.createElement('p');title.textContent='Shopping bag: '+m.playerBag.length+'/24 purchased items. Personal cash: $'+Number(S.personalCash).toFixed(2);bag.appendChild(title);
  for(const item of m.playerBag){
   const row=document.createElement('div'),text=document.createElement('span'),button=document.createElement('button');
   text.textContent=item.label+' · '+item.date;button.type='button';button.textContent='Use';button.disabled=!open;button.onclick=()=>use(item.id);
   row.append(text,button);bag.appendChild(row);
  }
 }
}
window.FE_MARKET_UI=Object.freeze({render});
})();
