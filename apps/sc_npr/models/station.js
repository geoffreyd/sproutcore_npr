// ==========================================================================
// Project:   Npr.StationModel
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
ScNpr.Station = SC.Record.extend(
/** @scope Npr.StationModel.prototype */ {

  // TODO: Add your own code here.
  primaryKey: 'id',
  
  audioURL: function(){
    var c = this.readAttribute('url');
    for (var i = c.length - 1; i >= 0; i--){

    }
  }.property('audioURL').cacheable()
}) ;
