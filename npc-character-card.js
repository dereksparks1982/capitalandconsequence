/* Capital & Consequence: individual NPC conversation card, not room dialogue.
 * A room shows only who is there. Free-text talk stays inside this card.
 */
(function(root){
 'use strict';
 let active=null,sequence=0,previousFocus=null;
 const byId=id=>document.getElementById(id);
 function element(tag,cls,text){
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(text!==undefined)node.textContent=text;
  return node;
 }
 function portrait(kind){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 160 200');svg.setAttribute('role','img');
  svg.setAttribute('aria-label',kind==='woman'?'Generic female silhouette':'Generic male silhouette');
  const paths=kind==='woman'?
   ['M45 87Q28 13 81 13Q133 13 116 87L134 160H26Z','M80 46a34 34 0 1 0 0 68a34 34 0 1 0 0 -68','M79 124C39 124 17 160 12 193H148C143 160 121 124 79 124Z']:
   ['M80 30a39 39 0 1 0 0 78a39 39 0 1 0 0 -78','M80 121C40 121 15 150 9 193H151C145 150 120 121 80 121Z'];
  for(const d of paths){const node=document.createElementNS('http://www.w3.org/2000/svg','path');node.setAttribute('d',d);svg.appendChild(node)}
  return svg;
 }
 function close(){
  const card=byId('npcCharacterCard');++sequence;
  if(card)card.remove();
  active=null;
  if(previousFocus?.isConnected)previousFocus.focus();
  previousFocus=null;
 }
 function appendLine(log,who,words){
  const p=element('p','npc-card-line');
  p.appendChild(element('strong','',who+': '));
  p.appendChild(document.createTextNode(words));
  log.appendChild(p);log.scrollTop=log.scrollHeight;
 }
 function open(options){
  if(!options||typeof options.onSpeak!=='function'||!options.id||!options.name)throw Error('NPC conversation card requires a resident and dialogue handler');
  close();previousFocus=document.activeElement;active=options;
  const ticket=++sequence,overlay=element('div','npc-card-overlay');
  overlay.id='npcCharacterCard';
  const dialog=element('section','npc-card');
  dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','npcCardName');
  const header=element('header','npc-card-header');
  const picture=element('div','npc-card-portrait');picture.appendChild(portrait(options.sex==='woman'?'woman':'man'));
  header.appendChild(picture);
  const identity=element('div','npc-card-identity');
  const h=element('h2','',options.name);h.id='npcCardName';identity.appendChild(h);
  identity.appendChild(element('p','',options.occupation||'Washington resident'));
  header.appendChild(identity);
  const exit=element('button','npc-card-close','×');exit.type='button';exit.setAttribute('aria-label','Close character card');exit.onclick=close;
  header.appendChild(exit);dialog.appendChild(header);
  const log=element('div','npc-card-transcript');log.setAttribute('role','log');
  log.setAttribute('aria-label','Conversation with '+options.name);log.setAttribute('aria-live','polite');
  const history=Array.isArray(options.history)?options.history.slice(-8):[];
  for(const record of history){
   if(record?.user)appendLine(log,'You',record.user);
   if(record?.reply)appendLine(log,options.name,record.reply);
  }
  if(!history.length)log.appendChild(element('p','npc-card-hint','You may speak to this person. What you say is up to you.'));
  dialog.appendChild(log);
  const form=element('form','npc-card-form');
  const label=element('label','', 'Your words');label.setAttribute('for','npcCardWords');
  const input=element('textarea');input.id='npcCardWords';input.maxLength=600;input.rows=3;input.required=true;
  input.setAttribute('aria-label','Speak to '+options.name);
  const send=element('button','npc-card-send','Speak');send.type='submit';
  form.append(label,input,send);
  form.addEventListener('submit',async event=>{
   event.preventDefault();const words=input.value.trim();
   if(!words||send.disabled)return;
   if(options.valid&&!options.valid()){appendLine(log,options.name,'The conversation has ended.');close();return}
   const hint=log.querySelector('.npc-card-hint');if(hint)hint.remove();
   appendLine(log,'You',words);input.value='';send.disabled=true;
   const pending=element('p','npc-card-pending',options.name+' is considering your words…');log.appendChild(pending);
   try{
    const outcome=await options.onSpeak(words);
    if(ticket!==sequence)return;
    pending.remove();
    appendLine(log,options.name,outcome?.ok?String(outcome.reply||''):String(outcome?.reason||'I cannot answer.'));
   }catch(e){
    if(ticket!==sequence)return;
    pending.remove();appendLine(log,options.name,'The conversation could not continue.');
   }finally{if(ticket===sequence){send.disabled=false;input.focus()}}
  });
  dialog.appendChild(form);overlay.appendChild(dialog);document.body.appendChild(overlay);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  input.focus();
  return true;
 }
 function sync(){
  if(active?.valid&&!active.valid())close();
 }
 // Registered early, capture phase: Escape closes only the character card,
 // rather than also closing the underlying full-screen Washington room.
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&active){e.preventDefault();e.stopImmediatePropagation();close()}
 },true);
 root.FE_NPC_CARD=Object.freeze({open,close,sync,isOpen:()=>!!active});
})(window);
