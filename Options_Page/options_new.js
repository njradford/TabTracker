$(function() {

    console.log("LOADED");

    $(".graph").click(function() {

        $(this).parent().parent().find(".graphPane").slideToggle(800);

    })

})