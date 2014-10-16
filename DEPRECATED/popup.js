document.addEventListener('DOMContentLoaded', function () {
    drawURLS();
    $(document).ready(function(){
    //DOC READY FUNCTIONS
        var form = $("#inputForm")
        var input = $("#urlForm")

        input.click(function(){
            console.log("clicked");
            if(input.val()=="ie www.facebook.com"){
                input.val("");
            }
        })

        form.mouseover(function(){
            form.fadeTo(200,1,function(){})
        })

        form.mouseout(function(){
            form.fadeTo(200,.80,function(){})
        })

        //HANDLES SUBMITTING VALUES WITHOUT REFRESH
        $("#inputForm").on('submit',function(e){
            e.preventDefault();
            console.log($("#urlForm").val());
            $.ajax({
              beforeSend: function() {
              },
              success: function(data) {
                helloForm($("#urlForm").val());
                form.trigger('reset'); // reset form
                drawURLS();
              },
              error: function(e) {
                //console.log(e)
              }
            })
        })
    });
});




function helloForm(e){
    chrome.extension.getBackgroundPage().parseInput(e);
}

//Draws URLS  in the list.
function drawURLS(){
    url=chrome.extension.getBackgroundPage().fetchURLS();
    console.log(url);
    if(url!=null){
        url.forEach(function(entry){
            console.log(entry);
            var $elem = $("<div class='panel'>");
              $elem.text(entry);
              $elem.appendTo(".backing");
              window.resizeTo(400,300);
        });
    }
}

//SOME PORT TESTING
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "knockknock");
    port.onMessage.addListener(function(msg) {
        if (msg.joke == "Knock knock")
            port.postMessage({question: "Who's there?"});
        else if (msg.answer == "Madame")
            port.postMessage({question: "Madame who?"});
        else if (msg.answer == "Madame... Bovary")
            port.postMessage({question: "I don't get it."});
    });
});

