/* Federal Exchange: fictional, dated, published daily stock-history records.
 * No intraday data; charts include only trading days before current game date.
 * Business dates use UTC noon for deterministic cross-platform generation.
 */
(function(root){
 'use strict';
 const RANGES=Object.freeze({'1w':5,'1m':22,'3m':66,'6m':132,'1y':260,all:Infinity});
 const MAX_ROWS=2600;
 const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&
  !Number.isNaN(Date.parse(s+'T12:00:00Z'));
 const fnv=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
 const unit=s=>(fnv(s)%1000000)/1000000;
 const price=n=>Math.max(1,Math.round(n*100)/100);
 function tradingDaysBefore(date,count){
  if(!validDate(date)||!Number.isSafeInteger(count)||count<0||count>MAX_ROWS)throw Error('Invalid stock history calendar request.');
  const d=new Date(date+'T12:00:00Z'),out=[];
  while(out.length<count){d.setUTCDate(d.getUTCDate()-1);if(d.getUTCDay()!==0&&d.getUTCDay()!==6)out.unshift(d.toISOString().slice(0,10))}
  return out;
 }
 function dailyMove(ticker,sector,day,vol){
  const trend=(unit(ticker+'|drift')-.46)*.00075;
  const broad=(unit('market|'+day)-.5)*.004;
  const industry=(unit(sector+'|'+day)-.5)*Math.max(.002,vol*.18);
  const company=(unit(ticker+'|'+day)-.5)*Math.max(.003,vol*.30);
  const era=Date.parse(day+'T12:00:00Z')/86400000;
  const longCycle=Math.sin(era/37+unit(ticker+'|cycle')*6.283)*Math.max(.0004,vol*.055);
  const shock=unit(ticker+'|shock|'+day);
  const rare=shock<.003?-(.02+vol*.7):shock>.997?.015+vol*.5:0;
  return Math.max(-.15,Math.min(.15,trend+broad+industry+company+longCycle+rare));
 }
 // Work BACKWARD from the known previous close so the opening sheet agrees
 // exactly with its last published historical closing price.
 function seed({ticker,sector,opening,openDate,vol=.04,count=520,previousClose=null}){
  if(typeof ticker!=='string'||!ticker||!Number.isFinite(opening)||opening<=0)
   throw Error('Stock seed requires a valid security and opening quote.');
  const days=tradingDaysBefore(openDate,count),result=[];
  const openingGap=(unit(ticker+'|open|'+openDate)-.5)*Math.min(.018,.004+vol*.18);
  // Caller can supply an exact previous close to match its own opening gap.
  let previous=Number.isFinite(previousClose)&&previousClose>0?price(previousClose):price(opening/(1+openingGap));
  for(let i=days.length-1;i>=0;i--){
   const day=days[i];result.push({date:day,close:previous});
   previous=price(previous/(1+dailyMove(ticker,sector,day,vol)));
  }
  return result.reverse();
 }
 function published(history,asOf,range='1m'){
  if(!validDate(asOf))throw Error('A valid current game date is required.');
  const limit=RANGES[range];
  if(limit===undefined)throw Error('Unknown published history range.');
  const byDate=new Map();
  for(const row of Array.isArray(history)?history:[]){
   if(!row||!validDate(row.date)||row.date>=asOf||!Number.isFinite(+row.close)||+row.close<=0)continue;
   const d=new Date(row.date+'T12:00:00Z');
   if(d.getUTCDay()===0||d.getUTCDay()===6)continue;
   byDate.set(row.date,{date:row.date,close:price(+row.close)});
  }
  const all=[...byDate.values()].sort((a,b)=>a.date.localeCompare(b.date));
  return Number.isFinite(limit)?all.slice(-limit):all;
 }
 const api=Object.freeze({RANGES,MAX_ROWS,tradingDaysBefore,dailyMove,seed,published});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_STOCK_HISTORY=api;
})(typeof window!=='undefined'?window:globalThis);
