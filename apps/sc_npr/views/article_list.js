// ==========================================================================
// Project:   ScNpr.ArticleListView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
ScNpr.ArticleListView = SC.View.extend(
/** @scope ScNpr.ArticleListView.prototype */ {

  itemPadding: 10,
  _alreadyRendered: false,
  
  contentObserver: function(){
    if(this._alreadyRendered) return;
    var content = this.get('content');
    var len = content.length();
    var height = this.get('rowHeight');
    var width = this.get('columnWidth');
    var itemPadding = this.get('itemPadding');
  
    for (var i=0; i < len; i++) {
      
      var view = ScNpr.ArticleListItemView.create({
        content:content.objectAt(i),
        layout: {
          height: height, 
          width: width, 
          top: 0, 
          left: width * i + ((((i === 0 )? 0 : i )) * itemPadding)
        }
      });
      
      this.appendChild(view);
    }

    var frame = this.get('frame');
    frame.width = len * width;
    this.adjust('width',len * width + ((len - 1) * itemPadding));
    if(i > 0) this._alreadyRendered = true;
  }.observes('*content.[]')

});
