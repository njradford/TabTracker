$(function(){

    $(".content").not("#addURL").css("display","none");


    /**
     * AJAX method to prevent form from resetting the page on submit
     */
    $("form").submit(function(e){
        e.preventDefault();
        var NEW_URL = $("#URLFORM").find("input").val();

        document.getElementById("URLFORM").reset();

        chrome.extension.getBackgroundPage().addURL(NEW_URL);

    });

    /**
     * Menu click handlers to set display of relevant menu items.
     */
    $("li").click(function(){
        $("li").animate({
            backgroundColor:'white',
            color:'#0097a7'
        },150);

        $(this).animate({
            backgroundColor:'#0097a7',
            color:'white'
        },150);
        $(".content").hide();
        button = $(this).text();
        switch(button) {
            case "Add URL":
                console.log("Add URL Clicked!");
                $("#addURL").show();
                break;
            case "Manage":
                console.log("Manage Clicked!");
                buildManagePage();
                $("#manage").show();
                break;
            case "Share":
                console.log("Share Clicked!");
                $("#share").show();
                break;
            case "About":
                console.log("About Clicked!");
                $("#about").show();
                break;
            case "Donate":
                console.log("Donate Clicked!");
                $("#donate").show();
                break;
            default:
                console.log(button);
        }
    });

    /**
     * JQuery Listeners for card items
     */
    $("#manage").on("click",".contentCardButton", function(){
        $(this).children().animate({
          color:"white"
          },100,function(){
              $(this).animate({
                  color:'#0097a7'
              },100);
          });
        $(this).animate({
            backgroundColor:'#0097a7',
            color:"white"
        },100,function(){
            $(this).animate({
                backgroundColor:'white',
                color:'#0097a7'
            },100);
        });

        cardURL = $(this).parent().parent().find("p.cardHeader").text();

        cardID = $(this).find("p").text();
        console.log("The button: "+cardID+". Has been clicked for URL: "+cardURL);
    })

});


/**
 * Constructs the URL cards used to display actively tracking URLS inside of the manage page.
 */
function buildManagePage() {

    var URLS;
    console.log("BUILDING MANAGE PAGE . . .");
    chrome.extension.getBackgroundPage().fetchSyncedURLS(function(data){
        URLS = data;
        $(".content#manage").empty();

        console.log(URLS);
        //BUILD THE DOM BASED ON DATA FROM THE DB
        if(URLS!=null) {
            URLS.forEach(function (entry) {
                console.log(entry.url);
                $(".content#manage").append(buildCard(entry));
            })

            $(".content#manage").append(purgeOption);

            $("#purgeOption").click(function(){

                purgeURLS()

            });

        } else if (URLS == null){
            $(".content#manage").append(
                '<div class = "contentCard" >'+
                    '<p class = "cardHeader" style="font-size:2vw;"><i>You haven\'t added any URLS to track.</i></p>'+
                '</div>'

            );
        }
    });


}


/**
 * Constructs a content card based on the provided URL object
 * @param URL_OBJECT
 * @returns {string}
 */
function buildCard(URL_OBJECT){
    var CONTENT_CARD =
    '<div class="contentCard" data-url="'+URL_OBJECT.url+'">' +
       '<p class="cardHeader">'+URL_OBJECT.url+'</p>'+
        '<div class="contentCardHits">'+URL_OBJECT.hits+' visits since '+URL_OBJECT.startDate+'</div>'+
        '<div class="contentCardMenu">'+
            '<div class="contentCardButton">'+
                '<p class="button" id="reset">Reset</p>'+
            '</div>'+
            '<div class="contentCardButton">'+
                '<p class="button" id="remove">Delete</p>'+
            '</div>'+
            '<div class="contentCardButton">'+
                '<p class="button" id="include">Include</p>'+
            '</div>'+
        '</div>'+
    '</div>';
    return CONTENT_CARD;
}


/**
 * Accepts a URL_OBJECT and adds a new object to the  manage page.
 * @param URL_OBJECT
 */
function addNewCard(URL_OBJECT){

    $(".content#manage").append(buildCard(URL_OBJECT));
}

var purgeOption =
    '<div class="contentCard" id="purgeOption">' +
        'Purge All Tracked Sites From Memory?'+
    '</div>';

/**
 * Removes all URLS from both the manage page and the Cloud sync database
 */
function purgeURLS() {
    console.log("PURGING . . .");
    chrome.extension.getBackgroundPage().flushURLS();
    $(".content#manage").fadeOut("slow", function(){
        $(this).empty();
    })
}

/**
 * Accepts a specific URL and removes it from the database of tracked URLS
 * @param URL
 */
function resetURL(URL) {


}


