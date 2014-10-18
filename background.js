/**
 * Created by nicholas on 10/13/14.
 */


var URLDATA;


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
    this.startDate;
}



//CALLED EVERY TIME A SITE IS VISITED
function siteVisited(url){
    //CHECK AGAINST ALL URLS

    //IF PRESENT. INCREMENT.

    //CHROME.SYNC.SET

    //SET URL DATA TO CALLBACK
}

//ADDS URL TO THE LIST OF URLS TO TRACK
function addURL(url){
    //CHECK IF URL IS ALREADY INCLUDED

    //IF NOT, INCLUDE IT IN THE URL
}

//RETURN WHETHER OF NOT THE URL IS PRESENT INSIDE THE DATA ARRAY
function checkIfTracking(url){

}

//UPDATE URLS. RETURNS THE UPDATED ARRAY
function syncUrls(URL_array){
    chrome.storage.sync.set({"URLS":URL_array},function(callback){
        return callback.URLS;
    })

}

