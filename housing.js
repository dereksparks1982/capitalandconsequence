/* Federal Electric v0.6.9: Washington housing catalog and household ledger.
   These are progression tiers, NOT purchasable properties yet. No prices,
   addresses, household wages or ownership status are fabricated. */
(function(){
 'use strict';
 const PROPERTIES=Object.freeze([
  Object.freeze({
   id:'capitol-hill-rowhouse',
   name:'Capitol Hill Rowhouse',
   category:'middle-class residence',
   mapLocationId:'home',
   proposedArea:'Eastern Market / 7th and C Streets SE',
   starting:true,
   purchasePrice:null,
   upkeep:null,
   amenities:Object.freeze(['private bedrooms','front room','household kitchen','storage'])
  }),
  Object.freeze({
   id:'expanded-townhouse',
   name:'Larger Washington Townhouse',
   category:'comfortable urban residence',
   mapLocationId:null,
   proposedArea:null,
   starting:false,
   purchasePrice:null,
   upkeep:null,
   amenities:Object.freeze(['more rooms','improved domestic facilities','space for visiting guests'])
  }),
  Object.freeze({
   id:'grand-city-house',
   name:'Grand City Residence',
   category:'wealthy urban residence',
   mapLocationId:null,
   proposedArea:null,
   starting:false,
   purchasePrice:null,
   upkeep:null,
   amenities:Object.freeze(['formal reception rooms','service entrance','staff quarters','carriage accommodations'])
  }),
  Object.freeze({
   id:'country-estate',
   name:'Country Estate',
   category:'wealthy suburban or rural property',
   mapLocationId:null,
   proposedArea:null,
   starting:false,
   purchasePrice:null,
   upkeep:null,
   amenities:Object.freeze(['larger grounds','guest accommodations','household service spaces'])
  })
 ]);
 const HOUSEHOLD_SERVICES=Object.freeze([
  'doorman or porter','butler','housekeeper','cook','maid','gardener','carriage driver'
 ]);
 function listTiers(){
  return PROPERTIES.map(p=>({...p,amenities:[...p.amenities]}));
 }
 function getTier(id){
  const tier=PROPERTIES.find(p=>p.id===id);
  return tier?{...tier,amenities:[...tier.amenities]}:null;
 }
 function currentHousehold(){
  const h=S.housing||{};
  return {primaryResidenceId:'capitol-hill-rowhouse',
   tenure:['rented','owned','provided'].includes(h.tenure)?h.tenure:'undetermined',
   properties:Array.isArray(h.properties)?[...h.properties]:[],
   staff:Array.isArray(h.staff)?[...h.staff]:[],
   improvements:Array.isArray(h.improvements)?[...h.improvements]:[]};
 }
 function renderHouseholdRecord(locationId,roomId){
  const block=document.getElementById('cityRoomHouseholdRecord');
  if(!block)return;
  const show=locationId==='home'&&roomId==='front-room';
  block.hidden=!show;
  if(!show)return;
  const h=currentHousehold();
  document.getElementById('cityRoomHousingName').textContent=getTier(h.primaryResidenceId).name;
  document.getElementById('cityRoomHousingTenure').textContent={
   rented:'Rented',owned:'Owned',provided:'Provided',undetermined:'Not established'
  }[h.tenure];
  document.getElementById('cityRoomHousingFeatures').textContent=
   h.staff.length||h.improvements.length
    ?h.staff.length+' household staff; '+h.improvements.length+' recorded improvements'
    :'No household staff or improvements recorded';
 }
 window.FE_HOUSING=Object.freeze({
  listTiers,getTier,currentHousehold,renderHouseholdRecord,
  serviceTypes:HOUSEHOLD_SERVICES
 });
})();
