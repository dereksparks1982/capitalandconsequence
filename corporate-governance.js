/* Capital & Consequence: period-inspired Federal Electric incorporation and control.
 * Saved separately from personal investments; one canonical cap table.
 * 1878 vocabulary: president rather than modern CEO. Fictional charter rules.
 */
(function(root){
'use strict';
const PEOPLE=Object.freeze([
 {id:'charles',name:'Charles Whitcomb',temperament:'founder',loyalty:100},
 {id:'harlow',name:'Edwin Harlow',temperament:'banker',loyalty:68},
 {id:'vale',name:'Harrison Vale',temperament:'financier',loyalty:42},
 {id:'prescott',name:'Nathaniel Prescott',temperament:'industrialist',loyalty:60},
 {id:'mercer',name:'Augustus Mercer',temperament:'speculator',loyalty:30},
 {id:'bell',name:'James Bellamy',temperament:'accountant',loyalty:77}
]);
const positive=n=>Number.isSafeInteger(n)&&n>0;
const dollars=cents=>'$'+(cents/100).toFixed(2);
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s);
const clone=x=>JSON.parse(JSON.stringify(x));
function initial(){return {version:1,status:'private',ticker:'FEC',issuedShares:10000,founderShares:10000,
 publicShares:0,rivalShares:0,marketShares:0,offeringPriceCents:500,offeringDate:null,
 directors:[],president:'charles',charterDate:null,authorizations:{},shareholderProxies:0,
 votes:[],dividends:[],bid:null,acquisitions:[],lastAdvanceDate:null,events:[],receipts:{},nextId:1};}
function ensure(save){
 if(!save||typeof save!=='object')throw Error('A saved profile is required.');
 if(!save.corporateGovernance)save.corporateGovernance=initial();
 const c=save.corporateGovernance;
 if(c.version!==1||!Number.isSafeInteger(c.issuedShares)||!positive(c.issuedShares)||
  !Number.isSafeInteger(c.founderShares)||!Number.isSafeInteger(c.publicShares)||
  !Number.isSafeInteger(c.rivalShares)||!Number.isSafeInteger(c.marketShares)||
  c.founderShares<0||c.publicShares<0||c.rivalShares<0||c.marketShares<0||
  c.issuedShares!==c.founderShares+c.publicShares+c.rivalShares+c.marketShares||
  !Array.isArray(c.directors)||!Array.isArray(c.events)||!Array.isArray(c.votes)||
  !Array.isArray(c.dividends)||!Array.isArray(c.acquisitions)||!c.receipts)
  throw Error('Unrecognized corporate charter. Save preserved; no automatic reset.');
 return c;
}
function percent(shares,total){return total?Math.round(10000*shares/total)/100:0;}
function ownership(save){
 const c=ensure(save),personal=c.founderShares+c.marketShares,others=c.publicShares+c.rivalShares;
 return {founder:personal,founderPercent:percent(personal,c.issuedShares),
  outsider:others,outsiderPercent:percent(others,c.issuedShares),rival:c.rivalShares,
  rivalPercent:percent(c.rivalShares,c.issuedShares),issued:c.issuedShares,
  public:c.publicShares,tradable:c.publicShares};
}
function canManage(save){const c=ensure(save);return save.characterRoute==='industrialist'&&c.president==='charles';}
function syncTreasury(save){if(save.componentWorks&&Number.isFinite(save.companyCash))save.componentWorks.cashCents=Math.round(save.companyCash*100);}
function register(save,kind,message,details={}){
 const c=ensure(save),entry={id:'FE-CORP-'+c.nextId++,date:save.gameDate||'1878-01-02',kind,message,...details};
 c.events.push(entry);return entry;
}
function reject(reason){return {ok:false,reason};}
function commit(save,token,action){
 const c=ensure(save);
 if(typeof token!=='string'||!/^[a-z0-9:._-]{1,90}$/i.test(token))return reject('An action receipt is required.');
 if(Object.prototype.hasOwnProperty.call(c.receipts,token))return {...clone(c.receipts[token]),repeated:true};
 const answer=action(c);
 if(answer.ok)c.receipts[token]=clone(answer);
 return answer;
}
function check(save,site,role=true){
 if(save.paused||save.phase!=='day')return 'Company offices are closed or the game is paused.';
 if(role&&save.characterRoute!=='industrialist')return 'Only Charles Whitcomb may direct Federal Electric.';
 if(site&&save.currentLocation?.locationId!==site)return site==='factory'?'Conduct this business at Federal Electric.':'Visit the stockbroker in person.';
 return null;
}
function electable(c,id){return PEOPLE.find(p=>p.id===id&&!c.directors.some(d=>d.id===id));}
function incorporate(save,token){
 return commit(save,token,c=>{
  const reason=check(save,'factory');if(reason)return reject(reason);
  if(c.status!=='private')return reject('Federal Electric already has a corporate charter.');
  if(Math.round((save.companyCash||0)*100)<7500)return reject('Incorporation and records cost $75 in company funds.');
  save.companyCash=Math.round((save.companyCash-75)*100)/100;syncTreasury(save);
  c.status='chartered';c.charterDate=save.gameDate;c.directors=[
   {id:'charles',name:'Charles Whitcomb',loyalty:100,temperament:'founder'},
   {id:'harlow',name:'Edwin Harlow',loyalty:68,temperament:'banker'},
   {id:'prescott',name:'Nathaniel Prescott',loyalty:60,temperament:'industrialist'}
  ];register(save,'charter','Federal Electric incorporated. A three-director board elected Charles president.');
  return {ok:true,message:'Corporate charter recorded. Charles remains president and owns every voting share.'};
 });
}
function appoint(save,id,slot,token){
 return commit(save,token,c=>{
  const reason=check(save,'factory');if(reason)return reject(reason);
  if(c.status==='private')return reject('Incorporate Federal Electric before electing directors.');
  if(!Number.isInteger(slot)||slot<1||slot>=c.directors.length)return reject('Choose one of the two outside director seats.');
  const candidate=electable(c,id);if(!candidate)return reject('Candidate is unavailable or already serves.');
  if(ownership(save).founderPercent+c.shareholderProxies<=50)return reject('You lack a majority of the voting shares and pledged shareholder proxies.');
  c.directors[slot]={...candidate};c.shareholderProxies=0;
  register(save,'election',candidate.name+' elected director following a shareholder vote.');
  return {ok:true,message:candidate.name+' elected to the board.'};
 });
}
function lobby(save,id,token){
 return commit(save,token,c=>{
  const reason=check(save,'factory',false);if(reason)return reject(reason);
  const director=c.directors.find(d=>d.id===id&&d.id!=='charles');
  if(!director)return reject('This director cannot be courted.');
  if(Math.round((save.personalCash||0)*100)<2500)return reject('A directors meeting costs $25 in personal funds.');
  if(director.lastMeeting===save.gameDate)return reject('You have already met this director today.');
  save.personalCash=Math.round((save.personalCash-25)*100)/100;
  director.lastMeeting=save.gameDate;director.loyalty=Math.min(100,director.loyalty+14);
  register(save,'relationship','Charles held a private business conversation with '+director.name+'.');
  return {ok:true,message:director.name+' is more receptive to your proposals.'};
 });
}
function boardSupport(save,resolution,d){
 if(d.id==='charles')return resolution!=='remove';
 const pressure=(save.reputation||50)<40?-18:(save.reputation||50)>=75?9:0;
 const cashPoor=(save.companyCash||0)<600?-20:0;
 const thresholds={ipo:54,dividend:66,reinstate:60,remove:75};
 const score=d.loyalty+pressure+cashPoor+(resolution==='remove'?-12:0);
 return resolution==='remove'?score<46:score>=(thresholds[resolution]||65);
}
function vote(save,resolution,token){
 return commit(save,token,c=>{
  const reason=check(save,'factory',false);if(reason)return reject(reason);
  if(c.status==='private')return reject('A chartered board is required.');
  if(!['ipo','dividend','reinstate'].includes(resolution))return reject('Unknown board resolution.');
  if(resolution==='ipo'&&c.status!=='chartered')return reject('Federal Electric is already listed.');
  if(resolution==='dividend'&&c.status!=='public')return reject('A public-company dividend requires an exchange listing.');
  if(resolution==='reinstate'&&c.president==='charles')return reject('Charles already holds the presidency.');
  if(resolution==='dividend'&&Math.round((save.companyCash||0)*100)<10000)return reject('The company requires at least $100 for a dividend.');
  if(resolution==='dividend'&&c.dividends.some(d=>d.date.slice(0,7)===save.gameDate.slice(0,7)))return reject('The board has already paid a dividend this month.');
  const votes=c.directors.map(d=>({id:d.id,yes:boardSupport(save,resolution,d)}));
  const ayes=votes.filter(v=>v.yes).length,passed=ayes>c.directors.length/2;
  c.votes.push({date:save.gameDate,resolution,ayes,nays:votes.length-ayes,passed,votes});
  if(passed&&resolution==='ipo')c.authorizations.ipo=save.gameDate;
  if(passed&&resolution==='reinstate')c.president='charles';
  if(passed&&resolution==='dividend'){
   const cents=Math.floor(Math.round((save.companyCash||0)*100)*.12);
   if(cents<1000)return reject('A dividend must distribute at least $10 in company funds.');
   const founderCents=Math.floor(cents*(c.founderShares+c.marketShares)/c.issuedShares);
   save.companyCash=Math.round((save.companyCash-cents/100)*100)/100;syncTreasury(save);
   save.personalCash=Math.round(((save.personalCash||0)+founderCents/100)*100)/100;
   c.dividends.push({date:save.gameDate,totalCents:cents,founderCents});
  }
  register(save,'board-vote','Board '+(passed?'approved ':'rejected ')+resolution+' ('+ayes+' to '+(votes.length-ayes)+').');
  return {ok:true,passed,ayes,nays:votes.length-ayes,message:'Board '+(passed?'approved ':'rejected ')+resolution+' by '+ayes+' to '+(votes.length-ayes)+'.'};
 });
}
function quote(save){
 const c=ensure(save);
 const assets=Math.max(0,Math.round((save.companyCash||0)*100)+Math.round((save.cashCustody?.businessBank||0)*100));
 const goodwill=Math.max(500000,Math.round(assets*(1+Math.max(0,save.reputation||0)/100)));
 const floor=Math.max(100,Math.floor(goodwill/c.issuedShares));
 return {priceCents:Math.max(100,Math.min(2500,floor)),assetsCents:assets};
}
function listing(save,newShares,secondaryShares,priceCents,token){
 return commit(save,token,c=>{
  const reason=check(save,'brokerOffice');if(reason)return reject(reason);
  if(c.status!=='chartered'||!c.authorizations.ipo)return reject('A board-approved public offering is required.');
  if(!Number.isSafeInteger(newShares)||newShares<500||newShares>10000||
     !Number.isSafeInteger(secondaryShares)||secondaryShares<0||secondaryShares>c.founderShares||
     !positive(priceCents)||priceCents<100||priceCents>2500)
   return reject('Choose 500–10,000 new shares, a valid founder sale, and a $1–$25 offering price.');
  if(newShares+secondaryShares>20000)return reject('Underwriter cannot place more than 20,000 shares.');
  if(c.authorizations.ipo>save.gameDate)return reject('The authorization date is invalid.');
  if((save.brokerage?.visits||0)<2)return reject('Make two separate visits to establish an underwriting relationship.');
  if((save.ledger?.length||0)<4||(save.reputation||0)<50||(save.companyCash||0)<750)return reject('Underwriters require four closed company accounts, reputation of at least 50, and $750 in operating funds.');
  const fair=quote(save).priceCents;
  if(priceCents<Math.round(fair*.75)||priceCents>Math.round(fair*1.5))return reject('The underwriter requires a share price close to the published company valuation.');
  const cashCents=Math.floor(newShares*priceCents*.95);
  const personalCents=Math.floor(secondaryShares*priceCents*.95);
  c.issuedShares+=newShares;c.founderShares-=secondaryShares;
  c.publicShares+=newShares+secondaryShares;
  c.status='public';c.offeringDate=save.gameDate;c.offeringPriceCents=priceCents;
  save.companyCash=Math.round(((save.companyCash||0)+cashCents/100)*100)/100;syncTreasury(save);
  save.personalCash=Math.round(((save.personalCash||0)+personalCents/100)*100)/100;
  syncListing(save);
  register(save,'ipo','Federal Electric listed as FEC: '+newShares+' new and '+secondaryShares+' founder shares sold.',{newShares,secondaryShares,priceCents});
  return {ok:true,message:'FEC listed. Company raised '+dollars(cashCents)+'; Charlie received '+dollars(personalCents)+'.',newShares,secondaryShares};
 });
}
function syncListing(save){
 const c=ensure(save);if(c.status!=='public')return;
 if(!save.stocks)save.stocks={};if(!save.portfolio)save.portfolio={};
 const price=c.offeringPriceCents/100,old=save.stocks.FEC;
 save.stocks.FEC=old?{...old,issuedShares:c.issuedShares,sharesOffered:Math.min(c.publicShares,Number.isSafeInteger(old.sharesOffered)?old.sharesOffered:c.publicShares)}:
 {name:'Federal Electric',sector:'Electrical',price,open:price,hiddenPrice:price,
 prev:price,prevClose:price,yieldRate:0,vol:.045,history:[],issuedShares:c.issuedShares,
 sharesOffered:c.publicShares,shareParValue:100,listedOn:c.offeringDate};
 if(!save.portfolio.FEC)save.portfolio.FEC={shares:0,cost:0,realized:0};
}
function marketFill(save,direction,quantity){
 const c=ensure(save);
 if(c.status!=='public'||!positive(quantity))return reject('FEC is not listed, or the quantity is invalid.');
 if(direction>0){
  if(c.publicShares<quantity)return reject('The outside float cannot supply those shares.');
  c.publicShares-=quantity;c.marketShares+=quantity;
 }else{
  if(c.marketShares<quantity)return reject('These shares are not held in the personal stock account.');
  c.marketShares-=quantity;c.publicShares+=quantity;
 }
 return {ok:true};
}
function proxy(save,token){
 return commit(save,token,c=>{
  const reason=check(save,'brokerOffice');if(reason)return reject(reason);
  if(c.status!=='public')return reject('Shareholder proxies require a public listing.');
  if((save.personalCash||0)<100)return reject('Proxy solicitation costs $100.');
  save.personalCash=Math.round((save.personalCash-100)*100)/100;
  c.shareholderProxies=Math.min(30,c.shareholderProxies+10);
  register(save,'proxy','Charles solicited ten points of shareholder proxy support.');
  return {ok:true,message:'Proxy support improved. It may help elect a new board.'};
 });
}
function counterBid(save,token){
 return commit(save,token,c=>{
  const reason=check(save,'brokerOffice');if(reason)return reject(reason);
  if(c.status!=='public'||!c.bid?.active)return reject('No hostile bid is underway.');
  if((save.personalCash||0)<150)return reject('Defensive shareholder outreach costs $150.');
  save.personalCash=Math.round((save.personalCash-150)*100)/100;
  c.bid.defense=(c.bid.defense||0)+1;c.shareholderProxies=Math.min(30,c.shareholderProxies+10);
  register(save,'defense','Charlie organized shareholders against the hostile syndicate.');
  return {ok:true,message:'Defensive solicitation recorded. A takeover is still possible.'};
 });
}
function removePresident(save,cause){
 const c=ensure(save);if(c.status==='private'||c.president!=='charles')return null;
 if(cause==='hostile-majority'){
  c.directors[1]={...PEOPLE.find(p=>p.id==='vale')};
  c.directors[2]={...PEOPLE.find(p=>p.id==='mercer')};
 }
 const votes=c.directors.map(d=>({id:d.id,yes:d.id!=='charles'&&(cause==='hostile-majority'||d.loyalty<40)}));
 const ayes=votes.filter(v=>v.yes).length,passed=ayes>c.directors.length/2;
 c.votes.push({date:save.gameDate,resolution:'remove-president',cause,ayes,nays:votes.length-ayes,passed,votes});
 register(save,'board-vote','Board '+(passed?'adopted':'rejected')+' removal of Charles, '+ayes+' to '+(votes.length-ayes)+'.');
 if(!passed)return null;
 c.president='harlow';
 register(save,'control-change','The board removed Charles from the presidency. His shares remain his personal property.');
 return {kind:'loss-of-control',message:'Federal Electric directors voted Charles out as president.'};
}
function advanceDay(save){
 const c=ensure(save);if(!validDate(save.gameDate)||c.lastAdvanceDate===save.gameDate)return null;
 const previous=c.lastAdvanceDate;c.lastAdvanceDate=save.gameDate;
 const elapsed=previous?Math.max(1,Math.min(90,Math.round((Date.parse(save.gameDate)-Date.parse(previous))/86400000))):1;
 for(const acquisition of c.acquisitions){
  if(acquisition.debtCents<=0||!['controlled','wholly-owned'].includes(acquisition.status))continue;
  const interest=Math.ceil(acquisition.debtCents*.07*elapsed/365);
  if(!Number.isSafeInteger(interest)||acquisition.debtCents+interest>Number.MAX_SAFE_INTEGER)throw Error('Unsafe acquisition interest settlement');
  acquisition.debtCents+=interest;acquisition.interestCents=(acquisition.interestCents||0)+interest;
  if(acquisition.debtCents>acquisition.totalCents*1.8){
   acquisition.status='foreclosed';
   register(save,'foreclosure',acquisition.ticker+' pledged shares were seized by lenders after acquisition debt ran beyond collateral.');
  }
 }
 if(c.status!=='public')return null;
 const share=ownership(save);
 const days=Math.max(0,Math.round((Date.parse(save.gameDate)-Date.parse(c.offeringDate||save.gameDate))/86400000));
 if(!c.bid&&days>=6&&share.founderPercent<65&&(save.reputation||0)<80){
  c.bid={active:true,bidder:'Vale & Mercer Syndicate',opened:save.gameDate,
   hostileShares:0,defense:0,financing:'borrowed bank credit'};
  register(save,'hostile-offer','Vale & Mercer began purchasing Federal Electric shares through intermediaries.');
 }
 if(c.president==='charles'&&c.directors.filter(d=>d.id!=='charles'&&d.loyalty<40).length>=2&&(save.companyCash||0)<750){const removal=removePresident(save,'directors-lost-confidence');if(removal)return removal;}
 if(c.bid?.active&&c.publicShares>0){
  const desired=Math.max(1,Math.floor(c.issuedShares*.025));
  const bought=Math.min(c.publicShares,Math.max(0,desired-Math.floor(desired*Math.min(2,c.bid.defense||0)/2)));
  c.bid.defense=Math.max(0,(c.bid.defense||0)-1);
  c.publicShares-=bought;c.rivalShares+=bought;c.bid.hostileShares+=bought;
  if(save.stocks?.FEC)save.stocks.FEC.sharesOffered=Math.min(save.stocks.FEC.sharesOffered,c.publicShares);
  register(save,'share-accumulation',c.bid.bidder+' acquired '+bought+' outside shares.');
  if(percent(c.rivalShares,c.issuedShares)>50){
   c.bid.active=false;c.bid.outcome='rival-control';
   return removePresident(save,'hostile-majority');
  }
  if(c.publicShares===0&&percent(c.rivalShares,c.issuedShares)<=50){
   c.bid.active=false;c.bid.outcome='blocked';register(save,'takeover-blocked','The syndicate failed to obtain a majority.');
  }
 }
 return null;
}
function tender(save,ticker,leveragePercent,token){
 return commit(save,token,c=>{
  const reason=check(save,'brokerOffice');if(reason)return reject(reason);
  if(c.status==='private')return reject('Incorporate your company before making corporate acquisition bids.');
  const security=save.stocks?.[ticker];if(!security||ticker==='FEC'||!Array.isArray(security.history)||!security.history.length||!Number.isSafeInteger(leveragePercent)||leveragePercent<0||leveragePercent>70)return reject('Choose a listed rival and 0–70 percent leverage.');
  if(c.acquisitions.some(a=>a.ticker===ticker&&a.status==='controlled'))return reject('This company is already controlled.');
  const shares=Math.floor((security.issuedShares||0)*.51)+1;
  const priceCents=Math.ceil((security.price||0)*115);
  if(!positive(shares)||!positive(priceCents))return reject('The exchange has no reliable capitalization for this rival.');
  const total=shares*priceCents,credit=Math.floor(total*leveragePercent/100),equity=total-credit;
  if(!Number.isSafeInteger(total)||!Number.isSafeInteger(equity))return reject('Acquisition exceeds safe accounting limits.');
  if(Math.round((save.personalCash||0)*100)<equity)return reject('The controlling tender needs '+dollars(equity)+' equity in personal funds.');
  save.personalCash=Math.round((save.personalCash-equity/100)*100)/100;
  c.acquisitions.push({ticker,date:save.gameDate,shares,totalCents:total,debtCents:credit,status:'controlled',ownershipPercent:percent(shares,security.issuedShares),loanSecuredBy:'acquired company'});
  register(save,'takeover','Charles acquired '+ticker+' through a '+leveragePercent+'% leveraged tender.',{ticker,shares,equity,credit});
  return {ok:true,message:'Controlling interest acquired in '+ticker+'. Loan '+dollars(credit)+' is owed against the acquired business.'};
 });
}
function increaseStake(save,ticker,targetPercent,leveragePercent,token){
 return commit(save,token,c=>{
  const reason=check(save,'brokerOffice');if(reason)return reject(reason);
  const a=c.acquisitions.find(x=>x.ticker===ticker&&x.status==='controlled');
  if(!a||![75,90].includes(targetPercent)||!Number.isSafeInteger(leveragePercent)||leveragePercent<0||leveragePercent>70)
   return reject('Select a controlled rival, a 75% or 90% stake, and 0–70% leverage.');
  const security=save.stocks?.[ticker],target=Math.ceil(security.issuedShares*targetPercent/100);
  if(target<=a.shares)return reject('You already hold the requested shareholding.');
  const additional=target-a.shares,total=additional*Math.ceil(security.price*120);
  const debt=Math.floor(total*leveragePercent/100),equity=total-debt;
  if(!Number.isSafeInteger(total)||Math.round((save.personalCash||0)*100)<equity)
   return reject('This extra tender requires '+dollars(equity)+' of personal equity.');
  save.personalCash=Math.round((save.personalCash-equity/100)*100)/100;
  a.shares=target;a.debtCents+=debt;a.totalCents+=total;
  a.ownershipPercent=percent(target,security.issuedShares);
  register(save,'stake-increase','Charles purchased an additional '+additional+' shares of '+ticker+' with '+leveragePercent+'% borrowed financing.');
  return {ok:true,message:'Controlling stake expanded to '+a.ownershipPercent+'%; acquired-company debt now '+dollars(a.debtCents)+'.'};
 });
}
function repayDebt(save,ticker,amountCents,token){
 return commit(save,token,c=>{
  const reason=check(save,'brokerOffice');if(reason)return reject(reason);
  const a=c.acquisitions.find(x=>x.ticker===ticker&&['controlled','wholly-owned'].includes(x.status));
  if(!a||!positive(a.debtCents)||!positive(amountCents))return reject('No acquisition debt can be repaid.');
  const paid=Math.min(a.debtCents,amountCents);
  if(Math.round((save.personalCash||0)*100)<paid)return reject('Insufficient personal funds for this debt payment.');
  save.personalCash=Math.round((save.personalCash-paid/100)*100)/100;
  a.debtCents-=paid;register(save,'debt-payment','Charles repaid '+dollars(paid)+' of '+ticker+' acquisition debt.');
  return {ok:true,message:'Loan reduced by '+dollars(paid)+'. Remaining debt '+dollars(a.debtCents)+'.'};
 });
}
function squeezeOut(save,ticker,token){
 return commit(save,token,c=>{
  const reason=check(save,'brokerOffice');if(reason)return reject(reason);
  const a=c.acquisitions.find(x=>x.ticker===ticker&&x.status==='controlled');
  if(!a||a.ownershipPercent<90)return reject('Compulsory minority buyouts require at least 90% ownership and an approved charter mechanism.');
  const s=save.stocks[ticker],remaining=s.issuedShares-a.shares;
  const payout=Math.ceil(remaining*s.price*125);
  if(Math.round((save.personalCash||0)*100)<payout)return reject('Insufficient cash to compensate all remaining shareholders.');
  save.personalCash=Math.round((save.personalCash-payout/100)*100)/100;
  a.shares=s.issuedShares;a.ownershipPercent=100;a.status='wholly-owned';
  register(save,'squeeze-out','Remaining '+ticker+' shareholders were paid '+dollars(payout)+' under the fictional merger charter.');
  return {ok:true,message:ticker+' is now wholly owned after compensating minority shareholders.'};
 });
}
const api=Object.freeze({PEOPLE,initial,ensure,ownership,canManage,incorporate,appoint,lobby,vote,quote,
 listing,syncListing,marketFill,proxy,counterBid,advanceDay,tender,increaseStake,repayDebt,squeezeOut});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CORPORATE=api;
})(typeof window!=='undefined'?window:globalThis);
