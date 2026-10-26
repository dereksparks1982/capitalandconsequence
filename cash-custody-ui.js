/* Physical cash and optional bank interface, always local to the room. */
(function(root){
 'use strict';
 const book=root.FE_CASH_CUSTODY;
 const fmt=n=>'$'+(Number(n)||0).toFixed(2);
 const ACTIONS=Object.freeze({
  factory:[
   ['collectCompany','Collect Company Cash','Company office → carried company funds'],
   ['returnCompany','Return Company Cash','Carried company funds → company office'],
   ['ownerDistribution','Recorded Owner Distribution','Company office → personal carried funds'],
   ['irregularDraw','Divert Company Cash','Company office → personal carried funds; unexplained in the books'],
   ['ownerDistributionCarried','Record Distribution of Carried Company Cash','Carried company funds → personal cash'],
   ['irregularDrawCarried','Divert Carried Company Cash','Carried company funds → personal cash; creates an accounting shortfall']
  ],
  districtBank:[
   ['depositBusiness','Deposit Carried Company Cash','Carried company cash → company bank account'],
   ['withdrawBusiness','Withdraw Company Bank Funds','Company bank account → carried company cash'],
   ['depositChecking','Deposit Personal Checking','Personal cash → personal checking'],
   ['withdrawChecking','Withdraw Personal Checking','Personal checking → personal cash'],
   ['depositSavings','Deposit General Savings','Personal cash → personal savings'],
   ['withdrawSavings','Withdraw General Savings','Savings → personal cash'],
   ['checkingToSavings','Checking to Savings','Internal bank transfer between your own accounts'],
   ['savingsToChecking','Savings to Checking','Internal bank transfer between your own accounts']
  ]
 });
 function render(save,location,route,changed){
  const panel=document.getElementById('cityRoomCashOffice');if(!panel)return;
  const options=location==='factory'&&route!=='industrialist'?[]:ACTIONS[location]||[];
  panel.hidden=!options.length;
  if(!options.length)return;
  const b=book.balances(save),summary=document.getElementById('cityRoomCashBalances');
  if(summary){
   summary.replaceChildren();
   for(const [name,value] of [
    ...(route==='industrialist'?[['Company cash at works',b.companyAtWorks],['Company cash carried',b.companyCarried],
    ['Company bank',b.businessBank]]:[]),['Personal cash carried',b.personalCarried],
    ['Personal checking',b.personalChecking],['General savings',b.personalSavings]]){
    const row=document.createElement('div');row.className='cash-office-balance';
    const label=document.createElement('span');label.textContent=name;
    const balance=document.createElement('strong');balance.textContent=fmt(value);
    row.append(label,balance);summary.appendChild(row);
   }
  }
  const select=document.getElementById('cityRoomCashAction');
  const prior=select?.value||'';
  if(select){select.replaceChildren();for(const [key,label] of options){
    if(route!=='industrialist'&&(key.includes('Company')||key.startsWith('owner')||key.startsWith('irregular')||
      key==='depositBusiness'||key==='withdrawBusiness'))continue;
    const opt=document.createElement('option');opt.value=key;opt.textContent=label;select.appendChild(opt);
   }
   if([...select.options].some(opt=>opt.value===prior))select.value=prior;
  }
  const help=document.getElementById('cityRoomCashActionInfo');
  const describe=()=>{const action=options.find(item=>item[0]===select?.value);if(help)help.textContent=action?.[2]||''};
  if(select)select.onchange=describe;
  describe();
  const button=document.getElementById('cityRoomCashConfirm'),status=document.getElementById('cityRoomCashStatus');
  if(button){button.disabled=!!save.paused||save.phase==='report'||(location==='districtBank'&&save.phase!=='day');button.onclick=()=>{
    const value=Number(document.getElementById('cityRoomCashAmount')?.value);
    const result=book.transfer(save,select.value,value,location,route);
    if(status)status.textContent=result.ok?'Transaction recorded at '+(location==='factory'?'Federal Electric':'the bank')+': '+fmt(value)+'.':result.reason;
    if(result.ok)changed?.(result.entry);
  }}
 }
 function header(save){
  const b=book.balances(save),cash=document.getElementById('cityRoomPersonalCash'),
   company=document.getElementById('cityRoomCompanyCash'),vault=document.getElementById('cityRoomBankCash');
  if(cash)cash.textContent=fmt(b.personalCarried);
  if(company)company.textContent=fmt(b.companyCarried);
  if(vault)vault.textContent=fmt(b.businessBank+b.personalChecking+b.personalSavings);
 }
 const api=Object.freeze({render,header});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_CASH_UI=api;
})(typeof window!=='undefined'?window:globalThis);
