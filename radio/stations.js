/* Federal Electric fictional radio lineup.
   Audio sources may be repo-local or remotely hosted. */
(function(){
 'use strict';
 window.FEDERAL_RADIO_STATIONS=[
  {
   id:'federal-electric',
   stationNumber:1,
   dial:'610 AM',
   name:'Federal Electric Network',
   format:'Federal Electric theme',
   restartOnTune:true,
   restartOnPower:true,
   clock:[
    {id:'federal-theme',src:'assets/audio/sunflower-slow-drag.ogg?v=20261003-title2',loop:true}
   ]
  },
  {
   id:'capital-signal',
   stationNumber:2,
   dial:'540 AM',
   name:'Capital Signal',
   format:'Experimental signal',
   restartOnTune:false,
   clock:[
    {id:'day-static',src:'assets/audio/radio-static-station.mp3?v=20261004-radio1',loop:true}
   ],
   /* Night currently uses the same carrier. Replace this clock with the
      planned Morse-code program when that asset is ready. */
   nightClock:[
    {id:'night-carrier',src:'assets/audio/radio-static-station.mp3?v=20261004-radio1',loop:true}
   ]
  },
  {
   id:'capital-radio-theatre',
   stationNumber:3,
   dial:'720 AM',
   name:'Capital Radio Theatre',
   format:'Drama & talk',
   restartOnTune:false,
   clock:[
    {
     id:'war-of-the-worlds',
     src:'https://drive.usercontent.google.com/download?id=1K_dcYlyaL6z5trT1ZUcc_Kpl3YmAdnz4&export=download&confirm=t',
     duration:3084.552,
     loop:true
    }
   ]
  },
  {
   id:'capital-melody',
   stationNumber:4,
   dial:'880 AM',
   name:'Capital Melody',
   format:'Popular music of the 1930s',
   restartOnTune:false,
   clock:[
    {
     id:'1930s-oldies-program',
     src:'https://drive.usercontent.google.com/download?id=16bqTETY06cPW6y_1LCzNLSJaLauEmk_3&export=download&confirm=t',
     duration:7978.083265,
     loop:true
    }
   ]
  }
 ];
})();