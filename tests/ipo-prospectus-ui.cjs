'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../corporate-governance.js');
const ui=fs.readFileSync(path.join(__dirname,'..','corporate-governance-ui.js'),'utf8');
function element(tag){
 return {tagName:tag.toUpperCase(),children:[],handlers:{},textContent:'',value:'',
  disabled:false,hidden:false,append(...nodes){this.children.push(...nodes)},
  appendChild(child){this.children.push(child);if(child.id)nodes[child.id]=child},
  replaceChildren(){this.children=[]},addEventListener(type,fn){this.handlers[type]=fn},
  setAttribute(){}};
}
const nodes={cityRoomBrokerage:element('section')};
const document={getElementById:id=>nodes[id]||null,createElement:element,
 createTextNode:text=>({textContent:String(text)})};
const save={gameDate:'1878-02-05',phase:'day',paused:false,
 characterRoute:'industrialist',currentLocation:{locationId:'factory'},
 companyCash:2500,personalCash:600,reputation:55,
 ledger:[{},{},{},{}],brokerage:{visits:2},portfolio:{},stocks:{}};
assert.equal(C.incorporate(save,'charter').ok,true);
assert.equal(C.vote(save,'ipo','board').passed,true);
save.currentLocation.locationId='brokerOffice';
let finished=null,minutes=0;
const window={FE_CORPORATE:C,
 FE_CORPORATE_CONTEXT:()=>({save,finish:result=>{finished=result}}),
 FE_WASHINGTON_TIME:{canSpend:()=>true},
 advanceWorldTime:seconds=>{minutes+=seconds;return seconds}};
vm.runInNewContext(ui,{window,document});
function find(what){
 const out=[];
 const visit=v=>{if(v?.tagName)out.push(v);for(const child of v?.children||[])visit(child)};
 visit(nodes.cityRoomBrokerage);
 return out.filter(what);
}
window.FE_CORPORATE_UI.broker();
const action=find(v=>v.tagName==='BUTTON'&&v.textContent==='Arrange Federal Electric IPO')[0];
const inputs=find(v=>v.tagName==='INPUT');
const preview=()=>find(v=>v.tagName==='P'&&v.textContent.includes('Founder voting stake'))[0]?.textContent;
assert.ok(action&&!action.disabled,'Approved underwriter offer must be available at broker');
assert.equal(inputs.length,3,'New issues, secondary founder sales and price remain editable');
assert.match(preview(),/Company receives \$2850\.00/);
assert.match(preview(),/Charles personally receives \$475\.00/);
assert.match(preview(),/Founder voting stake 73\.08%/);
const before=JSON.stringify(save);
inputs[2].value='20';inputs[2].handlers.input();
assert.equal(action.disabled,true,'Offer above valuation range must not be submitted');
assert.match(preview(),/NOT READY:/);
assert.equal(JSON.stringify(save),before,'Pricing preview does not debit cash or create shares');
inputs[2].value='1';inputs[2].handlers.input();
inputs[1].value='9500';inputs[1].handlers.input();
assert.equal(action.disabled,false);
assert.match(preview(),/lose majority voting control/);
inputs[1].value='500';inputs[1].handlers.input();
assert.match(preview(),/Founder voting stake 73\.08%/);
action.handlers.click();
assert.equal(finished?.ok,true,'Confirming the IPO must really issue FEC shares');
assert.equal(minutes,900,'Real underwriter business consumes 15 in-game minutes');
assert.equal(save.corporateGovernance.status,'public');
assert.equal(save.stocks.FEC.issuedShares,13000);
assert.equal(save.stocks.FEC.sharesOffered,3500);
assert.equal(save.companyCash,5275);
assert.equal(save.personalCash,1075);
assert.equal(C.ownership(save).founderPercent,73.08);
console.log('PASS live IPO underwriter preview, blocked invalid price, control-risk warnings, real listing and business-time charge');
