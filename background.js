/**
 * Aldous
 * ♫ "Electra Heart" - Marina and the Diamonds
 */

var URLDATA;

chrome.runtime.onStartup.addListener(
    function(){
        console.log("WAKING UP!");
        chrome.storage.sync.get("URLS", function(callback){
            console.log(callback.URLS);
            if(callback.URLS !=null){
                URLDATA = callback.URLS;
            } else {
                console.log("NO CLOUD DATA FOUND");
            };
        });
    }
);




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

    if(URLDATA!=null){
        console.log("Adding new object to URLDATA");
        URLDATA.push(URL_OBJ);
    }else{
        console.log("Creating a new URLDATA array");
        URLDATA = [URL_OBJ];
    }

    syncUrls(URLDATA);
}

//RETURN WHETHER OF NOT THE URL IS PRESENT INSIDE THE DATA ARRAY
function checkIfTracking(url){

}

//UPDATE URLS. RETURNS THE UPDATED ARRAY
function syncUrls(URL_array){
    console.log("SYNCING DATA. . . ");
    chrome.storage.sync.set({"URLS":URL_array},function(callback){
        console.log("SYNCED ");
        chrome.storage.sync.get("URLS",function(callback){
            console.log(callback.URLS);
        })
    })
}

function initial(callback){
     chrome.storage.sync.get("URLS",function(data){
        //console.log(data.URLS);
        callback(data.URLS);
        URLDATA = data.URLS;
     })

}



