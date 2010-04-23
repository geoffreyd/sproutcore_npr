// ==========================================================================
// Project:   ScNpr.playlistController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
ScNpr.playlistController = SC.ArrayController.create(
/** @scope ScNpr.playlistController.prototype */ {

  // TODO: Add your own code here.
	isPlayingThroughAPlaylist: NO,
	currentIndex: -1,
	
	playSelectedQueueItem: function() {
		this.set('isPlayingThroughAPlaylist',true);
	},
	
	playNext: function() {
		var content = this.get('arrangedObjects');
		if(!content || content.length() === 0) return;
		
		var len 		= content.length();
		var idx = this.get('currentIndex');
		
		if(idx < content.length()-1){
			ScNpr.nowPlayingController.playObject(content.objectAtIndex(++idx));
		}
		
		this.set('currentIndex',idx);
	},
	
	currentSongHasEnded: function() {
		var content = this.get('arrangedObjects');
		if(!content || content.length() === 0) return;
		this.playNext();
	},
	
	addStoryToPlaylist: function(obj) {
		obj.set('indexInPlaylist',this.get('currentIndex')+1);
		var content = this.get('arrangedObjects');
		if(content) content = content.toArray();
		content = content.concat(obj);
		this.set('content',content);

	},
	
	playSelectedItem: function(view) {
		var obj;
		console.log("playSelectedItem");
		
		if(view.kindOf(SC.Record)){
			obj = view;
		} else {
			obj = this.get('selection');
			if(obj) obj = obj.firstObject();
			else return;
		}
		
		ScNpr.nowPlayingController.playObject(obj,true);
		this.set('currentIndex',obj.get('indexInPlaylist'));
	},
	
	
	showPlaylist: function(view) {

    var pane = SC.PickerPane.create({
      layout: { width: 300, height: 400 },
       theme: "popover",
      contentView: SC.View.extend({
        layout: { top: 0, left: 0, bottom: 0, right: 0 },
				childViews: 'title list'.w(),
				
				title: SC.LabelView.design({
				  layout: {top:5,right:0,left:0,height:15},
				  value: 'Playlist',
					layerId: 'playlist-header',
					textAlign: SC.ALIGN_CENTER
				}),
				
				list: SC.ScrollView.design({
				  layout: {top:25,right:0,bottom:0,left:0},
				  contentView: SC.ListView.design({
					  layout: {top:0,right:0,bottom:0,left:0},
					  contentBinding: 'ScNpr.playlistController.arrangedObjects',
					  selectionBinding: 'ScNpr.playlistController.selection',
						rowHeight:40,
						rowSpacing:1,
						// actOnSelect: YES,
						action: 'playSelectedItem',
						target: 'ScNpr.playlistController',
						contentValueKey: 'title',
						exampleView: SC.View.extend({
						
						  classNames: ['station-info'],
						
						  displayProperties: 'title'.w(),
						
						  render: function(context, firstTime) {
						    var title = '';
						    var content = this.get('content');
						
						    if (content !== null)
						    {
						      title = content.get('title');
						    }
						    context = context.begin('div').addClass('playlist-title').push(title).end();
						
						    sc_super();
						  },
						
							touchStart: function() {
								return YES;
							},
							
							click: function() {
								ScNpr.playlistController.playSelectedItem(this.get('content'));
							},
							
							
							touchEnd: function() {
								ScNpr.playlistController.playSelectedItem(this.get('content'));
							}
							
						})
					})
				})
      })
    });
    pane.popup(view, SC.PICKER_POINTER, [2, 3, 0, 1, 2]);		
	}
	
}) ;
