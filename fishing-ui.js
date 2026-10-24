/* Capital & Consequence v0.6.87: live six-bank shore fishing. */
(function(){
'use strict';
const $=id=>document.getElementById(id),engine=()=>window.FE_FISHING;
let message='';
function permitted(){
 const p=window.FE_CITY?.currentLocation?.();
 return !!p&&!window.FE_CITY?.isDevRoom?.()&&!!engine()?.SITES[p.locationId]&&!S.paused&&S.phase!=='report'&&typeof activeProfileId==='function'&&!!activeProfileId();
}
function action(seconds,fn){
 if(!permitted()){message='Fishing is unavailable while paused or outside a playable bank.';render();return;}
 // Only the player-controlled action advances world time. Other lives simulate during it.
 if(window.advanceWorldTime(seconds)!==seconds){message='The action did not finish before the day changed.';render();return;}
 const result=fn();message=result?.message||result?.reason||'';
 save(true);render();
}
function render(){
 const panel=$('cityRoomFishing');if(!panel)return;
 const p=window.FE_CITY?.currentLocation?.(),site=p?.locationId;
 const eligible=!!engine()?.SITES[site]&&!window.FE_CITY?.isDevRoom?.();
 panel.hidden=!eligible;if(!eligible)return;
 const w=engine().ensure(S),session=w.session,isHere=session?.site===site,ok=permitted();
 const status=$('cityRoomFishingStatus'),log=$('cityRoomFishingLog'),list=$('cityRoomFishingCatches');
 if(status)status.textContent=!w.gear?'No tackle owned. Basic rod, line, bait and creel cost 75¢.':!session?'Rod and creel ready. Cast when you wish.':isHere?'Hooked '+engine().FISH[session.fishId].name+' · moving '+(session.direction<0?'left':'right')+' · tension '+session.tension+'% · distance '+session.range+' · stamina '+session.stamina:'You have a fish hooked at another bank.';
 if(log)log.textContent=message;
 for(const [id,show] of [['Outfit',!w.gear],['Cast',w.gear&&!session],['Abandon',!!session&&isHere],
  ...['Reel','Hold','Steer','Give'].map(n=>[n,!!session&&isHere])]){
  const button=$('cityRoomFishing'+id);if(button){button.hidden=!show;button.disabled=!ok||(id==='Cast'&&w.catches.length>=8);}
 }
 if(list){
  list.replaceChildren();
  const title=document.createElement('p');title.textContent='Creel: '+w.catches.length+'/8 fish. Catches are saved and never sold automatically.';list.appendChild(title);
  for(const fish of w.catches){
   const row=document.createElement('div');row.textContent=fish.name+' · '+fish.date+' ';
   const release=document.createElement('button');release.type='button';release.textContent='Release';release.disabled=!ok;
   release.onclick=()=>{const result=engine().release(S,fish.id);message=result.ok?'Fish released.':result.reason;save(true);render();};
   row.appendChild(release);list.appendChild(row);
  }
 }
}
function init(){
 if(!$('cityRoomFishing'))return;
 $('cityRoomFishingOutfit').onclick=()=>action(120,()=>engine().outfit(S));
 $('cityRoomFishingCast').onclick=()=>action(360,()=>engine().cast(S,window.FE_CITY.currentLocation().locationId,S.gameDate));
 $('cityRoomFishingAbandon').onclick=()=>action(60,()=>engine().abandon(S));
 for(const kind of ['reel','hold','steer','give'])$('cityRoomFishing'+kind[0].toUpperCase()+kind.slice(1)).onclick=()=>action(60,()=>engine().act(S,kind));
}
init();window.FE_FISHING_UI=Object.freeze({render});
})();
