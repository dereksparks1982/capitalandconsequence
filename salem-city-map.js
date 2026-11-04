/* Owner-provided 1851 Salem local map. Never substitutes Washington or world atlas. */
(function(root){
'use strict';
const IMAGE='assets/artwork/maps/Salem_1851_6502x6674_GitHub.jpg';
let host=null,profile=null,onSave=null,scale=1,x=0,y=0,drag=null,placing=false;
const vp=()=>host?.querySelector('.salem-viewport'),img=()=>host?.querySelector('.salem-image');
function marker(){const p=profile?.salemMap?.harborPin;return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?p:null}
function render(){if(!img())return;img().style.transform='translate('+x+'px,'+y+'px) scale('+scale+')';const b=host.querySelector('.salem-marker'),p=marker();b.hidden=!p;if(p){b.style.left=x+p.x*(img().naturalWidth||6502)*scale+'px';b.style.top=y+p.y*(img().naturalHeight||6674)*scale+'px'}}
function fit(){if(!vp()||!img())return;const w=img().naturalWidth||6502,h=img().naturalHeight||6674;scale=Math.min(vp().clientWidth/w,vp().clientHeight/h);x=(vp().clientWidth-w*scale)/2;y=(vp().clientHeight-h*scale)/2;render()}
function zoom(f){const old=scale,cx=vp().clientWidth/2,cy=vp().clientHeight/2;scale=Math.max(Math.min(vp().clientWidth/(img().naturalWidth||6502),vp().clientHeight/(img().naturalHeight||6674)),Math.min(1,scale*f));x=cx-(cx-x)*scale/old;y=cy-(cy-y)*scale/old;render()}
function status(text){host.querySelector('#salemStatus').textContent=text}
function close(){if(!host||host.hidden)return;host.hidden=true;document.body.classList.remove('salem-open');placing=false;drag=null}
function ensure(){if(host)return;host=document.createElement('section');host.id='salemMapViewer';host.className='salem-viewer';host.hidden=true;host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.innerHTML='<div class="salem-sheet"><header><div><small>BENJAMIN LEACH · SALEM</small><h2>Salem City Map</h2><p>Original owner-supplied historical map · 1851</p></div><nav><button data-salem="fit">Fit</button><button data-salem="out">−</button><button data-salem="in">+</button><button data-salem="close">✕</button></nav></header><main><div class="salem-viewport" tabindex="0" aria-label="Right mouse drag pans; wheel zooms"><img class="salem-image" src="'+IMAGE+'" draggable="false" alt="Historical Salem map, 1851"><button class="salem-marker" data-salem="waterfront" hidden>⚓</button></div><aside><h3>Salem Waterfront</h3><p>Local map for Benjamin Leach, not Washington.</p><button data-salem="office">Enter Leach Wharf Office</button><button data-salem="waterfront">Enter Salem Waterfront</button><h3>Harbor Marker</h3><p>No invented historic street position. Place a marker on the original map.</p><button data-salem="place">Place / Move Marker</button><button data-salem="clear">Clear Marker</button><p id="salemStatus" role="status">Right drag to pan · wheel to zoom</p></aside></main></div>';document.body.appendChild(host);
 host.addEventListener('click',e=>{const a=e.target.closest('[data-salem]')?.dataset.salem;if(a==='close')return close();if(a==='fit')return fit();if(a==='in'||a==='out')return zoom(a==='in'?1.25:.8);if(a==='place'){placing=true;status('Click on the historical map to place the harbor.');return}if(a==='clear'){if(profile?.salemMap)delete profile.salemMap.harborPin;onSave?.();render();return}
 if(a==='office'||a==='waterfront'){if(profile?.currentLocation?.locationId!=='salemHarbor')return status('First travel to Salem.');close();root.FE_CITY?.openRoom?.('salemHarbor',a==='office'?'leach-office':'harbor-walk');return}
 if(placing&&e.target.closest('.salem-viewport')){const rect=vp().getBoundingClientRect(),px=(e.clientX-rect.left-x)/((img().naturalWidth||6502)*scale),py=(e.clientY-rect.top-y)/((img().naturalHeight||6674)*scale);if(px<0||px>1||py<0||py>1)return status('Click within the printed map.');profile.salemMap??={};profile.salemMap.harborPin={x:Math.round(px*10000)/10000,y:Math.round(py*10000)/10000};placing=false;onSave?.();render();status('Harbor marker saved.')}});
 host.addEventListener('contextmenu',e=>{if(e.target.closest('.salem-viewport'))e.preventDefault()});
 host.addEventListener('pointerdown',e=>{if(e.button!==2||!e.target.closest('.salem-viewport'))return;drag={id:e.pointerId,cx:e.clientX,cy:e.clientY,x,y};try{vp().setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
 host.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;x=drag.x+e.clientX-drag.cx;y=drag.y+e.clientY-drag.cy;render()});
 host.addEventListener('pointerup',e=>{if(drag?.id===e.pointerId)drag=null});
 host.addEventListener('wheel',e=>{if(!e.target.closest('.salem-viewport'))return;e.preventDefault();zoom(e.deltaY>0?.8:1.25)},{passive:false});
 host.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 img().addEventListener('load',()=>{if(!host.hidden)fit()});
}
function open(save,changed){if(save?.characterRoute!=='mariner'||save?.currentLocation?.locationId!=='salemHarbor')return false;profile=save;onSave=changed;ensure();host.hidden=false;document.body.classList.add('salem-open');placing=false;requestAnimationFrame(fit);host.querySelector('[data-salem="close"]').focus();return true}
const api=Object.freeze({open,close,isOpen:()=>!!host&&!host.hidden,IMAGE});
if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.FE_SALEM_MAP=api;
})(typeof window!=='undefined'?window:globalThis);
