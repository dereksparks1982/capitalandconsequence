/* Small harbour district floorplans for the shipping chart.
 * A survey cursor explores generic 12x9 sectors. This is NOT the player's
 * physical whereabouts; a voyage must land before character presence exists.
 * Render only simple generic tile art, independent of the fixed Washington map.
 */
(function(root){
 'use strict';
 const regions=typeof module==='object'&&module.exports?require('./merchant-regions.js'):root.FE_MERCHANT_REGIONS;
 const nav=typeof module==='object'&&module.exports?require('./merchant-navigation.js'):root.FE_MERCHANT_NAV;
 const W=12,H=9;
 const ZONES=Object.freeze(['quay','warehouse','customs','market','lodging','street']);
 const entry=()=>({x:6,y:7});
 function placeKnown(save,place){
  if(typeof place!=='string')return false;
  if(Object.prototype.hasOwnProperty.call(nav.PORTS,place))return true;
  return !!regions.ensure(save).pins.find(p=>p.kind==='harbor'&&'mark:'+p.id===place);
 }
 function tiles(zone){
  if(!ZONES.includes(zone))return null;
  const g=Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=>
    x===0||y===0||x===W-1||y===H-1?'wall':'floor'));
  const paint=(x,y,t)=>{if(x>0&&y>0&&x<W-1&&y<H-1)g[y][x]=t};
  if(zone==='quay'){
   for(let y=1;y<H-1;y++)for(let x=1;x<=3;x++)paint(x,y,'water');
   for(let y=1;y<H-1;y++)paint(4,y,'dock');
   for(let y=2;y<=4;y++)paint(5,y,'crate');
   paint(7,3,'bollard');paint(7,5,'bollard');paint(8,2,'barrel');
  }else if(zone==='warehouse'){
   for(let y=2;y<=5;y++)for(let x of [2,3,8,9])paint(x,y,'crate');
   paint(5,2,'barrel');paint(6,2,'barrel');paint(5,4,'crate');
  }else if(zone==='customs'){
   for(let x=3;x<=8;x++)paint(x,3,'counter');
   paint(9,2,'books');paint(8,5,'crate');paint(3,5,'barrel');
  }else if(zone==='market'){
   for(let y of [2,5])for(let x of [2,3,8,9])paint(x,y,'stall');
   paint(4,2,'barrel');paint(8,6,'crate');
  }else if(zone==='lodging'){
   for(let y of [2,4])for(let x of [2,3,8,9])paint(x,y,'bed');
   paint(5,2,'table');paint(5,5,'table');
  }else if(zone==='street'){
   for(let y=1;y<H-1;y++)for(let x=4;x<=7;x++)paint(x,y,'road');
   paint(2,2,'crate');paint(9,5,'barrel');paint(2,5,'bollard');
  }
  // A passage at the bottom and top is retained for future true port travel.
  paint(6,H-1,'floor');paint(6,0,'floor');
  return g;
 }
 const passable=t=>['floor','road','dock'].includes(t);
 function preview(save,place,zone=null){
  if(!placeKnown(save,place))return null;
  const state=regions.ensure(save);
  const active=state.harborSurvey?.place===place&&ZONES.includes(state.harborSurvey.zone)?
   state.harborSurvey.zone:'quay';
  const selected=zone===null?active:zone;
  if(!ZONES.includes(selected))return null;
  if(!state.harborSurveys||typeof state.harborSurveys!=='object')state.harborSurveys={};
  const sections=state.harborSurveys[place]||{};
  const remembered=sections[selected],grid=tiles(selected);
  let x=Number.isInteger(remembered?.x)?remembered.x:entry().x;
  let y=Number.isInteger(remembered?.y)?remembered.y:entry().y;
  if(!passable(grid[y]?.[x])){x=entry().x;y=entry().y}
  state.harborSurvey={place,zone:selected,x,y};
  return {place,zone:selected,x,y,tiles:grid,width:W,height:H};
 }
 function step(save,place,dx,dy){
  if(!Number.isInteger(dx)||!Number.isInteger(dy)||Math.abs(dx)+Math.abs(dy)!==1)return {ok:false,reason:'Only one adjacent tile per step.'};
  const s=preview(save,place);
  if(!s)return {ok:false,reason:'No available port survey.'};
  const nx=s.x+dx,ny=s.y+dy;
  if(nx<=0||ny<=0||nx>=W-1||ny>=H-1||!passable(s.tiles[ny]?.[nx]))
   return {ok:false,reason:'That part of the harbour layout is blocked.'};
  const record=regions.ensure(save).harborSurvey;
  record.x=nx;record.y=ny;
  const m=regions.ensure(save);
  if(!m.harborSurveys[place])m.harborSurveys[place]={};
  m.harborSurveys[place][s.zone]={x:nx,y:ny};
  return {ok:true,x:nx,y:ny};
 }
 function walkTo(save,place,x,y){
  const s=preview(save,place);
  if(!s||!Number.isInteger(x)||!Number.isInteger(y))return {ok:false,reason:'Unrecognized chart cell.'};
  const deltaX=x-s.x,deltaY=y-s.y;
  if(Math.abs(deltaX)+Math.abs(deltaY)!==1)return {ok:false,reason:'Select one adjacent square.'};
  return step(save,place,deltaX,deltaY);
 }
 const api=Object.freeze({W,H,ZONES,tiles,preview,step,walkTo,passable});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_MERCHANT_HARBOR_WALK=api;
})(typeof window!=='undefined'?window:globalThis);
