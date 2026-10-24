/* Capital & Consequence: v0.6.87 shore-fishing simulation.
 * Player actions alone advance calendar time; this engine never ticks.
 */
(function(root){
'use strict';
const SITES=Object.freeze({
 potomacFishingBank:['catfish','perch','bass'],
 babcockLake:['perch','carp','bass'],
 fletchersCove:['bass','catfish','perch'],
 georgetownCanal:['carp','perch','catfish'],
 easternBranchFishing:['catfish','perch','carp'],
 chainBridgeFishing:['bass','perch','catfish']
});
const FISH=Object.freeze({catfish:{name:'Channel catfish',strength:3},perch:{name:'Yellow perch',strength:1},bass:{name:'River bass',strength:2},carp:{name:'Common carp',strength:3}});
const TACKLE_CENTS=75;
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
function ensure(save){
 if(!save||typeof save!=='object')throw Error('Fishing needs player autosave');
 if(!save.fishing||save.fishing.version!==1)save.fishing={version:1,gear:false,attempts:0,session:null,catches:[],history:[]};
 const w=save.fishing;if(!Array.isArray(w.catches))w.catches=[];if(!Array.isArray(w.history))w.history=[];
 if(!Number.isSafeInteger(w.attempts)||w.attempts<0)w.attempts=0;
 return w;
}
function outfit(save){
 const w=ensure(save);if(w.gear)return {ok:false,reason:'Your rod, line and creel are already packed.'};
 const cents=Math.round(Number(save.personalCash)*100);
 if(!Number.isSafeInteger(cents)||cents<TACKLE_CENTS)return {ok:false,reason:'Basic rod, line, bait and creel cost 75¢ in personal cash.'};
 save.personalCash=(cents-TACKLE_CENTS)/100;w.gear=true;w.history.push({kind:'tackle',costCents:TACKLE_CENTS});
 return {ok:true,costCents:TACKLE_CENTS,message:'You bought a rod, line, bait and creel for 75¢.'};
}
function cast(save,site,date){
 const w=ensure(save);
 if(!Object.hasOwn(SITES,site))return {ok:false,reason:'There is no fishing bank here.'};
 if(site==='babcockLake'&&date>'1888-12-31')return {ok:false,reason:'Babcock Lake no longer exists.'};
 if(!w.gear)return {ok:false,reason:'Purchase fishing tackle before casting.'};
 if(w.session)return {ok:false,reason:'Finish or abandon your hooked fish first.'};
 if(w.catches.length>=8)return {ok:false,reason:'Your creel is full (eight fish).'};
 w.attempts++;const seed=hash(site+'|'+date+'|'+w.attempts);
 const fishId=SITES[site][seed%SITES[site].length],fish=FISH[fishId];
 w.session={site,date,fishId,seed,step:0,direction:seed%2?1:-1,
  tension:26+seed%13,range:5+seed%3,stamina:5+fish.strength*2,status:'hooked'};
 return {ok:true,session:{...w.session},message:'A '+fish.name+' strikes the bait!'};
}
function act(save,choice){
 const w=ensure(save),s=w.session;
 if(!s||s.status!=='hooked')return {ok:false,reason:'No fish is on the line.'};
 if(!['reel','hold','steer','give'].includes(choice))return {ok:false,reason:'Unknown fishing move.'};
 const fish=FISH[s.fishId],wave=hash(s.seed+'|'+s.step);s.step++;
 if(wave%4===0)s.direction*=-1;
 let message='';
 if(choice==='reel'){
  s.range=Math.max(0,s.range-2);s.stamina=Math.max(0,s.stamina-2);
  s.tension+=9+fish.strength*3+(wave%5);message='You reel against the fish.';
 }else if(choice==='hold'){
  s.stamina=Math.max(0,s.stamina-1);s.tension=Math.max(0,s.tension-29);
  message='You hold steady while the fish tires.';
 }else if(choice==='steer'){
  s.stamina=Math.max(0,s.stamina-1);s.tension=Math.max(0,s.tension-(s.direction>0?29:23));
  message='You angle the rod against its run.';
 }else{
  s.range+=2;s.tension=Math.max(0,s.tension-39);message='You give the fish a little line.';
 }
 s.tension=Math.max(0,s.tension+wave%6+fish.strength*4);
 if(choice!=='reel')s.range+=s.stamina>1?1:0;
 if(s.tension>=100){w.session=null;w.history.push({kind:'break',site:s.site,date:s.date,fish:s.fishId});return {ok:true,finished:true,caught:false,message:'The line snaps. '+message};}
 if(s.range>=17){w.session=null;w.history.push({kind:'escape',site:s.site,date:s.date,fish:s.fishId});return {ok:true,finished:true,caught:false,message:'The fish runs free. '+message};}
 if(s.stamina===0&&s.range<=1){
  const fishRecord={id:'fish-'+w.attempts,kind:'fish',name:fish.name,species:s.fishId,site:s.site,date:s.date};
  w.catches.push(fishRecord);w.session=null;w.history.push({...fishRecord,kind:'catch'});
  return {ok:true,finished:true,caught:true,catch:fishRecord,message:'You land a '+fish.name+'. It goes into your creel.'};
 }
 if(w.history.length>64)w.history.splice(0,w.history.length-64);
 return {ok:true,finished:false,session:{...s},message};
}
function release(save,id){
 const w=ensure(save),i=w.catches.findIndex(c=>c.id===id);
 if(i<0)return {ok:false,reason:'Fish not in your creel.'};
 const [fish]=w.catches.splice(i,1);w.history.push({kind:'released',id:fish.id,site:fish.site});
 return {ok:true,fish};
}
function abandon(save){
 const w=ensure(save);if(!w.session)return {ok:false,reason:'No hooked fish.'};
 w.history.push({kind:'abandoned',site:w.session.site,fish:w.session.fishId});w.session=null;
 return {ok:true,message:'You cut the line and let the fish go.'};
}
const api=Object.freeze({SITES,FISH,TACKLE_CENTS,ensure,outfit,cast,act,release,abandon});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_FISHING=api;
})(typeof window!=='undefined'?window:globalThis);
