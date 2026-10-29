'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const script=fs.readFileSync(path.join(__dirname,'../asylum-story-ui.js'),'utf8');
const index=new Map(),listeners=new Map();
function element(tag='section'){
 const n={tagName:tag.toUpperCase(),children:[],hidden:false,disabled:false,textContent:'',
  append(...nodes){for(const node of nodes)this.children.push(node)},
  appendChild(node){this.children.push(node);return node},
  replaceChildren(...nodes){this.children=[...nodes]},
  setAttribute(k,v){this[k]=v},addEventListener(k,fn){listeners.set(this,k+':'+fn.name);this.listeners=this.listeners||{};this.listeners[k]=fn}};
 Object.defineProperty(n,'id',{get(){return this._id},set(value){this._id=value;index.set(value,this)}});
 return n;
}
const placeholder=element();
const overlay=element();overlay.id='cityRoomOverlay';
const document={getElementById:id=>index.get(id)||null,
 querySelector:sel=>sel==='#cityRoomOverlay .city-room-placeholder'?placeholder:null,
 createElement:element};
const player={sharedWorldId:'wtest',characterRoute:'wardman',phase:'day'};
let spends=0,applies=0,writes=0,renders=0,discovered=false,blocked=false;
const story={ACTIONS:{notice:{label:'Read notice · 1 minute',seconds:60,location:'blackwoodAsylum',room:'reception',routes:['wardman']}},
 visible:()=>({at:'1878-01-05T09:00'}),
 seen:()=>discovered,
 preview:()=>blocked?{ok:false,reason:'Staff have left'}:{ok:true,seconds:60},
 apply:()=>{applies++;discovered=true;return {ok:true}}};
const window={FE_ASYLUM_STORY:story,FE_SHARED_WORLD:{read:()=>({incidents:{}})},
 FE_CITY:{currentLocation:()=>({locationId:'blackwoodAsylum',roomId:'reception'}),isDevRoom:()=>false},
 FE_WASHINGTON_TIME:{canSpend:()=>true},
 advanceWorldTime:n=>{spends+=n;return n}};
const ctx={window,document,S:player,localStorage:{},activeProfileId:()=> 'profile-test',
 save:()=>{writes++;return true},render:()=>{renders++},console};
vm.runInNewContext(script,ctx);
const actions=index.get('asylumInquiryActions');
assert.equal(placeholder.children.length,1,'Reuses existing city room without moving its geometry');
assert.equal(actions.children.length,1);
assert.equal(actions.children[0].disabled,false);
actions.children[0].listeners.click();
assert.equal(spends,60,'Charges in-game time exactly once');
assert.equal(applies,1,'Only one source observation recorded');
assert.equal(writes,1,'Autosave follows confirmed case action');
assert.equal(renders,1,'Gameplay refresh follows successful save');
assert.equal(actions.children.length,1,'Repeated action is no longer offered');
const inactive=player.characterRoute='industrialist';window.FE_ASYLUM_CASE_UI.refresh();
assert.equal(index.get('asylumInquiryPanel').hidden,true,'Other careers cannot use Edmund’s inquiry');
player.characterRoute='wardman';discovered=false;blocked=true;window.FE_ASYLUM_CASE_UI.refresh();
assert.equal(actions.children[0].disabled,true,'Unavailable inquiry is visibly blocked');
assert.equal(spends,60,'Blocked action never advances game time');
console.log('PASS real in-room inquiry UI widget, one charged action, save, privacy and rejected work');
