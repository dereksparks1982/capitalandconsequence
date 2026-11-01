/* Desk collectables and book/map arrangement. No generated items or map edits.
 * A click opens the original map/book. A drag moves the physical object.
 * Positions belong to the CURRENT game only; no old-save migration.
 */
(function(root){
 'use strict';
 let bind=null,desk=null,blotter=null,drag=null,suppress=null,selected=null;
 const DEFAULT=Object.freeze({map:Object.freeze({x:.84,y:.50}),ledger:Object.freeze({x:.98,y:.50})});
 const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(+n)?+n:0));
 const current=()=>bind?.getSave?.();
 function layout(){
  const s=current();if(!s)return null;
  if(!s.deskLayout||s.deskLayout.version!==1)
   s.deskLayout={version:1,map:{...DEFAULT.map},ledger:{...DEFAULT.ledger}};
  return s.deskLayout;
 }
 function pos(id){
  const data=layout();if(!data)return {...DEFAULT[id]};
  const p=data[id]||DEFAULT[id];return {x:clamp(p.x),y:clamp(p.y)};
 }
 function place(element,p){
  if(!blotter||!element)return;
  const w=Math.max(0,blotter.clientWidth-element.offsetWidth);
  const h=Math.max(0,blotter.clientHeight-element.offsetHeight);
  element.style.left=Math.round(clamp(p.x)*w)+'px';
  element.style.top=Math.round(clamp(p.y)*h)+'px';
 }
 function updatePositions(){
  if(!blotter)return;
  place(blotter.querySelector('#careerDeskMap'),pos('map'));
  place(blotter.querySelector('#careerDeskLedger'),pos('ledger'));
  for(const item of root.FE_PERSONAL_EFFECTS?.list?.('desk')||[])
   place(blotter.querySelector('[data-desk-item-id="'+item.id+'"]'),item);
 }
 function renderObjects(){
  if(!blotter)return;
  blotter.querySelectorAll('.career-desk-object').forEach(node=>node.remove());
  const api=root.FE_PERSONAL_EFFECTS;
  const accessible=api?.isAccessible?.('desk');
  if(accessible)for(const item of api.list('desk')){
   const button=document.createElement('button');
   button.type='button';button.className='career-desk-object career-desk-movable';
   button.dataset.deskItemId=item.id;
   button.title='Inspect '+item.name+'; drag to rearrange';
   button.setAttribute('aria-label','Inspect '+item.name);
   button.textContent=({key:'🗝',letter:'✉',document:'▤',photograph:'▧',
    watch:'◷',coin:'◉'}[item.kind]||'◆');
   blotter.appendChild(button);
  }
  updatePositions();
 }
 function renderInventory(){
  if(!desk)return;
  const api=root.FE_PERSONAL_EFFECTS,carried=api?.carried?.()||[];
  const accessible=api?.isAccessible?.('desk');
  const panel=desk.querySelector('#careerDeskCollection');
  if(!panel)return;
  const onPerson=panel.querySelector('#careerDeskCarried');
  const storage=panel.querySelector('#careerDeskPlaced');
  const detail=panel.querySelector('#careerDeskItemDetail');
  onPerson.replaceChildren();storage.replaceChildren();detail.replaceChildren();
  if(!carried.length){
   const hint=document.createElement('span');hint.textContent='Nothing collected yet.';
   onPerson.appendChild(hint);
  }
  for(const item of carried){
   const row=document.createElement('div');row.className='career-desk-item-row';
   const text=document.createElement('span');text.textContent=item.name;
   const inspect=document.createElement('button');inspect.type='button';
   inspect.textContent='Inspect';inspect.dataset.inspectItem=item.id;
   row.append(text,inspect);
   const put=document.createElement('button');put.type='button';
   put.textContent='Place on felt';put.dataset.placeItem=item.id;
   put.disabled=!accessible;row.appendChild(put);onPerson.appendChild(row);
  }
  if(!accessible){
   const hint=document.createElement('span');
   hint.textContent='Return to the executive office to access the desk.';
   storage.appendChild(hint);
  }else{
   const onDesk=api.list('desk');
   if(!onDesk.length){
    const hint=document.createElement('span');
    hint.textContent='Space available for keys, letters and other possessions.';
    storage.appendChild(hint);
   }
   for(const item of onDesk){
    const row=document.createElement('div');row.className='career-desk-item-row';
    const text=document.createElement('span');text.textContent=item.name;
    const take=document.createElement('button');take.type='button';take.textContent='Take';
    take.dataset.takeItem=item.id;
    const inspect=document.createElement('button');inspect.type='button';
    inspect.textContent='Inspect';inspect.dataset.inspectItem=item.id;
    row.append(text,inspect,take);storage.appendChild(row);
   }
  }
  const entries=carried.concat(accessible?(api?.list?.('desk')||[]):[]);
  const inspected=entries.find(v=>v.id===selected);
  if(inspected){
   const title=document.createElement('strong');title.textContent=inspected.name;
   const info=document.createElement('p');
   info.textContent=inspected.description||'No additional description recorded.';
   const location=document.createElement('small');
   location.textContent=inspected.container==='desk'?'On the green felt':'Being carried';
   detail.append(title,info,location);
  }
 }
 function refresh(){
  if(!blotter)return;
  renderObjects();renderInventory();
 }
 function save(){bind?.save?.();}
 function drop(event){
  if(!drag||event.pointerId!==drag.pointerId)return;
  const moved=drag.moved,element=drag.element;
  try{element.releasePointerCapture?.(event.pointerId)}catch(_){}
  if(moved){
   const p={x:drag.x,y:drag.y};
   if(element.dataset.deskMove){
    layout()[drag.id]=p;save();
   }else root.FE_PERSONAL_EFFECTS?.position?.(drag.id,p.x,p.y);
   suppress=element;
   // The click generated after pointerup will be ignored, not the next real click.
   setTimeout(()=>{if(suppress===element)suppress=null},100);
  }
  drag=null;
 }
 function pointerDown(event){
  if(event.button!==0||!blotter)return;
  const element=event.target.closest('.career-desk-movable');
  if(!element||!blotter.contains(element))return;
  const id=element.dataset.deskMove||element.dataset.deskItemId;
  if(!id)return;
  if(element.dataset.deskItemId&&!root.FE_PERSONAL_EFFECTS?.isAccessible?.('desk'))return;
  const bounds=blotter.getBoundingClientRect(),rect=element.getBoundingClientRect();
  drag={pointerId:event.pointerId,element,id,startX:event.clientX,startY:event.clientY,
   offX:event.clientX-rect.left,offY:event.clientY-rect.top,
   x:0,y:0,moved:false};
  try{element.setPointerCapture?.(event.pointerId)}catch(_){}
 }
 function pointerMove(event){
  if(!drag||event.pointerId!==drag.pointerId||!blotter)return;
  if(!drag.moved&&Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)<7)return;
  drag.moved=true;
  event.preventDefault();
  const r=blotter.getBoundingClientRect(),e=drag.element;
  const rangeX=Math.max(0,blotter.clientWidth-e.offsetWidth);
  const rangeY=Math.max(0,blotter.clientHeight-e.offsetHeight);
  drag.x=clamp(rangeX?(event.clientX-r.left-drag.offX)/rangeX:0);
  drag.y=clamp(rangeY?(event.clientY-r.top-drag.offY)/rangeY:0);
  e.classList.add('is-dragging');place(e,drag);
 }
 function bindDesk(node){
  desk=node;blotter=desk?.querySelector('#careerDeskBlotter');
  if(!blotter)return;
  blotter.addEventListener('pointerdown',pointerDown);
  blotter.addEventListener('pointermove',pointerMove);
  blotter.addEventListener('pointerup',event=>{
   const el=drag?.element;drop(event);el?.classList.remove('is-dragging');
  });
  blotter.addEventListener('pointercancel',event=>{
   const el=drag?.element;drop(event);el?.classList.remove('is-dragging');
  });
  blotter.addEventListener('click',event=>{
   const element=event.target.closest('.career-desk-movable');
   if(suppress&&element===suppress){
    event.preventDefault();event.stopImmediatePropagation();suppress=null;return;
   }
   const id=element?.dataset.deskItemId;
   if(id){selected=id;renderInventory();}
  },true);
  desk.querySelector('#careerDeskCollection')?.addEventListener('click',event=>{
   const button=event.target.closest('button');if(!button)return;
   const api=root.FE_PERSONAL_EFFECTS;
   const id=button.dataset.inspectItem||button.dataset.placeItem||button.dataset.takeItem;
   if(button.dataset.inspectItem){selected=id;renderInventory();return;}
   if(button.dataset.placeItem){
    const result=api?.transfer?.(id,'desk');
    if(result?.ok)selected=id;
    refresh();
   }
   if(button.dataset.takeItem){
    const result=api?.transfer?.(id,'left-pocket');
    if(result?.ok)selected=id;
    refresh();
   }
  });
  if(!root.__capitalDeskResizeBound){
   root.addEventListener('resize',()=>root.FE_DESK_COLLECTION?.updatePositions?.());
   root.__capitalDeskResizeBound=true;
  }
  refresh();
 }
 root.FE_DESK_COLLECTION=Object.freeze({
  bind:config=>{bind=config;},attach:bindDesk,refresh,updatePositions,
  defaults:DEFAULT
 });
})(window);
