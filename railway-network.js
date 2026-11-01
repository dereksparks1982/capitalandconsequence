/* Rail planning layer for the immutable 2048x1159 Washington map.
 * Independent of roads. Stations and route-following trains require actual
 * connected painted rail segments. No imaginary company money is debited:
 * this is a planning/prototype editor, not a purchased railroad franchise.
 */
(function(root){'use strict';
const W=2048,H=1159,LIMIT_SEGMENTS=1500,LIMIT_STATIONS=80;
const valid=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1;
const px=(a,b)=>Math.hypot((a.x-b.x)*W,(a.y-b.y)*H);
const copy=p=>({x:+p.x.toFixed(6),y:+p.y.toFixed(6)});
function sanitize(raw){
 const result={version:1,segments:[],stations:[],trains:[]};
 if(!raw||raw.version!==1)return result;
 for(const s of (Array.isArray(raw.segments)?raw.segments:[]).slice(0,LIMIT_SEGMENTS)){
  if(!valid(s?.a)||!valid(s?.b)||px(s.a,s.b)<3)continue;
  result.segments.push({a:copy(s.a),b:copy(s.b)});
 }
 const ids=new Set();
 for(const s of (Array.isArray(raw.stations)?raw.stations:[]).slice(0,LIMIT_STATIONS)){
  if(!valid(s?.at)||typeof s.name!=='string'||!s.name.trim()||typeof s.id!=='string'||ids.has(s.id))continue;
  const station={id:s.id.slice(0,60),name:s.name.trim().slice(0,60),at:copy(s.at)};
  ids.add(station.id);result.stations.push(station);
 }
 for(const t of (Array.isArray(raw.trains)?raw.trains:[]).slice(0,8)){
  if(!ids.has(t?.from)||!ids.has(t?.to)||t.from===t.to||!Number.isSafeInteger(t.departure))continue;
  result.trains.push({id:String(t.id||'train').slice(0,50),from:t.from,to:t.to,departure:t.departure,
   minutes:Number.isFinite(t.minutes)?Math.max(1,Math.min(10000,t.minutes)):30});
 }
 return result;
}
function ensure(save){
 if(!save||typeof save!=='object')return sanitize(null);
 save.railwayPlanner=sanitize(save.railwayPlanner);
 return save.railwayPlanner;
}
function edgeKey(p){return Math.round(p.x*W/6)+','+Math.round(p.y*H/6)}
function graph(layout){
 const nodes=[],edges=[],junctionThreshold=7;
 const nodeFor=p=>{
  let i=nodes.findIndex(n=>px(n,p)<=junctionThreshold);
  if(i<0){i=nodes.length;nodes.push(copy(p))}
  return i;
 };
 for(const s of sanitize(layout).segments){
  const a=nodeFor(s.a),b=nodeFor(s.b),distance=px(s.a,s.b);
  if(a!==b)edges.push({a,b,distance});
 }
 return {nodes,edges};
}
function endpoint(graph,point){
 let best=-1,dist=Infinity;
 graph.nodes.forEach((n,i)=>{const d=px(n,point);if(d<dist){dist=d;best=i}});
 return dist<=18?best:-1;
}
function path(layout,fromId,toId){
 const safe=sanitize(layout),from=safe.stations.find(s=>s.id===fromId),to=safe.stations.find(s=>s.id===toId);
 if(!from||!to||fromId===toId)return null;
 const g=graph(safe),a=endpoint(g,from.at),b=endpoint(g,to.at);
 if(a<0||b<0||a===b)return null;
 const distances=Array(g.nodes.length).fill(Infinity),prev=Array(g.nodes.length).fill(-1),used=new Set();
 distances[a]=0;
 while(true){
  let k=-1;
  for(let i=0;i<distances.length;i++)if(!used.has(i)&&Number.isFinite(distances[i])&&(k<0||distances[i]<distances[k]))k=i;
  if(k<0||k===b)break;used.add(k);
  for(const e of g.edges){
   const other=e.a===k?e.b:e.b===k?e.a:-1;if(other<0||used.has(other))continue;
   const value=distances[k]+e.distance;
   if(value<distances[other]){distances[other]=value;prev[other]=k}
  }
 }
 if(!Number.isFinite(distances[b]))return null;
 const indexes=[];for(let i=b;i>=0;i=prev[i]){indexes.push(i);if(i===a)break}
 if(indexes.at(-1)!==a)return null;
 return {points:indexes.reverse().map(i=>g.nodes[i]),distancePixels:distances[b]};
}
function addSegment(save,a,b){
 if(!valid(a)||!valid(b)||px(a,b)<5)return {ok:false,reason:'Choose two distinct map positions.'};
 const draft=ensure(save);
 if(draft.segments.length>=LIMIT_SEGMENTS)return {ok:false,reason:'Track drawing limit reached.'};
 draft.segments.push({a:copy(a),b:copy(b)});
 return {ok:true,length:Math.round(px(a,b))};
}
function addStation(save,point,name){
 if(!valid(point)||typeof name!=='string'||!name.trim())return {ok:false,reason:'Place and name your station.'};
 const draft=ensure(save),g=graph(draft),nearest=endpoint(g,point);
 if(nearest<0)return {ok:false,reason:'Place the station beside a completed track endpoint.'};
 if(draft.stations.length>=LIMIT_STATIONS)return {ok:false,reason:'Station limit reached.'};
 if(draft.stations.some(s=>px(s.at,point)<20))return {ok:false,reason:'A station is already here.'};
 const id='station-'+String(Date.now())+'-'+draft.stations.length;
 const station={id,name:name.trim().slice(0,60),at:copy(g.nodes[nearest])};
 draft.stations.push(station);return {ok:true,station};
}
function startTrain(save,from,to){
 const layout=ensure(save),road=path(layout,from,to);
 if(!road)return {ok:false,reason:'The stations are not connected by tracks.'};
 const minute=save?.worldCalendar?.worldMinute;
 if(!Number.isSafeInteger(minute))return {ok:false,reason:'Washington time is unavailable.'};
 // A single active demonstration train can run on a connected service.
 const minutes=Math.max(4,Math.round(road.distancePixels/24));
 layout.trains=[{id:'rail-local',from,to,departure:minute,minutes}];
 return {ok:true,minutes,train:layout.trains[0]};
}
function trainPosition(layout,minute,train){
 if(!train||!Number.isFinite(minute))return null;
 const route=path(layout,train.from,train.to);if(!route)return null;
 const t=Math.max(0,Math.min(1,(minute-train.departure)/train.minutes));
 let remain=route.distancePixels*t;
 for(let i=1;i<route.points.length;i++){
  const a=route.points[i-1],b=route.points[i],length=px(a,b);
  if(remain<=length)return {x:a.x+(b.x-a.x)*(remain/length),y:a.y+(b.y-a.y)*(remain/length),arrived:t>=1};
  remain-=length;
 }
 return {...route.points.at(-1),arrived:true};
}
const api=Object.freeze({version:1,sanitize,ensure,graph,path,addSegment,addStation,startTrain,trainPosition,px});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_RAILWAY=api;
})(typeof window!=='undefined'?window:globalThis);
