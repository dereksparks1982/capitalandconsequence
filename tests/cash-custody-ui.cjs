'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const cash=require('../cash-custody.js');
const elements={};
function element(id){
 return elements[id]||(elements[id]={
  id,value:'',options:[],textContent:'',hidden:true,disabled:false,children:[],
  replaceChildren(){this.children=[];this.options=[];this.value=''},
  appendChild(node){this.children.push(node);if(node.tagName==='option'){this.options.push(node);if(this.options.length===1)this.value=node.value}}
 });
}
const doc={getElementById:id=>element(id),createElement:tag=>({tagName:tag,children:[],append(...x){this.children.push(...x)},appendChild(x){this.children.push(x)}})};
let spent=0,canSpend=true,changed=0;
const root={FE_CASH_CUSTODY:cash,
 FE_WASHINGTON_TIME:{canSpend:(s,n)=>canSpend&&s.phase==='day'&&n===120},
 advanceWorldTime:n=>{spent+=n;return n}};
const code=fs.readFileSync(path.join(__dirname,'../cash-custody-ui.js'),'utf8');
vm.runInNewContext(code,{window:root,document:doc});
const ui=root.FE_CASH_UI;
const save={gameDate:'1878-01-02',characterRoute:'industrialist',phase:'day',personalCash:100,companyCash:1000,
 currentLocation:{locationId:'districtBank',roomId:'banking-hall'}};
ui.render(save,'districtBank','industrialist',()=>changed++);
assert.equal(element('cityRoomCashOffice').hidden,false);
const action=element('cityRoomCashAction'),amount=element('cityRoomCashAmount'),confirm=element('cityRoomCashConfirm');
assert.equal(action.options.some(opt=>opt.value==='depositChecking'),true);
action.value='depositChecking';amount.value='1000';
confirm.onclick();
assert.equal(spent,0,'Insufficient funds rejected without consuming time');
assert.equal(save.personalCash,100);
assert.equal(changed,0);
amount.value='1.001';confirm.onclick();
assert.equal(spent,0,'Fractional cents rejected before clock');
assert.equal(changed,0);
amount.value='20';canSpend=false;confirm.onclick();
assert.equal(spent,0,'Unavailable game-time blocks transfer');
assert.equal(save.personalCash,100);
canSpend=true;confirm.onclick();
assert.equal(spent,120,'A valid teller transaction consumes exactly two game minutes');
assert.equal(changed,1);
assert.equal(save.personalCash,80);
assert.equal(cash.balances(save).personalChecking,20);
save.currentLocation={locationId:'factory',roomId:'workers-lodging'};
ui.render(save,'factory','industrialist',()=>changed++);
assert.equal(element('cityRoomCashOffice').hidden,true,'Sullivan cannot see cashier panel');
assert.equal(confirm.onclick,null,'Old handler removed');
save.currentLocation={locationId:'factory',roomId:'executive-office'};
ui.render(save,'factory','industrialist',()=>changed++);
action.value='collectCompany';amount.value='100';confirm.onclick();
assert.equal(spent,240);
assert.equal(save.companyCash,900);
assert.equal(cash.balances(save).companyCarried,100,'Business money carried is not personal');
assert.equal(save.personalCash,80);
ui.header(save);
assert.match(element('cityRoomCompanyCash').textContent,/100\.00/);
assert.match(element('cityRoomPersonalCash').textContent,/80\.00/);
save.currentLocation={locationId:'districtBank',roomId:'banking-hall'};
ui.render(save,'districtBank','industrialist',()=>changed++);
action.value='depositBusiness';amount.value='60';confirm.onclick();
assert.equal(spent,360);
assert.equal(cash.balances(save).businessBank,60);
assert.equal(cash.balances(save).companyCarried,40);
assert.equal(save.personalCash,80,'Depositing company funds cannot credit personal cash');
assert.equal(changed,3);
ui.render(save,'districtBank','investigator',()=>changed++);
assert.equal(action.options.some(opt=>opt.value==='depositBusiness'),false,'Only owner sees company bank operations');
assert.equal(element('cityRoomCashOffice').hidden,false,'Investigator can still use personal accounts');
console.log('PASS teller and factory UI validate first, charge two real player minutes, retain separate physical cash ownership');
