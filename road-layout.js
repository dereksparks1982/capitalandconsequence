/* Capital & Consequence: editable Washington street overlay.
 * Never changes the approved guide bitmap or original map coordinates.
 * PathFinding.js A* follows ONLY submitted street cells; marked buildings block movement.
 * Yuka Vector3 supplies geometry measurements.
 */
(function(root){
'use strict';
const PF=root.PF||(typeof module==='object'&&module.exports?require('./vendor/pathfinding/pathfinding-browser.min.js'):null);
const YUKA=root.YUKA||(typeof module==='object'&&module.exports?require('./vendor/yuka/yuka.min.js'):null);
const W=192,H=109,MAX_ROADS=2200,MAX_BLOCKS=500;
let layout=null,network=null;
const validPoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1;
function sanitize(src){
 if(!src||src.version!==1)return {version:1,active:false,segments:[],blocks:[]};
 const segments=(Array.isArray(src.segments)?src.segments:[]).filter(s=>
  validPoint(s?.a)&&validPoint(s?.b)&&Math.abs(s.a.x-s.b.x)+Math.abs(s.a.y-s.b.y)>.00001)
  .slice(0,MAX_ROADS).map(s=>({a:{x:s.a.x,y:s.a.y},b:{x:s.b.x,y:s.b.y}}));
 const blocks=(Array.isArray(src.blocks)?src.blocks:[]).filter(b=>b&&
  [b.x0,b.y0,b.x1,b.y1].every(v=>Number.isFinite(v)&&v>=0&&v<=1)&&
  b.x0<b.x1&&b.y0<b.y1).slice(0,MAX_BLOCKS)
  .map(b=>({x0:b.x0,y0:b.y0,x1:b.x1,y1:b.y1}));
 return {version:1,active:!!src.active&&segments.length>0,segments,blocks};
}
function load(value){if(value===layout)return;layout=value||null;network=null;}
function current(){return sanitize(layout)}
function isActive(){return !!layout?.active&&Array.isArray(layout.segments)&&layout.segments.length>0}
function length(a,b){
 if(YUKA?.Vector3)return new YUKA.Vector3(a.x*2048,a.y*1159,0).distanceTo(new YUKA.Vector3(b.x*2048,b.y*1159,0));
 return Math.hypot((a.x-b.x)*2048,(a.y-b.y)*1159);
}
const cell=p=>({x:Math.round(p.x*(W-1)),y:Math.round(p.y*(H-1))});
const point=(x,y)=>({x:x/(W-1),y:y/(H-1)});
function build(){
 if(network)return network;
 if(!PF?.Grid||!PF?.AStarFinder)return null;
 const draft=current(),matrix=Array.from({length:H},()=>Array(W).fill(1));
 for(const segment of draft.segments){
  const a=cell(segment.a),b=cell(segment.b);
  const steps=Math.max(1,Math.abs(a.x-b.x),Math.abs(a.y-b.y))*2;
  let prev=null;
  for(let k=0;k<=steps;k++){
   const t=k/steps,x=Math.round(a.x+(b.x-a.x)*t),y=Math.round(a.y+(b.y-a.y)*t);
   matrix[y][x]=0;
   if(prev){matrix[prev.y][x]=0;matrix[y][prev.x]=0}
   prev={x,y};
  }
 }
 for(const r of draft.blocks){
  for(let y=Math.max(0,Math.floor(r.y0*(H-1)));y<=Math.min(H-1,Math.ceil(r.y1*(H-1)));y++)
   for(let x=Math.max(0,Math.floor(r.x0*(W-1)));x<=Math.min(W-1,Math.ceil(r.x1*(W-1)));x++)
    matrix[y][x]=1;
 }
 const walkable=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(matrix[y][x]===0)walkable.push({x,y,p:point(x,y)});
 network={matrix,walkable,blocks:draft.blocks};return network;
}
function crossesWall(a,b,blocks){
 for(const r of blocks)for(let k=0;k<=48;k++){
  const t=k/48,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
  if(x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1)return true;
 }
 return false;
}
function entrance(p,net){
 let best=null;
 for(const v of net.walkable){
  const distance=length(p,v.p);
  if(distance>145||best&&distance>=best.distance)continue;
  if(crossesWall(p,v.p,net.blocks))continue;
  best={...v,distance};
 }
 return best;
}
function route(a,b){
 if(!isActive()||!validPoint(a)||!validPoint(b))return null;
 const net=build();if(!net||!net.walkable.length)return null;
 const start=entrance(a,net),end=entrance(b,net);
 if(!start||!end)return null;
 const search=new PF.AStarFinder({allowDiagonal:false});
 const raw=search.findPath(start.x,start.y,end.x,end.y,new PF.Grid(W,H,net.matrix));
 if(!raw.length)return null;
 const corners=[];
 for(let i=0;i<raw.length;i++){
  const row=raw[i];
  if(i>0&&i<raw.length-1){
   const prev=raw[i-1],next=raw[i+1];
   if((prev[0]===row[0]&&row[0]===next[0])||
      (prev[1]===row[1]&&row[1]===next[1]))continue;
  }
  corners.push(point(row[0],row[1]));
 }
 const out=[{x:a.x,y:a.y},...corners,{x:b.x,y:b.y}]
  .filter((p,i,list)=>i===0||length(p,list[i-1])>.4);
 if(out.length===1)out.push({x:b.x,y:b.y});
 out.routeType='provisional-street-custom';
 out.accessPixels=Math.round(start.distance+end.distance);
 out.turns=Math.max(0,corners.length-2);
 out.namedRoads=[];
 return out;
}
const api=Object.freeze({version:1,grid:{width:W,height:H},sanitize,load,current,isActive,route,
 diagnostic:()=>({pathfinding:!!PF?.AStarFinder,yuka:!!YUKA?.Vector3,roads:current().segments.length,blocks:current().blocks.length})});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_ROAD_LAYOUT=api;
})(typeof window!=='undefined'?window:globalThis);
