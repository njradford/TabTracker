$(document).ready(function(){
    $(".content").not("#addURL").css("display","none");

    $("li").click(function(){

        $("li").animate({
            backgroundColor:'white',
            color:'#0097a7'
        },150);

        $(".content").animate({
            opacity:0
        },150, function(){
            $(".content").css("display","none")
        });

        $(this).animate({
            backgroundColor:'#0097a7',
            color:'white'
        },150);

        button = $(this).text();
        switch(button) {
            case "Add URL":
                console.log("Add URL Clicked!");
                break;
            case "Manage":
                console.log("Manage Clicked!");
                break;
            case "Share":
                console.log("Share Clicked!");
                break;
            case "About":
                console.log("About Clicked!");
                break;
            case "Donate":
                console.log("Donate Clicked!");
                break;
            default:
                console.log(button);
        }
    });


});