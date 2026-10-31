/* Shared public Wardman trust docket: Sam reads, certifies, and Edmund
 * personally obtains the copy. Private family letters NEVER teleport to police.
 */
(function(root){'use strict';
const CASE='asylum-ward-death-1878';
const ID='wardman-trust-police:'+CASE;
const ACTIONS=Object.freeze({
 policeEstateAbstract:{seconds:600,role:'investigator'},
 policeEstateCompare:{seconds:600,role:'investigator'},
 familyEstatePoliceCopy:{seconds:600,role:'wardman'},
 familyPatientEstatePoliceCopy:{seconds:600,role:'wardman'}
});
const deny=reason=>({ok:false,reason});
const observed=(save,id)=>!!save?.incidentObservations?.records?.some(e=>e?.incidentId===CASE&&e?.eventId==='asylum:'+id);
const registry=w=>w?.institutionalRecords?.[CASE]||null;
const stamp=s=>root.FE_WASHINGTON_TIME?.now?.(s)?.iso||null;
function preview(save,world,id){
 const action=ACTIONS[id];if(!action)return deny('Unknown civil-records action.');
 if(save?.characterRoute!==action.role)return deny('This document is not assigned to this profession.');
 if(save.paused||save.phase!=='day')return deny('Public records desk is not operating.');
 if(!root.FE_SHARED_WORLD?.valid?.(world,world?.id))return deny('Shared Washington records are unavailable.');
 const file=registry(world);
 if(!file?.trustDocket?.filedAt)return deny('The public trust abstract has not been filed.');
 if(observed(save,id))return deny('This document has already been received or examined.');
 if(action.role==='investigator'){
  if(save.patrolDuty?.onDuty)return deny('Sam must finish his assigned Hillsdale shift first.');
  if(save.casePermissions?.[CASE]?.issuedBy!=='station-sergeant'||
     !observed(save,'policeWardmanCompare'))return deny('A sergeant referral and physical comparison of the asylum registers are required.');
  if(id==='policeEstateCompare'){
   if(!save.wardmanTrustInquiry?.abstractAt||!observed(save,'policeEstateAbstract'))
    return deny('Read the public trust abstract first.');
   if(!observed(save,'policeWardmanCertify'))
    return deny('File Sam’s independent asylum-register comparison first.');
   if(file.trustCertificate)return deny('A public police certification already exists.');
  }
 }else{
  if(file.trustCertificate?.id!==ID||file.trustCertificate.version!==1)
   return deny('Sam has not publicly filed a certified trust-record comparison.');
  if(save.wardmanTrustPolice?.certificateId)return deny('Edmund already holds the police certificate.');
  if(save.wardmanStanding?.careerEnded)return deny('Edmund’s playable career has ended.');
  if(id==='familyEstatePoliceCopy'&&save.wardmanStanding?.status==='patient')
   return deny('Request delivery in the patient ward while confined.');
  if(id==='familyPatientEstatePoliceCopy'&&save.wardmanStanding?.status!=='patient')
   return deny('This delivery is for a confined Edmund only.');
 }
 return {ok:true,seconds:action.seconds};
}
function apply(save,world,id,seconds){
 const permission=preview(save,world,id);if(!permission.ok)return permission;
 if(seconds!==permission.seconds)return deny('The full document examination time was not charged.');
 const at=stamp(save),file=registry(world);
 if(!at)return deny('A dated Washington clock is required.');
 let description='';
 if(id==='policeEstateAbstract'){
  save.wardmanTrustInquiry={version:1,abstractAt:at,
   docketDate:file.trustDocket.filedAt,source:file.trustDocket.source};
  description='Sam examined the publicly filed Wardman settlement abstract at the station. It describes contingent trustee control of family income if a relative is ruled incapable, not proof of coercion, a crime, or a murderer.';
 }else if(id==='policeEstateCompare'){
  save.wardmanTrustInquiry.comparedAt=at;
  save.wardmanTrustInquiry.signedBy='Metropolitan Police station sergeant';
  description='Sam formally compared the public family trust abstract with the separately certified asylum duty-register discrepancy. He recorded a potential financial conflict of interest; this is not a murder finding.';
 }else{
  save.wardmanTrustPolice={version:1,certificateId:ID,obtainedAt:at,
   deliveryAction:id,issuedAt:file.trustCertificate.issuedAt};
  description='Edmund personally received a copy of Sam’s independently certified public trust comparison. This supports a challenge to the family petition, but does not identify the killer.';
 }
 return {ok:true,source:id.startsWith('police')?'Metropolitan Police public trust abstract':'certified Metropolitan Police trust extract',
  description};
}
function publish(world,save,profileId){
 if(!root.FE_SHARED_WORLD?.valid?.(world,world?.id)||save?.characterRoute!=='investigator'||
    typeof profileId!=='string'||!profileId)return false;
 const file=registry(world),record=save.wardmanTrustInquiry;
 if(!file?.trustDocket||file.trustCertificate||record?.version!==1||!record?.comparedAt||
  record.signedBy!=='Metropolitan Police station sergeant'||!record.abstractAt)return false;
 if(save.casePermissions?.[CASE]?.issuedBy!=='station-sergeant'||![
  'policeEstateAbstract','policeEstateCompare','policeWardmanCompare','policeWardmanCertify'
 ].every(id=>observed(save,id)))return false;
 const comparison=save.incidentObservations.records.find(x=>x.incidentId===CASE&&x.eventId==='asylum:policeEstateCompare');
 if(comparison?.at!==record.comparedAt||record.comparedAt<record.abstractAt)return false;
 file.trustCertificate={version:1,id:ID,issuedAt:record.comparedAt,by:profileId,
  source:'Metro Police sworn public trust-register comparison',
  finding:'A civil settlement could benefit a trustee if a Wardman relative were adjudged incapable. Financial interest does not establish homicide guilt.'};
 root.FE_SHARED_WORLD.recordEvent(world,{id:ID,type:'public-trust-comparison',
  at:record.comparedAt,locationId:'metropolitanPolice',
  summary:'A Metropolitan Police certified comparison of a public Wardman settlement and a disputed asylum register was filed.'});
 return true;
}
function proof(save){
 const r=save?.wardmanTrustPolice;
 return !!r&&r.certificateId===ID&&!!r.obtainedAt&&
  ['familyEstatePoliceCopy','familyPatientEstatePoliceCopy'].includes(r.deliveryAction)&&
  observed(save,r.deliveryAction);
}
function summary(save){
 const s=save?.characterRoute;
 if(s==='investigator')return {examined:!!save.wardmanTrustInquiry?.abstractAt,
  certified:observed(save,'policeEstateCompare')};
 if(s==='wardman')return {received:proof(save),issuedAt:save.wardmanTrustPolice?.issuedAt||null};
 return null;
}
const api=Object.freeze({CASE,ID,ACTIONS,preview,apply,publish,proof,summary});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_WARDMAN_ESTATE_POLICE=api;
})(typeof window!=='undefined'?window:globalThis);
