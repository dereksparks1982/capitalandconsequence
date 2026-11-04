/* Maritime chart annotations and small generic harbor sectors.
 * Separate save namespace; does not alter Washington city map or physical location.
 * Chart pins are study marks, not automatically established ports or player teleport gates.
 */
(function(root){
'use strict';
const NAV=typeof module==='object'&&module.exports?require('./merchant-navigation.js'):root.FE_MERCHANT_NAV;
const ZONES=Object.freeze([
 {id:'quay',name:'Quayside',description:'A working waterfront. Mooring, cargo handling and coastal departures take place here.'},
 {id:'warehouse',name:'Storehouse',description:'A plain dockside storehouse. Trade goods belong to the ship or consignee until an actual ledger transaction.'},
 {id:'customs',name:'Customs Desk',description:'A port official would examine cargo manifests and duties. No clearance has been granted merely by viewing the chart.'},
 {id:'market',name:'Merchant Square',description:'A compact waterfront exchange with stalls and agents. No stock or trade contract is automatically created.'},
 {id:'lodging',name:'Sailors’ Lodging',description:'Basic paid bed rest is available after physically reaching this section. The room rate is a provisional game estimate; named residents remain unimplemented.'},
 {id:'street',name:'Harbour Street',description:'The lane joining the quay, warehouses and town. Inland exploration will require an approved regional map.'}
]);
const clamp=(v,max)=>Math.max(0,Math.min(max,Number.isFinite(+v)?+v:0));
const validPort=p=>Object.prototype.hasOwnProperty.call(NAV.PORTS,p);
function ensure(save){
 if(!save||typeof save!=='object')throw Error('Saved player profile required');
 if(!save.merchantMap||save.merchantMap.version!==1)save.merchantMap={version:1,pins:[],nextPin:0,view:{scale:null,x:null,y:null}};
 const m=save.merchantMap;
 if(!Array.isArray(m.pins))m.pins=[];
 if(!Number.isSafeInteger(m.nextPin)||m.nextPin<0)m.nextPin=m.pins.length;
 if(!m.view||typeof m.view!=='object')m.view={scale:null,x:null,y:null};
 if(!m.portPositions||typeof m.portPositions!=='object'||Array.isArray(m.portPositions))m.portPositions={};
 if(!Array.isArray(m.customPorts))m.customPorts=[];
 return m;
}
function addPin(save,x,y){
 const m=ensure(save);
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||y<0||x>800||y>600)return{ok:false,reason:'The location is outside the printed chart.'};
 if(m.pins.length>=60)return{ok:false,reason:'The chart has reached its 60-mark limit.'};
 const id=++m.nextPin;
 const pin={id,x:Math.round(clamp(x,800)*10)/10,y:Math.round(clamp(y,600)*10)/10,name:'Chart Mark '+id,kind:'study'};
 m.pins.push(pin);
 return{ok:true,pin};
}
function rename(save,id,name){
 const pin=ensure(save).pins.find(p=>p.id===Number(id));
 const label=String(name||'').trim();
 if(!pin)return{ok:false,reason:'Chart pin no longer exists.'};
 if(!label||label.length>64)return{ok:false,reason:'Pin names must contain 1 to 64 characters.'};
 pin.name=label;return{ok:true,pin};
}
function move(save,id,x,y){
 const pin=ensure(save).pins.find(p=>p.id===Number(id));
 if(!pin||![x,y].every(Number.isFinite)||x<0||y<0||x>800||y>600)return{ok:false,reason:'Invalid chart placement.'};
 pin.x=Math.round(x*10)/10;pin.y=Math.round(y*10)/10;return{ok:true,pin};
}
function classify(save,id,kind){
 const pin=ensure(save).pins.find(p=>p.id===Number(id));
 if(!pin)return{ok:false,reason:'Chart pin not found.'};
 if(!['study','harbor','coast','sea'].includes(kind))return{ok:false,reason:'Unknown area type.'};
 pin.kind=kind;return{ok:true,pin};
}
function remove(save,id){
 const m=ensure(save),index=m.pins.findIndex(p=>p.id===Number(id));
 if(index<0)return{ok:false,reason:'Chart pin not found.'};
 m.pins.splice(index,1);return{ok:true};
}
function port(port){
 return validPort(port)?{name:port,point:NAV.PORTS[port].slice(),zones:ZONES.map(z=>({...z}))}:null;
}
function inspectZone(portName,id){
 if(!validPort(portName))return null;
 const zone=ZONES.find(z=>z.id===id);
 return zone?{port:portName,...zone}:null;
}
/* Owner-set coordinates are a visual overlay, not a change to sailing routes or licenses. */
const validXY=(x,y)=>Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&y>=0&&x<=NAV.CHART.width&&y<=NAV.CHART.height;
const round=n=>Math.round(n*10)/10;
function customPort(save,name){return ensure(save).customPorts.find(p=>p.name===String(name))||null}
function chartPorts(save){
 const m=ensure(save),out={...NAV.DISPLAY_PORTS};
 for(const [n,p]of Object.entries(m.portPositions))if(Object.hasOwn(NAV.DISPLAY_PORTS,n)&&Array.isArray(p)&&validXY(p[0],p[1]))out[n]=p.slice(0,2);
 for(const p of m.customPorts)if(p&&typeof p.name==='string'&&validXY(p.x,p.y))out[p.name]=[p.x,p.y];
 return out;
}
function chartPoint(save,name){return Object.hasOwn(chartPorts(save),name)?chartPorts(save)[name]:null}
function addPort(save,name,x,y){
 const m=ensure(save),label=String(name??'').trim();
 if(!label||label.length>64||['__proto__','constructor','prototype'].includes(label))return{ok:false,reason:'Port name must be 1 to 64 characters and cannot be a reserved word.'};
 if(!validXY(x,y))return{ok:false,reason:'Place the port on the printed world chart.'};
 if([...Object.keys(NAV.DISPLAY_PORTS),...m.customPorts.map(p=>p.name)].some(n=>n.toLowerCase()===label.toLowerCase()))return{ok:false,reason:'That port is already registered.'};
 if(m.customPorts.length>=80)return{ok:false,reason:'Maximum of 80 user-added ports.'};
 const port={name:label,x:round(x),y:round(y)};m.customPorts.push(port);return{ok:true,port};
}
function movePort(save,name,x,y){
 if(!validXY(x,y))return{ok:false,reason:'The harbor marker must remain on the printed chart.'};
 const m=ensure(save),port=customPort(save,name);
 if(port){port.x=round(x);port.y=round(y);return{ok:true,port};}
 if(Object.hasOwn(NAV.DISPLAY_PORTS,name)){m.portPositions[name]=[round(x),round(y)];return{ok:true,port:{name,x:round(x),y:round(y)}};}
 return{ok:false,reason:'No such port exists on the chart.'};
}
function renamePort(save,name,newName){
 const port=customPort(save,name),next=String(newName??'').trim();
 if(!port)return{ok:false,reason:'Only owner-added ports can be renamed.'};
 if(!next||next.length>64||['__proto__','constructor','prototype'].includes(next))return{ok:false,reason:'Invalid port name.'};
 if([...Object.keys(NAV.DISPLAY_PORTS),...ensure(save).customPorts.filter(p=>p!==port).map(p=>p.name)].some(n=>n.toLowerCase()===next.toLowerCase()))return{ok:false,reason:'That port name is already used.'};
 port.name=next;return{ok:true,port};
}
function deletePort(save,name){
 const m=ensure(save),i=m.customPorts.findIndex(p=>p.name===name);
 if(i<0)return{ok:false,reason:'Built-in ports may be moved, but not deleted.'};
 m.customPorts.splice(i,1);return{ok:true};
}
const api=Object.freeze({ZONES,ensure,addPin,rename,move,classify,remove,port,inspectZone,customPort,chartPorts,chartPoint,addPort,movePort,renamePort,deletePort});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_MERCHANT_REGIONS=api;
})(typeof window!=='undefined'?window:globalThis);
