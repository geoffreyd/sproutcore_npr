// ==========================================================================
// Project:   ScNpr.stationController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr MX */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
ScNpr.stationController = SC.ArrayController.create(
/** @scope ScNpr.stationController.prototype */ {

  // TODO: Add your own code here.
  query: '',
  latitude: 0,
  longitude: 0,
  
  runSearch: function() {
    var val = this.get('query');      
    var opts = {
      'basePath': 'list.story',
      'uri': '/npr/stations?callLetters='+val+'&apiKey=MDA1MDU4NjgxMDEyNzA4NjE0NDNkOTE2Mg001'
    };
    var q = SC.Query.local(ScNpr.Station, { params: opts });
    var entries = ScNpr.store.find(q);   
    this.set('content',entries);
  }.observes('query'),
  
  getLocation: function() {
    console.log("getting location");
    var cont = this;
  //  navigator.geolocation.getCurrentPosition(function(pos){
      // var lat = pos.coords.latitude;
      // var lon = pos.coords.longitude;
      var lat = 42.29;
      var lon = -83.72;
      
    //  var val = this.get('query');      
      var opts = {
        'basePath': 'stations.station',
        'uri': '/npr/stations?lat='+lat+'&lon='+lon+'&apiKey=MDA1MDU4NjgxMDEyNzA4NjE0NDNkOTE2Mg001',
        'preProcess': function(response){
          var json = MX.XML.ToJSON(response.get('rawRequest').responseXML);
          return json;
          
        },
        'postProcess': function(obj){
          obj.id = obj.$attribute.id;
          console.log(obj);
          return obj;
          
        }
      };
      var q = SC.Query.local(ScNpr.Station, { params: opts });
      var entries = ScNpr.store.find(q);   
      cont.set('content',entries);
  //  });
  },
  
  playSelectedStation: function() {
    console.log("called");
    var obj = this.get('selection');
    if(obj) obj = obj.firstObject();
    else return;
    var audioURL = '';
    var url = obj.get('url');
    for (var i = url.length - 1; i >= 0; i--){
      if(url[i].$attribute.typeId === "7"){
        audioURL = url[i].$value;
      }
    }
    console.log("audioURL = "+audioURL);
    ScNpr.nowPlayingController.set('title',obj.get('callLetters').$value);
    ScNpr.nowPlayingController.set('storyAudioURL',audioURL);
    ScNpr.nowPlayingController.startPlaying();
  },
  
  
  showPopover: function(view) {
    console.log("view = "+view);
    var pane = SC.PickerPane.create({
      layout: { width: 300, height: 500 },
      contentView: SC.View.extend({
        layout: { top: 0, left: 0, bottom: 0, right: 0 },
        childViews: 'segmented list action'.w(),
        
        segmented: SC.SegmentedView.design({
          layout: {top:5,right:0,left:0,height:30},
          layoutDirection: SC.LAYOUT_HORIZONTAL,
          allowsMultipleSelection: NO,
          allowsEmptySelection: NO,
          items: [{title: 'Nearby',value: 'nearby'},{title: 'Search',value: 'search'}],
          itemTitleKey: 'title',
          itemValueKey: 'value'
        }),
        
        list: SC.ScrollView.design({
          layout: {top:40,right:0,bottom:30,left:0},
          contentView: SC.ListView.design({
            layout: {top:40,right:0,bottom:30,left:0},
            contentBinding: 'ScNpr.stationController.arrangedObjects',
            selectionBinding: 'ScNpr.stationController.selection',
            rowHeight:40,
            rowSpacing:1,
            actOnSelect: YES,
            action: 'playSelectedStation',
            target: 'ScNpr.stationController',
          
            exampleView: SC.View.extend({

              classNames: ['station-info'],

              displayProperties: 'name description age'.w(),

              render: function(context, firstTime) {
                var name = '';
                var city = '';
                var freq = '';
                var content = this.get('content');

                // debugger;
                if (content !== null)
                {
                  name = content.get('callLetters');
                  freq = content.get('frequency');
                  city = content.get('marketCity');
                }
                context = context.begin('div').addClass('station-name').push(name.$value).end();
                context = context.begin('div').addClass('station-city').push(city.$value).end();
                context = context.begin('div').addClass('station-freq').push(freq.$value).end();

                sc_super();
              }

            })
          })
        }),
        
        action: SC.ButtonView.design({
          layout: {right:0,bottom:0,left:0,height:22},
          title: 'Locate',
          action: 'getLocation',
          target: 'ScNpr.stationController'
        })
      })
    });
    pane.popup(view, SC.PICKER_POINTER, [2, 3, 0, 1, 2]);
  }
}) ;
