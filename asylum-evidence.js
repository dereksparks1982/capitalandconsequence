/* Capital & Consequence: deterministic incident scene, alibis and physical observations.
 * Only the shared world's hidden truth contains the responsible role.
 * Public fragments are authored from the same immutable event chronology.
 */
(function(root){
 'use strict';
 const CASE='asylum-ward-death-1878';
 const ROLES=Object.freeze([
  Object.freeze({role:'attendant',id:'ward-attendant-01',label:'A ward attendant',
   alibi:'I was sorting the ward laundry at nine.',normal:'linen-room',garment:'dark wool coat'}),
  Object.freeze({role:'patient',id:'ward-patient-01',label:'A ward resident',
   alibi:'I was sitting near the common-room window at nine.',normal:'common-room',garment:'dark wool coat'}),
  Object.freeze({role:'director',id:'ward-director-01',label:'Edmund Wardman’s elder brother, the asylum director',
   alibi:'I was handling correspondence in the office at nine.',normal:'director-office',garment:'brown overcoat'}),
  Object.freeze({role:'outside-visitor',id:'ward-visitor-01',label:'A visitor on the reception register',
   alibi:'I was waiting near the front desk at nine.',normal:'reception',garment:'brown overcoat'})
 ]);
 const EXHIBITS=Object.freeze({
  wardRoster:{location:'blackwoodAsylum',room:'orderly-station',roles:['wardman'],
   source:'ward staffing book',time:'1878-01-05T08:45',
   description:'The ward roster accounts for the attendants assigned before nine. A name on the duty roster is not proof of whereabouts.'},
  visitorRegister:{location:'blackwoodAsylum',room:'reception',roles:['investigator','wardman'],
   source:'public visitor sign-in register',time:'1878-01-05T08:53',
   description:'The reception book records one visitor entering before the death and leaving later. It does not say which wards were entered.'},
  bellStatement:{location:'blackwoodAsylum',room:'reception',roles:['investigator','wardman'],
   source:'porter statement',time:'1878-01-05T09:02',
   description:'A corridor bell sounded just after nine. The porter heard the bell but did not see who rang it.'},
  passageMark:{location:'blackwoodAsylum',room:'patient-ward',roles:['wardman'],
   source:'observed passage threshold',time:'1878-01-05T09:08',
   description:'A fresh muddy impression crosses the service passage threshold. The mark alone cannot be assigned to an individual.'},
  clothingAccount:{location:'blackwoodAsylum',room:'reception',roles:['investigator'],
   source:'corridor witness recollection',time:'1878-01-05T09:05',
   description:'A witness recalls a figure wearing a heavy outer coat near the service entrance. The witness could not identify the face.'},
  drainSurvey:{location:'blackwoodAsylum',room:'patient-ward',roles:['wardman'],
   source:'physical survey of service culvert',time:'1878-01-05T09:16',
   description:'The old maintenance culvert meets a low service threshold beneath the asylum. An outsider might reach the ward without using the front reception; the passage alone identifies no intruder.'},
  drainReport:{location:'metropolitanPolice',room:'station-duty-room',roles:['investigator'],
   source:'certified maintenance passage report',time:'1878-01-05T13:45',
   description:'An inspection establishes that the old drainage passage connects to an exterior outfall. The building plan does not establish who, if anyone, used it that morning.'},
  motiveLedger:{location:'blackwoodAsylum',room:'orderly-station',roles:['wardman'],
   source:'institutional grievance docket',time:'1878-01-05T09:20',
   description:'The ledger records earlier ward disputes, questions about administration and an outside family grievance. Each remains a possible motive, not proof of guilt.'},
  motiveDocket:{location:'metropolitanPolice',room:'station-duty-room',roles:['investigator'],
   source:'certified grievance and correspondence abstract',time:'1878-01-05T13:50',
   description:'Four unfinished leads remain: a staffing grievance, a patient quarrel, disputed director accounts, and a visitor who believes the deceased harmed a relative. They are allegations, not adjudicated facts.'}
 });
 const clone=o=>JSON.parse(JSON.stringify(o));
 function ensure(world,id=CASE){
  const incident=world?.incidents?.[id],truth=world?.worldTruth?.[id];
  if(!incident||!truth||incident.id!==truth.incidentId)return null;
  if(world.incidentScene?.[id]?.version===1)return world.incidentScene[id];
  const responsible=ROLES.find(p=>p.role===truth.culpritRole);
  if(!responsible)throw Error('Case truth has no matching scene role');
  const day=incident.at.slice(0,10);
  const movement=ROLES.map((p,index)=>({
   personId:p.id,role:p.role,publicName:p.label,statedAlibi:p.alibi,
   // No one has an obvious lie marker. Witnesses and physical traces must
   // support or challenge individual accounts, not expose a hidden boolean.
   moments:[
    {time:day+'T08:40',at:index%2?'south-corridor':'public-yard'},
    {time:day+'T08:55',at:p.role===responsible.role?
     (p.role==='outside-visitor'?'service-culvert':'service-passage'):p.normal},
    {time:day+'T09:00',at:p.role===responsible.role?'private-ward':p.normal},
    {time:day+'T09:12',at:index%2?'reception':'south-corridor'}
   ]
  }));
  const scene={version:1,incidentId:id,at:incident.at,
   persons:movement,exhibits:clone(EXHIBITS),caseState:'investigation-open',
   integrity:{culpritRole:responsible.role,sceneFixed:true}};
  if(!world.incidentScene)world.incidentScene={};
  world.incidentScene[id]=scene;
  return scene;
 }
 function available(world,id=CASE){
  const scene=world?.incidentScene?.[id];
  if(!scene||scene.version!==1)return [];
  return Object.entries(scene.exhibits).map(([key,e])=>({id:key,source:e.source,location:e.location,room:e.room,roles:[...e.roles],time:e.time}));
 }
 function describe(world,key,id=CASE){
  const scene=world?.incidentScene?.[id],e=scene?.exhibits?.[key];
  if(!e)return null;
  let description=e.description;
  if(key==='drainSurvey'||key==='drainReport'){
   const visitor=scene.persons.find(p=>p.role==='outside-visitor');
   const at=visitor?.moments?.find(m=>m.time===scene.at.slice(0,10)+'T08:55')?.at;
   description+=at==='service-culvert'?
    ' Freshly dislodged mortar and a damp scuff are documented at the outfall. The investigator must still establish who made them.':
    ' The stonework is old and no fresh passage at the outfall has been independently confirmed.';
  }
  if(key==='clothingAccount'){
   const culprit=ROLES.find(x=>x.role===scene.integrity.culpritRole);
   // Exactly two persons share either coat description. A coat is never
   // dispositive identification and is not automatically credited as proof.
   description+=' The coat appeared '+culprit.garment+'. Several residents and visitors own similar clothing.';
  }
  return {id:key,source:e.source,at:e.time,description};
 }
 function statementFolio(world,id=CASE){
  const statements=roster(world,id);
  if(!statements.length)return null;
  return {id:'statement-folio',source:'police-certified witness statement register',
   at:world.incidents[id].at,
   description:'Four separate statements were filed. '+statements.map(p=>p.name+
    ' stated: “'+p.alibi+'”').join(' ')+' Each is an uncorroborated account, not verified whereabouts.'};
 }
 function roster(world,id=CASE){
  const scene=world?.incidentScene?.[id];
  if(!scene)return [];
  return scene.persons.map(p=>({id:p.personId,name:p.publicName,alibi:p.statedAlibi}));
 }
 // A player-facing function MUST NOT export the culprit or positions.
 const api=Object.freeze({CASE,EXHIBITS,ensure,available,describe,roster,statementFolio});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_ASYLUM_EVIDENCE=api;
})(typeof window!=='undefined'?window:globalThis);
