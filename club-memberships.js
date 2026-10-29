/* The private poker clubs grant membership after a social trial.
 * Approval is earned, never inferred from possession of an invitation.
 * No timers: lockouts and invitations resolve against the in-game date. */
(function(root){'use strict';
const CONFIG=Object.freeze({
 middle:Object.freeze({venue:'Commerce Club',item:'Commerce Club Membership Card',itemId:'commerce-club-membership-card',hospitality:5}),
 elite:Object.freeze({venue:'Embassy Room',item:'Embassy Club Membership Card',itemId:'embassy-club-membership-card',hospitality:25})
});
function date(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))throw Error('An in-game date is required');const d=new Date(s+'T12:00:00Z');if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==s)throw Error('Invalid game date');return d}
function addDays(s,n){const d=date(s);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function ensure(save){
 if(!save||typeof save!=='object')throw Error('An active profile save is required');
 if(!save.clubMemberships||typeof save.clubMemberships!=='object')save.clubMemberships={version:1,middle:{},elite:{}};
 for(const tier of ['middle','elite'])if(!save.clubMemberships[tier]||typeof save.clubMemberships[tier]!=='object')save.clubMemberships[tier]={};
 return save.clubMemberships;
}
function hasCard(save,tier){
 const cfg=CONFIG[tier];if(!cfg)return false;
 return (save.personalEffects?.items||[]).some(item=>item.id===cfg.itemId&&item.kind==='membership');
}
function access(save,tier,today,introduced){
 if(tier==='working')return {allowed:true,status:'open',message:'Anyone can enter the Boiler Room.'};
 if(!CONFIG[tier])return {allowed:false,status:'unknown',message:'Unknown private poker club.'};
 date(today);const data=ensure(save)[tier];
 if(hasCard(save,tier))return {allowed:true,status:'member',message:CONFIG[tier].item+' recognized. Welcome back.'};
 if(data.cooldownUntil&&today<data.cooldownUntil)return {allowed:false,status:'cooldown',message:'Invitation suspended until '+data.cooldownUntil+'.'};
 if(!introduced)return {allowed:false,status:'invitation-required',message:'A personal introduction is required.'};
 return {allowed:true,status:'trial',message:'You have an invitation for a trial game. Membership is not guaranteed.'};
}
function trial(save,{tier,today,introduced,delta,stake,hands,conduct='courteous',sessionId=null}){
 if(!CONFIG[tier])return {status:'unrestricted',message:'No membership trial at this table.',hospitality:0};
 if(!['courteous','generous','quiet','rude'].includes(conduct))throw Error('Unknown social conduct');
 const status=access(save,tier,today,introduced);
 if(!status.allowed||status.status==='member')return {status:status.status,message:status.message,hospitality:0};
 if(!Number.isFinite(delta)||!Number.isFinite(stake)||stake<=0||!Number.isInteger(hands)||hands<0)throw Error('Valid session results required');
 if(hands===0)return {status:'trial-pending',message:'No hand was completed, so the trial remains open.',hospitality:0};
 const state=ensure(save)[tier],cfg=CONFIG[tier];
 if(sessionId!==null){
  if(typeof sessionId!=='string'||!sessionId||sessionId.length>120)throw Error('Invalid poker session identifier');
  if(state.lastSessionId===sessionId)return {...state.lastSessionResult,repeated:true};
 }
 state.trials=(state.trials||0)+1;state.lastTrial=today;
 const excessiveWin=delta>stake*.35;
 const accepted=conduct==='generous'||(conduct==='courteous'&&!excessiveWin)||(conduct==='quiet'&&delta<=stake*.15);
 const hospitality=conduct==='generous'?cfg.hospitality:0;
 if(accepted){
  if(!save.personalEffects||typeof save.personalEffects!=='object')save.personalEffects={version:1,items:[]};
  if(!Array.isArray(save.personalEffects.items))save.personalEffects.items=[];
  if(!hasCard(save,tier))save.personalEffects.items.push({id:cfg.itemId,name:cfg.item,kind:'membership',container:'left-pocket',source:cfg.venue,date:today});
  state.memberSince=today;state.cooldownUntil=null;state.lastConduct=conduct;
  const result={status:'member',item:cfg.item,cardId:cfg.itemId,hospitality,message:'The members present '+cfg.item+' as a gift. You are recognized here.',trials:state.trials};
  if(sessionId!==null){state.lastSessionId=sessionId;state.lastSessionResult={...result}}
  return result;
 }
 const days=conduct==='rude'?7:3;
 state.cooldownUntil=addDays(today,days);state.lastConduct=conduct;
 const result={status:'cooldown',until:state.cooldownUntil,hospitality:0,message:'The patrons decline membership for now. You may request another trial after '+state.cooldownUntil+'.',trials:state.trials};
 if(sessionId!==null){state.lastSessionId=sessionId;state.lastSessionResult={...result}}
 return result;
}
const api=Object.freeze({version:1,config:CONFIG,ensure,hasCard,access,trial});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CLUB_MEMBERSHIPS=api;
})(typeof window!=='undefined'?window:globalThis);
