// ==========================================================================
// Project:   ScNpr - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

// This page describes the main user interface for your application.  
ScNpr.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'topbar story currentlyPlaying storyBrowser bottomToolbar'.w(),
    
    topbar: SC.View.design({
      layout: { height: 45, left:0, top:0, right:0 },
      layerId: "npr-topbar",
      childViews: 'logo home homeActive topics settings'.w(),
      
      logo: SC.View.design({
        layout: {top:10,left:15,height:24,width:72},
        layerId: 'logo'
      }),
      
      home: SC.ButtonView.design({
        layout: {top:7,left:116,height:30,width:77},
        isVisible: SC.Binding.not('ScNpr.storyController.storyIsVisible'),
        title: '',
        action: 'toggleStoryMode',
        target: 'ScNpr.storyController',
        theme: 'ScNpr',
        layerId: 'home'
      }),
      
      homeActive: SC.ButtonView.design({
        layout: {top:7,left:116,height:30,width:77},
        isVisibleBinding: 'ScNpr.storyController.storyIsVisible',
        title: '',
        action: 'toggleStoryMode',
        target: 'ScNpr.storyController',
        theme: 'ScNpr',
        layerId: 'home-active'
      }),
      
      topics: SC.ButtonView.design({
        layout: {top:7,right:80,height:31,width:77},
        title: '',
        action: 'showTopics',
        target: 'ScNpr.navigationController',
        theme: 'ScNpr',
        layerId: 'topics'
      }),
      
      settings: SC.ButtonView.design({
        layout: {top:7,right:20,height:31,width:47},
        title: '',
        action: 'showSettings',
        target: 'ScNpr.navigationController',
        theme: 'ScNpr',
        layerId: 'settings'
      })
      
    }),
    
    story: ScNpr.PageView.design({
      layout: {top:45,right:0,bottom:71,left:0},
      layerId: 'story-detail',

      storyIsVisibleBinding: 'ScNpr.storyController.storyIsVisible',

      contentView: SC.View.extend({
        childViews: 'image imageCaption storyActions storyScroller'.w(),

        image: SC.View.design({
          layout: {left:124,top:24,width:380,height:285},
          childViews: 'imageView'.w(),
          imageView: SC.ImageView.design({
            classNames: 'story-image'.w(),
            valueBinding: '*owner.owner.content.bigImage'
          })
        }),
        imageCaption: SC.LabelView.design({
          layout: {top:320,left:125,height:60,width:380},
          classNames: 'image-caption'.w(),
          valueBinding: '*owner.content.imageCaption'
        }),
        storyActions: SC.View.design({
          layout: {top:400,left:205,height:43,width:299},
          classNames: 'story-actions'.w(),
          childViews: 'toggleAudio'.w(),
          isVisibleBinding: '*owner.content.storyHasAudio',

          toggleAudio: SC.View.design({
            layout: {top:0,left:0, width:150,height:40},
            classNames: 'play-audio'.w(),
            value: '',
            valueBinding: '*owner.owner.content',

            click: function  (evt) {
              // console.log("this = "+this);
              // console.log("this.get('value') = "+this.get('value'));
              ScNpr.nowPlayingController.playObject(this.get('value'),true);
            },        
            touchStart: function(evt) {
              return YES;
            },

            touchEnd: function(evt) {
              this.click(evt);
              return YES;
            }

          })
        }),

        storyScroller: SC.ScrollView.design({
          layout: {top:0,left:522,bottom:0,right:0},
          classNames: 'story-scroller'.w(),

          contentView: ScNpr.HTMLView.design({
            classNames: 'content-wrapper'.w(),
            htmlContentBinding: '*owner.owner.owner.content.storyBodyHTML'
          }),

          heightObserver: function(){
            var val = ScNpr.nowPlayingController.get('audioIsPlaying');
            console.log("val = "+val);
            var layout = this.get('layout');
            if(val){
              layout.bottom += 81;
            } else {
              layout.bottom -= 81;
            }
            this.adjust('bottom',(val)? 80:0);
            this.notifyPropertyChange('layout');
          }.observes('ScNpr.nowPlayingController.audioIsPlaying')
        })        
      })
    }),

    storyBrowser: SC.View.design({
      layout: {top:45,right:0,bottom:71,left:0},
      childViews: 'leftCategories rightArticles'.w(),
      layerId: 'workspace',

      leftCategories: SC.View.design({
        layout: {top:0,bottom:0,left:0,width:101},
        childViews: 'news arts music'.w(),
        layerId: 'leftCategories',

        news: SC.View.design({
          layout: {top:0,right:0,left:0,height:200},
          childViews: 'newsLabel'.w(),
          classNames:'newsLabel'.w(),
          newsLabel: SC.LabelView.design({
            layout: {top:20,right:10,height:100,width:65},
            textAlign: SC.ALIGN_RIGHT,
            value: 'news'
          })
        }),
        arts: SC.View.design({
          layout: {top:200,right:0,left:0,height:180},
          childViews: 'artsLabel'.w(),
          classNames:'artsLabel'.w(),
          artsLabel: SC.LabelView.design({
            layout: {top:20,right:10,height:100,width:50},
            textAlign: SC.ALIGN_RIGHT,
            value: 'arts & life'
          })
        }),
        music: SC.View.design({
          layout: {top:380,right:0,left:0,height:180},
          childViews: 'musicLabel'.w(),
          classNames:'musicLabel'.w(),
          musicLabel: SC.LabelView.design({
            layout: {top:20,right:10,height:100,width:77},
            textAlign: SC.ALIGN_RIGHT,
            value: 'music'
          })
        })
      }),

      rightArticles: SC.View.design({
        layout: {top:0,right:0,bottom:0,left:101},
        childViews: 'newsArticles artsArticles musicArticles'.w(),
        layerId: 'rightArticles',
        newsArticles: SC.ScrollView.design({
          classNames:'newsSection'.w(),
          layout: {top:7,right:0,left:10,height:190},
          alwaysBounceVertical: NO,
          contentView: ScNpr.ArticleListView.design({
            contentBinding: 'ScNpr.newsController.arrangedObjects',
            rowHeight: 179,
            columnWidth: 241
          })
        }),
        artsArticles: SC.ScrollView.design({
          classNames:'artsSection'.w(),
          layout: {top:207,right:0,left:10,height:170},
          alwaysBounceVertical: NO,
          contentView: ScNpr.ArticleListView.design({
            contentBinding: 'ScNpr.artsController.arrangedObjects',
            rowHeight: 160,
            columnWidth: 316
          })
        }),
        musicArticles: SC.ScrollView.design({
          classNames:'musicSection'.w(),
          layout: {top:387,right:0,left:10,height:170},
          alwaysBounceVertical: NO,
          contentView: ScNpr.ArticleListView.design({
            contentBinding: 'ScNpr.musicController.arrangedObjects',
            rowHeight: 160,
            columnWidth: 316
          })
        })
      })
    }),

    currentlyPlaying: SC.View.design({
      layout: {right:0,bottom:0,left:0,height:75},
      childViews: 'nowPlayingLabel nowPlayingTitle stopPlaying'.w(),
      classNames: 'now-playing'.w(),
      nowPlayingLabel: SC.LabelView.design({
        layout: {top:11,left:200,height:17,width:170},
        classNames: 'now-playing-label'.w(),
        value: 'Now Playing'
      }), 
      nowPlayingTitle: SC.LabelView.design({
        layout: {top:30,left:200,height:40,width:207},
        classNames: 'now-playing-title'.w(),
        valueBinding: 'ScNpr.nowPlayingController.audioTitle'
      }), 

      stopPlaying: SC.View.design({
        layout: {top:16,left:488,height:46,width:47},
        classNames: 'stop-playing'.w(),

        touchStart: function(evt) {
          return YES;
        },

        touchEnd: function(evt) {
          console.log('here');
          this.click(evt);
          return YES;
        },


        click: function(evt) {
          ScNpr.nowPlayingController.stopPlaying();
        }          
      }),        
      storyAudioIsPlayingObserver: function(){
        var val = ScNpr.nowPlayingController.get('audioIsPlaying');
        console.log("val = "+val);
        if(val){
          this.get('layer').style.WebkitTransform = 'translate3d(0px,-71px,0px)';
        } else {
          this.get('layer').style.WebkitTransform = 'translate3d(0px,1px,0px)';
        }
      }.observes('ScNpr.nowPlayingController.audioIsPlaying')
    }),

    bottomToolbar: SC.View.design({
      layout: {right:0,bottom:0,left:0,height:72},
      childViews: 'listenLabel listenBox adBox'.w(),
      layerId: 'bottomToolbar',

      listenLabel: SC.LabelView.design({
        layout: {top:31,left:146,height:30,width:80},
        layerId: 'listenLabel',
        value: 'Listen'
      }),
      listenBox: SC.View.design({
        layout: {top:20,left:220,height:43,width:347},
        layerId: 'listen-box',
        childViews: 'playlist programs stations'.w(),
        playlist: SC.ButtonView.design({
          layout: {top:4,left:7,height:32,width:109},
          action: 'showPlaylist',
          target: 'ScNpr.playlistController',
          theme:  'ScNpr',
          layerId: 'playlist-button'
        }),
        programs: SC.ButtonView.design({
          layout: {top:4,left:119,height:32,width:109},
          action: 'showPrograms',
          target: 'ScNpr.programController',
          theme:  'ScNpr',
          layerId: 'blank-button'
        }),
        stations: SC.ButtonView.design({
          layout: {top:4,left:233,height:32,width:109},
          action: 'showPopover',
          target: 'ScNpr.stationController',
          theme:  'ScNpr',
          layerId: 'red-button'
        })
      }),
      adBox: SC.View.design({
        layout: {top:25,right:50,bottom:25,width:200},
        childViews: 'label image'.w(),
        label: SC.LabelView.design({
          layout: {top:0,bottom:0,left:0,right:35},
          textAlign: SC.ALIGN_RIGHT,
          value: 'Support provided by'
        }),
        image: SC.ImageView.design({
          layout: {top:0,bottom:0,right:0,width:30},
          value: sc_static('ad.png')
        })
      })
    })
    
  })
});
