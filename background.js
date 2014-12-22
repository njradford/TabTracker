/**
 *
 * todo: Change date setting functions to be relative to the local time, rather than the global time
 *
 */


var URLDATA;

var sessionDict = {};

var hitCount;





/**
 * Runs whenever Chrome first starts or whenever the extension is reloaded.
 */
chrome.runtime.onInstalled.addListener(
    function () {

        console.log("Tab Tracker background page starting");
        chrome.storage.sync.get("URLS", function (callback) {
            console.log(callback.URLS);
            if (callback.URLS != null) {
                URLDATA = callback.URLS;
            } else {
                console.log("NO CLOUD DATA FOUND");
            }
            chrome.browserAction.setBadgeBackgroundColor({color:"#000000"});
            calculateHits();
        })
    }
);

/**
 * Listens for any time when a tab is updated within in the Chrome instance
 */
chrome.tabs.onUpdated.addListener(

    function(tabId, changeInfo, tab) {

        //Only register events that are completed
        if(changeInfo.status == "complete") {

            currentURL = regex(tab.url);    

            fetchSyncedURLS(function(data){

                for (i = 0; i < data.length; i++) {

                    if(data[i].url == currentURL) {
                        data[i].hits++;

                        URLDATA = data;
                        syncURLS();

                        calculateHits();

                    }
                }
            })
        }
    }
);


/**
 * Pulls the root domain and prefix from a URL and returns it
 * @param inputUrl
 * @returns {*}
 */
function regex(inputUrl) {

    var txt = inputUrl;

    var re1 = '.*?';	// Non-greedy match on filler
    var re2 = '((?:[a-z][a-z\\.\\d_]+)\\.(?:[a-z\\d]{3}))(?![\\w\\.])';	// File Name 1

    var p = new RegExp(re1 + re2, ["i"]);
    var m = p.exec(txt);

    if (m != null) {

        return m[1];
    }
}


/**
 * urlObject container for information about user data related to a specific, blocked URL that they have
 * specified.
 * @param url
 */
function urlObject(url) {
    this.hits = 0;
    d = new Date();

    this.dates = {};


    this.startDate = d.getUTCMonth()+"/"+d.getUTCDate()+"/"+d.getUTCFullYear();

    if (url != null) {
        this.url = url;
    } else {
        this.url = "www.facebook.com";

    }
}


/**
 * Adds the URL to the list of URLS that are actively being tracked by the
 * application.
 * @param url
 * @param callback, Function to be fired after the new URL object is created
 *                  used by the options menu to display a new card using the
 *                  newly created URL object without reload.
 *
 */
function addURL(url, callback) {
    //CHECK IF URL IS ALREADY INCLUDED
    //IF NOT, INCLUDE IT IN THE URL
    var URL_OBJ = new urlObject(url);

    if(callback != null) {
        callback(URL_OBJ);

    }

    if (URLDATA != null) {
        console.log("Adding new object to URLDATA");
        URLDATA.push(URL_OBJ);
    } else {
        console.log("Creating a new URLDATA array");
        URLDATA = [URL_OBJ];
    }
    syncURLS();
}

/**
 * Returns whether the app is currently tracking a given URL
 *
 * @param url
 */
function checkIfTracking(URL) {

}

/**
 * Pushes the local URL data to the server
 * @param localURLS
 */
function syncURLS() {
    console.log("SYNCING DATA. . . ");
    chrome.storage.sync.set({"URLS": URLDATA}, function (callback) {
        console.log("SYNCED ");
        chrome.storage.sync.get("URLS", function (callback) {
            console.log(callback.URLS);
        })
    })
}


/**
 * Pulls synced URLS from the server. To use inside of the
 * options page, the page passes through the field that it
 * wants the updated values to be assigned to.
 *
 * @param callback
 */
function fetchSyncedURLS(callback) {

    chrome.storage.sync.get("URLS", function (data) {
        callback(data.URLS);
        URLDATA = data.URLS;
    })
}

/**
 * List tracked URLS
 */
function listURLS() {


    fetchSyncedURLS(
        function(URLS){
            for(i = 0; i < URLS.length; i++) {
                console.log(URLS[i]);
            }
        }
    )

}
/**
 * Accepts a specific URL and resets it's counter
 * @param URL
 */
function resetURL(URL) {

    fetchSyncedURLS(function(data){

        for( i = 0; i < data.length; i++ ) {
            if( data[i].url == URL){
                data[1].hits  = 0;
                URLDATA = data;
                syncURLS();
            }
        }
    })
}

/**
 * Accepts a specific URL and removes it from the database of tracked URLS
 * @param URL
 */
function removeURL(URL) {

    fetchSyncedURLS(function(data){

        for( i = 0; i < data.length; i++ ) {
            if( data[i].url == URL){
                data.splice(i, 1);
                URLDATA = data;
                syncURLS();
            }
        }
    })
}


/**
 * Flushes all of the current URLS from the local and cloud storage
 *
 */
function flushURLS() {

    URLDATA = null;
    chrome.storage.sync.remove("URLS");
    calculateHits();

}


/**
 * Iterates over the hit counts for all tracked URLS and updates the badge view
 * for the browser action.
 */
function calculateHits(){

    hitCount = 0;

    if(URLDATA != null) {

        for( i = 0; i < URLDATA.length; i++ ) {
            hitCount += URLDATA[i].hits;
        }

    }

    chrome.browserAction.setBadgeText({text:hitCount.toString()});


    if(hitCount+1>6) {

        chrome.notifications.create("Tab Tracker", {

            type:"basic", iconUrl:"notification.png", title:"Friendly Reminder", message:"You've visited a blocked site "+hitCount.toString()+" times."


        }, function(){
            console.log("Notification Created")
        });

    }
}





