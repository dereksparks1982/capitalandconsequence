/* Simple interactive port planning scene. No NPCs, ownership,
 * travel receipt, player location, or shipping cargo mutation.
 */
(function(root){
 'use strict';
 const walk=typeof module==='object'&&module.exports?require('./merchant-harbor-walk.js'):root.FE_MERCHANT_HARBOR_WALK;
 const regions=typeof module==='object'&&module.exports?require('./merchant-regions.js'):root.FE_MERCHANT_REGIONS;
 const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const tiles={wall:'▓',floor:'',water:'≈',dock:'═',road:'·',crate:'▣',barrel:'◉',bollard:'●',counter:'▤',books:'▥',stall:'▦',bed:'▰',table:'▪'};
 function render(save,place){
  const scene=walk.preview(save,place);
  if(!scene)return '<p>The selected area has no survey layout.</p>';
  const name=place.startsWith('mark:')?regions.ensure(save).pins.find(v=>'mark:'+v.id===place)?.name||'Harbour Candidate':place;
  const current=regions.ZONES.find(z=>z.id===scene.zone);
  let html='<section class="merchant-harbor-walk" tabindex="0" role="region" aria-label="Harbor sector planning survey"><div class="merchant-harbor-walk-head">'+
   '<div><small>GENERIC PORT LAYOUT · SURVEY ONLY</small><h3>'+escape(name)+'</h3><p>'+escape(current?.name||scene.zone)+'</p></div>'+
   '<button type="button" data-ocean-action="walk-close" aria-label="Close district preview">✕</button></div>';
  html+='<p class="merchant-harbor-walk-caution">Survey cursor only. This is not Charles; no passenger travel or physical arrival has occurred.</p>';
  html+='<div class="merchant-harbor-zone-tabs">'+regions.ZONES.map(z=>
   '<button type="button" data-ocean-action="walk-zone:'+z.id+'"'+(z.id===scene.zone?' aria-pressed="true"':'')+'>'+escape(z.name)+'</button>').join('')+'</div>';
  html+='<div class="merchant-harbor-board" role="grid" aria-label="Low-detail 12 by 9 port sector">';
  for(let y=0;y<scene.height;y++)for(let x=0;x<scene.width;x++){
   const tile=scene.tiles[y][x],active=scene.x===x&&scene.y===y;
   const neighbor=Math.abs(scene.x-x)+Math.abs(scene.y-y)===1&&walk.passable(tile);
   const aria=active?'Survey cursor':tile+' at column '+(x+1)+', row '+(y+1);
   const mark=active?'♟':tiles[tile]||'';
   if(active||neighbor)html+='<button type="button" class="merchant-harbor-tile '+tile+(active?' walker':'')+'" data-ocean-action="walk-cell:'+x+':'+y+'" aria-label="'+escape(aria)+'"'+(active?' aria-current="location"':'')+'>'+mark+'</button>';
   else html+='<span class="merchant-harbor-tile '+tile+'" aria-hidden="true">'+mark+'</span>';
  }
  html+='</div><div class="merchant-harbor-pad" aria-label="Walk one square">'+
    '<button type="button" data-ocean-action="walk-step:0:-1" aria-label="Walk north">↑</button>'+
    '<span><button type="button" data-ocean-action="walk-step:-1:0" aria-label="Walk west">←</button>'+
    '<button type="button" data-ocean-action="walk-step:0:1" aria-label="Walk south">↓</button>'+
    '<button type="button" data-ocean-action="walk-step:1:0" aria-label="Walk east">→</button></span></div>';
  html+='<p class="fine">WASD, arrows, or an adjacent tile move the survey cursor. Move between simplified local sections using the tabs. Port transactions remain on the Shipping Office, not inside this preview.</p></section>';
  return html;
 }
 const api=Object.freeze({render});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_MERCHANT_HARBOR_UI=api;
})(typeof window!=='undefined'?window:globalThis);
