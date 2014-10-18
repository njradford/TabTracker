$(document).ready(function(){
    var URLS;
    chrome.extension.getBackgroundPage().initial(function(data){
        URLS = data;
        //BUILD THE DOM BASED ON DATA FROM THE DB
        URLS.forEach(function(entry){
            console.log(entry.url);
            $(".content#manage").append(buildCard(entry));
        });
        buttonListeners();
    });



//CONTENT CARD DIV

    $(".content").not("#addURL").css("display","none");




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
});

//CALLED TO ATTACH JQUERY LISTENERS TO OBJECTS
function buttonListeners(){
    $(".contentCardButton").click(function(){
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

    });
}



//ACCEPTS A URL OBJECT AND RETURNS THE PLAINTEXT DIV OF THE CONTENT CARD
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