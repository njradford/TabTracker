/**
 * Aldous
 * ♫ "Electra Heart" - Marina and the Diamonds
 */

var URLDATA = [];


chrome.storage.sync.get("URLS", function(callback){
    URLDATA = callback.URLS;
    console.log(URLDATA);
})

//URL DATA CONTAINER
function urlObject(url){
    this.hits = 0;
    this.startDate= "10/10/10";

    if(url!=null){
        this.url= url;
    }else{
        this.url = "www.facebook.com";

    }
}





//CALLED EVERY TIME A SITE IS VISITED
function siteVisited(url){
    //CHECK AGAINST ALL URLS

    //IF PRESENT. INCREMENT.

    //CHROME.SYNC.SET

    //SET URL DATA TO CALLBACK
}

//ADDS URL TO THE LIST OF URLS TO TRACK
function addURL(url, callback){
    //CHECK IF URL IS ALREADY INCLUDED


    //IF NOT, INCLUDE IT IN THE URL
    var URL_OBJ = new urlObject(url);
    callback(URL_OBJ);
    URLDATA.push(URL_OBJ);
    syncUrls(URLDATA);
}

//RETURN WHETHER OF NOT THE URL IS PRESENT INSIDE THE DATA ARRAY
function checkIfTracking(url){

}

//UPDATE URLS. RETURNS THE UPDATED ARRAY
function syncUrls(URL_array){
    chrome.storage.sync.set({"URLS":URL_array},function(callback){
        chrome.storage.sync.get("URLS",function(callback){
            console.log(callback.URLS);
        })
    })
}

function initial(callback){
     chrome.storage.sync.get("URLS",function(data){
        //console.log(data.URLS);
        callback(data.URLS);
     })

}



