/* Accessible, deliberately restrained pre-campaign story card for Charles.
 * Existing world and map artwork are untouched. No website, audio or remote assets.
 */
(function(root){
'use strict';
let overlay=null,context=null;
function element(tag,cls,text){
 const node=document.createElement(tag);
 if(cls)node.className=cls;
 if(text!==undefined&&text!==null)node.textContent=String(text);
 return node;
}
function ensureOverlay(){
 if(overlay?.isConnected)return overlay;
 overlay=document.createElement('section');
 overlay.className='whitcomb-intro-overlay';
 overlay.id='whitcombIntroOverlay';
 overlay.setAttribute('role','dialog');
 overlay.setAttribute('aria-modal','true');
 overlay.setAttribute('aria-label','Charles Whitcomb: Journey to Washington');
 document.body.appendChild(overlay);
 overlay.addEventListener('keydown',event=>{
  if(!context||event.target?.closest?.('textarea,input,select,[contenteditable]'))return;
  const dirs={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],
   w:[0,-1],a:[-1,0],s:[0,1],d:[1,0]};
  const move=dirs[event.key];
  if(move){event.preventDefault();handleStep(move[0],move[1]);return}
  if(event.key.toLowerCase()==='e'&&root.FE_ALEXANDRIA_WALK?.scene?.(context.save)){
   event.preventDefault();handleAction(()=>root.FE_ALEXANDRIA_WALK.inspect(context.save));
  }
 });
 return overlay;
}
function hide(){
 context=null;
 if(overlay){overlay.replaceChildren();overlay.remove();overlay=null}
}
function handleAction(operation){
 const c=context,walk=root.FE_ALEXANDRIA_WALK;
 if(!c||!walk?.scene?.(c.save))return;
 const state=root.FE_WHITCOMB_INTRO.ensure(c.save),before=JSON.stringify(state.alexandriaWalk||null);
 const outcome=operation();
 if(!outcome?.ok){const message=overlay?.querySelector('.whitcomb-intro-walk-message');if(message)message.textContent=outcome?.reason||'Unavailable';return}
 if(c.persist?.()===false){
  state.alexandriaWalk=JSON.parse(before);
  const message=overlay?.querySelector('.whitcomb-intro-walk-message');
  if(message)message.textContent='Movement was not saved; the original position has been restored.';
  return;
 }
 const info=outcome.reason;
 show(c.save,c.choose,c.persist);
 const message=overlay?.querySelector('.whitcomb-intro-walk-message');
 if(message)message.textContent=info||'';
 overlay?.querySelector('.whitcomb-intro-tile.current')?.focus?.({preventScroll:true});
}
function handleStep(dx,dy){
 if(!context)return;
 const walk=root.FE_ALEXANDRIA_WALK,p=walk?.ensure?.(context.save);
 if(p)handleAction(()=>walk.move(context.save,p.x+dx,p.y+dy));
}
function renderPlace(save){
 const walk=root.FE_ALEXANDRIA_WALK;
 if(!walk?.scene?.(save))return null;
 const st=walk.ensure(save),r=walk.rows(st.zone),place=walk.SHAPE[st.zone];
 const section=element('section','whitcomb-alexandria-area');
 section.appendChild(element('h3',null,'Explore '+place.name));
 section.appendChild(element('p','whitcomb-intro-map-note',
  'An explorable slice of Alexandria, not a recreation of the entire city. WASD or arrows walk; E examines a marked square. Prelude walking leaves the Washington clock frozen.'));
 const board=element('div','whitcomb-intro-tile-board');
 board.setAttribute('role','grid');board.setAttribute('aria-label',place.name+' walkable top-down area');
 const glyph={'#':'▓','.':'','D':'⇆','H':'↕','F':'▤','R':'▥','M':'▦','P':'▣','B':'▰','T':'■','~':'≈'};
 for(let y=0;y<9;y++)for(let x=0;x<12;x++){
  const t=r[y][x],here=st.x===x&&st.y===y,adj=Math.abs(st.x-x)+Math.abs(st.y-y)===1&&walk.passable(t);
  const label=here?'Charles standing here':(t==='#'?'Wall':t==='~'?'Water':t==='T'?'Stored goods':t==='D'?'Connecting door':
   t==='H'?'Warehouse passage':t==='F'?'Father’s desk':t==='R'?'Trading register':t==='M'?'Caravan goods':t==='P'?'Passenger papers':
   t==='B'?'Cabin bunk':'Walkable floor')+' ('+(x+1)+','+(y+1)+')';
  const cell=element(adj||here?'button':'span','whitcomb-intro-tile kind-'+(t==='#'?'wall':t==='.'?'floor':t==='~'?'water':t==='T'?'stored':t.toLowerCase())+
   (here?' current':''),here?'♟':glyph[t]??'');
  cell.setAttribute('aria-label',label);
  if(adj||here){
   cell.type='button';
   cell.addEventListener('click',()=>handleAction(()=>here?walk.inspect(save):walk.move(save,x,y)));
  }
  board.appendChild(cell);
 }
 section.appendChild(board);
 const links=element('div','whitcomb-intro-exits');
 for(const id of walk.exits(save)){
  const control=element('button',null,'Enter '+walk.SHAPE[id].name+' · connected doorway');
  control.type='button';control.addEventListener('click',()=>handleAction(()=>walk.cross(save,id)));
  links.appendChild(control);
 }
 section.appendChild(links);
 const message=element('p','whitcomb-intro-walk-message');
 message.setAttribute('role','status');
 section.appendChild(message);
 return section;
}
function show(save,choose,persist){
 context={save,choose,persist};
 const service=root.FE_WHITCOMB_INTRO,scene=service?.current?.(save);
 if(!scene){hide();return false}
 const state=service.ensure(save),card=element('article','whitcomb-intro-card');
 const heading=element('header','whitcomb-intro-heading');
 heading.appendChild(element('p','whitcomb-intro-kicker','CAPITAL & CONSEQUENCE · CHARLES WHITCOMB'));
 heading.appendChild(element('h2',null,scene.title));
 heading.appendChild(element('p','whitcomb-intro-place',scene.place));
 const chapters=element('div','whitcomb-intro-progress');
 for(let i=0;i<service.SCENES.length;i++){
  const tab=element('span',i<state.stage?'complete':i===state.stage?'current':'pending',
   (i+1)+' · '+service.SCENES[i].id.toUpperCase());
  chapters.appendChild(tab);
 }
 const body=element('section','whitcomb-intro-story');
 const walkScene=renderPlace(save);if(walkScene)body.appendChild(walkScene);
 body.appendChild(element('h3',null,scene.setting));
 body.appendChild(element('p','whitcomb-intro-narrative',scene.story));
 body.appendChild(element('p','whitcomb-intro-context',scene.detail));
 const choices=element('div','whitcomb-intro-choices');
 choices.appendChild(element('h3',null,'What will Charlie do?'));
 let busy=false;
 for(const decision of scene.options){
  const button=element('button','whitcomb-intro-choice',decision.title);
  button.type='button';
  button.addEventListener('click',()=>{
   if(busy)return;
   busy=true;
   const result=choose?.(decision.id);
   if(!result?.ok){
    busy=false;
    error.textContent=result?.reason||'The choice could not be saved.';
    return;
   }
   error.textContent='';
  });
  choices.appendChild(button);
 }
 const error=element('p','whitcomb-intro-error');
 error.setAttribute('role','alert');
 const foot=element('footer','whitcomb-intro-footer');
 foot.appendChild(element('span',null,'Opening chapter '+(state.stage+1)+' of '+service.SCENES.length));
 foot.appendChild(element('span',null,'Choices are saved. Normal game time starts in Washington.'));
 card.append(heading,chapters,body,choices,error,foot);
 const layer=ensureOverlay();
 layer.replaceChildren(card);
 layer.hidden=false;
 const first=choices.querySelector('button');
 if(first&&document.activeElement===document.body)first.focus({preventScroll:true});
 return true;
}
const api=Object.freeze({show,hide});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WHITCOMB_INTRO_UI=api;
})(typeof window!=='undefined'?window:globalThis);
