/** @class    TODO: Describe Class      
  @extends SC.DataSource   
  @since SproutCore 1.0 
*/  
/*globals ScNpr */
 
ScNpr.NPRDataSource = SC.DataSource.extend( {    
 
  fetch: function(store, query) {
    var params = query.get('params');
    
    var urlParams = params.uri;

    SC.Request.getUrl(urlParams).json()
      .notify(this, 'didFetchTasks', store, query)
      .send();
    return YES;
  },  

 
  didFetchTasks: function(response, store, query) {
    if (SC.ok(response)) {
      var text = response.get('body'),
          parameters = query.get('params'),
          basePath = parameters.basePath,
          pathLength = 1,
          preProcess = parameters.preProcess,
          i;

      if(preProcess){
          text = preProcess(response);
      }

      if(parameters.basePath){
        basePath = parameters.basePath.split('.');
        pathLength = basePath.length;
      }

      for(i=0;i<pathLength;i++){
        text = text[basePath[i]];
      }
      
      var numObjects  = text.length;
      var postProcess = parameters.postProcess;
      if(postProcess){
        for(i=0;i<numObjects;i++){
           text[i] = postProcess(text[i]);
        }
      }
      
      store.loadRecords(query.get('recordType'), text);
      store.dataSourceDidFetchQuery(query);
 
    } else store.dataSourceDidErrorQuery(query, response);
  },
  
  requestDidError: function(r){
    var pane = SC.AlertPane.error("There has been an error with your request", 
      r.get('rawResponse').toString(), '', "OK", "Cancel", this);      
    return YES;
  },

  retrieveRecord: function(store, storeKey, id, params) {     
    var ret = [], url, r, action={},
        recordType = SC.Store.recordTypeFor(storeKey) ;
    id = recordType.idFor(storeKey);
    url='youtube/'+id;
    r = SC.Request.getUrl(url).set('isJSON', YES);
 
    r.notify(this, this.retrieveRecordDidComplete, 
        { store: store, storeKey: storeKey,id:id }
    ).send();
 
    this.cancelStoreKeys[storeKey]=[].push(r);
    return ret;
  }, 
  
  retrieveRecordDidComplete: function(r,params) {
    var response, results, storeKeys = [], hashes = [];
    response = r.response();
    if(response.kindOf ? response.kindOf(SC.Error) : false){
      this.requestDidError(r);
    }else{
      results = response.content;
      storeKeys.push(params.storeKey);
      params.store.dataSourceDidComplete(params.storeKey, results, params.id);
      this.cancelStoreKeys[params.storeKey]=null;    
      params.storeKeyArray.replace(0,0,storeKeys);
    }  
    return YES;
  },   
  
  createRecord: function(store, storeKey) {
    return NO;
  },
  updateRecord: function(store, storeKey, params) { 
    return NO;   
  },
  destroyRecord: function(store, storeKey) {
    return NO;
  },
  cancel: function(store, storeKeys) {     
    return NO;   
  }    
});