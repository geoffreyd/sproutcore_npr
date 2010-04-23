// ==========================================================================
// Project:   ScNpr.HTMLView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
ScNpr.HTMLView = SC.View.extend(SC.StaticLayout,
/** @scope ScNpr.HTMLView.prototype */ {
  useStaticLayout: YES,
  classNames: ['npr-html-view'],
  
  htmlContent: '',
  
  displayProperties: 'htmlContent'.w(),

  render: function(context, firstTime) {
    context.push(this.get('htmlContent'));
  }

});
