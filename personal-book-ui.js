/* Capital & Consequence: accessible HTML/CSS page-turning private books.
 * One shared mechanism; books are player UI, never stealable NPC inventory.
 * No new image files, no altered map geometry, no hidden-case knowledge.
 */
(function(root){
'use strict';
let access=null,overlay=null,spread=0,pages=[],turning=false,returnFocus=null,flash='',selectedPage=0;
const $=id=>document.getElementById(id);
const isOpen=()=>!!overlay&&!overlay.hidden;
function elt(tag,cls,content){
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(content!==undefined)e.textContent=String(content);
 return e;
}
function create(){
 if(overlay)return overlay;
 overlay=elt('div','personal-book-backdrop');
 overlay.id='personalBookBackdrop';overlay.hidden=true;
 overlay.innerHTML=`<section class="personal-book-window" role="dialog" aria-modal="true" aria-labelledby="personalBookHeading">
 <header class="personal-book-header"><div><small>WASHINGTON, D.C. · PRIVATE PAPERS</small>
 <h2 id="personalBookHeading">Personal Records</h2></div>
 <button id="personalBookClose" type="button" aria-label="Close personal book">×</button></header>
 <div class="personal-book-toolbar"><label>Section <select id="personalBookSection" aria-label="Jump to a book section"></select></label>
 <button id="personalBookWriteJump" type="button">My Writing</button><output id="personalBookPosition" aria-live="polite"></output></div>
 <div id="personalBookSpread" class="personal-book-spread" aria-label="Open book with two facing pages">
 <article id="personalBookLeft" class="personal-book-page"></article>
 <article id="personalBookRight" class="personal-book-page"></article></div>
 <footer class="personal-book-controls">
 <button id="personalBookPrev" type="button">◀ Previous Pages</button>
 <p id="personalBookMessage" role="status" aria-live="polite"></p>
 <button id="personalBookNext" type="button">Next Pages ▶</button></footer>
 </section>`;
 document.body.appendChild(overlay);
 $('personalBookClose').addEventListener('click',close);
 $('personalBookPrev').addEventListener('click',()=>turn(-1));
 $('personalBookNext').addEventListener('click',()=>turn(1));
 $('personalBookSection').addEventListener('change',e=>jump(Number(e.target.value)));
 $('personalBookWriteJump').addEventListener('click',()=>jump(pages.length-1));
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 document.addEventListener('keydown',e=>{
  if(!isOpen())return;
  if(e.key==='Escape'){e.preventDefault();close();return}
  // Never steal left/right arrow keys while writing, editing or selecting.
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();turn(1)}
  if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();turn(-1)}
  if(e.key==='Home'){e.preventDefault();jump(0)}
  if(e.key==='End'){e.preventDefault();jump(pages.length-1)}
 });
 return overlay;
}
function build(page,node){
 node.replaceChildren();
 if(!page){node.append(elt('p','personal-book-blank',''));return}
 const upper=elt('small','personal-book-section',page.section||'Private papers');
 const heading=elt('h3','personal-book-title',page.title||'Untitled record');
 const kicker=elt('p','personal-book-kicker',page.kicker||'');
 node.append(upper,heading,kicker);
 for(const value of (page.paragraphs||[]).slice(0,20))
  node.append(elt('p','personal-book-paragraph',value));
 if(Array.isArray(page.items)&&page.items.length){
  const body=elt('div','personal-book-items');
  for(const record of page.items.slice(0,90)){
   const item=elt('div','personal-book-item');
   item.append(elt('strong','',record.heading||''),elt('p','',record.text||''));
   body.appendChild(item);
  }
  node.appendChild(body);
 }
 if(page.editable){
  const label=elt('label','personal-book-note-label','Write privately');
  const area=elt('textarea','personal-book-note');
  area.id='personalBookNote';area.maxLength=4000;
  area.value=page.note||'';area.placeholder='Write your own dated observations and recollections…';
  label.appendChild(area);
  const saveButton=elt('button','personal-book-save','Save Entry to Ledger');
  saveButton.type='button';
  saveButton.addEventListener('click',persistNotes);
  node.append(label,saveButton);
 }
 const number=elt('small','personal-book-folio',String(Math.max(1,pages.indexOf(page)+1)));
 node.append(number);
}
function persistNotes(){
 if(!access)return true;
 const area=$('personalBookNote');
 if(!area)return true;
 const save=access.getSave?.();
 if(!save)return false;
 const newNote=area.value.slice(0,4000);
 if(!newNote.trim())return true;
 // New writing is append-only, dated, and private to the selected character.
 // Do not destroy the old personalBookNotes field from earlier versions.
 const previous=save.personalBookEntries;
 const entries=Array.isArray(previous)?previous.slice():[];
 const stamp=typeof save.gameDate==='string'&&/^\\d{4}-\\d{2}-\\d{2}$/.test(save.gameDate)?save.gameDate:'Undated';
 const entry={id:'entry-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9),date:stamp,text:newNote};
 save.personalBookEntries=[...entries,entry];
 let ok=false;
 try{ok=access.save?.()===true}catch(error){ok=false}
 if(!ok){
  if(previous===undefined)delete save.personalBookEntries;
  else save.personalBookEntries=previous;
  flash='SAVE FAILED. Your text remains visible. Nothing was erased.';
  $('personalBookMessage').textContent=flash;
  return false;
 }
 const oldNotesIndex=pages.findIndex(p=>p.id==='notes');
 const refreshed=root.FE_PERSONAL_BOOK_PAGES?.buildPages?.(save,{
  publicFile:raw=>root.FE_MURDER_CASES?.publicFile?.(raw)||null
 });
 if(Array.isArray(refreshed)&&refreshed.length){
  pages=refreshed;
  selectedPage=Math.min(Math.max(0,oldNotesIndex),pages.length-1);
  spread=selectedPage-selectedPage%2;
 }
 flash='Saved to this character’s ledger as page '+(selectedPage+1)+' · '+stamp+'.';
 render();
 return true;
}
function render(){
 if(!overlay)return;
 build(pages[spread],$('personalBookLeft'));
 build(pages[spread+1],$('personalBookRight'));
 $('personalBookPrev').disabled=turning||spread<=0;
 $('personalBookNext').disabled=turning||spread+2>=pages.length;
 $('personalBookPosition').textContent='Pages '+(spread+1)+'–'+
  Math.min(spread+2,pages.length)+' of '+pages.length;
 $('personalBookMessage').textContent=flash;
 const select=$('personalBookSection');
 // The index lists *every* page, including the right-hand folio.
 // Rebuild when a saved private entry creates a new permanent page.
 if(select.options.length!==pages.length){
  select.replaceChildren();
  pages.forEach((p,i)=>{
   const option=elt('option','', 'Page '+(i+1)+' · '+(p.section||'Private Papers')+' · '+(p.title||'Record'));
   option.value=String(i);select.append(option);
  });
 }
 select.value=String(Math.min(selectedPage,pages.length-1));
 $('personalBookNext').textContent=spread+2>=pages.length?'End of Ledger':'Next Pages ▶';
}
function jump(index){
 if(turning||!Number.isInteger(index)||index<0||index>=pages.length)return false;
 const wantsFreshWriting=pages[index]?.id==='notes';
 if(!persistNotes())return false;
 // If writing was auto-saved, it has become a permanent page and the blank
 // notebook page moved forward. The Writing shortcut should follow it.
 if(wantsFreshWriting)index=pages.length-1;
 spread=index-index%2;selectedPage=index;flash='';render();
 const target=index%2?$('personalBookRight'):$('personalBookLeft');
 if(target)target.scrollTop=0;
 return true;
}
function turn(direction){
 if(turning||!isOpen()||![-1,1].includes(direction))return false;
 const next=spread+direction*2;
 if(next<0||next>=pages.length)return false;
 if(!persistNotes())return false;
 turning=true;
 const view=$('personalBookSpread');
 const original=$(direction>0?'personalBookRight':'personalBookLeft');
 const leaf=elt('div','personal-book-flip-sheet '+(direction>0?'forward':'backward'));
 const oldPage=original.cloneNode(true);
 oldPage.removeAttribute('id');
 oldPage.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
 leaf.appendChild(oldPage);view.appendChild(leaf);
 spread=next;selectedPage=next;flash='';render();
 let finished=false;
 const finish=()=>{
  if(finished)return;
  finished=true;leaf.remove();turning=false;render();
 };
 leaf.addEventListener('animationend',finish,{once:true});
 setTimeout(finish,470);
 return true;
}
function open(){
 const save=access?.getSave?.();
 if(!save||!root.FE_PERSONAL_BOOK_PAGES?.buildPages)return false;
 const pageData=root.FE_PERSONAL_BOOK_PAGES.buildPages(save,{
  publicFile:raw=>root.FE_MURDER_CASES?.publicFile?.(raw)||null
 });
 if(!Array.isArray(pageData)||!pageData.length)return false;
 create();pages=pageData;spread=0;selectedPage=0;turning=false;flash='';
 const def=root.FE_PERSONAL_BOOK_PAGES.DATA[save.characterRoute];
 $('personalBookHeading').textContent=def?.title||'Private Records';
 const choices=$('personalBookSection');choices.replaceChildren();
 overlay.hidden=false;
 returnFocus=document.activeElement;
 render();$('personalBookClose').focus();
 return true;
}
function close(){
 if(!isOpen()||!persistNotes())return false;
 overlay.hidden=true;turning=false;
 overlay.querySelector('.personal-book-flip-sheet')?.remove();
 if(returnFocus?.isConnected)returnFocus.focus();
 returnFocus=null;return true;
}
function bind(handlers){
 if(!handlers||typeof handlers.getSave!=='function'||typeof handlers.save!=='function')
  return false;
 access=handlers;return true;
}
const api=Object.freeze({bind,open,close,get active(){return isOpen()}});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PERSONAL_BOOK=api;
})(typeof window!=='undefined'?window:globalThis);
