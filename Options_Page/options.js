$(document).ready(function(){
    $(".content").not("#addURL").css("display","none");

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

        console.log($(this).attr('id'));

    });

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