
//SIDE MINI GRAPH

//This function will give an asyncronuous context for the await key words to work
async function buildVis2(country_name) {

    // Clean up old vis
    d3.select("#visualization2").html('');

    // set the dimensions and margins of the graph
    var width = 650;
    var height = 200;
    var margin = {top: 10, right: 250, bottom: 30, left: 60},
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const mini_graph = d3.select("#visualization2")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Import wine data
    const wine_production = await d3.csv('wine-production.csv');
    const country_wine_production = wine_production.filter((row) => row.Entity === country_name);
    //Gives an array of all the tonnes amounts 
    const tonnes = wine_production.map((row) => parseInt(row.tonnes));
    // ... spreads the array to get the number we want
    const max_tonnes = Math.max(...tonnes);
    const min_tonnes = Math.min(...tonnes);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
        .domain([1961,2014])
        .range([ 0, width ]);

    //add format for years on x axis
    var x_axis = d3.axisBottom().scale(x)
        .tickFormat(d3.format('.0f'));

    mini_graph.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis);

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([min_tonnes, max_tonnes])
        .range([ height, 0 ]);
    
    mini_graph.append("g").call(d3.axisLeft(y));

    // This allows to find the closest X index of the mouse:
    const bisect = d3.bisector(function(d) { return d.x_axis; }).left;

    // Create the circle that travels along the curve of chart
    var focus = mini_graph
        .append('g')
        .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 0)

    // Create the text that travels along the curve of chart
    var focusText = mini_graph
        .append('g')
        .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

    // Add the line
    mini_graph.append("path")
        .datum(country_wine_production)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.Year) })
            .y(function(d) { return y(d.tonnes) })
        )

    // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
        focus.style("opacity", 1)
        focusText.style("opacity",1)
    }

    function mousemove(event) {
        // recover coordinate we need
        var hovered_year = Math.floor(x.invert(d3.pointer(event)[0]));
        selectedData = country_wine_production.find((row) => parseInt(row.Year) === hovered_year)
        focus
            .attr("cx", x(selectedData.Year))
            .attr("cy", y(selectedData.tonnes))
        focusText
            .html("Year:" + selectedData.Year + "  -  " + "tonnes:" + selectedData.tonnes)
            .attr("x", x(selectedData.Year)+15)
            .attr("y", y(selectedData.tonnes))
    }

    function mouseout() {
        focus.style("opacity", 0)
        focusText.style("opacity", 0)
    }

    // Create a rect on top of the svg area: this rectangle recovers mouse position
    mini_graph.append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
}

buildVis2('World');
