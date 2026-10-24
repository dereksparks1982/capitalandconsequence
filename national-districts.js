/* Capital & Consequence: alternate-history national district charter.
 * Public setting data only, not a physical national travel map.
 * The Civil War really lasted 1861–1865. The subsequent abolition of
 * state borders is fictional, with no invented exact reform date.
 */
(function(root){
 'use strict';
 const CHARTER=Object.freeze({
  country:'United States of America',
  historicalCivilWar:Object.freeze({began:1861,ended:1865}),
  reorganization:'after the Civil War',
  reorganizationDate:null,
  stateBordersRetained:false,
  organization:'Federal districts organized around collective national purposes',
  government:'Federal republic, alternate constitutional arrangements not yet specified',
  campaignDesignStart:'1878-01-02',
  currentPrototypeStart:'1890-01-02',
  presidentialTermYears:10,
  presidentialMaxTerms:null,
  presidentialNextElectionYear:1886,
  presidentialElectionMethod:'nationwide popular vote'
 });
 // Only Columbia's capital role is fixed canon. Other NAMES and all noncapital
 // geographic borders are placeholders until the owner selects them.
 const DISTRICTS=Object.freeze([
  Object.freeze({id:'columbia',name:'District of Columbia',role:'capital and national government',
   description:'Washington is the seat of the federal government and the opening city.',
   status:'established',seat:'Washington',regions:[]}),
  Object.freeze({id:'husbandry',name:'Agriculture & Husbandry District',
   role:'grain, food crops, livestock and animal husbandry',
   description:'The national breadbasket. Farms, ranches, grain elevators and livestock markets support the country.',
   status:'working-name',seat:null,regions:[]}),
  Object.freeze({id:'foundry',name:'Foundry District',role:'heavy manufacturing, steel and machine works',
   description:'Furnaces, steelworks, foundries and manufacturers supply industry with finished materials and machinery.',
   status:'working-name',seat:null,regions:[]}),
  Object.freeze({id:'mineral',name:'Mineral District',role:'mining and raw mineral extraction',
   description:'Mines, pits and ore freight feed metal, coal and mineral supply chains.',
   status:'working-name',seat:null,regions:[]}),
  Object.freeze({id:'timber',name:'Timber District',role:'forestry, timber and lumber',
   description:'Forests, sawmills and carpenters supply lumber, paper stock and other wood products.',
   status:'working-name',seat:null,regions:[]}),
  Object.freeze({id:'maritime',name:'Maritime District',role:'ports, shipbuilding and waterborne commerce',
   description:'Ports, shipyards and shipping houses connect national districts to distant markets.',
   status:'working-name',seat:null,regions:[]}),
  Object.freeze({id:'transport',name:'Transport District',role:'railways, roads and national freight exchange',
   description:'Tracks, depots and transport workshops move people and goods between districts.',
   status:'working-name',seat:null,regions:[]}),
  Object.freeze({id:'commerce',name:'Commerce District',role:'trade, markets, finance and distribution',
   description:'Merchants, brokers and warehouses coordinate goods and private capital.',
   status:'working-name',seat:null,regions:[]})
 ]);
 const clone=d=>({...d,regions:[...d.regions]});
 function list(){return DISTRICTS.map(clone)}
 function get(id){const item=DISTRICTS.find(d=>d.id===id);return item?clone(item):null}
 function publicDescription(){
  return 'After the Civil War of 1861–1865, the United States discarded its old state borders. '+
   'In this alternate history, it became a federation of purpose-based districts. '+
   'Washington remains the seat of government, while districts devoted to agriculture, '+
   'manufacturing, transportation, natural resources and commerce serve the nation. '+
   'Specific district names and borders beyond the capital remain under development.';
 }
 function registerText(){
  return DISTRICTS.map(d=>(d.status==='established'?'':'WORKING NAME · ')+d.name+
   '\nPurpose: '+d.role+'\n'+d.description).join('\n\n');
 }
 const api=Object.freeze({CHARTER,list,get,publicDescription,registerText});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_NATIONAL_DISTRICTS=api;
})(typeof window!=='undefined'?window:globalThis);
