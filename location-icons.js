/* Choose a compact physical map icon for selected registered locations.
 * The choice REPLACES that pin's numbered badge, not the location/card or
 * immutable registered map coordinate. Fully profile-scoped.
 */
(function(root){'use strict';
const ICONS=Object.freeze({
 number:Object.freeze({name:'Numbered pin',glyph:''}),
 station:Object.freeze({name:'Railroad station',glyph:'▣'}),
 railway:Object.freeze({name:'Locomotive depot',glyph:'▤'}),
 factory:Object.freeze({name:'Factory',glyph:'▥'}),
 police:Object.freeze({name:'Police station',glyph:'✦'}),
 hospital:Object.freeze({name:'Hospital',glyph:'✚'}),
 circus:Object.freeze({name:'Circus tent',glyph:'△'}),
 club:Object.freeze({name:'Clubhouse',glyph:'♧'}),
 theatre:Object.freeze({name:'Theatre',glyph:'♫'}),
 market:Object.freeze({name:'Market building',glyph:'▦'}),
 home:Object.freeze({name:'House',glyph:'⌂'}),
 government:Object.freeze({name:'Government building',glyph:'▰'}),
 park:Object.freeze({name:'Park',glyph:'♣'})
});
function ensure(save){
 if(!save||typeof save!=='object')return {version:1,byLocation:{}};
 if(save.mapLocationIcons?.version!==1||!save.mapLocationIcons.byLocation)
  save.mapLocationIcons={version:1,byLocation:{}};
 return save.mapLocationIcons;
}
function selected(save,id){
 const choice=ensure(save).byLocation[id];
 return Object.hasOwn(ICONS,choice)?choice:'number';
}
function choose(save,id,icon){
 if(!id||typeof id!=='string'||!Object.hasOwn(ICONS,icon))return {ok:false,reason:'Unknown place or icon.'};
 const bank=ensure(save);if(icon==='number')delete bank.byLocation[id];else bank.byLocation[id]=icon;
 return {ok:true,icon};
}
function decorate(marker,save,id){
 if(!marker)return;
 const icon=selected(save,id),pin=marker.querySelector('.title-map-marker-pin');
 if(!pin)return;
 marker.dataset.physicalIcon=icon;
 let figure=pin.querySelector('.title-map-physical-icon');
 if(!figure){figure=document.createElement('span');figure.className='title-map-physical-icon';figure.setAttribute('aria-hidden','true');pin.appendChild(figure)}
 figure.textContent=ICONS[icon].glyph;figure.hidden=icon==='number';
 const number=pin.querySelector('b');if(number)number.hidden=icon!=='number';
}
const api=Object.freeze({ICONS,ensure,selected,choose,decorate});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_LOCATION_ICONS=api;
})(typeof window!=='undefined'?window:globalThis);
