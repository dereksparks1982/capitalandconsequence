/* v0.6.13: Blackwood institutional-venture seed. Planning only.
   Absorbs design themes from the proposed 1890s Blackwood Asylum game.
   Moroz Asylum / Cherny Bor remains a distinct Soviet-era concept. */
(function(){
'use strict';
const BLACKWOOD=Object.freeze({
 id:'blackwoodAsylum',
 name:'Blackwood Asylum',
 era:'1890s alternate Washington',
 locationId:'blackwoodAsylum',
 status:'proposed',
 site:null,
 governance:'undetermined',
 ownership:'unassigned',
 acquisitionCost:null,
 shareValuation:null,
 operatingBudget:null,
 managementAppointmentTerms:null,
 managementSystems:Object.freeze(['admissions and records','staff rostering','operating budget','ward conditions','inspection and investigations','patient histories','reported outcomes'])
});
const FUTURE_ROLES=Object.freeze([
 Object.freeze({id:'minority-investor',name:'Minority investor',ready:false}),
 Object.freeze({id:'director-or-superintendent',name:'Appointed director or superintendent',ready:false}),
 Object.freeze({id:'controlling-owner',name:'Controlling owner (where lawful in-world)',ready:false})
]);
function describe(){
 const interests=S.institutionInterests||{investments:[],appointments:[]};
 const investment=(interests.investments||[]).find(v=>v.institutionId===BLACKWOOD.id);
 const appointment=(interests.appointments||[]).find(v=>v.institutionId===BLACKWOOD.id);
 return {name:BLACKWOOD.name,ownership:BLACKWOOD.ownership,governance:BLACKWOOD.governance,
  stakePercent:investment?.stakePercent||0,role:appointment?.role||null,purchasable:false,operational:false};
}
function renderConcept(){
 const out=document.getElementById('asylumVentureStatus');if(!out)return;
 const d=describe();
 out.textContent=d.stakePercent>0||d.role
  ?'Recorded interest: '+d.stakePercent+'% stake; appointment: '+(d.role||'none')+'. Operational systems remain pending.'
  :'No asylum investment or appointment. The property and its terms are not yet established.';
}
window.FE_INSTITUTIONS=Object.freeze({
 get:()=>({...BLACKWOOD,managementSystems:[...BLACKWOOD.managementSystems]}),
 roles:()=>FUTURE_ROLES.map(v=>({...v})),
 describe,renderConcept
});
renderConcept();
})();
