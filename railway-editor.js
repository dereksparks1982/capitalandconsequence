/* Track-and-station editor. This is a rail PLANNER, not free company-owned
 * construction. It draws a separate transparent canvas over the approved map.
 */
(function(root){'use strict';
const $=id=>document.getElementById(id),W=2048,H=1159;
let config=null,editing=false,mode='track',first=null,canvas=null,ctx=null,overlay=null,selectedFrom='';
let past=[];
function state(){return config?.getSave?.()}
function plan(){return root.FE_RAILWAY?.ensure?.(state())}
function notify(s){const node=$('titleMapRailStatus');if(node)node.textContent=s}
function snapshot(){past.push(JSON.stringify(plan()));if(past.length>30)past.shift()}
function commit(s){config?.persist?.();draw();refreshOptions();notify(s)}
function position(p){const v=config?.getView?.()||{x:0,y:0,scale:1};return {x:v.x+p.x*W*v.scale,y:v.y+p.y*H*v.scale}}
function local(e){
 const r=overlay?.getBoundingClientRect?.(),v=config?.getView?.();
 if(!r||!v||v.scale<=0)return null;
 const x=(e.clientX-r.left-v.x)/(W*v.scale),y=(e.clientY-r.top-v.y)/(H*v.scale);
 return x>=0&&x<=1&&y>=0&&y<=1?{x,y}:null;
}
function draw(){
 if(!ctx||!overlay)return;
 const v=config?.getView?.(),size=$('titleMapViewport');
 if(!v||!size)return;
 const w=size.clientWidth,h=size.clientHeight;
 if(!w||!h)return;
 const dpr=Math.max(1,Math.min(2,Number(root.devicePixelRatio)||1));
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
 canvas.style.width=w+'px';canvas.style.height=h+'px';
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const p=plan();if(!p)return;
 ctx.lineCap='round';ctx.lineJoin='round';
 for(const line of p.segments){
  const a=position(line.a),b=position(line.b);
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
  ctx.strokeStyle='#271f1a';ctx.lineWidth=5;ctx.stroke();
  ctx.strokeStyle='#c0ac76';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
 }
 for(const s of p.stations){
  const v=position(s.at);
  ctx.fillStyle='#56402b';ctx.strokeStyle='#e4d2a0';ctx.lineWidth=2;
  ctx.fillRect(v.x-9,v.y-10,18,16);ctx.strokeRect(v.x-9,v.y-10,18,16);
  ctx.fillStyle='#f0e0b1';ctx.font='bold 11px monospace';ctx.fillText('ST',v.x-7,v.y+2);
  ctx.fillStyle='#fff1c9';ctx.fillText(s.name.slice(0,24),v.x+14,v.y+2);
 }
 if(first){const t=position(first);ctx.fillStyle='#e0d47c';ctx.beginPath();ctx.arc(t.x,t.y,6,0,Math.PI*2);ctx.fill()}
 const minute=state()?.worldCalendar?.worldMinute;
 for(const train of p.trains){
  const moved=root.FE_RAILWAY.trainPosition(p,minute,train);if(!moved)continue;
  const t=position(moved);
  ctx.fillStyle=moved.arrived?'#816f52':'#2f3941';ctx.strokeStyle='#fff2d3';ctx.lineWidth=2;
  ctx.fillRect(t.x-10,t.y-7,20,14);ctx.strokeRect(t.x-10,t.y-7,20,14);
  ctx.fillStyle='#fff3da';ctx.font='bold 10px monospace';ctx.fillText('LO',t.x-7,t.y+3);
 }
}
function click(e){
 if(!editing||config?.busy?.()||e.button!==0)return;
 const p=local(e);if(!p)return;
 e.stopPropagation();e.preventDefault();
 if(mode==='track'){
  if(!first){first=p;notify('Track start selected. Click the next bend or endpoint.');draw();return}
  snapshot();
  const res=root.FE_RAILWAY?.addSegment?.(state(),first,p);
  if(res?.ok){first=p;commit('Track segment saved. Continue clicking bends, or select Finish Track.')}
  else{past.pop();notify(res?.reason||'Invalid track')}
 }else if(mode==='station'){
  const name=root.prompt?.('Station name (up to 60 characters):','New Station');
  if(name===null||name===undefined)return;
  snapshot();
  const result=root.FE_RAILWAY?.addStation?.(state(),p,name);
  if(result?.ok)commit('Station '+result.station.name+' established on the rail plan.');
  else{past.pop();notify(result?.reason||'Station could not be placed')}
 }
}
function refreshOptions(){
 const a=$('titleMapRailFrom'),b=$('titleMapRailTo');
 if(!a||!b)return;
 const stations=plan()?.stations||[];
 const previousA=a.value,previousB=b.value;
 for(const sel of [a,b]){
  sel.replaceChildren();
  for(const s of stations){const o=document.createElement('option');o.value=s.id;o.textContent=s.name;sel.appendChild(o)}
 }
 if(stations.some(s=>s.id===previousA))a.value=previousA;
 if(stations.some(s=>s.id===previousB))b.value=previousB;
 else if(stations.length>1)b.selectedIndex=1;
}
function enter(){
 if(!config||config.busy?.())return notify('Finish the active journey first.');
 if(!editing&&(config.pinEdit?.()||root.FE_ROAD_EDITOR?.isEditing?.()))
  return notify('Finish Edit Pins or Road Editor before editing rails.');
 editing=!editing;first=null;past=[];
 const controls=$('titleMapRailTools'),button=$('titleMapRailEdit');
 if(controls)controls.hidden=!editing;
 if(button){button.setAttribute('aria-pressed',String(editing));button.textContent=editing?'Finish Rails':'Rail Editor'}
 if(overlay){overlay.classList.toggle('editing',editing)}
 if(editing){const card=$('titleMapLocationCard');if(card)card.hidden=true}
 draw();refreshOptions();
 notify(editing?'Draw tracks with successive clicks. Place stations at track endpoints. Trains move with Washington time.':'Rail editor closed. Saved tracks stay visible.');
}
function mount(args){
 if(config)return true;
 config=args;overlay=$('titleMapRailCanvas');if(!overlay)return false;
 canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
 canvas.style.cssText='display:block;pointer-events:none;width:100%;height:100%';
 overlay.appendChild(canvas);ctx=canvas.getContext('2d');
 if(!ctx)return false;
 overlay.addEventListener('pointerdown',click);
 const on=(id,ev,fn)=>$(id)?.addEventListener(ev,fn);
 on('titleMapRailEdit','click',enter);
 on('titleMapRailMode','change',e=>{mode=e.target.value;first=null;draw();notify(mode==='track'?'Click rail corners.':'Click an existing track endpoint to build a station.')});
 on('titleMapRailFinish','click',()=>{first=null;draw();notify('Track ended. Click a new start to draw another line.')});
 on('titleMapRailUndo','click',()=>{if(first){first=null;draw();return notify('Pending endpoint cleared.')}
   if(!past.length)return notify('Nothing to undo.');
   state().railwayPlanner=JSON.parse(past.pop());commit('Last rail-plan edit undone.')});
 on('titleMapRailRun','click',()=>{
  const from=$('titleMapRailFrom')?.value,to=$('titleMapRailTo')?.value;
  const res=root.FE_RAILWAY?.startTrain?.(state(),from,to);
  if(res?.ok)commit('Locomotive dispatched. Travel time '+res.minutes+' game minutes. Advance the Washington clock to move it.');
  else notify(res?.reason||'Train could not depart.');
 });
 on('titleMapRailClear','click',()=>{
  if(!root.confirm?.('Clear ALL track, stations, and train previews from this profile?'))return;
  snapshot();state().railwayPlanner={version:1,segments:[],stations:[],trains:[]};
  first=null;commit('Rail plan cleared. Approved city map untouched.');
 });
 refreshOptions();draw();return true;
}
function sync(){if(!config)return;draw()}
root.FE_RAIL_EDITOR=Object.freeze({mount,sync,isEditing:()=>editing});
root.FE_RAIL_EDITOR_SETUP?.();
})(typeof window!=='undefined'?window:globalThis);
