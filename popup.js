
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

    currentURL = chrome.extension.getBackgroundPage().regex(tabs[0].url);

    console.log(currentURL);
    if(currentURL != null) {

        chrome.extension.getBackgroundPage().fetchSyncedURLS(function(d){

            tracking = false;
            for ( i = 0; i < d.length; i++ ) {

                if(currentURL == d[i].url) {

                    tracking = true;
                    break;
                }
            }

            console.log(tracking);

            if ( tracking ) {

                $("#question").html("Already Tracking");
                $("#hero").html(currentURL);
                $("button#track").hide();

            } else {

                $("#question").html("Start Tracking");
                $("#hero").html(currentURL+"?");

            }


        })

    } else {
        $("#question").html("Cannot Track Current Site");
        $("#hero").html(currentURL);
        $("button#track").hide();

    }



});

$(document).ready(function(){

    $("button#track").click(function(){

        $(this).fadeOut(500);
        chrome.extension.getBackgroundPage().addURL(currentURL);
        $("#question").html("Now Tracking . . . ");
        $("#hero").html(currentURL);

    })

    $("button#options").click(function(){

        chrome.tabs.create({url: "/Options_Page/options_new.html"});
    })


})