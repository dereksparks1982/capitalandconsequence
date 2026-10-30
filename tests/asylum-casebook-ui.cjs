'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','asylum-story-ui.js'),'utf8');
const index=new Map();
function el(tag='div'){
 const n={tagName:tag.toUpperCase(),children:[],textContent:'',hidden:false,disabled:false,
  value:'',listeners:{},append(...children){for(const c of children){this.children.push(c);
   if(this.tagName==='SELECT'&&c.tagName==='OPTION'&&this.children.length===1)this.value=c.value}},
  appendChild(c){this.append(c);return c},replaceChildren(...children){this.children=[];this.value='';this.append(...children)},
  setAttribute(k,v){this[k]=v},addEventListener(k,fn){this.listeners[k]=fn}};
 Object.defineProperty(n,'id',{get(){return this._id},set(v){this._id=v;index.set(v,this)}});
 return n;
}
const placeholder=el(),overlay=el();overlay.id='cityRoomOverlay';
const doc={getElementById:id=>index.get(id)||null,
 querySelector:sel=>sel==='#cityRoomOverlay .city-room-placeholder'?placeholder:null,
 createElement:el};
const S={sharedWorldId:'wcase',characterRoute:'investigator',phase:'day',paused:false};
const world={incidents:{}},place={locationId:'metropolitanPolice',roomId:'station-duty-room'};
let spent=0,filings=0,confirmations=0,writes=0,renders=0;
const win={FE_ASYLUM_STORY:{ACTIONS:{},visible:()=>({at:'1878-01-05T09:00'})},
 FE_ASYLUM_CASEWORK:{
  dossier:()=>({ready:true,leads:[
   {available:true,label:'Access records',description:'Two people can enter'},
   {available:true,label:'Passage traces',description:'Two people may fit'},
   {available:true,label:'Time accounts',description:'Two people are possible'}],
   suspects:[{id:'ward-director-01',name:'Director',statement:'I was in the office.'},
    {id:'ward-visitor-01',name:'Visitor',statement:'I waited at reception.'}]}),
  canFile:(_s,_w,_p,suspect)=>({ok:suspect==='ward-director-01',seconds:600,
   warning:'This is a referral, not a warrant.'}),
  file:(_s,_w,_p,suspect,o)=>{assert.equal(suspect,'ward-director-01');
   assert.equal(o.spentSeconds,600);filings++;return{ok:true,kind:'referral'}}},
 FE_SHARED_WORLD:{read:()=>world},
 FE_CITY:{currentLocation:()=>place,isDevRoom:()=>false},
 FE_WASHINGTON_TIME:{canSpend:()=>true},
 advanceWorldTime:n=>{spent+=n;return n},
 confirm:()=>{confirmations++;return true}};
const ctx={window:win,document:doc,S,localStorage:{},activeProfileId:()=> 'sam-profile',
 save:()=>{writes++;return true},render:()=>{renders++},console};
vm.runInNewContext(source,ctx);
assert.equal(placeholder.children.length,1,'Reuse same room, not a new layout');
assert.equal(index.get('asylumCasebook').hidden,false);
assert.equal(index.get('asylumCasebookFile').disabled,false);
assert.match(index.get('asylumCasebookLeads').children[1].textContent,/Two people can enter/);
assert.equal(win.FE_ASYLUM_CASE_UI.fileSuspect(),true);
assert.equal(spent,600);assert.equal(filings,1);assert.equal(confirmations,1);
assert.equal(writes,1);assert.equal(renders,1);
S.characterRoute='industrialist';
win.FE_ASYLUM_CASE_UI.refresh();
assert.equal(index.get('asylumInquiryPanel').hidden,true,'Other career gets no asylum inquiry');
console.log('PASS shared asylum casebook visible in original room and named referral charges, confirms and saves once');
