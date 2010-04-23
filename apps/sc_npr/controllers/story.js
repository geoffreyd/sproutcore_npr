// ==========================================================================
// Project:   ScNpr.storyController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
ScNpr.storyController = SC.ObjectController.create(
/** @scope ScNpr.storyController.prototype */ {

  // TODO: Add your own code here.
  storyIsVisible: false,
  story: null,
  
  storyImageURL: '',
  storyImageCaption: '',
  fullTextWithHTML: '',
  storyTitle: '',
  storyByLine: '',
  storyDate: '',
  storyAudio: '',
  storyHasAudio: '',
  storyIsVisible: false,
  storyBodyHTML: '',

  toggleStoryMode: function() {
    var visible = this.get('storyIsVisible');
    var story = this.get('story');
    
    if(!story) return;
    else{
      this.set('storyIsVisible',!visible);
    }
  },
  
  showStory: function(story) {
    this.set('story',story);
    
    var caption = story.get('imageCaption');
    this.set('storyImageCaption',caption);
    
    this.set('storyImageURL',story.get('bigImage'));
    
    var fullTextWithHTML = story.get('fullTextWithHTML');
    this.set('fullTextWithHTML',fullTextWithHTML);
    
    var date = story.get('storyDate');
    this.set('storyDate',date);
    
    var byline = story.get('byLine');
    this.set('storyByLine','by '+byline);
    
    var title = story.get('title');
    this.set('storyTitle',title);
    
    ScNpr.nowPlayingController.set('title',title);
    
    var audioURL = story.get('storyAudio');
    this.set('storyAudio',audioURL);
    this.set('storyHasAudio',audioURL !== undefined);
    
    var html = '<div id="story-title">'+title+'</div><div class="image-caption story-byline">'+byline+'</div><div class="image-caption">'+date+'</div><div class="story-body">'+fullTextWithHTML+'</div>';
    this.set('storyBodyHTML',html);
    
    
    this.set('storyIsVisible',true);
  }
  
}) ;
