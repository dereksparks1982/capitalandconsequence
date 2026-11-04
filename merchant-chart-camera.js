/* Pure maritime chart camera math. The owner's Mitchell 1880 atlas is drawn
 * in an 800 x 492 logical viewport, from the bundled 9664-pixel scan.
 * Camera v3 is specific to this image; previous artwork cameras reset to fit.
 */
(function(root){
'use strict';
const finite=v=>Number.isFinite(v);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const chart=Object.freeze({width:800,height:492,nativeWidth:9664});
function viewport(v){return {width:Math.max(1,Number(v?.width)||1),height:Math.max(1,Number(v?.height)||1)};}
function fit(v){
 const p=viewport(v);
 return Math.max(.01,Math.min((p.width-12)/chart.width,(p.height-12)/chart.height));
}
function limit(v,nativeWidth=chart.nativeWidth,pixelRatio=1){
 const physical=Math.max(1,Number(pixelRatio)||1);
 const native=Math.max(1,Number(nativeWidth)||chart.nativeWidth);
 // The minimum fit always wins if the whole chart cannot be sharp at this DPI.
 return Math.max(fit(v),Math.min(10,native/(chart.width*physical)));
}
function constrain(position,v){
 const p=viewport(v);
 const s=finite(position.scale)&&position.scale>0?position.scale:fit(p);
 const width=chart.width*s,height=chart.height*s;
 const x=width<=p.width?(p.width-width)/2:clamp(position.x,p.width-width,0);
 const y=height<=p.height?(p.height-height)/2:clamp(position.y,p.height-height,0);
 return {scale:s,x,y};
}
function fitted(v){return constrain({scale:fit(v),x:0,y:0},v);}
function centered(v,point,scale){
 const p=viewport(v);
 const x=clamp(Number(point?.[0])||0,0,chart.width);
 const y=clamp(Number(point?.[1])||0,0,chart.height);
 return constrain({scale,x:p.width/2-x*scale,y:p.height/2-y*scale},p);
}
function restored(saved,v,nativeWidth=chart.nativeWidth,pixelRatio=1){
 const p=viewport(v),base=fitted(p);
 if(!saved||saved.chartVersion!==3||!finite(saved.zoom)||saved.zoom<=0||
    !finite(saved.cx)||!finite(saved.cy))return base;
 const scaled=clamp(base.scale*saved.zoom,base.scale,limit(p,nativeWidth,pixelRatio));
 return centered(p,[saved.cx,saved.cy],scaled);
}
function recorded(view,v){
 const p=viewport(v),base=fit(p);
 const x=clamp((p.width/2-view.x)/view.scale,0,chart.width);
 const y=clamp((p.height/2-view.y)/view.scale,0,chart.height);
 return {zoom:Math.round(view.scale/base*10000)/10000,cx:x,cy:y,chartVersion:3};
}
function zoomed(view,v,factor,px,py,nativeWidth=chart.nativeWidth,pixelRatio=1){
 const p=viewport(v),original=constrain(view,p);
 if(!finite(factor)||factor<=0)return original;
 const s=clamp(original.scale*factor,fit(p),limit(p,nativeWidth,pixelRatio));
 const anchorX=finite(px)?clamp(px,0,p.width):p.width/2;
 const anchorY=finite(py)?clamp(py,0,p.height):p.height/2;
 return constrain({scale:s,
  x:anchorX-(anchorX-original.x)*s/original.scale,
  y:anchorY-(anchorY-original.y)*s/original.scale},p);
}
function moved(view,v,dx,dy){
 const p=viewport(v);
 return constrain({scale:view.scale,
  x:view.x+(finite(dx)?dx:0),y:view.y+(finite(dy)?dy:0)},p);
}
function focused(view,v,point,minimum=1.1,nativeWidth=chart.nativeWidth,pixelRatio=1){
 const p=viewport(v),s=clamp(Math.max(view.scale,minimum),fit(p),limit(p,nativeWidth,pixelRatio));
 return centered(p,point,s);
}
function reflowed(view,oldViewport,newViewport,nativeWidth=chart.nativeWidth,pixelRatio=1){
 const old=viewport(oldViewport),next=viewport(newViewport);
 const cx=(old.width/2-view.x)/view.scale,cy=(old.height/2-view.y)/view.scale;
 const s=clamp(view.scale,fit(next),limit(next,nativeWidth,pixelRatio));
 return centered(next,[cx,cy],s);
}
const api=Object.freeze({chart,viewport,fit,limit,constrain,fitted,restored,recorded,
 zoomed,moved,focused,reflowed});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_MERCHANT_CAMERA=api;
})(typeof window!=='undefined'?window:globalThis);
