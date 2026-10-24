/* Capital & Consequence: accessible horse and carriage custody at home,
 * factory shelter or a livery. No travel happens from this panel.
 */
(function(root){
 'use strict';
 const LOCATIONS=['home','factory','westLivery','eastLivery'];
 function render(locationId,roomId,save,changed,live=true){
  const overlay=document.getElementById('cityRoomOverlay');if(!overlay)return;
  let panel=document.getElementById('horseStableService');
  if(!panel){
   panel=document.createElement('section');panel.id='horseStableService';
   panel.className='sheet';overlay.appendChild(panel);
  }
  panel.replaceChildren();
  panel.hidden=!LOCATIONS.includes(locationId);
  if(panel.hidden)return;
  const title=document.createElement('h3');
  title.textContent=locationId==='home'?'Charlie’s Home Stable & Carriage House':
   locationId==='factory'?'Federal Electric · Temporary Horse Shelter':'Horses and Carriages on the Premises';
  panel.appendChild(title);
  const explanation=document.createElement('p');
  explanation.textContent='Animals remain wherever you leave them. Preparing a horse means you will ride or lead it on your next actual city trip. You can leave it here and travel on foot. A carriage or wagon moves only with a horse.';
  panel.appendChild(explanation);
  const animals=(save.transport?.assets||[]).filter(a=>
   (a.owner==='personal'||a.owner==='rental')&&a.locationId===locationId&&
   ['stabled','tethered'].includes(a.status));
  const horses=animals.filter(a=>a.kind==='horse');
  const vehicles=animals.filter(a=>a.kind==='carriage');
  const status=document.createElement('p');status.setAttribute('role','status');panel.appendChild(status);
  const pending=save.horseCustody;
  if(pending?.from===locationId){
   status.textContent='Prepared for next trip: '+(animals.find(a=>a.id===pending.assetId)?.name||pending.assetId)+
    (pending.vehicleId?' and its carriage or wagon':'')+'. Travel normally on the city map.';
  }
  if(!animals.length){
   const empty=document.createElement('p');
   empty.textContent='No personal horses or carriages are kept here.';
   panel.appendChild(empty);
  }
  for(const h of horses){
   const row=document.createElement('div');row.className='horse-stable-actions';
   const label=document.createElement('p');label.textContent=h.name+' · '+(h.owner==='rental'?'hired':'owned')+' · '+h.status;
   row.appendChild(label);
   const add=(labelText,vehicleId=null)=>{
    const button=document.createElement('button');button.type='button';button.textContent=labelText;
    button.disabled=!live||save.paused;
    button.onclick=()=>{
     const result=root.FE_HORSE_CUSTODY?.prepare?.(save,h.id,locationId,vehicleId);
     status.textContent=result?.ok?'Ready: '+h.name+(vehicleId?' with vehicle':'')+' will accompany the next completed trip.':'Unable to prepare: '+(result?.reason||'unavailable');
     if(result?.ok&&!result.repeated)changed?.();
    };
    row.appendChild(button);
   };
   add('Ride or lead '+h.name+' on next trip');
   for(const vehicle of vehicles)add('Take '+vehicle.name+' with '+h.name,vehicle.id);
   panel.appendChild(row);
  }
  if(vehicles.length&&!horses.length){
   const p=document.createElement('p');
   p.textContent='A wagon or carriage cannot move without a horse at this location.';
   panel.appendChild(p);
  }
  for(const v of vehicles){
   const p=document.createElement('p');
   p.textContent=v.name+' · '+(v.owner==='rental'?'hired':'owned')+' · '+v.status;
   panel.appendChild(p);
  }
 }
 const api=Object.freeze({render});
 if(root)root.FE_HORSE_STABLE_UI=api;
})(typeof window!=='undefined'?window:globalThis);
