/* 1878 river and coast fishing craft; independent of merchant cargo vessels.
   All trips require player action; upkeep follows game calendar. */
(function(root){
'use strict';
const TYPES=Object.freeze({
 skiff:{name:'Rowing Skiff',price:12,upkeep:.02,catch:3,year:1878},
 smack:{name:'Sailing Fishing Smack',price:260,upkeep:.30,catch:18,year:1878},
 trawler:{name:'Steam Fishing Trawler',price:12500,upkeep:9,catch:150,year:1885}
});
const plus=(iso,n)=>{const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const days=(a,b)=>Math.max(0,Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000));
function roll(key){let h=2166136261;for(const c of String(key)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0)/4294967296}
function ensure(save){
 if(!save.fishingFleet||save.fishingFleet.version!==1)save.fishingFleet={version:1,lastDay:null,nextId:0,vessels:[],cash:0,log:[]};
 const f=save.fishingFleet;if(!Array.isArray(f.vessels))f.vessels=[];if(!Array.isArray(f.log))f.log=[];
 return f;
}
function entry(f,date,msg){f.log.unshift(date+' · '+msg);f.log=f.log.slice(0,24)}
function buy(save,type){
 const f=ensure(save),spec=TYPES[type];
 if(!spec||Number(save.gameDate.slice(0,4))<spec.year)return{ok:false,reason:'Vessel type not available in this period.'};
 if(save.paused||save.phase!=='day')return{ok:false,reason:'Purchase requires an open business day.'};
 if((save.personalCash||0)<spec.price+5)return{ok:false,reason:'Requires $'+(spec.price+5).toFixed(2)+' including $5 operating reserves.'};
 save.personalCash-=spec.price+5;f.cash+=5;
 const vessel={id:++f.nextId,type,name:spec.name+' '+f.nextId,condition:95,port:'Potomac',lastTrip:null,status:'active'};
 f.vessels.push(vessel);entry(f,save.gameDate,spec.name+' purchased; crew and maintenance reserves assigned.');
 return{ok:true,vessel,message:spec.name+' purchased. Ready for fishing.'};
}
function work(save,id,site){
 const f=ensure(save),v=f.vessels.find(x=>x.id===id),spec=TYPES[v?.type];
 if(!v||v.status!=='active')return{ok:false,reason:'Fishing vessel not available.'};
 if(save.paused||save.phase==='report'||!root.FE_FISHING?.SITES?.[site])return{ok:false,reason:'Fishing vessel must launch from an active fishing bank.'};
 if(v.lastTrip===save.gameDate)return{ok:false,reason:'This vessel already worked its fishing grounds today.'};
 if(v.condition<30)return{ok:false,reason:'Vessel condition is unsafe. Arrange shipyard repairs.'};
 const expenses=spec.type==='trawler'?12:spec.upkeep*6;
 if(f.cash<expenses)return{ok:false,reason:'Fishing treasury cannot cover fuel, bait, crew and port fees.'};
 f.cash-=expenses;v.lastTrip=save.gameDate;v.condition=Math.max(0,v.condition-(3+roll(id+'|wear|'+save.gameDate)*4));
 const storm=roll(id+'|storm|'+site+'|'+save.gameDate);
 if(storm<.002*(1+(100-v.condition)/50)){
  v.status='lost';entry(f,save.gameDate,v.name+' lost during a severe squall. All craft and tackle aboard were lost.');
  return{ok:true,loss:true,message:v.name+' was lost in a severe squall. Vessel removed from operating fleet.'};
 }
 const catchTons=Math.max(1,Math.round(spec.catch*(.45+roll(id+'|haul|'+save.gameDate)))),
  sale=+(catchTons*(v.type==='trawler'?2.2:1.1)).toFixed(2);
 f.cash+=sale;
 entry(f,save.gameDate,v.name+' returned '+catchTons+' baskets of commercial fish to the market. Net sale '+sale.toFixed(2)+' dollars; hull '+v.condition.toFixed(0)+'%.');
 return{ok:true,catchBaskets:catchTons,revenue:sale,message:v.name+' landed '+catchTons+' baskets; fishing treasury received $'+sale.toFixed(2)+'.'};
}
function repair(save,id){
 const f=ensure(save),v=f.vessels.find(x=>x.id===id),spec=TYPES[v?.type];
 if(!v||v.status!=='active'||save.paused||save.phase!=='day')return{ok:false,reason:'Vessel must be in service for shipyard repair.'};
 const fee=+(Math.max(.50,(100-v.condition)*(spec.price/1400))).toFixed(2);
 if(f.cash<fee)return{ok:false,reason:'Insufficient fishing treasury for $'+fee.toFixed(2)+' repairs.'};
 f.cash-=fee;v.condition=100;
 entry(f,save.gameDate,v.name+' repaired for $'+fee.toFixed(2)+'.');
 return{ok:true,message:v.name+' fully repaired.'};
}
function advance(save){
 const f=ensure(save),today=save.gameDate;
 if(!f.lastDay){f.lastDay=today;return f}
 const n=Math.min(3650,days(f.lastDay,today));
 for(let i=1;i<=n;i++){
  const date=plus(f.lastDay,i);
  for(const v of f.vessels){
   if(v.status!=='active')continue;
   f.cash-=TYPES[v.type].upkeep;
   v.condition=Math.max(5,v.condition-.045);
  }
 }
 f.lastDay=today;return f;
}
const api=Object.freeze({TYPES,ensure,buy,work,repair,advance});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_FISHING_VESSELS=api;
})(typeof window!=='undefined'?window:globalThis);