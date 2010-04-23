// ==========================================================================
// Project:   ScNpr.AudioView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
ScNpr.AudioView = SC.View.extend(
/** @scope ScNpr.AudioView.prototype */ {

  childViews: 'audioTag audioController'.w(),
  audioLayer: null,
  displayProperties: 'value'.w(),
  
  audioTag: SC.View.design({
    render: function(context,firstTime) {
      console.log("rerendering audioTag");
      var val = this.get('parentView').get('value');
      context.push('<audio id="audio-player" src="'+val+'"></audio>');
      this.invokeLater(this.layerDidCreate,1);
    },
    
    layerDidCreate: function() {
      console.log("this.get('layer') = "+this.$());
      ScNpr.nowPlayingController.set('playingAudioObject',this.get('parentView').$('audio')[0]);
      if(ScNpr.nowPlayingController.get('audioURL')){
        ScNpr.nowPlayingController.startPlaying();  
      }
    },
    
    valueChanged: function() {
      console.log("changed");
      this.displayDidChange();
    }.observes('.owner.value')
    
        
  }),
  
  audioController: SC.View.design({
    layout: {top:0,right:0,bottom:0,left:0},
    
    touchStart: function(evt) {
      return YES;
    },
    
    
    touchEnd: function(evt) {
      console.log('here');
      this.click(evt);
      return YES;
    },
    
  
    click: function(evt) {
      ScNpr.nowPlayingController.togglePlaying();
    }
    
  })

});
