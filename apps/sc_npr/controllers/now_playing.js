// ==========================================================================
// Project:   Npr.nowPlayingController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr Audio */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
ScNpr.nowPlayingController = SC.ObjectController.create(
/** @scope Npr.nowPlayingController.prototype */ {

  // TODO: Add your own code here.
  title: '',
  playingAudioObject: null,
  audioIsPlaying: false,
  audioURL: '',
  audioTitle: '',
  
  startPlaying: function() {
    var audioObject = this._setupAudioObject();

    
    console.log("audioObject = "+audioObject);
    
    if(audioObject.paused){
      this.set('audioIsPlaying',true);
      audioObject.play();
    }
  },
  
  pausePlaying: function() {    
    var audioObject = this.get('playingAudioObject');
    
    if(!audioObject){
      audioObject = this._setupAudioObject();
    }

    this.set('audioIsPlaying',false);
    console.log("audioObject.paused = "+audioObject.paused);
    audioObject.pause();
  },
  
  stopPlaying: function() {
    this.pausePlaying();
  },
  
  togglePlaying: function() {
    var audioObject = this.get('playingAudioObject');
    
    if(!audioObject){
      audioObject = this._setupAudioObject();
    }
    
    if(audioObject.paused){
      this.set('audioIsPlaying',true);
      audioObject.play();
    } else {
      this.set('audioIsPlaying',false);
      audioObject.pause();
    }
  },
  
  audioURLObserver: function(){
    var val = this.get('audioURL');
    var obj = this.get('playingAudioObject');
    if(obj) {
      obj.pause() ;
      delete obj ;
    }
    this._setupAudioObject();
  }.observes('audioURL'),
  
  _setupAudioObject: function() {
    var obj = new Audio();
    var val = this.get('audioURL');
    if(!val || val === "") console.log('creating audio object without src');
    obj.src = val;
    obj.addEventListener('ended', ScNpr.nowPlayingController.objectHasEnded,false);
    this.set('playingAudioObject',obj);
    return obj;
  },
  
  objectHasEnded: function() {
    if(ScNpr.playlistController.get('isPlayingThroughAPlaylist')){
      ScNpr.playlistController.currentSongHasEnded();
    }
  },
  
  playObject: function(obj,startPlaying) {
    if(!startPlaying) startPlaying = false;
    this.set('audioTitle',obj.get('title'));
    this.set('audioURL',obj.get('storyAudio'));
    
    if(startPlaying) this.startPlaying();
  }
  
  
}) ;
