/* Capital & Consequence: four independent MAIN campaigns in one Washington.
 * This is a read-only story register. It NEVER generates evidence, advances
 * time, completes missions, pays wages or discloses the murder's hidden truth.
 * Recorded milestones reflect real source ledgers; later acts are design
 * targets until their playable scenes have been implemented.
 */
(function(root){'use strict';
const CAMPAIGNS=Object.freeze({
 industrialist:Object.freeze({
  title:'The Current That Built Washington',
  protagonist:'Charles “Charlie” Whitcomb',
  premise:'A widowed proprietor gambles his legacy on a changing capital, where his company can electrify Washington or be taken from him.',
  themes:['industry','public trust','ownership','influence'],
  acts:Object.freeze([
   {id:'first-light',title:'I · First Light',goal:'Fulfil and ship a legitimate Federal Electric production order.',marker:'shipment',playable:true},
   {id:'charter',title:'II · A Name in the Register',goal:'Secure a valid company charter and confront the obligations of ownership.',marker:'charter',playable:true},
   {id:'exchange',title:'III · Selling the Future',goal:'Gain the proper board authority and list Federal Electric on the exchange.',marker:'ipo',playable:true},
   {id:'control',title:'IV · The Battle for the Board',goal:'Defend or surrender control amid financial rivals and competing loyalties.',marker:null,playable:false},
   {id:'legacy',title:'V · The Cost of Progress',goal:'Decide what Washington, its workers and the Whitcomb name will inherit.',marker:null,playable:false}
  ])}),
 investigator:Object.freeze({
  title:'The Hillsdale Papers',
  protagonist:'Samuel “Sam” Harlan',
  premise:'A married rookie patrolman in Hillsdale must earn trust, investigate corruption, and decide whose version of justice deserves his badge.',
  themes:['family','evidence','race and class','duty'],
  acts:Object.freeze([
   {id:'beat',title:'I · The Hillsdale Beat',goal:'File two real patrol reports from Sam’s assigned neighborhood.',marker:'patrol',playable:true},
   {id:'assignment',title:'II · A Call Beyond the Beat',goal:'Earn the station sergeant’s written permission to assist with the asylum inquiry.',marker:'sergeant',playable:true},
   {id:'case',title:'III · Two Conflicting Accounts',goal:'File a preliminary investigation based on lawful witness and coroner findings.',marker:'caseMemo',playable:true},
   {id:'institution',title:'IV · The Papers That Changed',goal:'Certify the disputed asylum register after personally checking the sources.',marker:'certificate',playable:true},
   {id:'reckoning',title:'V · Justice in the Capital',goal:'Confront the wider political forces behind the cases without a guaranteed promotion or conviction.',marker:null,playable:false}
  ])}),
 criminal:Object.freeze({
  title:'Behind the Golden Peacock',
  protagonist:'Elias “Eli” Crowe',
  premise:'An obscure doorman enters a dangerous network of favors, debts and secrets. He may protect his own, exploit them, or lose everything.',
  themes:['loyalty','deception','money','personal freedom'],
  acts:Object.freeze([
   {id:'threshold',title:'I · At the Peacock Door',goal:'Complete two paid visitor encounters at Lui’s club.',marker:'door',playable:true},
   {id:'favour',title:'II · A Favor with a Price',goal:'Meet the patron, decide who receives the sealed envelope and face the outcome.',marker:'peacockFavor',playable:true},
   {id:'leverage',title:'III · The Keeper of Secrets',goal:'Meet a suspicious regular, choose how to use the information and face the response.',marker:'peacockNetwork',playable:true},
   {id:'betrayal',title:'IV · Debts Come Due',goal:'Respond to a contested claim of debt and learn what the regular does next.',marker:'peacockDebts',playable:true},
   {id:'exit',title:'V · The Last Door',goal:'Choose a lawful future, a criminal empire, or a dangerous escape.',marker:null,playable:false}
  ])}),
 wardman:Object.freeze({
  title:'The Wardman Inheritance',
  protagonist:'Edmund Wardman',
  premise:'An estranged orderly in his brother’s asylum follows a suspicious death into a battle over family power, his liberty and his own mind.',
  themes:['family','confinement','institutional abuse','identity'],
  acts:Object.freeze([
   {id:'orderly',title:'I · The Family Black Sheep',goal:'Perform and file an ordinary ward assignment as Edmund.',marker:'ward',playable:true},
   {id:'death',title:'II · A Death in the Ward',goal:'Record a sourced orderly incident memorandum after examining the ward.',marker:'wardMemo',playable:true},
   {id:'petition',title:'III · The Family Petition',goal:'Discover and contest any formally documented family commitment petition.',marker:'petition',playable:true},
   {id:'confinement',title:'IV · The Patient in His Own Asylum',goal:'Undergo a recorded commitment hearing, confinement or clinical review.',marker:'confinement',playable:true},
   {id:'inheritance',title:'V · Blood and Evidence',goal:'Expose or challenge the family’s secrets without assuming the director committed the murder.',marker:null,playable:false}
  ])})
});
function hasObservation(s,id){
 return !!s?.incidentObservations?.records?.some(e=>e?.eventId==='asylum:'+id&&e?.incidentId==='asylum-ward-death-1878');
}
function mark(save){
 const charter=save?.corporateGovernance;
 const c=save?.componentWorks;
 return Object.freeze({
  shipment:!!Object.values(c?.receipts||{}).find(x=>x?.kind==='shipment'),
  charter:!!charter?.charterDate,
  ipo:charter?.status==='public'||!!charter?.offeringDate,
  patrol:(save?.patrolDuty?.reportsFiled||0)>=2,
  sergeant:save?.casePermissions?.['asylum-ward-death-1878']?.issuedBy==='station-sergeant'&&hasObservation(save,'stationMemo'),
  caseMemo:hasObservation(save,'policeMemo'),
  certificate:hasObservation(save,'policeWardmanCertify'),
  door:(save?.doormanDuty?.totalSegments||0)>=2,
  peacockFavor:save?.peacockStory?.stage==='resolved'&&!!save?.peacockStory?.finishedAt,
  peacockNetwork:save?.peacockNetwork?.stage==='resolved'&&!!save?.peacockNetwork?.completedAt,
  peacockDebts:save?.peacockDebts?.stage==='resolved'&&!!save?.peacockDebts?.completedAt,
  ward:(save?.orderlyDuty?.totalAssignments||0)>=1,
  wardMemo:hasObservation(save,'wardMemo'),
  petition:!!save?.wardmanStanding?.petition,
  confinement:!!save?.familyRecords?.hearing||!!save?.familyRecords?.appeal||
   save?.wardmanStanding?.status==='patient'||!!save?.wardmanStanding?.custodyRisk?.review
 });
}
function inspect(save){
 const def=CAMPAIGNS[save?.characterRoute];if(!def)return null;
 const earned=mark(save);
 let previous=true,achieved=0;
 const acts=def.acts.map(act=>{
  const recorded=!!act.playable&&!!earned[act.marker];
  const status=!act.playable?'planned':
   recorded?'milestone-recorded':previous?'available':'awaiting-previous';
  if(recorded)achieved++;
  if(!recorded)previous=false;
  return {id:act.id,title:act.title,goal:act.goal,status,
   milestoneRecorded:recorded,implemented:!!act.playable};
 });
 const standing=save?.wardmanStanding;
 const ending=save?.characterRoute==='wardman'&&standing?.careerEnded==='experimental-lobotomy'?
  'Edmund’s playable career has ended following a fictional experimental lobotomy. His history remains in this private book.':
  null;
 return {id:save.characterRoute,title:def.title,protagonist:def.protagonist,
  premise:def.premise,acts,recordedMilestones:achieved,ending};
}
function pages(save){
 const view=inspect(save);if(!view)return [];
 const items=view.acts.map(x=>({heading:x.title,
  text:(x.status==='milestone-recorded'?'Verified milestone recorded. ':
   x.status==='planned'?'Main-story chapter designed; interactive missions are not implemented yet. ':
   x.status==='awaiting-previous'?'Later milestone; preceding chapter is unfinished. ':
   'Current objective. ')+x.goal}));
 return [{id:'main-story',section:'Main Story',title:view.title,
  kicker:view.protagonist+' · Personal campaign',
  paragraphs:[view.premise,'This is the character’s main campaign, separate from optional jobs and side missions. Only verified activities advance the register. Future chapters are not represented as playable before their scenes exist.'].concat(view.ending?[view.ending]:[]),items}];
}
const api=Object.freeze({CAMPAIGNS,inspect,pages});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_MAIN_STORIES=api;
})(typeof window!=='undefined'?window:globalThis);
