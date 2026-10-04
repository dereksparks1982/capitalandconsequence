/* Federal Electric radio automation engine.
   Uses Howler.js core (MIT) for browser playback.
   Live stations use an absolute broadcast clock: radio power controls
   audibility, never the position of the broadcast. */
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
   this.howl=null;
   this.soundId=null;
   this.localResumeOffset=0;
   this.contextMode=this.getMode();
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

  _stopHowl(unload=true){
   if(!this.howl)return;
   try{this.howl.stop(this.soundId)}catch(e){}
   if(unload){try{this.howl.unload()}catch(e){}}
   this.howl=null;this.soundId=null;
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

  _playCurrent(options={}){
   const station=this.current();
   if(!station||!this.powered||this.masterPaused||typeof Howl!=='function')return;
   const firstSlot=this._slotFor(station);
   if(!firstSlot||!firstSlot.block?.src)return;
   const token={};
   this.playToken=token;
   this._stopHowl(true);
   const block=firstSlot.block;
   const howl=new Howl({
    src:[block.src],
    html5:true,
    preload:true,
    loop:!!block.loop&&this.clockFor(station).length===1,
    volume:0,
    onload:()=>{
     if(this.playToken!==token||this.howl!==howl)return;
     const duration=Number(block.duration)>0?Number(block.duration):howl.duration();
     const slot=this._slotFor(station,duration);
     let offset=slot?.block?.id===block.id?slot.offset:0;
     if(station.restartOnTune&&Number.isFinite(options.localOffset))offset=Math.max(0,options.localOffset);
     const id=howl.play();
     this.soundId=id;
     try{if(offset>0)howl.seek(offset,id)}catch(e){}
     howl.volume(this.volume,id);
    },
    onend:()=>{
     if(this.playToken!==token||this.masterPaused||!this.powered)return;
     if(!block.loop||this.clockFor(station).length>1)this._playCurrent();
    },
    onloaderror:(_id,error)=>console.warn('Federal Electric radio load error:',station.name,error),
    onplayerror:(_id,error)=>console.warn('Federal Electric radio play error:',station.name,error)
   });
   this.howl=howl;
   howl.load();
  }

  activate(){
   if(!this.powered||this.masterPaused)return;
   if(this.howl&&this.howl.playing(this.soundId))return;
   this._playCurrent({localOffset:this.localResumeOffset});
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
   this._stopHowl(true);
   if(this.onStationChange)this.onStationChange(station,this.index);
   if(this.powered&&!this.masterPaused)this._playCurrent();
   return station;
  }

  next(){return this.tune(this.index+1)}

  setPower(on){
   const next=!!on;
   if(this.powered===next){
    if(next)this.activate();
    return;
   }
   this.powered=next;
   const station=this.current();
   if(!next){
    if(station?.restartOnTune)this.localResumeOffset=0;
    this._stopHowl(true);
   }else if(!this.masterPaused){
    this._playCurrent();
   }
  }

  setMasterPaused(paused){
   const next=!!paused;
   if(this.masterPaused===next)return;
   const station=this.current();
   if(next){
    if(station?.restartOnTune&&this.howl&&this.soundId!=null){
     const pos=Number(this.howl.seek(this.soundId));
     if(Number.isFinite(pos))this.localResumeOffset=pos;
    }
    this.masterPaused=true;
    this._stopHowl(true);
   }else{
    this.masterPaused=false;
    if(this.powered)this._playCurrent({localOffset:this.localResumeOffset});
   }
  }

  setVolume(volume){
   if(Number.isFinite(volume))this.volume=Math.max(0,Math.min(1,volume));
   if(this.howl&&this.soundId!=null)try{this.howl.volume(this.volume,this.soundId)}catch(e){}
  }

  refreshContext(){
   const mode=this.getMode();
   if(mode===this.contextMode)return;
   this.contextMode=mode;
   if(this.powered&&!this.masterPaused)this._playCurrent({localOffset:this.localResumeOffset});
  }

  sync(){
   if(!this.powered||this.masterPaused||!this.isLive()||!this.howl||this.soundId==null)return;
   const station=this.current();
   const clock=this.clockFor(station);
   if(clock.length!==1)return;
   const block=clock[0];
   const duration=Number(block.duration)>0?Number(block.duration):this.howl.duration();
   if(!Number.isFinite(duration)||duration<=0)return;
   const expected=this.elapsedSeconds()%duration;
   const actual=Number(this.howl.seek(this.soundId));
   if(Number.isFinite(actual)&&Math.abs(actual-expected)>2.5){
    try{this.howl.seek(expected,this.soundId)}catch(e){}
   }
  }

  destroy(){
   if(this.syncTimer){clearInterval(this.syncTimer);this.syncTimer=null}
   this._stopHowl(true);
   this.playToken=null;
  }
 }

 window.FederalRadioEngine=FederalRadioEngine;
})();