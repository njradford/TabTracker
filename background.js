/**
 * Aldous
 * ♫ "Electra Heart" - Marina and the Diamonds
 */


var URLDATA = [];

URLDATA[0] = new urlObject;
URLDATA[1] = new urlObject;
URLDATA[2] = new urlObject;

chrome.storage.sync.set({"URLS":URLDATA}, function(callback){

});

//URL DATA CONTAINER
function urlObject(){
    this.hits = 0;
    this.url = "www.facebook.com";
    this.startDate= "10/10/10";
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

function initial(callback){
     chrome.storage.sync.get("URLS",function(data){
        //console.log(data.URLS);
        callback(data.URLS);
     })

}

function returnTest(){
    return 5;
}

