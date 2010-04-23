// ==========================================================================
// Project:   ScNpr.ArtsStory
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
ScNpr.ArtsStory = SC.Record.extend(
/** @scope ScNpr.ArtsStory.prototype */ {

  // TODO: Add your own code here.
  primaryKey: 'id',
  storyType: 'Arts',  

  image: function(){
    var c = this.readAttribute('image');
    if(!c || !c[0]) return;
    
    return c[0].src;
  }.property('image').cacheable(),
  
  bigImage: function(){
    var c = this.readAttribute('image');
    if(!c) return;
    if(c[0].enlargement){
      return c[0].enlargement.src;  
    } else {
      return c[0].src;  
    }
  }.property('image').cacheable(),
  
  imageHeight: function(){
    var c = this.readAttribute('image');
    if(!c) return;
    
    return c[0].width;
  }.property('image').cacheable(),
  
  imageWidth: function(){
    var c = this.readAttribute('image');
    if(!c) return;
    
    return c[0].width;
  }.property('image').cacheable(),
  
  fullTextWithHTML: function() {
    var c = this.readAttribute('textWithHtml');
    if(!c) return '';
    var paragraphs = c.paragraph;
    var len = paragraphs.length;
    var html = '';
    
    for (var i = 0; i < len; i++){
      html += '<p>'+paragraphs[i].$text+'</p>';
    }
    

    if(!html) return '';
    return html;    
  }.property('textWithHtml').cacheable(),
  
  imageCaption: function() {
    var c = this.readAttribute('image');
    if(!c) return '';
    if(!c[0].caption.$text) return '';
    
    return c[0].caption.$text;    
  }.property('image'),
  
  
  title: function(){
    var c = this.readAttribute('title');
    if(!c) return;
    
    return c.$text;
  }.property('title').cacheable(),
  
  byLine: function(){
    var c = this.readAttribute('byline');
    if(!c) return;
    
    return 'by '+c[0].name.$text;
  }.property('byline').cacheable(),
  
  storyDate: function(){
    var c = this.readAttribute('storyDate');
    if(!c) return;
    
    return c.$text;
  }.property('storyDate').cacheable(),
  
  teaser: function(){
    var c = this.readAttribute('teaser');
    if(!c) return;
    
    return c.$text;
  }.property('teaser').cacheable(),
  
  storyAudio: function() {
    var c = this.readAttribute('audio');
    if(!c || !c[0].format.mp3) return;
    
    return c[0].format.mp3.$text;    
  }.property('audio'),
  
  storyHasAudio: function() {
    var c = this.readAttribute('audio');
    if(!c || !c[0].format.mp3) return;
    
    return c[0].format.mp3.$text !== undefined || c[0].format.mp3.$text !== '' ;    
  }.property('audio'),

  storyBodyHTML: function() {
    var fullTextWithHTML = this.get('fullTextWithHTML');    
    var date = this.get('storyDate');
    var byline = this.get('byLine');
    var title = this.get('title');    

    return '<div id="story-title">'+title+'</div><div class="image-caption story-byline">'+byline+'</div><div class="image-caption">'+date+'</div><div class="story-body">'+fullTextWithHTML+'</div>';
  }.property('title','byLine','storyDate','fullTextWithHTML')
  
  
}) ;
