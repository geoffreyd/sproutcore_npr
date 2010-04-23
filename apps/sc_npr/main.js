// ==========================================================================
// Project:   ScNpr
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals ScNpr */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
ScNpr.main = function main() {

  // Step 1: Instantiate Your Views
  ScNpr.getPath('mainPage.mainPane').append() ;

  var url_options = '&fields=title,teaser,storyDate,byline,audio,image,textWithHtml&requiredAssets=image,text&sort=dateDesc&output=JSON&apiKey=MDA1MDU4NjgxMDEyNzA4NjE0NDNkOTE2Mg001',
      opts, q, entries ;

  opts = {
    'basePath': 'list.story',
    'uri': '/npr_api/query?id=1003,1004%@'.fmt(url_options)
  } ;
  
  q = SC.Query.local(ScNpr.NewsStory, { params: opts }) ;
  entries = ScNpr.store.find(q) ;
  ScNpr.newsController.set('content', entries) ;
  
  opts = {
    'basePath': 'list.story',
    'uri': '/npr_api/query?id=1008%@'.fmt(url_options)
  };
  q = SC.Query.local(ScNpr.ArtsStory, { params: opts });
  entries = ScNpr.store.find(q);   
  ScNpr.artsController.set('content',entries);
  
  opts = {
    'basePath': 'list.story',
    'uri': '/npr_api/query?id=1106%@'.fmt(url_options)
  };
  q = SC.Query.local(ScNpr.MusicStory, { params: opts });
  entries = ScNpr.store.find(q);   
  ScNpr.musicController.set('content',entries);

} ;

function main() { ScNpr.main(); }
