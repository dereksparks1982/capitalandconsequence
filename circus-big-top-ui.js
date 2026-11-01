/* Small paper ticket window and act summaries, inside the existing room.
 * The circus show and carnival booths have different attendance receipts. */
(function(root){
'use strict';
if(typeof document==='undefined')return;
let panel=null,save=null,onAttend=null;
function node(){
 if(panel?.isConnected)return panel;
 const host=document.querySelector('#cityRoomOverlay .city-room-placeholder');
 if(!host)return null;
 panel=document.createElement('section');panel.className='cc-circus-big-top';panel.id='ccCircusBigTop';panel.hidden=true;
 panel.innerHTML='<h4>THE BIG TOP · TICKETS</h4><p data-big-top-next></p>'+
 '<button type="button" data-big-top-attend>Buy Ticket &amp; Attend · 20¢</button>'+
 '<p data-big-top-status role="status" aria-live="polite"></p><div data-big-top-history></div>';
 host.prepend(panel);
 panel.querySelector('[data-big-top-attend]').addEventListener('click',()=>{
  const r=typeof onAttend==='function'?onAttend():{ok:false,reason:'Ticket booth unavailable.'};
  panel.querySelector('[data-big-top-status]').textContent=r?.ok?
   'The show is over. '+r.report.description:r?.reason||'Unable to attend the show.';
  refresh();
 });
 return panel;
}
function refresh(){
 if(!panel||panel.hidden||!save)return;
 const service=root.FE_CIRCUS_BIG_TOP,slot=service?.slot?.(save);
 const next=panel.querySelector('[data-big-top-next]'),btn=panel.querySelector('[data-big-top-attend]');
 next.textContent=slot?.ok?
  slot.description+' · '+(slot.waitMinutes?'Begins in '+slot.waitMinutes+' game minutes. ':'')+
  'Performance lasts '+service.DURATION_SECONDS/60+' minutes.':slot?.reason||'No performance scheduled.';
 btn.disabled=!slot?.ok;
 const history=panel.querySelector('[data-big-top-history]');history.replaceChildren();
 const visit=root.FE_CIRCUS_TOUR?.active?.(save);
 const reports=(save.circusPerformances||[]).filter(x=>x.circusId===visit?.id).slice(-2).reverse();
 if(reports.length){
  const title=document.createElement('b');title.textContent='YOUR SHOW PROGRAMS';history.append(title);
  for(const r of reports){
   const record=document.createElement('p');record.textContent=r.description;
   history.appendChild(record);
  }
 }
}
function render(profile,attend,{locationId,dev=false}={}){
 save=profile;onAttend=attend;
 const item=node();if(!item)return;
 const active=root.FE_CIRCUS_BIG_TOP?.available?.(save);
 const overlay=document.getElementById('cityRoomOverlay');
 item.hidden=!active||dev||locationId!==active.locationId||!!overlay?.hidden;
 if(!item.hidden)refresh();
}
root.FE_CIRCUS_BIG_TOP_UI=Object.freeze({render,refresh});
})(typeof window!=='undefined'?window:globalThis);
