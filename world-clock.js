/* Federal Electric world-time and event-queue foundation, v0.6.32.
 * Engine-independent, offline, deterministic. NOT YET the live campaign clock.
 * Every time jump is explicit; reopening a saved game does not advance time.
 */
(function(root){
 'use strict';
 const MINUTE_MS=60000;
 function parseMinute(iso){
  if(typeof iso!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(iso))throw new Error('Expected YYYY-MM-DDTHH:mm');
  const ms=Date.parse(iso+':00Z');
  if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,16)!==iso)throw new Error('Invalid world calendar minute');
  return Math.floor(ms/MINUTE_MS);
 }
 function formatMinute(minute){
  if(!Number.isSafeInteger(minute))throw new Error('Invalid world minute');
  return new Date(minute*MINUTE_MS).toISOString().slice(0,16);
 }
 function create(iso='1890-01-02T08:00'){
  return {version:1,worldMinute:parseMinute(iso),nextSequence:0,queue:[],history:[]};
 }
 function validState(world){
  if(!world||world.version!==1||!Number.isSafeInteger(world.worldMinute)||
    !Number.isSafeInteger(world.nextSequence)||!Array.isArray(world.queue)||!Array.isArray(world.history))
   throw new Error('Invalid world-clock save state');
  return world;
 }
 function before(a,b){return a.at<b.at||(a.at===b.at&&a.sequence<b.sequence)}
 function insert(queue,item){
  let i=queue.length;queue.push(item);
  while(i>0){const parent=(i-1)>>1;if(!before(item,queue[parent]))break;queue[i]=queue[parent];i=parent}
  queue[i]=item;
 }
 function extract(queue){
  const first=queue[0],last=queue.pop();
  if(queue.length){
   let i=0;
   while(true){
    let child=i*2+1;if(child>=queue.length)break;
    if(child+1<queue.length&&before(queue[child+1],queue[child]))child++;
    if(!before(queue[child],last))break;
    queue[i]=queue[child];i=child;
   }
   queue[i]=last;
  }
  return first;
 }
 function schedule(world,at,type,payload={}){
  validState(world);
  if(!Number.isSafeInteger(at)||at<world.worldMinute)throw new Error('Cannot schedule in the past');
  if(typeof type!=='string'||!(/^[a-z][a-z0-9-]{0,63}$/).test(type))throw new Error('Invalid event type');
  if(!payload||typeof payload!=='object'||Array.isArray(payload))throw new Error('Event payload must be a data object');
  const sequence=++world.nextSequence;
  const event={sequence,at,type,payload:JSON.parse(JSON.stringify(payload))};
  insert(world.queue,event);
  return sequence;
 }
 function advanceTo(world,target,onEvent=()=>{},maxEvents=10000){
  validState(world);
  if(!Number.isSafeInteger(target)||target<world.worldMinute)throw new Error('World time cannot run backwards');
  if(typeof onEvent!=='function')throw new Error('Event handler required');
  if(!Number.isSafeInteger(maxEvents)||maxEvents<1)throw new Error('Invalid event processing limit');
  let processed=0;
  while(world.queue.length&&world.queue[0].at<=target){
   if(processed>=maxEvents)throw new Error('Event processing limit reached; world stopped before unprocessed events');
   const event=extract(world.queue);
   if(event.at<world.worldMinute)throw new Error('Corrupt event queue contains a past event');
   world.worldMinute=event.at;
   // Handlers may schedule additional events, but only at or after this minute.
   onEvent({type:event.type,at:event.at,sequence:event.sequence,payload:JSON.parse(JSON.stringify(event.payload))},world);
   world.history.push({sequence:event.sequence,at:event.at,type:event.type});
   if(world.history.length>256)world.history.splice(0,world.history.length-256);
   processed++;
  }
  world.worldMinute=target;
  return processed;
 }
 function spend(world,minutes,onEvent,maxEvents){
  if(!Number.isSafeInteger(minutes)||minutes<0)throw new Error('Invalid duration');
  return advanceTo(world,validState(world).worldMinute+minutes,onEvent,maxEvents);
 }
 const api=Object.freeze({create,parseMinute,formatMinute,schedule,advanceTo,spend});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WORLD_CLOCK=api;
})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:null);
