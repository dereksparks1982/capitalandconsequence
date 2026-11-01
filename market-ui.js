/* v0.6.88: Chinatown market counter shared with simulated households. */
(function(){
'use strict';
const $=id=>document.getElementById(id),commerce=()=>window.FE_WASHINGTON_COMMERCE;
function marketSite(){
 const here=window.FE_CITY?.currentLocation?.();
 if(here?.locationId==='oldChinatown'&&here.roomId==='market-street')return '';
 if(here?.locationId==='hillsdale'&&['hillsdale-market','hillsdale-butcher'].includes(here.roomId))return here.roomId;
 if(here?.locationId==='easternMarket'&&here.roomId==='market-hall')return 'easternMarket';
 if(here?.locationId==='georgetownMarketHouse'&&here.roomId==='market-hall')return 'georgetownMarketHouse';
 if(here?.locationId==='centerMarket'&&['market-hall','wholesale-counter'].includes(here.roomId))return 'centerMarket';
 return null;
}
let message='',filter='',category='all';
function permitted(){
 const p=window.FE_CITY?.currentLocation?.(),t=window.FE_WASHINGTON_TIME?.now?.(S);
 return !!p&&marketSite()!==null&&!window.FE_CITY?.isDevRoom?.()&&S.phase==='day'&&!S.paused&&t?.minuteOfDay>=480&&t.minuteOfDay<1020&&typeof activeProfileId==='function'&&!!activeProfileId();
}
function buy(id){
 if(!permitted()){message='The market is closed or you are not at its counter.';render();return;}
 const model=commerce(),m=model.ensure(S),site=marketSite(),stock=site?m.siteStocks[site]:m.stock,good=model.GOODS.find(x=>x.id===id);
 if(!good||!(site===''?model.SITES.oldChinatown.has(id):model.allowedAt(id,site))||stock[id]<1){message='Sold out. Await the next physical delivery.';render();return;}
 if(Math.round(S.personalCash*100)<good.cents){message='Not enough personal cash.';render();return;}
 if(window.advanceWorldTime(300)!==300){message='Trading hours ended before the purchase.';render();return;}
 const sale=model.purchase(S,'player',id,{date:S.gameDate,...(site?{siteId:site}:{})});
 message=sale.ok?'Purchased '+good.label+' for '+good.cents+'¢. Merchant stock and cash updated.':sale.reason;
 save(true);render();
}
function buyThree(id){
 if(!permitted()){message='Visit the open market counter.';render();return;}
 const site=marketSite(),model=commerce(),quote=model.quoteBasket(S,site,[{id,packages:3}]);
 if(!quote.ok){message=quote.reason;render();return;}
 if(!window.FE_WASHINGTON_TIME?.canSpend?.(S,900)){message='Not enough Washington time.';render();return;}
 if(window.advanceWorldTime(900)!==900){message='Purchase was interrupted.';render();return;}
 const result=model.purchaseBasket(S,site,[{id,packages:3}],{date:S.gameDate});
 message=result.ok?'Bought 3 packages for '+result.totalCents+'¢.':result.reason;
 save(true);render();
}
function use(id){
 if(!permitted()){message='You must be at the market to sort your shopping bag.';render();return;}
 const model=commerce(),m=model.ensure(S),item=m.playerBag.find(g=>g.id===id);
 if(!item){message='This item is no longer in your shopping bag.';render();return;}
 const needs=window.FE_CHARACTER_NEEDS;
 const food=needs?.PROVISIONS?.[item.good];
 if(!food){message='Take this purchase home for storage or cooking; it cannot be used up here.';render();return;}
 const available=needs.provisionAvailability(S,item.good);
 if(available&&!available.ok){message=available.reason;render();return;}
 const duration=600;
 if(!window.FE_WASHINGTON_TIME?.canSpend?.(S,duration)){message='Not enough time for this action.';render();return;}
 if(window.advanceWorldTime(duration)!==duration){message='Could not complete this action.';render();return;}
 const consumed=model.consume(S,id);
 if(!consumed.ok){message=consumed.reason;render();return;}
 const outcome=needs.eatProvision(S,consumed.good.good);
 message=outcome?.ok?'Ate '+consumed.good.label+'. Hunger and thirst updated.':outcome?.reason||'Meal not recorded.';
 save(true);render();
}
function render(){
 const panel=$('cityRoomMarket');if(!panel)return;
 const current=window.FE_CITY?.currentLocation?.();
 const site=marketSite(),here=site!==null&&!window.FE_CITY?.isDevRoom?.();
 panel.hidden=!here;if(!here)return;
 const m=commerce().ensure(S),open=permitted(),list=$('cityRoomMarketGoods'),bag=$('cityRoomMarketBag');
 const stock=site?m.siteStocks[site]:m.stock;
 const heading=panel.querySelector('h4');
 if(heading)heading.textContent=({
  'hillsdale-market':'Hillsdale Market · Provisions','hillsdale-butcher':'Hillsdale Butcher',
  'easternMarket':'Eastern Market · Groceries','georgetownMarketHouse':'Georgetown Market House',
  'centerMarket':'Center Market · Washington Provisions'
 })[site]||'Chinatown · Market Street';
 const note=$('cityRoomMarketNote');if(note)note.textContent=message||'Cash purchases use your personal account. Every sale reduces the actual merchant stock.';
 if(list){
  list.replaceChildren();
  const tools=document.createElement('div');tools.className='market-search-tools';
  const input=document.createElement('input');input.type='search';input.placeholder='Search foods, meat, flour, baking ingredients';input.value=filter;
  input.setAttribute('aria-label','Search the market catalog');
  const select=document.createElement('select');select.setAttribute('aria-label','Food categories');
  for(const name of ['all',...(window.FE_FOOD_CATALOG?.sections||[])]){
   const option=document.createElement('option');option.value=name;option.textContent=name==='all'?'All goods':name;
   select.append(option);
  }
  select.value=category;input.oninput=()=>{filter=input.value.toLowerCase();render()};
  select.onchange=()=>{category=select.value;render()};
  tools.append(input,select);list.appendChild(tools);
  const goods=commerce().GOODS.filter(item=>commerce().allowedAt(item.id,site)&&
   (site!==''||commerce().SITES.oldChinatown.has(item.id))&&
   (category==='all'||(window.FE_FOOD_CATALOG?.find?.(item.id)?.section||'Miscellaneous')===category)&&
   (!filter||(item.label+' '+item.id).toLowerCase().includes(filter)));
  const note=document.createElement('p');note.textContent=goods.length+' goods listed · merchant stocks are finite';list.append(note);
  for(const g of goods){
   const row=document.createElement('div'),text=document.createElement('span'),button=document.createElement('button');
   text.textContent=g.label+' · '+g.cents+'¢ · '+stock[g.id]+' in stock';
   button.type='button';button.textContent='Buy';button.disabled=!open||stock[g.id]<1||Math.round(S.personalCash*100)<g.cents||m.playerBag.length>=24;
   button.onclick=()=>buy(g.id);row.append(text,button);
   const multi=document.createElement('button');multi.type='button';multi.textContent='Buy 3';
   multi.disabled=!open||stock[g.id]<3||Math.round(S.personalCash*100)<g.cents*3||m.playerBag.length+3>24;
   multi.onclick=()=>buyThree(g.id);row.append(multi);list.appendChild(row);
  }
 }
 if(bag){
  bag.replaceChildren();
  const title=document.createElement('p');title.textContent='Shopping bag: '+m.playerBag.length+'/24 purchased items. Personal cash: $'+Number(S.personalCash).toFixed(2);bag.appendChild(title);
  for(const item of m.playerBag){
   const row=document.createElement('div'),text=document.createElement('span'),button=document.createElement('button');
   text.textContent=item.label+' · '+item.date;button.type='button';const food=window.FE_CHARACTER_NEEDS?.PROVISIONS?.[item.good];
   const permission=food?window.FE_CHARACTER_NEEDS.provisionAvailability(S,item.good):null;
   button.textContent=food?'Eat / Drink':'Take Home';button.disabled=!open||!food||permission?.ok===false;
   if(permission?.remaining)button.title=permission.reason;button.onclick=()=>use(item.id);
   row.append(text,button);bag.appendChild(row);
  }
 }
}
window.FE_MARKET_UI=Object.freeze({render});
})();
