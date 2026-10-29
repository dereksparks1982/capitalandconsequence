/* Capital & Consequence: public hospital/police follow-up at actual room visits.
 * Does not create police omniscience, instant healing, new destinations, or UI pins.
 */
(function(root){
'use strict';
let controls=null;
function getPanel(){
 let panel=document.getElementById('cityRoomDuelAftercare');
 if(panel)return panel;
 const anchor=document.getElementById('cityRoomDuel');
 if(!anchor||!anchor.parentElement)return null;
 panel=document.createElement('section');panel.id='cityRoomDuelAftercare';
 panel.className='city-room-aftermath';panel.hidden=true;
 const heading=document.createElement('h4');heading.textContent='Consequences of Honor';
 const note=document.createElement('p');note.id='cityRoomAftercareNote';
 const button=document.createElement('button');button.id='cityRoomAftercareAct';
 button.type='button';
 panel.append(heading,note,button);
 anchor.insertAdjacentElement('afterend',panel);
 return panel;
}
function render(){
 const panel=getPanel();if(!panel||!controls||!root.FE_DUEL_AFTERMATH)return;
 const save=controls.getSave?.(),location=controls.getLocation?.();
 if(!save||!location){panel.hidden=true;return}
 const state=root.FE_DUEL_AFTERMATH.visible(save,location,save.gameDate);
 const caseDue=location==='metropolitanPolice'?
  root.FE_POLICE_CASEWORK?.due?.(save,save.gameDate):null;
 const target=state.injury?
  {id:state.injury.duelId,kind:'treat',label:'Request treatment · 20 minutes',
   text:'You were injured in a duel. Ask the receiving staff for treatment.'}:
  state.reportable?
  {id:state.reportable.duelId,kind:'report',label:'Give a statement · 10 minutes',
   text:'You witnessed your own duel. You may give your account to the police. Reporting does not prove an allegation.'}:
  caseDue?{id:caseDue.id,kind:'review',label:'Request case update · 12 minutes',
   text:'Your earlier statement can now be reviewed at the police desk. A report alone does not establish guilt.'}:null;
 if(!target){panel.hidden=true;return}
 panel.hidden=false;
 document.getElementById('cityRoomAftercareNote').textContent=target.text;
 const button=document.getElementById('cityRoomAftercareAct');
 button.textContent=target.label;
 button.disabled=false;
 button.onclick=()=>{
  if(!controls||button.disabled)return;
  button.disabled=true;
  const ok=controls.onAction?.(target.id,location,target.kind);
  if(!ok){
   document.getElementById('cityRoomAftercareNote').textContent=
    'This request could not be completed. No treatment or statement was recorded.';
  }
  render();
 };
}
function bind(next){
 if(!next||typeof next.getSave!=='function'||
  typeof next.getLocation!=='function'||typeof next.onAction!=='function')
  return false;
 controls=next;render();return true;
}
const api=Object.freeze({bind,render});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_DUEL_AFTERCARE_UI=api;
})(typeof window!=='undefined'?window:globalThis);
