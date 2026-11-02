/* Railroad finance panel inside the existing freehand Rail Editor.
 * Drawing is always only a plan. Finance actions charge saved company cash.
 */
(function(root){
'use strict';
const company=root.FE_RAIL_COMPANY;
if(!company)throw Error('Railway company must load before its finance panel.');
const $=id=>document.getElementById(id);
let mounted=false;
function el(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;}
function selectLine(holder,lines){
 const list=el('select');list.id='railCompanyLine';list.setAttribute('aria-label','Purchased railway corridor');
 for(const l of lines){const o=el('option',l.stations.map(s=>s.name).join(' ↔ ')+' · '+l.status);
  o.value=l.id;list.appendChild(o);}
 holder.appendChild(list);
 return list;
}
function mount(){
 if(mounted)return true;
 const parent=$('titleMapRailTools');if(!parent)return false;
 const section=el('section');section.id='railCompanyPanel';
 section.className='title-map-road-tools';section.setAttribute('aria-label','Railway charter and real construction');
 section.innerHTML='<h3>Railway Ownership · Federal Electric</h3>'+
  '<p>Painted track is a draft only. Rights, contracted crews and locomotives cost real company money and Washington time. These actions do not give free revenue or map pins.</p>'+
  '<p id="railCompanyBalance"></p><div id="railCompanyCharter"></div>'+
  '<div id="railCompanyCorridors"></div><div id="railCompanyActions"></div>'+
  '<p id="railCompanyNotice" role="status" aria-live="polite"></p>';
 parent.appendChild(section);mounted=true;
 section.addEventListener('click',e=>{
  const b=e.target.closest('button[data-rail-company]');
  if(!b||b.disabled||typeof S==='undefined')return;
  const action=b.dataset.railCompany;
  const request={action,date:root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate};
  if(action==='rights'){
   request.from=$('titleMapRailFrom')?.value;request.to=$('titleMapRailTo')?.value;
  }else if(action==='build'||action==='dispatch'||action==='line-repair')
   request.lineId=$('railCompanyLine')?.value;
  else if(action==='engine-repair')request.lineId=b.dataset.engineId;
  const proposed=company.preflight(S,request);
  if(!proposed.ok){$('railCompanyNotice').textContent=proposed.reason;return;}
  b.disabled=true;
  const spent=root.advanceWorldTime(proposed.seconds,true);
  if(spent!==proposed.seconds){
   $('railCompanyNotice').textContent='Construction action interrupted: no ownership or funds changed.';
   render();return;
  }
  const seq=(S.railCompanyReceiptSequence||0)+1;
  const outcome=company.transact(S,{...request,token:'railcompany:'+seq,spentSeconds:spent});
  if(outcome.ok&&!outcome.repeated){
   S.railCompanyReceiptSequence=seq;save(true);
  }
  $('railCompanyNotice').textContent=outcome.ok?outcome.description:outcome.reason;
  render();root.FE_RAIL_EDITOR?.sync?.();
 });
 return true;
}
function actionButton(holder,name,action,request){
 const button=el('button',name);button.type='button';button.dataset.railCompany=action;
 if(action==='engine-repair')button.dataset.engineId=request.lineId;
 const terms=company.preflight(S,{action,date:root.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate,...request});
 button.disabled=!terms.ok;
 button.title=terms.ok?'$'+(terms.costCents/100).toFixed(2)+' · '+terms.seconds/60+' game minutes':terms.reason;
 holder.appendChild(button);return button;
}
function render(){
 if(typeof document==='undefined'||typeof S==='undefined'||!mount())return;
 const state=company.read(S),balance=$('railCompanyBalance');
 balance.textContent='Company funds $'+(Number(S.companyCash)||0).toFixed(2)+
  ' · charter '+(state.charter?'registered':'not purchased')+' · '+
  state.lines.length+' paid rights agreements · '+
  state.engines.length+' purchased locomotives.';
 const charter=$('railCompanyCharter');charter.replaceChildren();
 if(!state.charter)actionButton(charter,'Register railway charter · $250 · 60 min','charter',{});
 const corridors=$('railCompanyCorridors');corridors.replaceChildren();
 if(state.charter){
  const heading=el('h4','Acquire rights for selected drawn route');
  const selectHint=el('p','Select two connected planned stations using the existing From/To selectors above.');
  corridors.append(heading,selectHint);
  actionButton(corridors,'Purchase surveyed corridor rights · 60 min','rights',{
   from:$('titleMapRailFrom')?.value,to:$('titleMapRailTo')?.value
  });
 }
 const actions=$('railCompanyActions');actions.replaceChildren();
 if(state.lines.length){
  const title=el('h4','Construct & Operate Paid Lines');actions.appendChild(title);
  const selected=selectLine(actions,state.lines);
  const feedback=el('div');actions.appendChild(feedback);
  const draw=()=>{
   feedback.replaceChildren();const line=state.lines.find(l=>l.id===selected.value);
   if(!line)return;
   feedback.appendChild(el('p',line.stations.map(s=>s.name).join(' to ')+' · '+line.length+
    ' map pixels · '+line.crewShiftsCompleted+'/'+line.crewShiftsRequired+
    ' paid construction shifts · '+line.status+' · track condition '+(line.condition??100)+'/100.'));
   if(line.status!=='open')actionButton(feedback,'Pay crew and build track · 90 min','build',{lineId:line.id});
   else{
    actionButton(feedback,'Run paid locomotive · 15 min · fuel $12','dispatch',{lineId:line.id});
    if((line.condition??100)<100)
     actionButton(feedback,'Pay track maintenance crew · 90 min · $65','line-repair',{lineId:line.id});
   }
  };
  selected.addEventListener('change',draw);draw();
 }
 if(state.lines.some(l=>l.status==='open'))
  actionButton(actions,'Buy locomotive · $1,400 · 120 min','engine',{});
 if(state.engines.length){
  const shop=el('div');shop.appendChild(el('h4','Locomotive Condition & Fitter Repairs'));
  for(const engine of state.engines){
   shop.appendChild(el('p',engine.id+' · engine condition '+(engine.condition??100)+'/100'));
   if((engine.condition??100)<100)
    actionButton(shop,'Repair '+engine.id+' · 120 min · $50','engine-repair',{lineId:engine.id});
  }
  actions.appendChild(shop);
 }
 const last=company.trips(S).at(-1);
 if(last)actions.appendChild(el('p','Latest actual paid trip '+last.id+' · '+last.status+
  ' · no speculative ticket or freight proceeds.'));
 root.FE_RAIL_FREIGHT_UI?.render?.();
}
root.FE_RAIL_COMPANY_UI=Object.freeze({mount,render});
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{mount();render()},{once:true});
 else {mount();render();}
}
})(typeof window!=='undefined'?window:globalThis);
