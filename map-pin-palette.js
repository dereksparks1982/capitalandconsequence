/* Functional Washington map pin colors, independent of historical origin.
 * Immutable printed map and coordinates are NOT modified by this API. */
(function(root){'use strict';
const THEMES=Object.freeze({
 government:Object.freeze({name:"Government",color:'#c79a30',foreground:'#24180e'}),
 commerce:Object.freeze({name:"Commerce",color:'#a53636',foreground:'#fff7ec'}),
 entertainment:Object.freeze({name:"Entertainment & social",color:'#2564a0',foreground:'#fff7ec'}),
 hillsdale:Object.freeze({name:"Hillsdale / Barry Farm",color:'#744c30',foreground:'#fff7ec'}),
 green:Object.freeze({name:"Parks & education",color:'#32794c',foreground:'#fff7ec'}),
 religion:Object.freeze({name:"Religion",color:'#6a3f89',foreground:'#fff7ec'}),
 industry:Object.freeze({name:"Industry",color:'#37393f',foreground:'#fff7ec'}),
 water:Object.freeze({name:"Water & recreation",color:'#217f88',foreground:'#fff7ec'}),
 healthcare:Object.freeze({name:"Private healthcare",color:'#dfd9c7',foreground:'#242017'}),
 housing:Object.freeze({name:"Housing & other",color:'#676c70',foreground:'#fff7ec'})
});
function purpose(location){
 if(!location||typeof location!=='object')return 'housing';
 const id=String(location.id||''),category=String(location.category||'');
 if(id==='hillsdale'||id.startsWith('hillsdale-'))return 'hillsdale';
 if(category==='government'||id==='governmentHospital'||id==='blackwoodAsylum')return 'government';
 if(category==='institution')return 'healthcare';
 if(id==='oldChinatown')return 'commerce';
 if(['commerce','finance','transport'].includes(category))return 'commerce';
 if(category==='company')return 'industry';
 if(['sport','social','fair','gaming','underground','theatre'].includes(category))return 'entertainment';
 if(category==='education')return 'green';
 if(category==='religious')return 'religion';
 if(category==='leisure')return 'water';
 return 'housing';
}
function info(location){const code=purpose(location);return {code,...THEMES[code]}}
const api=Object.freeze({version:1,themes:THEMES,purpose,info});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_MAP_PIN_PALETTE=api;
})(typeof window!=='undefined'?window:globalThis);
