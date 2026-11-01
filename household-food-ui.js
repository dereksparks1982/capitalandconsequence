/* Modest, deliberately simple in-room kitchen and market controls.
 * All actions pass through the app's authoritative time, cash, inventory
 * and save guards. Never creates free ingredients in the renderer.
 */
(function(root){'use strict';
if(typeof document==='undefined')return;
let panel=null,profile=null,actions=null,recipeFilter='',recipeGroup='all',notice='';
const $=(el,selector)=>el?.querySelector(selector);
function el(tag,content,cls){
 const n=document.createElement(tag);if(content!==undefined)n.textContent=String(content);
 if(cls)n.className=cls;return n;
}
function btn(label,action,id='',qty=''){
 const b=el('button',label);b.type='button';b.dataset.foodAction=action;
 b.dataset.foodId=id;b.dataset.foodQty=String(qty);return b;
}
function addRows(host,rows){
 if(!rows.length){host.appendChild(el('p','Nothing here yet.'));return}
 for(const row of rows)host.appendChild(row);
}
function ensure(){
 if(panel?.isConnected)return panel;
 const parent=document.querySelector('#cityRoomOverlay .city-room-placeholder');
 if(!parent)return null;
 panel=el('section',undefined,'cc-household-food');panel.id='ccHouseholdFood';panel.hidden=true;
 panel.setAttribute('aria-label','Household pantry, kitchen, cookbooks and bakery');
 panel.innerHTML='<h4 data-food-heading>Household Kitchen</h4><p data-food-status role="status" aria-live="polite"></p><div data-food-body></div>';
 parent.prepend(panel);
 panel.addEventListener('click',e=>{
  const b=e.target.closest('button[data-food-action]');if(!b)return;
  const handler=actions?.[b.dataset.foodAction];
  if(typeof handler!=='function')return;
  const quantity=Number(b.dataset.foodQty)||1;
  const order=b.dataset.foodAction==='order'?
   Number($ (b.parentElement,'select')?.value??0):quantity;
  const result=handler(b.dataset.foodId,order);
  notice=result?.ok?
   (result.message||result.reason||'Recorded.'):result?.reason||'That action could not be completed.';
  refresh();
 });
 return panel;
}
function foodName(id){return root.FE_FOOD_CATALOG?.find?.(id)?.label||id}
function row(title,detail,buttons=[]){
 const div=el('div',undefined,'cc-food-row'),copy=el('div',undefined,'cc-food-description');
 copy.append(el('strong',title),el('small',detail));
 const buttonsEl=el('div',undefined,'cc-food-actions');
 for(const b of buttons)buttonsEl.appendChild(b);
 div.append(copy,buttonsEl);return div;
}
function market(body){
 body.append(el('h5','Cookbooks from the provision merchant'));
 const books=el('div',undefined,'cc-food-grid'),status=root.FE_COOKERY?.state?.(profile);
 for(const book of root.FE_RECIPES?.BOOKS||[]){
  const owned=status?.purchases?.some(p=>p.id===book.id),read=status?.booksRead?.includes(book.id);
  const button=btn(read?'Studied':owned?'Purchased':'Buy for '+book.cents+'¢','buyBook',book.id);
  button.disabled=owned||!actions?.buyBook;
  books.appendChild(row(book.name,book.minutes+' min reading · '+book.kind+' · '+(read?'Recipes learned':'Paper volume'),[button]));
 }
 body.append(books);
 body.append(el('h5','Sell your baked goods'));
 const carried=root.FE_KITCHEN?.ledger?.(profile)?.k?.carriedMeals||[];
 const sellable=carried.filter(m=>!m.spoiled&&m.servings>0&&root.FE_RECIPES?.byId?.[m.recipe]?.kind==='baking');
 addRows(body,sellable.map(meal=>{
  const name=root.FE_RECIPES.byId[meal.recipe]?.name||meal.recipe;
  const buy=btn('Sell 1 serving','sell',meal.id,1);
  return row(name,meal.servings+' physically carried serving(s) · merchant must have cash',[buy]);
 }));
 if(!sellable.length)body.append(el('p','Bake at home, pack your goods, and carry them here to sell.'));
}
function storage(body){
 body.append(el('h5','Groceries in your shopping bag'));
 const bag=root.FE_WASHINGTON_COMMERCE?.ensure?.(profile)?.playerBag||[];
 const toStore=bag.filter(x=>root.FE_FOOD_CATALOG?.find?.(x.good));
 const storeAll=btn('Put All Groceries Away','storeAll');storeAll.disabled=!toStore.length;
 body.append(storeAll);
 addRows(body,toStore.map(item=>{
  const dest=root.FE_FOOD_CATALOG.find(item.good)?.storage||'pantry';
  return row(item.label,item.units+' recipe units · suggested '+dest,
   [btn('Store in '+dest,'store',item.id)]);
 }));
 body.append(el('h5','Pantry · Larder · Icebox'));
 const k=root.FE_KITCHEN?.ledger?.(profile)?.k;
 if(!k)return;
 root.FE_KITCHEN.sync(profile);
 const status=el('p',Number.isFinite(k.iceUntil)&&k.iceUntil>profile.worldCalendar?.worldMinute?
  'Icebox cooled until '+root.FE_CHARACTER_NEEDS?.formatClock?.(k.iceUntil):
  'Icebox has no usable ice. Milk and meat can spoil quickly.');
 body.append(status);
 for(const container of root.FE_KITCHEN.CONTAINERS){
  const box=el('details',undefined,'cc-food-container');
  box.open=container==='pantry';
  const sum=el('summary',container.toUpperCase()+' · '+k.goods.filter(g=>g.container===container).length+' packages');box.append(sum);
  const rows=k.goods.filter(g=>g.container===container).map(g=>row(foodName(g.good),
   g.units+' units · '+(g.spoiled?'SPOILED':'fresh')+' · '+container,[
    btn('Take','take',g.id),btn('Discard','discard',g.id)
   ]));
  addRows(box,rows);body.append(box);
 }
 body.append(el('h5','Milkman · Iceman · Household Deliveries'));
 const orders=root.FE_HOME_DELIVERIES?.state?.(profile),delivery=el('div',undefined,'cc-food-grid');
 for(const [id,option] of Object.entries(root.FE_HOME_DELIVERIES?.OPTIONS||{})){
  const saved=orders?.orders?.[id],current=typeof saved==='object'?saved?.packages||0:Number(saved||0);
  const container=el('div',undefined,'cc-food-row'),copy=el('span',option.label+' · '+option.period);
  const select=el('select');select.setAttribute('aria-label','Packages per delivery for '+option.label);
  for(let n=0;n<=option.maximum;n++){const opt=el('option',String(n));opt.value=String(n);select.append(opt)}
  select.value=String(current);
  container.append(copy,select,btn('Set Standing Order','order',id));
  delivery.append(container);
 }
 body.append(delivery);
 const recent=(orders?.receipts||[]).slice(-3).reverse();
 if(recent.length)body.append(el('p','Recent deliveries: '+recent.map(r=>r.date+' '+r.key+' '+r.packages+' pkg').join(' · ')));
}
function cooking(body){
 body.append(el('h5','Prepare Food and Practice Baking'));
 const skill=root.FE_COOKERY?.bakingLevel?.(profile)||0;
 body.append(el('p','Baking proficiency '+skill+'/100. Cookbooks unlock recipes; each preparation spends actual Washington time and ingredients.'));
 const filter=el('input');filter.type='search';filter.placeholder='Find a meal, bread, pie or pastry';filter.value=recipeFilter;
 filter.setAttribute('aria-label','Search known recipes');
 const groups=el('select');groups.setAttribute('aria-label','Recipe type');
 for(const g of ['all','cooking','baking']){const opt=el('option',g==='all'?'All recipes':g);opt.value=g;groups.append(opt)}
 groups.value=recipeGroup;
 const listing=el('div',undefined,'cc-food-recipes');
 const paint=()=>{
  listing.replaceChildren();
  const learned=root.FE_COOKERY?.state?.(profile)?.known||[];
  const matches=(root.FE_RECIPES?.RECIPES||[]).filter(r=>learned.includes(r.id)&&
   (recipeGroup==='all'||r.kind===recipeGroup)&&
   (!recipeFilter||r.name.toLowerCase().includes(recipeFilter)));
  for(const r of matches.slice(0,75)){
   const avail=root.FE_KITCHEN.available(profile,r.ingredients);
   const missing=avail.ok?'Ingredients ready':(avail.missing||[]).map(x=>foodName(x.id)+' '+x.have+'/'+x.needed).join(', ');
   const b=btn('Prepare · '+r.minutes+' min','prepare',r.id);b.disabled=!avail.ok;
   listing.append(row(r.name,r.servings+' servings · '+r.kind+' · '+missing,[b]));
  }
  if(!matches.length)listing.append(el('p','No known recipes match. Study a cookbook for more.'));
 };
 filter.oninput=()=>{recipeFilter=filter.value.toLowerCase();paint()};
 groups.onchange=()=>{recipeGroup=groups.value;paint()};
 body.append(filter,groups,listing);paint();
 body.append(el('h5','Prepared Meals and Bakery Stock'));
 const data=root.FE_KITCHEN.ledger(profile);
 addRows(body,data.k.meals.filter(m=>m.servings>0).map(meal=>{
  const r=root.FE_RECIPES?.byId?.[meal.recipe],buttons=[];
  if(!meal.spoiled)buttons.push(btn('Eat · 10 min','eat',meal.id));
  if(!meal.spoiled&&r?.kind==='baking')buttons.push(btn('Pack 1 to Sell','pack',meal.id,1));
  return row(r?.name||meal.recipe,meal.servings+' servings · '+(meal.spoiled?'spoiled':'ready'),buttons);
 }));
 const study=(root.FE_RECIPES?.BOOKS||[]).filter(b=>root.FE_COOKERY?.canRead?.(profile,b.id)?.ok);
 if(study.length){
  body.append(el('h5','Books in Your Pockets'));
  addRows(body,study.map(book=>row(book.name,book.minutes+' minutes to study',
   [btn('Read and Learn','readBook',book.id)])));
 }
}
function refresh(){
 if(!panel||panel.hidden||!profile)return;
 const kitchen=root.FE_KITCHEN?.atKitchen?.(profile),market=root.FE_COOKERY?.atMarket?.(profile);
 const head=$(panel,'[data-food-heading]'),body=$(panel,'[data-food-body]'),status=$(panel,'[data-food-status]');
 head.textContent=kitchen?'Kitchen, Pantry & Cookery':'Cookbooks & Bakery Counter';
 status.textContent=notice;
 body.replaceChildren();
 if(kitchen){storage(body);cooking(body)}
 else if(market)market(body);
}
function render(save,handlers,{locationId,roomId,dev=false}={}){
 profile=save;actions=handlers;
 const node=ensure();if(!node)return;
 const atRealRoom=!dev&&save?.currentLocation?.locationId===locationId&&
  save?.currentLocation?.roomId===roomId;
 node.hidden=!atRealRoom||!(root.FE_KITCHEN?.atKitchen?.(save)||root.FE_COOKERY?.atMarket?.(save))||
  !!document.getElementById('cityRoomOverlay')?.hidden;
 if(!node.hidden)refresh();
}
root.FE_FOOD_UI=Object.freeze({render,refresh});
})(typeof window!=='undefined'?window:globalThis);
