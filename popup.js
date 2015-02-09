chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {

    currentURL = chrome.extension.getBackgroundPage().getURI(tabs[0].url);

    protocol = currentURL.protocol();
    console.log(protocol);

    if (protocol.indexOf("http") === 0) {


        chrome.extension.getBackgroundPage().checkIfTracking(currentURL.host(), function(t){

            if (t) {
                $("#question").html("Already Tracking");
                $("#hero").html(currentURL.host());
                $("button#track").hide();
            } else {
                $("#question").html("Start Tracking");
                $("#hero").html(currentURL.host() + "?");
            }

        });


    } else {
        $("#question").html("Cannot Track Current Site");
        $("#hero").html(currentURL);
        $("#track").hide();

        z
    }


});

$(document).ready(function () {

    $("button#track").click(function () {

        $(this).fadeOut(500);
        chrome.extension.getBackgroundPage().addURL(currentURL.host());
        $("#question").html("Now Tracking . . . ");
        $("#hero").html(currentURL);

    });

    $("button#options").click(function () {

        chrome.tabs.create({url: "/Options_Page/options_new.html"});
    })


});