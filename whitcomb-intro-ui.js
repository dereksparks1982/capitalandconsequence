/* Accessible, deliberately restrained pre-campaign story card for Charles.
 * Existing world and map artwork are untouched. No website, audio or remote assets.
 */
(function(root){
'use strict';
let overlay=null;
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
 return overlay;
}
function hide(){
 if(overlay){overlay.replaceChildren();overlay.remove()}
}
function show(save,choose){
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
 if(first)first.focus({preventScroll:true});
 return true;
}
const api=Object.freeze({show,hide});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WHITCOMB_INTRO_UI=api;
})(typeof window!=='undefined'?window:globalThis);
