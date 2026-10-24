/* D.C. Sports Register: a read-only record, not an outcome generator.
 * Uses real saved title ledgers and in-era competitor names.
 * Does not modify the game clock, economy, NPCs or tournament schedules. */
(function(root){'use strict';
const ORDER=['horse','boxing','dog','car','poker'];
function lookup(save,sport,id){
 if(id===null||id===undefined)return 'Unknown competitor';
 const key=String(id),path={horse:'racing',boxing:'boxing',dog:'dogRacing',car:'midgetCarRacing'}[sport];
 const racer=save?.[path]?.roster?.find(r=>String(r.id)===key);
 if(!racer)return key;
 return sport==='car'?racer.name+' · '+racer.driver:racer.name;
}
function summary(save,date,engine){
 if(typeof date!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date))return [];
 const state=save?.sportsChampionships||{},year=+date.slice(0,4),config=engine?.sports||{};
 return ORDER.filter(k=>config[k]&&year>=config[k].earliest).map(sport=>{
  const titles=state.titleHistory?.filter(x=>x?.sport===sport)||[];
  const champ=state.champions?.[sport]||null;
  const events=Object.values(state.tournaments||{}).filter(x=>x?.sport===sport&&x.month<=date.slice(0,7));
  const current=events.find(x=>x.status!=='complete')||null;
  const games=current?Object.entries(current.rounds||{}).filter(([,v])=>v.result).length:0;
  const scheduled=current?Object.keys(current.rounds||{}).length:0;
  return {sport,label:config[sport].label,
   champion:champ?lookup(save,sport,champ.name):null,
   lastWon:champ?.month||null,titleCount:titles.length,
   underway:current?{month:current.month,completedRounds:games,totalRounds:scheduled}:null};
 });
}
function render(save){
 const node=typeof document==='undefined'?null:document.getElementById('dcChampionshipBoard');
 if(!node)return;
 const rows=summary(save,save?.gameDate,root?.FE_CHAMPIONSHIPS);
 node.replaceChildren();
 for(const row of rows){
  const card=document.createElement('div');card.className='dc-title-card';
  const title=document.createElement('strong');title.textContent=row.label;
  const holder=document.createElement('p');holder.textContent=row.champion?
   'Reigning champion: '+row.champion:'No champion crowned yet.';
  const note=document.createElement('small');
  note.textContent=row.underway?'Tournament underway · '+row.underway.completedRounds+'/'+row.underway.totalRounds+' rounds decided':
   row.lastWon?'Last crowned: '+row.lastWon+' · Recorded titles: '+row.titleCount:'Awaiting first championship.';
  card.append(title,holder,note);node.appendChild(card);
 }
 if(!rows.length){const note=document.createElement('p');note.textContent='No sporting championships have been established in this period.';node.appendChild(note);}
}
const api=Object.freeze({version:1,summary,lookup,render});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_CHAMPIONSHIP_REGISTER=api;
})(typeof window!=='undefined'?window:globalThis);
