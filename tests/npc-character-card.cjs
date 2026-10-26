'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../npc-character-card.js'),'utf8');
const elements=[];
let activeElement=null;
class Node {
 constructor(tag,owner){this.tagName=tag;this.owner=owner;this.children=[];this.listeners={};this.parentNode=null;this.textContent='';this.attributes={};this.className='';this.id='';this.value='';this.disabled=false;this.scrollHeight=0;}
 appendChild(v){this.children.push(v);v.parentNode=this;return v}
 append(...nodes){nodes.forEach(v=>this.appendChild(v))}
 remove(){if(this.parentNode){const c=this.parentNode.children;const i=c.indexOf(this);if(i>=0)c.splice(i,1);this.parentNode=null}}
 setAttribute(k,v){this.attributes[k]=v}
 addEventListener(k,fn){(this.listeners[k]||(this.listeners[k]=[])).push(fn)}
 querySelector(selector){const match=selector.slice(1);const find=node=>node.children.find(v=>v.className?.split(' ').includes(match))||node.children.map(find).find(Boolean);return find(this)||null}
 focus(){activeElement=this}
 get isConnected(){let n=this;while(n){if(n===body)return true;n=n.parentNode}return false}
}
const body=new Node('body');const document={
 body,createElement(tag){const n=new Node(tag);elements.push(n);return n},
 createElementNS(ns,tag){return this.createElement(tag)},
 createTextNode(text){const n=new Node('#text');n.textContent=text;return n},
 get activeElement(){return activeElement},
 getElementById(id){return elements.find(e=>e.id===id&&e.isConnected)||null},
 addEventListener(k,fn,capture){this[k+'Handler']=fn;this[k+'Captures']=capture}
};
const ctx={document,window:{}};vm.runInNewContext(source,ctx,{filename:'npc-character-card.js'});
const card=ctx.window.FE_NPC_CARD;
assert.ok(card);assert.equal(document.keydownCaptures,true,'Escape must capture before room shortcut');
const visitorButton=new Node('button');body.appendChild(visitorButton);visitorButton.focus();
let present=true,asked='';
assert.equal(card.open({id:'madamStar',name:'Madam Star',occupation:'Club proprietor',sex:'woman',
 history:[],valid:()=>present,onSpeak:async words=>{asked=words;return{ok:true,reply:'I do not know that.'}}}),true);
assert.equal(card.isOpen(),true);
const overlay=document.getElementById('npcCharacterCard');assert.equal(overlay.children[0].attributes['role'],'dialog');
assert.equal(elements.filter(e=>e.tagName==='textarea').length,1);
const labels=elements.filter(e=>e.tagName==='button').map(e=>e.textContent);
assert.equal(labels.includes('Speak'),true);assert.equal(labels.includes('Close'),false);
assert.equal(labels.some(l=>/Ask About|Greet|Topic|Washington/.test(l)),false,'no offered dialogue topics');
assert.equal(elements.find(e=>e.tagName==='svg').attributes['aria-label'],'Generic female silhouette');
const form=elements.find(e=>e.tagName==='form'),input=elements.find(e=>e.tagName==='textarea');
(async()=>{
 input.value='Do you know a television?';
 await form.listeners.submit[0]({preventDefault(){}});
 assert.equal(asked,'Do you know a television?');
 assert.equal(elements.filter(e=>e.className==='npc-card-line').length,2,'speech stays in character card transcript');
 const escape={key:'Escape',preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
 document.keydownHandler(escape);assert.equal(escape.prevented,true);assert.equal(escape.stopped,true);
 assert.equal(card.isOpen(),false);assert.equal(activeElement,visitorButton,'focus returns to room visitor');
 card.open({id:'eddieDoyle',name:'Eddie Doyle',sex:'man',onSpeak:async()=>({ok:false,reason:'No'}),valid:()=>present});
 assert.equal(elements.filter(e=>e.tagName==='svg').at(-1).attributes['aria-label'],'Generic male silhouette');
 present=false;card.sync();assert.equal(card.isOpen(),false,'a departing resident closes the card');
 console.log('PASS resident card, two silhouette types, sole freeform input, transcript, Escape isolation and departure');
})().catch(error=>{console.error(error);process.exitCode=1});
