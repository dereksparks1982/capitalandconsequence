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
const graph=[],adj=[],edges=[],idByGrid=new Map();
function add(p){
 const id=graph.length;
 graph.push(Object.freeze({x:+p.x.toFixed(6),y:+p.y.toFixed(6)}));
 adj.push([]);
 return id;
}
function link(a,b,label){
 if(a===b||a<0||b<0)return;
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
function nearestEdge(p){
 let best=null;
 for(let i=0;i<edges.length;i++){
  const e=edges[i],a=graph[e.a],b=graph[e.b];
  // Minimize REAL map-image pixels, not warped normalized x/y.
  const dx=(b.x-a.x)*IMG.w,dy=(b.y-a.y)*IMG.h;
  const t=Math.max(0,Math.min(1,(((p.x-a.x)*IMG.w)*dx+((p.y-a.y)*IMG.h)*dy)/(dx*dx+dy*dy)));
  const at={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
  const distance=pixel(at,p);
  if(!best||distance<best.distance)best={edge:i,at,t,distance};
 }
 return best;
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
 const corner={x:Math.abs(from.x-point.x)<Math.abs(from.y-point.y)?point.x:from.x,
  y:Math.abs(from.x-point.x)<Math.abs(from.y-point.y)?from.y:point.y};
 return compact([corner,point]);
}
function shortest(start,end){
 if(start===end)return [start];
 const distance=Array(graph.length).fill(Infinity),prev=Array(graph.length).fill(-1);
 const visited=Array(graph.length).fill(false);
 distance[start]=0;
 for(let count=0;count<graph.length;count++){
  let node=-1;
  for(let n=0;n<graph.length;n++)
   if(!visited[n]&&(node<0||distance[n]<distance[node]))node=n;
  if(node<0||!Number.isFinite(distance[node]))break;
  if(node===end)break;
  visited[node]=true;
  for(const e of adj[node]){
   if(distance[node]+e.cost<distance[e.to]){
    distance[e.to]=distance[node]+e.cost;prev[e.to]=node;
   }
  }
 }
 if(!Number.isFinite(distance[end]))return [];
 const path=[end];let at=end;
 while(at!==start&&path.length<=graph.length){at=prev[at];if(at<0)return [];path.push(at)}
 return path.reverse();
}
function streetRoute(start,end){
 if(!start||!end||![start.x,start.y,end.x,end.y].every(Number.isFinite))return null;
 if(start.x===end.x&&start.y===end.y)
  return {points:[{x:start.x,y:start.y}],type:'provisional-street-network',accessPixels:0,intersections:0};
 const a=nearestEdge(start),b=nearestEdge(end);
 if(!a||!b)return null;
 const ae=edges[a.edge],be=edges[b.edge];
 // Two candidate intersections for each snapped entrance.
 let best=null;
 for(const u of [ae.a,ae.b])for(const v of [be.a,be.b]){
  const path=shortest(u,v);
  if(!path.length)continue;
  const cost=pixel(a.at,graph[u])+path.slice(1).reduce((sum,n,i)=>
   sum+pixel(graph[path[i]],graph[n]),0)+pixel(graph[v],b.at);
  if(!best||cost<best.cost)best={cost,path};
 }
 let middle=best?best.path.map(i=>graph[i]):[];
 let startLine=[a.at,...middle,b.at];
 if(a.edge===b.edge){
  const direct=pixel(a.at,b.at);
  if(!best||direct<=best.cost)startLine=[a.at,b.at];
 }
 if(!startLine.length)return null;
 const body=compact([start,...access(start,a.at),...startLine,
  ...access(end,b.at).slice().reverse(),end]);
 // Complete path starts and ends at the map pins. Long driveway
 // connectors are explicitly flagged: this is not street-perfect art.
 const accessPixels=Math.round(a.distance+b.distance);
 const approximate=accessPixels>65;
 return {points:body,type:approximate?'provisional-street-access':'provisional-street-network',
  accessPixels,intersections:middle.length,networkEdges:edges.length};
}
const api=Object.freeze({version:1,source:'approximate-guide-intersections',image:IMG,
 nodeCount:graph.length,edgeCount:edges.length,streetRoute,
 diagnostic:()=>({nodes:graph.length,edges:edges.length,avenues:diagonals.map(v=>v.name)})});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CAPITAL_STREETS=api;
})(typeof window!=='undefined'?window:globalThis);
