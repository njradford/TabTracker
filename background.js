var URLDATA;
var hitCount;


/**
 * todo:Switch the specification of URL matching to check more than the Root domain.
 */


/**
 * Runs whenever Chrome first starts or whenever the extension is reloaded.
 */
chrome.runtime.onInstalled.addListener(
    function () {

        console.log("Tab Tracker background page starting");
        chrome.storage.local.get("URLS", function (callback) {
            if (callback.URLS != null) {
                URLDATA = callback.URLS;
            } else {
                console.log("NO DATA FOUND");
            }
            chrome.browserAction.setBadgeBackgroundColor({color: "#000000"});
            calculateHits();
        })
    }
);

/**
 * Listens for any time when a tab is updated within in the Chrome instance
 */
chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {

        //Only register events that are completed
        if (changeInfo.status == "complete") {

            var currentURL = new URI(tab.url);

            currentURL = currentURL.host();

            console.log(currentURL);

            fetchSyncedURLS(function (data) {

                if (data != null) {

                    for (i = 0; i < data.length; i++) {

                        if (data[i].url == currentURL) {

                            data[i].hits++;

                            if (data[i].dates == null) {

                                data[i].dates = [Date.now()]

                            } else {

                                data[i].dates.push(Date.now());

                            }


                            URLDATA = data;
                            syncURLS();

                            calculateHits();

                        }
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
function getURI(inputUrl) {

    return new URI(inputUrl);
}


/**
 * urlObject container for information about user data related to a specific, blocked URL that they have
 * specified.
 * @param url
 */
function urlObject(url) {
    this.hits = 0;
    d = new Date();

    this.dates = [];


    this.startDate = d.valueOf();

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

    if (callback != null) {
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
    chrome.storage.local.set({"URLS": URLDATA}, function (callback) {
        console.log("SYNCED ");
        chrome.storage.local.get("URLS", function (callback) {
            URLDATA == callback.URLS;
            calculateHits();
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

    chrome.storage.local.get("URLS", function (data) {

        URLDATA = data.URLS;

        callback(data.URLS);

    })
}

/**
 * List tracked URLS
 */
function listURLS() {

    fetchSyncedURLS(
        function (URLS) {
            for (i = 0; i < URLS.length; i++) {
                console.log(URLS[i]);
            }
        }
    )
}

function buildHitData(URL, callback) {


    return fetchSyncedURLS(function (data) {

        var sortedHits;
        var hits;
        contains = false;

        /**
         * Fetches the current URL's data from the cloud storage
         */
        for (i = 0; i < data.length; i++) {
            if (data[i].url == URL) {
                hits = data[i].dates;
                contains = true;
                break;
            }
        }

        if (!contains) {
            return null;
        }

        comparator = new Date(hits[0]);
        comparatorHitCount = 1;

        /**
         * Strip all time data less than hour
         */

        comparator.setMinutes(00, 00, 00);


        /**
         * Builds an array of blank hours to avoid scaling the browsing history in the graph
         */


        var between = [];

        var date1 = new Date(hits[0]);
        date1.setMinutes(00, 00, 00);


        var date2 = new Date(hits[hits.length - 1]);

        date2.setMinutes(00, 00, 00);

        while (date1.valueOf() < date2.valueOf()) {

            date1.setHours(date1.getHours() + 1);
            between.push(new Date(date1.valueOf()));
        }




        /**
         * Group hit data into hours
         */
        for (i = 1; i < hits.length; i++) {

            current = new Date(hits[i]);

            current.setMinutes(00, 00, 00);


            if (current.getTime() == comparator.getTime()) {
                comparatorHitCount++;
            } else {

                bucket = {};


                bucket.hits = comparatorHitCount;
                bucket.date = comparator;
                comparatorHitCount = 1;

                comparator = current;

                if (sortedHits == null) {

                    sortedHits = [bucket];

                } else {

                    sortedHits.push(bucket);
                }
            }

        }

        bucket = {};


        bucket.hits = comparatorHitCount;
        bucket.date = comparator;

        if (sortedHits == null) {

            sortedHits = [bucket];

        } else {

            sortedHits.push(bucket);
        }


        /**
         * Weave together the blank and sorted legitimate data
         */


        finalData = [sortedHits[0]];

        j = 1;

        for (i = 0; i < between.length; i++) {

            if (between[i].valueOf() == sortedHits[j].date.valueOf()) {

                finalData.push(sortedHits[j]);

                j++;

            } else {

                bucket = {};

                bucket.hits = 0;
                bucket.date = between[i];

                finalData.push(bucket);

            }

        }


        lastDate = finalData[finalData.length-1].date;

        currentDate = new Date();

        currentDate.setMinutes(0,0,0);

        if( !(currentDate.getTime() == lastDate.getTime()) ) {


            bucket = {};

            bucket.hits = 0;
            bucket.date = currentDate;
            finalData.push(bucket);

        }

        callback(finalData);
    })

}
/**
 * Accepts a specific URL and resets it's counter
 * @param URL
 */
function resetURL(URL) {

    fetchSyncedURLS(function (data) {

        for (i = 0; i < data.length; i++) {
            if (data[i].url == URL) {
                data[1].hits = 0;
                data[1].startDate = new Date().valueOf();
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

    fetchSyncedURLS(function (data) {

        for (i = 0; i < data.length; i++) {
        if (data[i].url == URL) {
            data.splice(i, 1);
            URLDATA = data;
            syncURLS();
            calculateHits()
        }
    }
})
}


/**
 * Flushes all of the current URLS from the local and cloud storage
 *
 */
function resetURLS() {

    URLDATA = null;
    chrome.storage.local.remove("URLS");
    calculateHits();

}


/**
 * Iterates over the hit counts for all tracked URLS and updates the badge view
 * for the browser action.
 */
function calculateHits() {

    hitCount = 0;

    if (URLDATA != null) {

        for (i = 0; i < URLDATA.length; i++) {
            hitCount += URLDATA[i].hits;
        }

    }

    chrome.browserAction.setBadgeText({text: hitCount.toString()});


    if (false ) {

        chrome.notifications.create("Tab Tracker", {

            type: "basic",
            iconUrl: "notification.png",
            title: "Friendly Reminder",
            message: "You've visited a blocked site " + hitCount.toString() + " times."


        }, function () {
            console.log("Notification Created")
        });

    }
}

function simulateData() {

    var sampleURL = new urlObject("www.reddit.com");
    var startDate = new Date(1422750343000);
    var current = new Date();

    sampleURL.startDate = startDate.valueOf();

    startDate.setMinutes(00 , 00 , 00);
    current.setMinutes( 00 , 00 , 00);

    while (startDate.valueOf() != current.valueOf()) {
        startDate.setMinutes( startDate.getMinutes() + 1);

        if(Math.random() > .97) {
            sampleURL.dates.push(startDate.valueOf());
        }
    }

    sampleURL.hits = sampleURL.dates.length;
    URLDATA.push(sampleURL);
    console.log(sampleURL);

    syncURLS();
}

/**
 * Exclude the protocol from the String URL
 * @param url
 */
function checkIfTracking(url, callback){

    fetchSyncedURLS(function (d) {
        tracking = false;

        if (d != null) {

            for (i = 0; i < d.length; i++) {

                if (url == d[i].url) {

                    tracking = true;
                    break;
                }
            }
        }

        callback(tracking);

    })

}







