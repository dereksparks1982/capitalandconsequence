/* Capital & Consequence: fishing skill, record catches, trophies, meets and boats. */
(function(){
'use strict';
const el=id=>document.getElementById(id),engine=()=>window.FE_FISHING;
let message='';
function permitted(){
 const p=window.FE_CITY?.currentLocation?.();
 return !!p&&!window.FE_CITY?.isDevRoom?.()&&!!engine()?.SITES[p.locationId]&&!S.paused&&S.phase!=='report'&&typeof activeProfileId==='function'&&!!activeProfileId();
}
function action(seconds,fn){
 if(!permitted()){message='Fishing is unavailable while paused or outside an accessible bank.';render();return;}
 if(window.advanceWorldTime(seconds)!==seconds){message='The action did not finish before the day changed.';render();return;}
 const result=fn();message=result?.message||result?.reason||'';
 save(true);render();
}
function render(){
 const panel=el('cityRoomFishing');if(!panel)return;
 const p=window.FE_CITY?.currentLocation?.(),site=p?.locationId;
 const available=!!engine()?.SITES[site]&&!window.FE_CITY?.isDevRoom?.();
 panel.hidden=!available;if(!available)return;
 const w=engine().ensure(S),session=w.session,here=session?.site===site,ok=permitted();
 const status=el('cityRoomFishingStatus'),log=el('cityRoomFishingLog'),list=el('cityRoomFishingCatches');
 if(status)status.textContent=!w.gear?'No tackle owned. Basic rod, line, bait and creel cost 75¢.':!session?'Rod and creel ready. Cast when you wish.':here?'Hooked '+engine().FISH[session.fishId].name+' · moving '+(session.direction<0?'left':'right')+' · tension '+session.tension+'% · distance '+session.range+' · stamina '+session.stamina:'Fish hooked at another bank.';
 const skill=el('cityRoomFishingSkill');if(skill)skill.textContent='Fishing skill '+w.skill.toFixed(1)+'/100 · Legendary encounter odds at 100: 0.5% per eligible cast.';
 if(log)log.textContent=message;
 for(const [id,show] of [['Outfit',!w.gear],['Cast',w.gear&&!session],['Abandon',!!session&&here],
  ...['Reel','Hold','Steer','Give'].map(n=>[n,!!session&&here])]){
  const b=el('cityRoomFishing'+id);
  if(b){b.hidden=!show;b.disabled=!ok||(id==='Cast'&&w.catches.length>=8)}
 }
 if(list){
  list.replaceChildren();
  const title=document.createElement('p');title.textContent='Creel '+w.catches.length+'/8 fish. No catch is sold automatically.';list.appendChild(title);
  for(const fish of w.catches){
   const row=document.createElement('div');row.className='fishing-catch';
   const label=document.createElement('span');label.textContent=fish.name+' · '+(fish.weightLb||'?')+' lb · '+fish.date+' ';
   row.appendChild(label);
   const release=document.createElement('button');release.type='button';release.textContent='Release';release.disabled=!ok;
   release.onclick=()=>{const result=engine().release(S,fish.id);message=result.ok?'Fish released.':result.reason;save(true);render();};
   row.appendChild(release);
   if(fish.legendary){
    const mounted=document.createElement('button');mounted.type='button';mounted.textContent='Have Stuffed & Mounted · $5';mounted.disabled=!ok;
    mounted.onclick=()=>action(120,()=>engine().mount(S,fish.id));
    row.appendChild(mounted);
   }
   list.appendChild(row);
  }
  if(w.mounted.length){
   const h=document.createElement('h5');h.textContent='Permanent Trophy Collection';list.appendChild(h);
   for(const trophy of w.mounted){
    const row=document.createElement('p');row.textContent=trophy.name+' · '+trophy.weightLb+' lb · mounted '+trophy.mountedOn;list.appendChild(row);
   }
  }
 }
 const meet=el('cityRoomFishingMeet');
 if(meet){meet.disabled=!ok||new Date(S.gameDate+'T12:00:00').getDay()!==6;meet.title='Saturday meet, 25¢ entry';}
 const host=el('cityRoomFishingFleet');
 if(host){
  const fleet=window.FE_FISHING_VESSELS?.advance?.(S);
  host.replaceChildren();
  if(!fleet){host.textContent='Fishing craft registry unavailable.';return}
  const h=document.createElement('h5');h.textContent='Owned Fishing Craft · Treasury $'+fleet.cash.toFixed(2);host.appendChild(h);
  for(const [type,spec] of Object.entries(window.FE_FISHING_VESSELS.TYPES)){
   if(+S.gameDate.slice(0,4)<spec.year)continue;
   const b=document.createElement('button');b.type='button';b.textContent='Buy '+spec.name+' · $'+spec.price;
   b.disabled=!ok;b.onclick=()=>action(300,()=>window.FE_FISHING_VESSELS.buy(S,type));
   host.appendChild(b);
  }
  for(const ship of fleet.vessels){
   const row=document.createElement('div');row.className='fishing-vessel';
   const text=document.createElement('p');text.textContent=ship.name+' · '+ship.status+' · condition '+ship.condition.toFixed(0)+'%';
   row.appendChild(text);
   if(ship.status==='active'){
    const voyage=document.createElement('button');voyage.type='button';voyage.textContent='Fish Grounds · 45 min';
    voyage.disabled=!ok||ship.lastTrip===S.gameDate;
    voyage.onclick=()=>action(2700,()=>window.FE_FISHING_VESSELS.work(S,ship.id,site));
    const repair=document.createElement('button');repair.type='button';repair.textContent='Shipyard Repair · 30 min';repair.disabled=!ok;
    repair.onclick=()=>action(1800,()=>window.FE_FISHING_VESSELS.repair(S,ship.id));
    row.append(voyage,repair);
   }
   host.appendChild(row);
  }
  for(const x of fleet.log.slice(0,5)){
   const p=document.createElement('p');p.className='fine';p.textContent=x;host.appendChild(p);
  }
 }
}
function init(){
 if(!el('cityRoomFishing'))return;
 el('cityRoomFishingOutfit').onclick=()=>action(120,()=>engine().outfit(S));
 el('cityRoomFishingCast').onclick=()=>action(360,()=>engine().cast(S,window.FE_CITY.currentLocation().locationId,S.gameDate));
 el('cityRoomFishingAbandon').onclick=()=>action(60,()=>engine().abandon(S));
 const meet=el('cityRoomFishingMeet');if(meet)meet.onclick=()=>action(1200,()=>engine().fishMeet(S,window.FE_CITY.currentLocation().locationId,S.gameDate));
 for(const kind of ['reel','hold','steer','give']){
  el('cityRoomFishing'+kind[0].toUpperCase()+kind.slice(1)).onclick=()=>action(60,()=>engine().act(S,kind));
 }
}
init();window.FE_FISHING_UI=Object.freeze({render});
})();