// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Called when the user clicks on the browser action.
previousURL=" ";
visitCount =0;
variable="hello from background";

var values;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    //console.log(changeInfo.status);
    if (changeInfo.status == 'complete') {
        processTab(tab);
    }
});

function processTab(tab){
    tabUrl = tab.url

}

function parseInput(value){
    console.log(value);
    chrome.storage.sync.get('URLS', function(callback){
        //CHECK IF POSITION IS EMPTY IN LOCAL STORAGE AND SET.
        if(callback.URLS==null){
            console.log("Adding new url @ "+value);
            urls = [value];
            chrome.storage.sync.set({'URLS':urls},function(data){});
        } else{
            console.log(callback.URLS.length);
            array = callback.URLS;
            array.push(value);
            console.log(array);
            chrome.storage.sync.set({'URLS':array},function(data){});
        }
    });
}

function fetchURLS(){
    chrome.storage.sync.get('URLS', function(callback){
        values=callback.URLS;
    });

    return values;
}

function removeURL(){
    //TODO: THIS WILL REMOVE A SPECIFIC ELEMENT FROM THE URL ARRAY.
}

//PORT TESTING







