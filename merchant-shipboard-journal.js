/* Player-authored voyage notebook, saved without a second timer or invented lore. */
(function(root){
'use strict';
const ship=typeof module==='object'&&module.exports?require('./merchant-shipboard.js'):root.FE_SHIPBOARD;
const no=reason=>({ok:false,reason}),yes=(reason,extra={})=>({ok:true,reason,...extra});
const MAX_TEXT=800,MAX_PAGES=500;
function store(save){
 if(save?.characterRoute!=='industrialist'||save?.passengerSea?.version!==1)return null;
 if(!save.passengerSea.journal||save.passengerSea.journal.version!==1)
  save.passengerSea.journal={version:1,next:0,pages:[]};
 const book=save.passengerSea.journal;
 if(!Array.isArray(book.pages))book.pages=[];
 if(!Number.isSafeInteger(book.next)||book.next<0)book.next=book.pages.length;
 return book;
}
function pages(save){
 const book=save?.characterRoute==='industrialist'?save?.passengerSea?.journal:null;
 return book?.version===1&&Array.isArray(book.pages)?book.pages.map(p=>({...p})):[];
}
function quote(save,text){
 const atBerth=ship.stationOffer(save,'rest',600);
 if(!atBerth.ok)return atBerth;
 if(typeof text!=='string'||!text.trim())return no('Write something before committing a journal page.');
 if(text.trim().length>MAX_TEXT)return no('Each page is limited to 800 characters.');
 const book=store(save);
 if(!book)return no('Your passage journal is unavailable here.');
 if(book.pages.length>=MAX_PAGES)return no('The notebook is full; old pages are preserved.');
 return yes('Time available at your passenger berth.',{seconds:600});
}
function write(save,text){
 const validation=quote(save,text);if(!validation.ok)return validation;
 const book=store(save),voyage=save.passengerSea.voyage;
 const page={id:++book.next,voyageId:voyage.id,from:voyage.from,to:voyage.to,
  minute:save.worldCalendar.worldMinute,date:save.gameDate,body:text.trim()};
 book.pages.push(page);
 return yes('Written a page in your personal voyage journal.',{page:{...page}});
}
const api=Object.freeze({MAX_TEXT,MAX_PAGES,store,pages,quote,write});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_SHIP_JOURNAL=api;
})(typeof window!=='undefined'?window:globalThis);
