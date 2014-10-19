$(function(){
    var URLS;
    chrome.extension.getBackgroundPage().initial(function(data){
        URLS = data;
        //BUILD THE DOM BASED ON DATA FROM THE DB
        if(URLS!=null) {
            URLS.forEach(function (entry) {
                console.log(entry.url);
                $(".content#manage").append(buildCard(entry));
            });
        };
    });

    $(".content").not("#addURL").css("display","none");

    //ADD AJAX FORM HANDLER
    $("form").submit(function(e){
        e.preventDefault();
        var NEW_URL = $("#URLFORM").find("input").val();
        document.getElementById("URLFORM").reset();
        chrome.extension.getBackgroundPage().addURL(NEW_URL, addNewCard);

    })

    //MENU CLICK HANDLERS
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

    //HANDLE LISTENERS FOR CONTENT CARD BUTTONS
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

//ACCEPTS THE URL OBJECT, BUILDS THE CARD, AND APPENDS IT TO THE MANAGE CONTAINER
function addNewCard(URL_OBJECT){

    $(".content#manage").append(buildCard(URL_OBJECT));


}