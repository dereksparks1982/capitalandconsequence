/* A plain in-room sleep panel for home and the existing developer preview.
 * Fading is visual only. All hours and recovery are charged by the main clock.
 */
(function(root){
'use strict';
if(typeof document==='undefined')return;
let panel=null,blackout=null,handler=null,busy=false,lastSave=null;
const el=id=>document.getElementById(id);
function create(){
 if(panel?.isConnected)return panel;
 panel=document.createElement('section');panel.id='ccBedroomSleep';
 panel.className='cc-home-sleep';panel.hidden=true;
 panel.setAttribute('aria-label','Bedroom sleep and wind-up alarm');
 panel.innerHTML='<b>BEDROOM · REST & WIND-UP ALARM</b>'+
  '<p>Sleep as long as you wish. Actual rest restores Energy. The old twin-bell alarm only works when wound and switched on.</p>'+
  '<div class="cc-sleep-choices"><button type="button" data-hours="1">Nap · 1 hour</button>'+
  '<button type="button" data-hours="4">Rest · 4 hours</button>'+
  '<button type="button" data-hours="8">Night · 8 hours</button></div>'+
  '<label>Custom sleep (hours) <input id="ccSleepHours" type="number" min="0.5" max="12" step="0.5" value="8"></label>'+
  '<button id="ccSleepCustom" type="button">Sleep Custom Hours</button>'+
  '<div class="cc-sleep-alarm"><b>⏰ WIND-UP BELL CLOCK</b>'+
  '<label><input id="ccAlarmEnabled" type="checkbox"> Set alarm</label>'+
  '<label>Ringing time <input id="ccAlarmTime" type="time" value="07:00"></label>'+
  '<button type="button" id="ccAlarmWind">Wind the Clock</button>'+
  '<span id="ccAlarmState"></span></div>'+
  '<p id="ccSleepStatus" role="status" aria-live="polite"></p>';
 const holder=document.querySelector('#cityRoomOverlay .city-room-placeholder');
 if(holder)holder.prepend(panel);
 function configure(){
  if(!lastSave)return;
  const service=root.FE_WINDUP_SLEEP,parts=el('ccAlarmTime')?.value?.split(':')||[];
  const result=service?.configure?.(lastSave,{enabled:!!el('ccAlarmEnabled')?.checked,
   hour:Number(parts[0]),minute:Number(parts[1])});
  if(result?.ok){root.save?.(true);status();}
 }
 function status(){
  if(!lastSave)return;
  const a=root.FE_WINDUP_SLEEP?.ensure?.(lastSave);
  if(!a)return;
  const clock=lastSave?.worldCalendar?.worldMinute;
  const wound=Number.isSafeInteger(a.woundAt)&&Number.isSafeInteger(clock)&&clock>=a.woundAt&&clock-a.woundAt<18*60;
  el('ccAlarmState').textContent=(a.enabled?'Alarm ON':'Alarm OFF')+
   ' · '+(wound?'SPRING WOUND':'NOT WOUND')+
   ' · '+String(a.hour).padStart(2,'0')+':'+String(a.minute).padStart(2,'0');
 }
 panel.querySelectorAll('[data-hours]').forEach(btn=>btn.addEventListener('click',()=>sleep(Number(btn.dataset.hours))));
 el('ccSleepCustom').addEventListener('click',()=>sleep(Number(el('ccSleepHours').value)));
 el('ccAlarmEnabled').addEventListener('change',configure);
 el('ccAlarmTime').addEventListener('change',configure);
 el('ccAlarmWind').addEventListener('click',()=>{
  const result=root.FE_WINDUP_SLEEP?.wind?.(lastSave);
  el('ccSleepStatus').textContent=result?.ok?'You wind the clock key. Remember to switch on the bell.':result?.reason||'Unable to wind the alarm.';
  root.save?.(true);status();
 });
 panel._status=status;
 return panel;
}
function fade(){
 if(blackout?.isConnected)return blackout;
 blackout=document.createElement('div');blackout.id='ccSleepFade';
 blackout.className='cc-sleep-fade';blackout.hidden=true;
 blackout.setAttribute('role','status');blackout.setAttribute('aria-live','polite');
 blackout.innerHTML='<p>RESTING...</p>';
 document.body.appendChild(blackout);
 return blackout;
}
function sleep(hours){
 if(busy||!lastSave||typeof handler!=='function')return;
 if(!Number.isFinite(hours)||hours<.5||hours>12||!Number.isInteger(hours*2)){
  el('ccSleepStatus').textContent='Choose between ½ and 12 hours, in half-hour steps.';return;
 }
 const plan=root.FE_WINDUP_SLEEP?.plan?.(lastSave,{hours});
 if(!plan?.ok){el('ccSleepStatus').textContent=plan?.reason||'Sleep is unavailable.';return}
 busy=true;
 const screen=fade();
 screen.hidden=false;screen.querySelector('p').textContent='RESTING...';
 requestAnimationFrame(()=>screen.classList.add('is-black'));
 setTimeout(()=>{
  let outcome;
  try{outcome=handler({hours})}
  catch(err){outcome={ok:false,reason:'Bed rest was interrupted.'};console.error('Bedroom sleep failed',err)}
  const message=outcome?.reason||'You wake from bed rest.';
  screen.querySelector('p').textContent=message;
  if(el('ccSleepStatus'))el('ccSleepStatus').textContent=message;
  setTimeout(()=>{
   screen.classList.remove('is-black');
   setTimeout(()=>{screen.hidden=true;busy=false;},350);
  },550);
 },310);
}
function render(save,onSleep,room=null){
 lastSave=save;handler=onSleep;
 const node=create(),overlay=el('cityRoomOverlay');
 const inBedroom=room?room.locationId==='home'&&room.roomId==='bedroom':
  overlay?.dataset.locationId==='home'&&el('cityRoomName')?.textContent==='Bedroom';
 const visible=!!overlay&&!overlay.hidden&&inBedroom;
 node.hidden=!visible;
 if(!visible)return;
 const a=root.FE_WINDUP_SLEEP?.ensure?.(save);
 if(a&&document.activeElement!==el('ccAlarmEnabled'))el('ccAlarmEnabled').checked=a.enabled;
 if(a&&document.activeElement!==el('ccAlarmTime'))
  el('ccAlarmTime').value=String(a.hour).padStart(2,'0')+':'+String(a.minute).padStart(2,'0');
 node._status();
}
root.FE_SLEEP_UI=Object.freeze({render});
})(typeof window!=='undefined'?window:globalThis);
