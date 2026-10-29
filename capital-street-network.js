/* Capital & Consequence: first-pass 1938 guide street-network overlay.
 * The immutable 1938 Washington artwork is NOT modified by this route graph.
 * Normalized corridors reflect APPROXIMATE illustrated blocks and diagonal
 * avenues. They are NOT surveyed street centerlines. Refine with reviewed
 * guide waypoints rather than claiming building-perfect collision avoidance.
 */
(function(root){
'use strict';
const IMG=Object.freeze({w:2048,h:1159});
const xs=[.11,.15,.19,.23,.27,.31,.35,.39,.43,.47,.51,.55,.59,.63,.67,.71,.75,.79,.83,.87,.91];
const ys=[.09,.13,.17,.21,.25,.29,.33,.37,.41,.45,.49,.53,.57,.61,.65,.69,.73];
const allowed=(x,y)=>{
 if(y<=.17)return x>=.23&&x<=.83;
 if(y<=.29)return x>=.19&&x<=.91;
 if(y<=.53)return x>=.11&&x<=.91;
 if(y<=.61)return x>=.23&&x<=.91;
 if(y<=.69)return x>=.31&&x<=.87;
 return x>=.55&&x<=.79;
};
const pixel=(a,b)=>Math.hypot((a.x-b.x)*IMG.w,(a.y-b.y)*IMG.h);
// A deliberately conservative building exclusion in the approximate guide.
// Its box is not a surveyed footprint. The entrance pin may approach the
// perimeter, but transit through this central landmark is not a roadway.
const BLOCKED_LANDMARKS=Object.freeze([
 Object.freeze({name:'White House grounds',x0:.398,x1:.424,y0:.356,y1:.384})
]);
function pointInBox(p,box){
 return p.x>=box.x0&&p.x<=box.x1&&p.y>=box.y0&&p.y<=box.y1;
}
function intersectsBox(a,b,box){
 // Liang-Barsky segment / axis-aligned bounding box clipping.
 let lo=0,hi=1;
 const dx=b.x-a.x,dy=b.y-a.y;
 for(const [p,q] of [[-dx,a.x-box.x0],[dx,box.x1-a.x],
   [-dy,a.y-box.y0],[dy,box.y1-a.y]]){
  if(Math.abs(p)<1e-12){if(q<0)return false;continue}
  const t=q/p;
  if(p<0)lo=Math.max(lo,t);else hi=Math.min(hi,t);
  if(lo>hi)return false;
 }
 return true;
}
const graph=[],adj=[],edges=[],idByGrid=new Map();
function add(p){
 const id=graph.length;
 graph.push(Object.freeze({x:+p.x.toFixed(6),y:+p.y.toFixed(6)}));
 adj.push([]);
 return id;
}
function link(a,b,label){
 if(a===b||a<0||b<0)return;
 if(BLOCKED_LANDMARKS.some(box=>intersectsBox(graph[a],graph[b],box)))return;
 const length=pixel(graph[a],graph[b]);
 if(length<.01)return;
 const idx=edges.length;
 edges.push(Object.freeze({a,b,length,label}));
 adj[a].push({to:b,cost:length,edge:idx});
 adj[b].push({to:a,cost:length,edge:idx});
}
for(let j=0;j<ys.length;j++)for(let i=0;i<xs.length;i++){
 if(!allowed(xs[i],ys[j]))continue;
 idByGrid.set(i+','+j,add({x:xs[i],y:ys[j]}));
}
for(let j=0;j<ys.length;j++)for(let i=0;i<xs.length;i++){
 const a=idByGrid.get(i+','+j);
 if(a===undefined)continue;
 const east=idByGrid.get((i+1)+','+j);
 const south=idByGrid.get(i+','+(j+1));
 if(east!==undefined)link(a,east,'local east-west street');
 if(south!==undefined)link(a,south,'local north-south street');
}
// Major road-like diagonal avenues. Attach only between existing modeled
// intersections. These are deliberately limited, recognizable corridors;
// connecting a diagonal crossing without a modeled intersection is forbidden.
const diagonals=[
 {name:'Pennsylvania Avenue corridor',pairs:[[5,10,6,9],[6,9,7,8],[7,8,8,7],[8,7,9,8],[9,8,10,9],[10,9,11,10],[11,10,12,11],[12,11,13,12]]},
 {name:'Massachusetts Avenue corridor',pairs:[[5,7,6,6],[6,6,7,5],[7,5,8,4],[8,4,9,3],[9,3,10,2],[10,2,11,1]]},
 {name:'New York Avenue corridor',pairs:[[8,7,9,6],[9,6,10,5],[10,5,11,4],[11,4,12,4],[12,4,13,3],[13,3,14,3],[14,3,15,2]]},
 {name:'South-east diagonal corridor',pairs:[[11,9,12,10],[12,10,13,11],[13,11,14,12],[14,12,15,13]]}
];
for(const avenue of diagonals)for(const [i,j,k,l] of avenue.pairs){
 const a=idByGrid.get(i+','+j),b=idByGrid.get(k+','+l);
 if(a!==undefined&&b!==undefined)link(a,b,avenue.name);
}
// Visit road endpoints without allowing an invisible long-range teleport:
// snap a location to an existing EDGE, then walk to a genuine intersection.
// Evaluate several plausible nearby road entrances; the closest street
// in isolation may force a much longer journey than a second nearby road.
function nearbyEdges(p,limit=4){
 const candidates=[];
 for(let i=0;i<edges.length;i++){
  const e=edges[i],a=graph[e.a],b=graph[e.b];
  const dx=(b.x-a.x)*IMG.w,dy=(b.y-a.y)*IMG.h;
  const t=Math.max(0,Math.min(1,(((p.x-a.x)*IMG.w)*dx+
   ((p.y-a.y)*IMG.h)*dy)/(dx*dx+dy*dy)));
  const at={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
  const distance=Math.abs((at.x-p.x)*IMG.w)+Math.abs((at.y-p.y)*IMG.h);
  const inside=BLOCKED_LANDMARKS.some(box=>pointInBox(p,box));
  const steps=compact([p,...access(p,at)]);
  if(!inside&&BLOCKED_LANDMARKS.some(box=>
    steps.some((v,j)=>j>0&&intersectsBox(steps[j-1],v,box))))continue;
  candidates.push({edge:i,at,t,distance});
 }
 candidates.sort((a,b)=>a.distance-b.distance||a.edge-b.edge);
 const min=candidates[0]?.distance??Infinity;
 return candidates.filter(v=>v.distance<=min+95).slice(0,limit);
}
function compact(points){
 const out=[];
 for(const p of points){
  if(!out.length||pixel(out[out.length-1],p)>.05)out.push({x:p.x,y:p.y});
 }
 return out;
}
function access(from,point){
 // The entrance must never be silently represented as a verified road.
 // Use a short turn to the nearest modeled street from the exact pin.
 if(pixel(from,point)<.05)return [];
 // Orthogonal doorstep access: favor the axis with the smaller deviation,
 // never a long diagonal directly from a building to the street graph.
 const sideways=Math.abs((from.x-point.x)*IMG.w);
 const vertical=Math.abs((from.y-point.y)*IMG.h);
 const corner=sideways<vertical?{x:point.x,y:from.y}:{x:from.x,y:point.y};
 return compact([corner,point]);
}
// Road graph is fixed; moving a pin changes only its road access points.
// Reuse a bounded number of shortest-path trees while the user drags pins.
const treeCache=new Map(),CACHE_LIMIT=48;
// Binary min-heap keeps live pin edits responsive while the static guide
// graph grows. Cost ties are resolved by node ID for repeatable paths.
function comparePriority(a,b){return a.cost-b.cost||a.node-b.node}
function pushHeap(heap,item){
 heap.push(item);
 let i=heap.length-1;
 while(i>0){
  const parent=Math.floor((i-1)/2);
  if(comparePriority(heap[parent],item)<=0)break;
  heap[i]=heap[parent];i=parent;
 }
 heap[i]=item;
}
function popHeap(heap){
 const first=heap[0],last=heap.pop();
 if(!heap.length)return first;
 let i=0;
 while(true){
  const left=2*i+1,right=left+1;
  if(left>=heap.length)break;
  let next=left;
  if(right<heap.length&&comparePriority(heap[right],heap[left])<0)next=right;
  if(comparePriority(last,heap[next])<=0)break;
  heap[i]=heap[next];i=next;
 }
 heap[i]=last;
 return first;
}
function treeFrom(start){
 if(treeCache.has(start)){
  const known=treeCache.get(start);
  treeCache.delete(start);treeCache.set(start,known);return known;
 }
 const distance=Array(graph.length).fill(Infinity),prev=Array(graph.length).fill(-1);
 const visited=Array(graph.length).fill(false),heap=[];
 distance[start]=0;pushHeap(heap,{node:start,cost:0});
 while(heap.length){
  const {node,cost}=popHeap(heap);
  if(visited[node]||cost>distance[node])continue;
  visited[node]=true;
  for(const edge of adj[node]){
   if(visited[edge.to])continue;
   const next=distance[node]+edge.cost;
   if(next<distance[edge.to]){
    distance[edge.to]=next;prev[edge.to]=node;
    pushHeap(heap,{node:edge.to,cost:next});
   }
  }
 }
 const tree={distance,prev};
 treeCache.set(start,tree);
 if(treeCache.size>CACHE_LIMIT)treeCache.delete(treeCache.keys().next().value);
 return tree;
}
function shortest(start,end){
 if(start===end)return [start];
 const tree=treeFrom(start);
 if(!Number.isFinite(tree.distance[end]))return [];
 const path=[end];let at=end;
 while(at!==start&&path.length<=graph.length){
  at=tree.prev[at];if(at<0)return [];path.push(at);
 }
 return at===start?path.reverse():[];
}
function routeTurns(points){
 let count=0,last=null;
 for(let i=1;i<points.length;i++){
  const dx=(points[i].x-points[i-1].x)*IMG.w;
  const dy=(points[i].y-points[i-1].y)*IMG.h;
  const magnitude=Math.hypot(dx,dy);
  if(magnitude<=.1)continue;
  const next={x:dx/magnitude,y:dy/magnitude};
  if(last&&Math.abs(Math.atan2(last.x*next.y-last.y*next.x,
    last.x*next.x+last.y*next.y))>.30)count++;
  last=next;
 }
 return count;
}
function namedRoads(nodePath,sameEdge=null){
 const names=[];
 const include=id=>{
  const label=edges[id]?.label||'';
  if(/^(Pennsylvania|Massachusetts|New York) Avenue corridor$/.test(label)&&
     !names.includes(label))names.push(label);
 };
 if(sameEdge!==null)include(sameEdge);
 for(let i=1;i<nodePath.length;i++){
  const edge=adj[nodePath[i-1]].find(e=>e.to===nodePath[i]);
  if(edge)include(edge.edge);
 }
 return names;
}
function streetRoute(start,end){
 if(!start||!end||![start.x,start.y,end.x,end.y].every(Number.isFinite))return null;
 if(start.x===end.x&&start.y===end.y)
  return {points:[{x:start.x,y:start.y}],type:'provisional-street-network',
   accessPixels:0,intersections:0,turns:0,namedRoads:[]};
 const origins=nearbyEdges(start),targets=nearbyEdges(end);
 if(!origins.length||!targets.length)return null;
 // Minimize total door-to-door distance, not simply graph distance after
 // snapping each door to its closest road. Every candidate uses real map
 // image pixel length and remains subject to the landmark exclusion.
 let best=null;
 for(const a of origins)for(const b of targets){
  const ae=edges[a.edge],be=edges[b.edge];
  if(a.edge===b.edge){
   const cost=a.distance+pixel(a.at,b.at)+b.distance;
   if(!best||cost<best.cost-1e-7)
    best={cost,a,b,path:[],direct:true};
  }
  for(const u of [ae.a,ae.b]){
   const tree=treeFrom(u);
   for(const v of [be.a,be.b]){
    const along=tree.distance[v];
    if(!Number.isFinite(along))continue;
    const cost=a.distance+pixel(a.at,graph[u])+along+
     pixel(graph[v],b.at)+b.distance;
    if(!best||cost<best.cost-1e-7)
     best={cost,a,b,from:u,to:v,direct:false};
   }
  }
 }
 if(!best)return null;
 const {a,b,direct}=best;
 const path=direct?[]:shortest(best.from,best.to);
 if(!direct&&!path.length)return null;
 const middle=path.map(id=>graph[id]);
 const road=direct?[a.at,b.at]:[a.at,...middle,b.at];
 const body=compact([start,...access(start,a.at),...road,
  ...access(end,b.at).slice().reverse(),end]);
 const accessPixels=Math.round(a.distance+b.distance);
 return {points:body,
  type:accessPixels>65?'provisional-street-access':'provisional-street-network',
  accessPixels,intersections:direct?0:path.length,networkEdges:edges.length,
  turns:routeTurns(body),namedRoads:namedRoads(path,direct?a.edge:null)};
}
const api=Object.freeze({version:4,source:'approximate-guide-intersections',image:IMG,
 nodeCount:graph.length,edgeCount:edges.length,streetRoute,
 diagnostic:()=>({nodes:graph.length,edges:edges.length,cachedTrees:treeCache.size,avenues:diagonals.map(v=>v.name),blockedAreas:BLOCKED_LANDMARKS.map(v=>v.name)})});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CAPITAL_STREETS=api;
})(typeof window!=='undefined'?window:globalThis);
