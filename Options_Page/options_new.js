
function buildGraph(url, target){

    chrome.extension.getBackgroundPage().buildHitData(url, function(data){


        var margin = {top: 10, right: 10, bottom: 100, left: 40},
            margin2 = {top: 430, right: 10, bottom: 20, left: 40},
            width = 590 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom,
            height2 = 500 - margin2.top - margin2.bottom;


        var x = d3.time.scale().range([0, width]),
            x2 = d3.time.scale().range([0, width]),
            y = d3.scale.linear().range([height, 0]),
            y2 = d3.scale.linear().range([height2, 0]);



        x2.tickFormat(d3.time.format("%Y"));
        x.tickFormat(d3.time.format("%Y"));


        var xAxis = d3.svg.axis().scale(x).orient("bottom"),
            xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
            yAxis = d3.svg.axis().scale(y).orient("left");

        var brush = d3.svg.brush()
            .x(x2)
            .on("brush", brushed);

        var area = d3.svg.area()
            .interpolate("monotone")
            .x(function(d) { return x(d.date); })
            .y0(height)
            .y1(function(d) { return y(d.hits); });

        var area2 = d3.svg.area()
            .interpolate("monotone")
            .x(function(d) { return x2(d.date); })
            .y0(height2)
            .y1(function(d) { return y2(d.hits); });

        var svg = target.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


        /**Interpret and append data **/

        x.domain(d3.extent(data.map(function(d) { return d.date; })));
        y.domain([0, d3.max(data.map(function(d) { return d.hits; }))]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        focus.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);

        focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        context.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area2);

        context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        context.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", height2 + 7);


        function brushed() {
            x.domain(brush.empty() ? x2.domain() : brush.extent());
            focus.select(".area").attr("d", area);
            focus.select(".x.axis").call(xAxis);
            console.log(x.ticks())
        }

        function type(d) {
            d.date = new Date(Math.round(d.date));
            console.log(d.date);
            d.hits = +d.hits;
            return d;
        }

    })


}




$(document).ready(function() {

    $("#content li").hide(0);

    $("#content .add").show(0);

    /**
     * Toggle slide out for graph
     */
    $("body").on('click', "button.graph", function() {

        $(this).parent().parent().find(".graphPane").slideToggle();

    })

    /**
     * Modify default action for form submit
     */


    /**
     * Toggle views for content cards based on nav menu selection
     */
    $("#nav button").click(function(){

        c = $(this).attr("class").split(" ")[0];

        if(c == "manage") {

            buildManagePage();
        } else {

            $("li.manage").empty();

        }

        $("#nav button").toggleClass("active", false);

        $(this).toggleClass("active", true);

        $("#content li").hide(0,function(){
            $("#content ."+c).show(0);

        });

    })

})

function buildManagePage() {


    chrome.extension.getBackgroundPage().fetchSyncedURLS(function(data){


        for ( i = 0; i < data.length; i++) {

            obj = data[i];

            h = obj.hits;

            u = obj.url;
            d = obj.startDate;

            var card = $('<div class="contentCard" data-host='+ u +'>'+
            '<h2>'+ u +' </h2>'+
            '<h3>'+ h +' hits since '+ d +'</h3>'+
            '<div class="graphPane">'+
            '</div>'+
            '<div class="cardMenu">'+
            '<button class="reset">Reset</button>'+
            '<button class="remove">Remove</button>'+
            '<button class="graph">Graph</button>'+
            '</div>'+
            '</div>');

            $("li.manage").append(card);

            target = card.find(".graphPane");

            test = d3.selectAll(target.toArray());

            buildGraph(u, test);


        }


    });

}

