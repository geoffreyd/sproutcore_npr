// ==========================================================================
// Project:   ScNpr.PageView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
ScNpr.PageView = SC.View.extend(
/** @scope ScNpr.PageView.prototype */ {

  containerView: null,
  contentView: null,
  outerContentView: null,
  content: null,
  _rendered: false,


  createChildViews: function() {
    var childViews = [] , view; 

    // create the containerView.  We must always have a container view. 
    // also, setup the contentView as the child of the containerView...
    if (SC.none(view = this.containerView)) view = SC.View;

    childViews.push(this.containerView = this.createChildView(view, {
      layout: {top:0,left:0, bottom:0, width:1024}
    }));


    // and replace our own contentView...
    var f = this.containerView.get('frame');
    // f.y = 0;
    // this.outerContentView.set('frame',f);

    // console.log(f);

    // set childViews array.
    this.childViews = childViews ;

    // this.contentViewDidChange() ; // setup initial display...
  },  

  contentViewDidChange: function() {
    var newView = this.get('containerView'),
        oldView = this._scroll_contentView,
        frameObserver = this.contentViewFrameDidChange,
        layerObserver = this.contentViewLayerDidChange;

    if (newView !== oldView) {

      // stop observing old content view
      if (oldView) {
        oldView.removeObserver('frame', this, frameObserver);
        oldView.removeObserver('layer', this, layerObserver);
      }

      // update cache
      this._scroll_contentView = newView;
      if (newView) {
        newView.addObserver('frame', this, frameObserver);
        newView.addObserver('layer', this, layerObserver);
      }

      // replace container
      this.containerView.set('contentView', newView);

      this.contentViewFrameDidChange();
    }
  }.observes('contentView'),

  startingIndex: 0,
  startingIndexBinding: 'ScNpr.storyBrowserController*startingIndex',

  startingIndexObserver: function(){

    // this.disableAnimations();
    this.invokeLater(this.updateLayerToProperOffset,1);
    // this.invokeLater(this.eableAnimations,100);

  }.observes('startingIndex'),

  updateLayerToProperOffset: function() {
    var curItem = ScNpr.storyBrowserController.get('startingIndex');
    this._state = curItem;
    var dest = (curItem * this.objectWidth);
    this._curVal = -1 * dest;
//     console.log('translate3d(-'+dest+'px,0px,0px)');
    this.containerView.$().css('-webkit-transform','translate3d(-'+dest+'px,0px,0px)');
  },

  contentBinding: 'ScNpr.storyBrowserController*activeController.arrangedObjects',

  contentObserver: function() {
    // if(this._rendered) return;
    var children = [], view;


    var stories = this.get('content');
    // console.log("stories = "+stories);
    if(!stories) return;

    var len = stories.length();
    console.log("len = "+len);
    if(!len) return;
    this._rendered = true;
    this.set('numObjects',len);

    var objectWidth = 1024;
    var _cv = this.get('contentView');


    view = _cv;
    var outerCV = this.get('containerView');
    this._layer = outerCV.get('layer');
    // console.log("view = "+view);
    // console.log("outerCV = "+outerCV);
    // console.log("outerCV.frame.y = "+outerCV.frame.y);
    outerCV.adjust('width',len * objectWidth);    
    this.clearContents();
    var v = null;
    for (var i = len - 1; i >= 0; i--){
      // console.log("stories.objectAt(i) = "+stories.objectAt(i));
      v = view.create({
        layout : {top:0,left:(i * objectWidth),bottom:0,width:objectWidth},
        classNames: 'story-in-detail'.w(),
        parentView: outerCV,
        owner: outerCV,
        isVisibleInWindow: true,
        page: outerCV.page
      });
      v.set('content',stories.objectAt(i));
      outerCV.appendChild(v);
      //        
      // outerCV.childViews.push(outerCV.createChildView(view, {
      //   layout : {top:0,left:(i * objectWidth),bottom:0,width:objectWidth},
      //   classNames: 'story-in-detail'.w(),
      //   content: stories.objectAt(i)
      // }));

      // console.log("outerCV.childViews = "+outerCV.childViews);
    }
  }.observes('*content.[]'),

  clearContents: function() {
    var cv = this.get('containerView');
    // console.log("cv = "+cv.get('childViews'));
    var images = this.$('img');
    var len = images.length;
    for (var i = images.length - 1; i >= 0; i--){
      console.log("Clearning images[i].src to "+images[i].src);
      //images[i].src = "";
    }
    cv.removeAllChildren();
  },

  _touchObject: null,
  _originalPoint: null,
  _state: 0,

   acceptsMultitouch: YES,

  numObjects: 2,
  objectWidth:1024,
  _numObjectsPerPage: 1,
  _dragCoefficient: 3,
  _movingThreshold: 10,

  _accumulatedDifference: SC.Point.create(),
  _originalLeft:0,
  _layer: null,

  storyIsVisibleObserver: function(){
    var val = ScNpr.storyController.get('storyIsVisible');
    this.$().css('z-index',(val)? '2' : '0');
  }.observes('storyIsVisible'),

  captureTouch: function(touch) {
    return YES;
  },

  touchStart: function(evt) {
    // console.log("touchStart");
    var cv = this.get('containerView');

    this._touchObject = evt;
    this._originalLeft = cv.get('layout').left;

    this._originalPoint = SC.Point.create({
      x:evt.pageX,
      y:evt.pageY
    });

    return YES;
  },

  _draggingMode: 0,
  slopeCutoff: 0.4,
  // slopeCutoffBinding: 'SproutFeeds.customizationController.slopeSlider',

  touchesDragged: function(evt,touches) {
    var differenceX = (evt.pageX - this._originalPoint.x);
    var differenceY = (evt.pageY - this._originalPoint.y);

    console.log("wrapper touchesDragged with differenceY = "+differenceY);

    var state = this._state;

    if(state === 0 && differenceX > 0){
      differenceX /= this._dragCoefficient;
    }
    else if(state === (this.numObjects-this._numObjectsPerPage) && differenceX < 0){
      differenceX /= this._dragCoefficient;
    }        
    this._accumulatedDifference.x += differenceX;
    this._accumulatedDifference.y += differenceY;

    var distance = Math.sqrt(Math.pow(this._accumulatedDifference.x,2)+Math.pow(this._accumulatedDifference.y,2));

    var slope = Math.abs(this._accumulatedDifference.y) / Math.abs(this._accumulatedDifference.x);

    // console.log("slope = "+slope);
    // console.log("slope = "+slope);
    // console.log("slopCutoff = "+this.get('slopeCutoff'));

    switch(this._draggingMode){
      case 0:
        if(distance > this._movingThreshold && slope >= this.get('slopeCutoff')){
          this._draggingMode = 1;

          console.log("releasing touch to scrollview");

          this._accumulatedDifference.x = 0;
          this._accumulatedDifference.y = 0;
          this._draggingMode = 0;
          console.log(touches.get('length'));
          touches.forEach(function(o){o.captureTouch(this, YES); },this);
        } else if(distance > this._movingThreshold && slope < this.get('slopeCutoff')){
          this._draggingMode = 2;
          this._layer.style.WebkitTransform = 'translate3d('+(this._curVal+differenceX)+'px,0px,0px)';  
          console.log("scrolling horizontally");
        }  
      break;
      case 2:
        this._layer.style.WebkitTransform = 'translate3d('+(this._curVal+differenceX)+'px,0px,0px)';  
      break;
    }

  },

  enableAnimations: function() {
      this._layer.style.WebkitTransition = '-webkit-transform 0.2s ease-out';
  },
  disableAnimations: function() {
      this._layer.style.WebkitTransition = '-webkit-transform 0.0s ease-out';
  },

  mouseDown: function(evt) {
    this.touchStart(evt);
  },

  mouseDragged: function(evt) {
    this.touchesDragged(evt);
  },

  mouseUp: function(evt) {
    this.touchEnd(evt);
  },

  _curVal:0,
  touchEnd: function(touch) {
    console.log("wrapper touchEnd");
    var diffX = this._accumulatedDifference.x,
        val  = 0;

    this._touchObject = null;

    var state = this._state;
    var multiplier = 1;
    var didMove = false,
        eligibleToMove = false;

    // Should I check if i can move?
    if(diffX < (-1 * this._movingThreshold)){
      eligibleToMove = true;
      multiplier = -1;
    }  
    else if(diffX > this._movingThreshold){
      eligibleToMove = true;
    }

    // How much should I move by?
    if(eligibleToMove){
      if(state === 0 && multiplier > 0){
        val = 0;
      }
      else if(state === (this.numObjects-this._numObjectsPerPage) && multiplier < 0){
        val = 0;
      }
      else{
        val = this.objectWidth;
        didMove = true;
      }  
    } else {
      touch.captureTouch(this, YES);
      if (touch.touchResponder && touch.touchResponder !== this) touch.touchResponder.tryToPerform("touchEnd", touch);
    }

    // If I moved, update state
    if(didMove){  
      if(diffX < -50){
        state++;
      }  
      else if(diffX > 50){
        state--;
      }
    }

    this._curVal += (multiplier * val);

    this._state = state;

    this._accumulatedDifference.x = 0;
    this._accumulatedDifference.y = 0;
    this._draggingMode = 0;
    this.enableAnimations();
    this._layer.style.WebkitTransform = 'translate3d('+this._curVal+'px,0px,0px)';
    this.invokeLater(this.disableAnimations,100);
  }
});