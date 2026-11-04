/* Capital & Consequence: Crowe Family Butchers, clickable 32px tile study.
 * The room illustration is drawn with code, not new external assets.
 * Inspection is free; room transfer and work use the existing city clock.
 * This module has NO authority over player finances or hidden story knowledge.
 */
(function(root){'use strict';
const SHOP='croweButcherShop',NS='http://www.w3.org/2000/svg';
const ZONES=Object.freeze([
 Object.freeze({id:'counter',room:'shop-floor',name:'Retail counter',desc:'The scales, chopping paper, daily prices, meat ready for sale, and the customers who pay at the counter.',x:8,y:33,w:25,h:26,actions:[{id:'counter',text:'Serve 1 lb beef · 15 min',opts:{key:'beef'}}]}),
 Object.freeze({id:'ledger',room:'shop-floor',name:'Till and daybook',desc:'The counter till and handwritten books. Recorded drawings and unexplained shortages are not the same thing.',x:35,y:35,w:13,h:23,actions:[{id:'audit',text:'Count the shop till · 10 min'}]}),
 Object.freeze({id:'block',room:'cutting-room',name:'Butcher’s cutting block',desc:'Heavy timber blocks and working tools where raw meat becomes prepared counter cuts.',x:53,y:10,w:17,h:26,actions:[{id:'cut',text:'Prepare 3 lb beef · 15 min',opts:{key:'beef'}}]}),
 Object.freeze({id:'rail',room:'ice-room',name:'Hanging beef rail',desc:'Dressed sides hang to age, normally 30 days before cutting. Each side has its own dated record.',x:75,y:10,w:21,h:30,actions:[]}),
 Object.freeze({id:'ice',room:'ice-room',name:'Ice chest and drainage',desc:'The iceman delivers large blocks of ice. Your cousin normally pays and keeps the room clean.',x:76,y:46,w:18,h:19,actions:[{id:'iceDelivery',text:'Receive ice · 5 min'},{id:'cleanRoom',text:'Clean and inspect room · 15 min'}]}),
 Object.freeze({id:'larder',room:'stock-room',name:'Stock larder',desc:'Raw deliveries and prepared provisions waiting to be worked or sold. Goods here belong to the shop.',x:11,y:70,w:24,h:20,actions:[{id:'restock',text:'Buy 6 lb beef · 10 min',opts:{key:'beef'}}]}),
 Object.freeze({id:'wagon',room:'back-door',name:'Supplier door',desc:'The rear receiving point for meat and blocks of ice. No supplier is paid unless actual shop funds are available.',x:45,y:75,w:24,h:16,actions:[{id:'receiveSide',text:'Receive a whole beef side · 15 min'}]}),
 Object.freeze({id:'loft',room:'loft',name:'Cousin’s upstairs loft',desc:'Your cousin lives permanently above the family shop. This is his home, not a public waiting room.',x:2,y:3,w:36,h:16,actions:[]})
]);
const byId=id=>ZONES.find(z=>z.id===id)||null;
let lastSelected='counter';
const money=n=>'$'+(Math.max(0,Number(n)||0)/100).toFixed(2);
function details(zoneId,snapshot){
 const zone=byId(zoneId);if(!zone)return null;
 const room=snapshot?.coldRoom||{},sides=Array.isArray(room.sides)?room.sides:[];
 let status='';
 if(zone.id==='rail'){
  status=sides.length?sides.map(side=>'Side #'+side.id+': '+side.weightLbs+' lb, '+side.ageDays+
   ' day(s) aging'+(side.standardReady?', ready for normal cutting':', early cut by request only')).join(' · '):
   'No beef sides currently hanging.';
 }else if(zone.id==='ice'){
  status='Ice: '+(room.iceBlocks??0)+'/'+(room.iceCapacity??0)+' blocks · '+(room.condition||'status unknown')+
   ' · Cleanliness: '+(room.cleanliness??0)+'/100';
 }else if(zone.id==='counter'){
  status='Beef ready: '+(snapshot?.prepared?.beef??0)+' lb · Posted price: '+money(snapshot?.prices?.beef||0)+'/lb';
 }else if(zone.id==='ledger'){
  status='Shop till: '+money(snapshot?.tillCents||0)+
   (snapshot?.lastAudit?' · Last count: '+snapshot.lastAudit.date:' · Till not yet counted');
 }else if(zone.id==='block'||zone.id==='larder'){
  status='Uncut beef: '+(snapshot?.raw?.beef??0)+' lb · Prepared beef: '+(snapshot?.prepared?.beef??0)+' lb';
 }else if(zone.id==='wagon'){
  status='Whole side purchase: '+money(4480)+' from the independent shop till.';
 }else status='Private upstairs lodging. Ordinary shop management continues below.';
 return {id:zone.id,name:zone.name,room:zone.room,description:zone.desc,status,
  actions:zone.actions.map(a=>({id:a.id,text:a.text,opts:{...(a.opts||{})}})),
  sides:zone.id==='rail'?sides.map(s=>({...s})):[]};
}
function element(tag,className,text){
 const e=document.createElement(tag);
 if(className)e.className=className;
 if(text!==undefined)e.textContent=text;
 return e;
}
function svgEl(tag,attributes){
 const e=document.createElementNS(NS,tag);
 for(const [key,value] of Object.entries(attributes||{}))e.setAttribute(key,String(value));
 return e;
}
function furniture(svg,tag,attrs){const node=svgEl(tag,attrs);svg.appendChild(node);return node;}
function floorPlan(svg,snapshot,currentRoom){
 svg.setAttribute('viewBox','0 0 480 320');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
 furniture(svg,'rect',{x:0,y:0,width:480,height:320,fill:'#292922'});
 const rooms=[
  {x:8,y:9,w:184,h:66,fill:'#4c4234',room:'loft'},
  {x:8,y:84,w:240,h:119,fill:'#75634d',room:'shop-floor'},
  {x:252,y:9,w:103,h:111,fill:'#5c5344',room:'cutting-room'},
  {x:357,y:9,w:115,h:205,fill:'#54616a',room:'ice-room'},
  {x:8,y:216,w:172,h:96,fill:'#51473a',room:'stock-room'},
  {x:188,y:216,w:166,h:96,fill:'#615648',room:'back-door'}
 ];
 for(const room of rooms){
  furniture(svg,'rect',{x:room.x,y:room.y,width:room.w,height:room.h,fill:room.fill,
   stroke:currentRoom===room.room?'#e7cd77':'#151510','stroke-width':currentRoom===room.room?5:4});
  // Manual tile marks retain the project's simple 32px top-down style.
  for(let x=room.x+32;x<room.x+room.w;x+=32)furniture(svg,'path',{d:'M'+x+' '+room.y+'v'+room.h,stroke:'#aeb4ad','stroke-opacity':'.07'});
  for(let y=room.y+32;y<room.y+room.h;y+=32)furniture(svg,'path',{d:'M'+room.x+' '+y+'h'+room.w,stroke:'#aeb4ad','stroke-opacity':'.07'});
 }
 // Counter, block, scales, meat rail, hooks, large ice chest, hanging sides,
 // larder shelves, wagon receiving crates and upstairs bed.
 furniture(svg,'rect',{x:29,y:114,width:151,height:20,fill:'#9d7c4f',stroke:'#33291b','stroke-width':3});
 furniture(svg,'rect',{x:33,y:138,width:43,height:37,fill:'#352c24',stroke:'#b49c68','stroke-width':3});
 furniture(svg,'rect',{x:88,y:144,width:60,height:17,fill:'#aa8056',stroke:'#3d2b1e','stroke-width':2});
 furniture(svg,'circle',{cx:57,cy:143,r:10,fill:'#a5a6a1',stroke:'#403d38','stroke-width':2});
 furniture(svg,'rect',{x:270,y:39,width:60,height:54,fill:'#67412b',stroke:'#b99a65','stroke-width':4});
 furniture(svg,'rect',{x:278,y:47,width:44,height:38,fill:'#a1794c'});
 furniture(svg,'path',{d:'M361 28H462',stroke:'#17191c','stroke-width':7});
 furniture(svg,'path',{d:'M363 30H461',stroke:'#9b9b91','stroke-width':3});
 const sides=(snapshot?.coldRoom?.sides||[]).slice(0,4);
 for(let i=0;i<sides.length;i++){
  const side=sides[i],x=370+i*23;
  furniture(svg,'path',{d:'M'+x+' 30v9',stroke:'#999b9a','stroke-width':2});
  furniture(svg,'path',{d:'M'+(x-2)+' 39l-5 5 3 11 1 10 -3 19 9 6 8-5 -1-16 -4-15 -3-9Z',
   fill:side.standardReady?'#915b51':'#a15e58',stroke:'#4e292c','stroke-width':2});
  furniture(svg,'path',{d:'M'+(x+1)+' 49l2 18',stroke:'#df9b8c','stroke-opacity':'.65','stroke-width':2});
 }
 furniture(svg,'rect',{x:373,y:153,width:85,height:42,fill:'#a8c3cc',stroke:'#263b45','stroke-width':5});
 for(let i=0;i<3;i++)furniture(svg,'rect',{x:381+i*24,y:160,width:20,height:28,fill:'#d5e7eb',stroke:'#91abb2','stroke-width':1});
 furniture(svg,'path',{d:'M460 194v10h-28',stroke:'#89969b','stroke-width':3,fill:'none'});
 for(const y of [235,265])furniture(svg,'rect',{x:26,y,width:137,height:13,fill:'#90714c',stroke:'#31251e','stroke-width':3});
 for(const x of [207,248,292])furniture(svg,'rect',{x,y:249,width:34,height:31,fill:'#987b55',stroke:'#342d22','stroke-width':3});
 furniture(svg,'rect',{x:46,y:23,width:76,height:35,fill:'#51413a',stroke:'#bbab84','stroke-width':4});
 furniture(svg,'rect',{x:54,y:26,width:27,height:25,fill:'#e2cfab'});
 furniture(svg,'rect',{x:149,y:27,width:22,height:27,fill:'#745a40',stroke:'#261b1a','stroke-width':3});
 furniture(svg,'path',{d:'M165 74v10M196 180v33M355 115v18',stroke:'#d3b985','stroke-width':7});
 const now=furniture(svg,'rect',{x:205,y:142,width:18,height:23,fill:'#292d32',stroke:'#c0b39a','stroke-width':2});
 furniture(svg,'rect',{x:207,y:136,width:14,height:8,fill:'#d2b28e'});
 now.setAttribute('data-crowe-player-marker','true');
}
function render(host,{summary,currentRoom,onNavigate,onAction}){
 if(!host||!summary)return;
 host.replaceChildren();
 const section=element('section','crowe-scene');
 section.setAttribute('aria-label','Interactive top-down Crowe butcher shop');
 const title=element('h4','crowe-scene-title','CROWE FAMILY BUTCHERS · WORKROOM PLAN');section.appendChild(title);
 const hint=element('p','crowe-scene-hint','Select an object to inspect it. Go To Room uses the existing room navigation; working actions use the game clock.');
 section.appendChild(hint);
 const stage=element('div','crowe-scene-stage');stage.setAttribute('role','group');stage.setAttribute('aria-label','Butcher shop floor plan');
 const svg=svgEl('svg',{class:'crowe-scene-backdrop'});floorPlan(svg,summary,currentRoom);stage.appendChild(svg);
 let selected=byId(lastSelected)?.room===currentRoom?lastSelected:ZONES.find(z=>z.room===currentRoom)?.id||'counter';
 const detail=element('div','crowe-scene-inspector'),actions=element('div','crowe-scene-actions');
 const buttons=[];
 function show(id){
  selected=byId(id)?id:selected;lastSelected=selected;
  for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.croweSpot===selected));
  const state=details(selected,summary);
  detail.replaceChildren();actions.replaceChildren();
  detail.appendChild(element('strong','',state.name));
  detail.appendChild(element('p','',state.description));
  detail.appendChild(element('p','crowe-scene-live',state.status));
  if(state.room!==currentRoom){
   const go=element('button','crowe-scene-go','Go To '+ROOM_NAMES[state.room]);
   go.type='button';go.addEventListener('click',()=>onNavigate?.(state.room));actions.appendChild(go);
  }else{
   for(const choice of state.actions){
    const cmd=element('button','',choice.text);cmd.type='button';
    cmd.addEventListener('click',()=>onAction?.(choice.id,choice.opts));
    actions.appendChild(cmd);
   }
   if(selected==='rail'){
    for(const side of state.sides){
     const cmd=element('button','',side.standardReady?
      'Cut 24 lb from side #'+side.id+' · 30 min':
      'Early-request cut from side #'+side.id+' · 30 min');
     cmd.type='button';
     cmd.addEventListener('click',()=>onAction?.('cutSide',{sideId:side.id,...(side.standardReady?{}:{early:true})}));
     actions.appendChild(cmd);
    }
   }
  }
  if(!actions.childNodes.length)actions.appendChild(element('small','',state.room===currentRoom?'Nothing to operate in this spot.':'Enter the room to work here.'));
 }
 const ROOM_NAMES={ 'shop-floor':'Butcher’s Counter','cutting-room':'Cutting Room',
  'ice-room':'Ice-Cooled Hanging Room','stock-room':'Stock Larder','back-door':'Supplier Door','loft':'Cousin’s Loft'};
 for(const zone of ZONES){
  const btn=element('button','crowe-scene-hotspot',zone.name);
  btn.type='button';btn.dataset.croweSpot=zone.id;
  btn.setAttribute('aria-label','Inspect '+zone.name);
  btn.style.left=zone.x+'%';btn.style.top=zone.y+'%';btn.style.width=zone.w+'%';btn.style.height=zone.h+'%';
  btn.addEventListener('click',()=>show(zone.id));stage.appendChild(btn);buttons.push(btn);
 }
 section.append(stage,detail,actions);host.appendChild(section);show(selected);
}
const api=Object.freeze({SHOP,ZONES,details,render});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CROWE_SHOP_SCENE=api;
})(typeof window!=='undefined'?window:globalThis);
