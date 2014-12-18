/**
 * Aldous
 * ♫ "Electra Heart" - Marina and the Diamonds
 *
 * todo: Fix blocking issue that causes background page to go to sleep and take vital logic for the options page with it
 * todo: Create dynamic counter in the Chrome browser action button to show the total tally of site visits
 *
 *
 */


var URLDATA;

var sessionDict = {};


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
        })
    }
)

/**
 * Listens for any time when a tab is updated within in the Chrome instance
 */
chrome.tabs.onUpdated.addListener(

    function(tabId, changeInfo, tab) {

        //Only register events that are completed
        if(changeInfo.status == "complete") {

            console.log(regexTest(tab.url)+" has completed loading. . .");
        }
    }
)


/**
 * Pulls the root domain and prefix from a URL and returns it
 * @param inputUrl
 * @returns {*}
 */
function regexTest(inputUrl) {

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
    this.startDate = "10/10/10";

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
    callback(URL_OBJ);

    if (URLDATA != null) {
        console.log("Adding new object to URLDATA");
        URLDATA.push(URL_OBJ);
    } else {
        console.log("Creating a new URLDATA array");
        URLDATA = [URL_OBJ];
    }

    syncUrls(URLDATA);
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
function syncUrls(localURLS) {
    console.log("SYNCING DATA. . . ");
    chrome.storage.sync.set({"URLS": URL_array}, function (callback) {
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
        //console.log(data.URLS);
        callback(data.URLS);
        URLDATA = data.URLS;
    })

}



