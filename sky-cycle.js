/* Capital & Consequence: 1878+ Washington almanac and unobtrusive header.
 * Scientific positions calculated by MIT-licensed Astronomy Engine.
 * The save's game clock, never real current time, governs this display.
 */
(function(root){
 'use strict';
 const astro=typeof module==='object'&&module.exports?require('./vendor/astronomy-engine/astronomy.browser.js'):root.Astronomy;
 if(!astro)throw Error('Astronomy Engine must load before the Washington sky');
 const OBSERVER=new astro.Observer(38.8977,-77.0365,0);
 const FIVE_HOURS=5*60*60*1000; // Nineteenth-century Washington civil display: no modern DST.
 const PHASES=[['New Moon','🌑'],['Waxing Crescent','🌒'],['First Quarter','🌓'],['Waxing Gibbous','🌔'],
  ['Full Moon','🌕'],['Waning Gibbous','🌖'],['Last Quarter','🌗'],['Waning Crescent','🌘']];
 let daily=null;
 function utcTime(localIso){
  if(typeof localIso!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(localIso))throw Error('Mapped world time required');
  const t=new Date(localIso+':00Z');
  if(!Number.isFinite(+t)||t.toISOString().slice(0,16)!==localIso)throw Error('Invalid mapped time');
  return new Date(+t+FIVE_HOURS);
 }
 function weather(value){
  const name=typeof value==='string'&&value.trim()?value.trim().slice(0,72):'Unknown';
  const text=name.toLowerCase();
  const icon=/thunder|lightning|storm/.test(text)?'⛈':/snow|blizzard|sleet|ice/.test(text)?'❄':
   /rain|showers|drizzle/.test(text)?'🌧':/fog|mist|haze/.test(text)?'🌫':
   /overcast/.test(text)?'☁':/partly|scattered/.test(text)?'⛅':
   /cloud/.test(text)?'☁':/wind|gust/.test(text)?'🌬':'☀';
  return {name,icon};
 }
 function almanac(date){
  if(daily?.date===date)return daily;
  const midnight=utcTime(date+'T00:00');
  const rise=astro.SearchRiseSet(astro.Body.Sun,OBSERVER,+1,midnight,1);
  const set=astro.SearchRiseSet(astro.Body.Sun,OBSERVER,-1,midnight,1);
  // Do not label an eclipse elsewhere on Earth as visible in Washington.
  const before=new Date(+midnight-24*60*60*1000);
  const solar=astro.SearchLocalSolarEclipse(before,OBSERVER);
  const lunar=astro.SearchLunarEclipse(before);
  daily={date,rise:rise?.date||null,set:set?.date||null,solar,lunar};
  return daily;
 }
 function localDateOf(utc){return new Date(+utc-FIVE_HOURS).toISOString().slice(0,10)}
 function snapshot(iso,condition){
  const now=utcTime(iso),date=iso.slice(0,10),info=almanac(date);
  const sunlight=!!(info.rise&&info.set&&now>=info.rise&&now<info.set);
  const degrees=astro.MoonPhase(now);
  const index=Math.round(degrees/45)%8;
  const [phaseName,phaseIcon]=PHASES[index];
  const solar=info.solar;
  const solarActive=!!(solar?.partial_begin?.time?.date&&solar?.partial_end?.time?.date&&
   now>=solar.partial_begin.time.date&&now<=solar.partial_end.time.date&&localDateOf(solar.peak.time.date)===date);
  const lunar=info.lunar,mid=lunar?.peak?.date,halfMinutes=lunar?.sd_penum||0;
  const lunarActive=!!(mid&&localDateOf(mid)===date&&Math.abs(+now-(+mid))<=halfMinutes*60000&&!sunlight);
  const eclipse=solarActive?'Solar eclipse':lunarActive?'Lunar eclipse':null;
  return {date,time:iso.slice(11),weather:weather(condition),sunlight,skyIcon:solarActive?'🌑':sunlight?'☀':'☾',
   moonPhase:phaseName,moonIcon:phaseIcon,moonDegrees:degrees,eclipse,
   sunrise:info.rise?new Date(+info.rise-FIVE_HOURS).toISOString().slice(11,16):null,
   sunset:info.set?new Date(+info.set-FIVE_HOURS).toISOString().slice(11,16):null};
 }
 function render(){
  if(typeof document==='undefined'||typeof S==='undefined')return;
  const el=document.getElementById('washingtonSky'),wx=document.getElementById('washingtonWeather'),sun=document.getElementById('washingtonSunMoon');
  if(!el||!wx||!sun)return;
  const moment=S.worldCalendarStatus==='ready'?root.FE_CALENDAR_BRIDGE?.moment?.(S):null;
  if(!moment?.iso){el.hidden=true;return}
  try{
   const sky=snapshot(moment.iso,S.turnConditions?.weather);
   wx.textContent=sky.weather.icon+' '+sky.weather.name;
   wx.title='Washington weather: '+sky.weather.name;
   sun.textContent=sky.skyIcon+' '+sky.moonIcon+(sky.eclipse?' · '+sky.eclipse:'');
   sun.title=(sky.sunlight?'Daylight':'Night')+' · '+sky.moonPhase+
    ' · Sunrise '+(sky.sunrise||'unknown')+', sunset '+(sky.sunset||'unknown')+
    (sky.eclipse?' · '+sky.eclipse+' in progress':'');
   el.hidden=false;
  }catch(_e){el.hidden=true}
 }
 const api=Object.freeze({snapshot,weather,utcTime,render});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root){
  root.FE_WASHINGTON_SKY=api;
  if(typeof document!=='undefined'){
   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
   else render();
   setInterval(render,5000);
  }
 }
})(typeof window!=='undefined'?window:globalThis);
