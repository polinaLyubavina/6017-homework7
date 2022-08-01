
//SIDE MINI GRAPH

//This function will give an asyncronuous context for the await key words to work
async function buildVis2(country_name) {

    // Clean up old vis
    d3.select("#visualization2").html('');

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const mini_map = d3.select("#visualization2")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Import wine data
    const wine_production = await d3.csv('wine-production.csv');
    const world_wine_production = wine_production.filter((row) => row.Entity === country_name);
    //Gives an array of all the tonnes amounts 
    const tonnes = wine_production.map((row) => parseInt(row.tonnes));
    // ... spreads the array to get the number we want
    const max_tonnes = Math.max(...tonnes);
    const min_tonnes = Math.min(...tonnes);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
    // TODO : CHANGE FORMAT OF YEAR ON X AXIS
        .domain([1961,2014])
        .range([ 0, width ]);

    mini_map.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([min_tonnes, max_tonnes])
        .range([ height, 0 ]);
    
    mini_map.append("g").call(d3.axisLeft(y));

    // This allows to find the closest X index of the mouse:
    const bisect = d3.bisector(function(d) { return d.x; }).left;

    // Create the circle that travels along the curve of chart
    var focus = mini_map
        .append('g')
        .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 0)

    // Create the text that travels along the curve of chart
    var focusText = mini_map
        .append('g')
        .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

    // Add the line
    mini_map.append("path")
        .datum(world_wine_production)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.Year) })
            .y(function(d) { return y(d.tonnes) })
        )

    // Create a rect on top of the svg area: this rectangle recovers mouse position
    mini_map.append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);

    // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
        focus.style("opacity", 1)
        focusText.style("opacity",1)
    }

    function mousemove() {
        // recover coordinate we need
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisect(wine_production, x0, 1);
        selectedData = wine_production[i]
        focus
          .attr("cx", x(selectedData.x))
          .attr("cy", y(selectedData.y))
        focusText
          .html("x:" + selectedData.x + "  -  " + "y:" + selectedData.y)
          .attr("x", x(selectedData.x)+15)
          .attr("y", y(selectedData.y))
    }

    function mouseout() {
        focus.style("opacity", 0)
        focusText.style("opacity", 0)
    }
}

buildVis2('World');
