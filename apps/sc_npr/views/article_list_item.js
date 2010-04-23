// ==========================================================================
// Project:   ScNpr.ArticleListItemView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
ScNpr.ArticleListItemView = SC.View.extend(
/** @scope ScNpr.ArticleListItemView.prototype */ {

  content: null,
  
  displayProperties: 'content'.w(),
  
  render: function(context,firstTime) {
    var content = this.get('content');
    if(!content) return;
    
    var image   = content.get('image');
    var title   = content.get('title');
    var teaser  = content.get('teaser');
    var hasAudio= content.get('storyAudio') !== '';

    var html, img_html = '';
    
    if(image){
      img_html = '<div class="info-image" style="background:url(\''+image+'\');"></div>';
    }
    
    html = '<h3>'+title+'</h3>';
    
    if(image){
      html += '<div class="left-info">'
            + '<div class="info-image" style="background:url(\''+image+'\');"></div>'
            + '</div>'
            + '<div class="right-info">' ;
    } else {
      html += '<div class="full-info">' ;
    }

    html += '<p>'+teaser+'</p>';
    
    html += '</div>';  
    
    
    var html_no_teaser = '<div class="left-info">'+img_html+'</div>'
      + '<div class="right-info"><h3>'+title+'</h3><div class="home-view-story-actions"></div></div>' ;
    
    switch(content.get('storyType')){
      case 'News':
        context.addClass('news-story');
        context.push(html);
      break;
      case 'Music':
        context.addClass('music-story');
        context.push(html_no_teaser);
      break;
      case 'Arts':
        context.addClass('arts-story');
        context.push(html_no_teaser);
      break;
    }
      
    if(content.get('storyAudio')){
      this.invokeLater(this.addChild,1);
    }
  },
  
  addChild: function() {

    var view =  SC.View.create({
     layout: {bottom:10,right:15,height:27,width:122},
      classNames: 'home-view-story-actions'.w(),
     childViews: 'toggleAudio addToPlaylsit'.w(),
      isVisibleBinding: '*.owner.content.storyHasAudio',

     toggleAudio: SC.View.design({
        layout: {top:0,left:0, width:50,height:27},
        classNames: 'play-audio'.w(),
        valueBinding: 'ScNpr.storyController.storyAudio',

        click: function  (evt) {
           ScNpr.nowPlayingController.set('audioTitle',this.get('parentView').get('parentView').get('content').get('title'));            
           ScNpr.nowPlayingController.set('audioURL',this.get('parentView').get('parentView').get('content').get('storyAudio'));            
            ScNpr.nowPlayingController.startPlaying();
        },        
        touchStart: function(evt) {
          return YES;
        },

        touchEnd: function(evt) {
           console.log('here');
          this.click(evt);
          return YES;
        }

      }),

     addToPlaylsit: SC.View.design({
        layout: {top:0,left:50, width:50,height:27},
        classNames: 'play-audio'.w(),

        click: function  (evt) {
           var c = this.get('parentView').get('parentView').get('content');
            ScNpr.playlistController.addStoryToPlaylist(c);
        },        
        touchStart: function(evt) {
          return YES;
        },

        touchEnd: function(evt) {
           console.log('here');
          this.click(evt);
          return YES;
        }

      }),

     storyAudioIsPlayingObserver: function(){
        var val = ScNpr.storyController.get('audioIsPlaying');
        if(val){
          this.$().addClass('story-actions-disabled');  
        } else {
         this.$().removeClass('story-actions-disabled');  
        }
       }.observes('ScNpr.nowPlayingController.audioIsPlaying')
    });
                
    this.appendChild(view);
  },
  
  
  click: function(evt) {
    this.touchEnd();
  },
  
  
  touchStart: function(evt) {    
    return YES;
  },
  
  touchEnd: function(evt) {
    var controller, index;
    var content = this.get('content');
    switch(content.get('storyType')){
      case 'News':
        controller = ScNpr.newsController;
      break;
      case 'Music':
        controller = ScNpr.musicController;
      break;
      case 'Arts':
        controller = ScNpr.artsController;
      break;
    }
    
    console.log("controller = "+controller);
    console.log("controller.get('arrangedObjects').indexOf(content) = "+controller.get('arrangedObjects').indexOf(content));
    
    ScNpr.storyBrowserController.set('activeController',controller);
    ScNpr.storyBrowserController.set('content',controller.get('arrangedObjects'));
    ScNpr.storyBrowserController.set('startingIndex',controller.get('arrangedObjects').indexOf(content));
    
    ScNpr.storyController.showStory(this.get('content'));
  }

});
