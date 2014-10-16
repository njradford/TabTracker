/**
 * Created by nicholas on 10/13/14.
 */


var myData = [];
var myURL;



myData.push(new urlObject());


chrome.storage.sync.set({"test": myData}, function(callback){

    chrome.storage.sync.get("test", function(callback){

        myURL = callback.test[0];
        myURL.incrementHit();
        console.log(myURL.hits);
    });

});

function urlObject() { // constructor function
    // properties not initialized to meaningful value
    this.nickMame = "FB";
    this.hits = 0;
    this.url = "www.facebook.com";
}

urlObject.prototype.incrementHit = function(){
    this.hits = this.hits++;
};