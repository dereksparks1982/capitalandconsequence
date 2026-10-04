/* Federal Electric radio automation engine.
   Native browser audio playback with a broadcast clock.
   Radio power controls audibility; live-station position comes from the clock. */
(function(){
 'use strict';

 class FederalRadioEngine{
  constructor(options={}){
   this.stations=Array.isArray(options.stations)?options.stations:[];
   this.volume=Number.isFinite(options.volume)?options.volume:.38;
   this.getMode=typeof options.getMode==='function'?options.getMode:(()=> 'day');
   this.onStationChange=typeof options.onStationChange==='function'?options.onStationChange:null;
   this.index=Math.max(0,Math.min(this.stations.length-1,Number(options.index)||0));
   this.powered=options.powered!==false;
   this.masterPaused=!!options.masterPaused;
   this.airStartAt=Date.now();
   this.localResumeOffset=0;
   this.contextMode=this.getMode();
   this.audio=new Audio();
   this.audio.preload='auto';
   this.audio.volume=this.volume;
   this.audio.loop=false;
   this.loadToken=0;
   this.sourceIndex=0;
   this.currentBlockId='';
   this.syncTimer=setInterval(()=>this.sync(),1000);
  }

  station(index=this.index){return this.stations[index]||null}
  current(){return this.station()}
  elapsedSeconds(){return Math.max(0,(Date.now()-this.airStartAt)/1000)}
  clockFor(station){
   const mode=this.getMode();
   if(mode==='night'&&Array.isArray(station?.nightClock)&&station.nightClock.length)return station.nightClock;
   return Array.isArray(station?.clock)?station.clock:[];
  }
  isLive(station=this.current()){return !!station&&!station.restartOnTune}

  _sources(block){
   if(Array.isArray(block?.sources)&&block.sources.length)return block.sources.filter(Boolean);
   return block?.src?[block.src]:[];
  }

  _knownCycle(clock){
   if(!clock.length)return 0;
   let total=0;
   for(const block of clock){
    const d=Number(block.duration);
    if(!Number.isFinite(d)||d<=0)return 0;
    total+=d;
   }
   return total;
  }

  _slotFor(station,dynamicDuration=0){
   const clock=this.clockFor(station);
   if(!clock.length)return null;
   if(station.restartOnTune){
    return {block:clock[0],offset:Math.max(0,this.localResumeOffset||0)};
   }
   if(clock.length===1){
    const block=clock[0];
    const duration=Number(block.duration)>0?Number(block.duration):dynamicDuration;
    return {block,offset:duration>0?this.elapsedSeconds()%duration:0};
   }
   const cycle=this._knownCycle(clock);
   if(!cycle)return {block:clock[0],offset:0};
   let at=this.elapsedSeconds()%cycle;
   for(const block of clock){
    const duration=Number(block.duration);
    if(at<duration)return {block,offset:at};
    at-=duration;
   }
   return {block:clock[0],offset:0};
  }

  _seekToSlot(station,slot){
   if(!slot||!this.audio)return;
   const duration=Number(slot.block?.duration)>0?Number(slot.block.duration):this.audio.duration;
   let offset=slot.offset||0;
   if(!station.restartOnTune&&Number.isFinite(duration)&&duration>0)offset%=duration;
   try{
    if(Number.isFinite(offset)&&offset>=0&&Math.abs((this.audio.currentTime||0)-offset)>.5)this.audio.currentTime=offset;
   }catch(e){}
  }

  _attemptPlay(){
   if(!this.powered||this.masterPaused)return;
   this.audio.volume=this.volume;
   const p=this.audio.play();
   if(p&&typeof p.catch==='function')p.catch(()=>{});
  }

  _loadCurrent(options={}){
   const station=this.current();
   if(!station||!this.powered||this.masterPaused)return;
   const firstSlot=this._slotFor(station);
   if(!firstSlot?.block)return;
   const sources=this._sources(firstSlot.block);
   if(!sources.length)return;

   const token=++this.loadToken;
   const block=firstSlot.block;
   const clock=this.clockFor(station);
   this.sourceIndex=0;
   this.currentBlockId=block.id||'';
   this.audio.pause();
   this.audio.loop=!!block.loop&&clock.length===1;

   const loadSource=()=>{
    if(token!==this.loadToken)return;
    const src=sources[this.sourceIndex];
    if(!src)return;
    this.audio.src=src;
    this.audio.load();

    const onMeta=()=>{
     if(token!==this.loadToken)return;
     const duration=Number(block.duration)>0?Number(block.duration):this.audio.duration;
     const slot=this._slotFor(station,duration);
     if(station.restartOnTune&&Number.isFinite(options.localOffset))slot.offset=Math.max(0,options.localOffset);
     this._seekToSlot(station,slot);
    };
    this.audio.onloadedmetadata=onMeta;
    this.audio.oncanplay=onMeta;
    this.audio.onerror=()=>{
     if(token!==this.loadToken)return;
     if(this.sourceIndex+1<sources.length){
      this.sourceIndex++;
      loadSource();
     }
    };
    this.audio.onended=()=>{
     if(token!==this.loadToken||this.masterPaused||!this.powered)return;
     if(!this.audio.loop)this._loadCurrent();
    };

    let immediateOffset=firstSlot.offset||0;
    if(station.restartOnTune&&Number.isFinite(options.localOffset))immediateOffset=Math.max(0,options.localOffset);
    try{if(immediateOffset>0)this.audio.currentTime=immediateOffset}catch(e){}
    this._attemptPlay();
   };
   loadSource();
  }

  activate(){
   if(!this.powered||this.masterPaused)return;
   const station=this.current();
   if(!station)return;
   if(this.audio.src&&this.currentBlockId){
    if(this.isLive(station)){
     const slot=this._slotFor(station,this.audio.duration);
     this._seekToSlot(station,slot);
    }
    this._attemptPlay();
    return;
   }
   this._loadCurrent({localOffset:this.localResumeOffset});
  }

  tune(index){
   if(!this.stations.length)return null;
   const next=(Number(index)+this.stations.length)%this.stations.length;
   const previous=this.current();
   if(previous?.restartOnTune)this.localResumeOffset=0;
   this.index=next;
   const station=this.current();
   this.contextMode=this.getMode();
   this.localResumeOffset=0;
   this.audio.pause();
   this.audio.removeAttribute('src');
   this.audio.load();
   this.currentBlockId='';
   if(this.onStationChange)this.onStationChange(station,this.index);
   if(this.powered&&!this.masterPaused)this._loadCurrent({localOffset:0});
   return station;
  }

  next(){return this.tune(this.index+1)}

  setPower(on){
   const next=!!on;
   const station=this.current();
   if(this.powered===next){
    if(next)this.activate();
    return;
   }
   this.powered=next;
   if(!next){
    if(station?.restartOnPower||station?.restartOnTune)this.localResumeOffset=0;
    this.audio.pause();
   }else if(!this.masterPaused){
    if(station?.restartOnPower||station?.restartOnTune){
     this.audio.pause();
     try{this.audio.currentTime=0}catch(e){}
     this.localResumeOffset=0;
    }
    if(this.isLive(station)){
     const slot=this._slotFor(station,this.audio.duration);
     this._seekToSlot(station,slot);
    }
    this.activate();
   }
  }

  setMasterPaused(paused){
   const next=!!paused;
   if(this.masterPaused===next)return;
   const station=this.current();
   if(next){
    if(station?.restartOnTune){
     const pos=Number(this.audio.currentTime);
     if(Number.isFinite(pos))this.localResumeOffset=pos;
    }
    this.masterPaused=true;
    this.audio.pause();
   }else{
    this.masterPaused=false;
    if(this.powered){
     if(this.isLive(station)){
      const slot=this._slotFor(station,this.audio.duration);
      this._seekToSlot(station,slot);
     }
     this.activate();
    }
   }
  }

  setVolume(volume){
   if(Number.isFinite(volume))this.volume=Math.max(0,Math.min(1,volume));
   this.audio.volume=this.volume;
  }

  refreshContext(){
   const mode=this.getMode();
   if(mode===this.contextMode)return;
   this.contextMode=mode;
   if(this.powered&&!this.masterPaused)this._loadCurrent({localOffset:this.localResumeOffset});
  }

  sync(){
   if(!this.powered||this.masterPaused||!this.isLive()||!this.audio?.src)return;
   const station=this.current();
   const slot=this._slotFor(station,this.audio.duration);
   if(!slot||slot.block?.id!==this.currentBlockId){
    this._loadCurrent();
    return;
   }
   const expected=Number(slot.offset);
   const actual=Number(this.audio.currentTime);
   if(Number.isFinite(expected)&&Number.isFinite(actual)&&Math.abs(actual-expected)>2.5){
    try{this.audio.currentTime=expected}catch(e){}
   }
  }

  destroy(){
   if(this.syncTimer){clearInterval(this.syncTimer);this.syncTimer=null}
   this.loadToken++;
   this.audio.pause();
   this.audio.removeAttribute('src');
   this.audio.load();
  }
 }

 window.FederalRadioEngine=FederalRadioEngine;
})();