//Group Names: Anirudh Lath & Polina Lyubavina
//uids: u1149016 & u0895721
//Project: HW 7
//Class: 6017-001 Data Analytics & Visualization

//MAP VISUALIZATION

//This function will give an asyncronuous context for the await key words to work
async function buildVis1() {

    //click countries stick
    let clicked_country = undefined;

    //create SVG
    const width = 1000;
    const height = 450;

    // append the svg object to the body of the page
    const svg = d3.select('#visualization1')
        .attr('width', width)
        .attr('height', height)
        //unclicks/removes border from selected country when the background is clicked
        .on('click', () => { 
            countries_group
                .selectAll('path')
                .classed('clicked', false);

            clicked_country = undefined;

            buildVis2('World');
        });

    //map projection
    //scale scales it on the page
    //translate can center it on the svg
    const projection = d3.geoEqualEarth().scale(165).translate([width/2, height/1.6]);
    const path = d3.geoPath(projection);

    //g is a specific svg element that goes into the svg
    //g is what the group is called inside of an svg
    const countries_group = svg.append('g');

    //Import wine data.
    //Await is a keyword that will make the rest of the code await execution while
    //the data is loading.
    const wine_production = await d3.csv('wine-production.csv');
    //Gives an array of all the tonnes amounts 
    const tonnes = wine_production.map((row) => parseInt(row.tonnes));
    // ... spreads the array to get the number we want
    const max_tonnes = Math.max(...tonnes);
    const min_tonnes = Math.min(...tonnes);

    //Creates a sequential discrete nine-color scale (using Red-Purple).
    //Given a number t in the range [0,1], returns the corresponding color
    //from the “RdPu” sequential color scheme represented as an RGB string.
    //domain is the min and max range of data.
    const color_sequential = d3.scaleSequential(d3.interpolateRdPu)
        .domain([min_tonnes, max_tonnes]);
    
    //import data to draw map
    const countries_data = await d3.json('countries-110m.json');

    //If you have topojson instead of geojson.
    //Topojson is just another form of json that can be used by d3 geojson, no additional libraries are required
    const countries = topojson.feature(countries_data, countries_data.objects.countries);



    //----------------------------------------------------------//
    // Legend

    //Append a defs (for definition) element to your SVG
    const defs = svg.append("defs");

    //Add legend gradient
    //Append a linearGradient element to the defs and give it a unique id
    const linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    //Set the color for the start (0%)
    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color_sequential(min_tonnes));

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color_sequential(max_tonnes))

    const legend = svg.append("g");

    legend
        .append('rect')
        .attr("width", 300)
        .attr("height", 10)
        .attr("x", 350)
        .attr("y", 25)
        .attr('fill', "url(#linear-gradient)")

    legend
        .append("text")
            .text('Legend')
            .attr("style", "underlined")
            .attr("x", 460)
            .attr("y", 18)

    legend
        .append("text")
            .attr("font-size", "12px")
            .text(max_tonnes)
            .attr("x", 630)
            .attr("y", 18)

    legend
        .append("text")
            .attr("font-size", "12px")
            .text(min_tonnes)
            .attr("x", 340)
            .attr("y", 18)


    //----------------------------------------------------------//
    // Instructions

    const tutorial = svg.append("g");

    tutorial.append("text")
        .style("font-size", "18px")
        .style("font-weight", 700)
        .style('color', 'black')
        .text('Instructions')
        .attr("width", 20)
        .attr("height", 30)
        .attr("x", 600)


        
    //----------------------------------------------------------//
    // Mouse over function

    countries_group
        .selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        //here d is an html attribute that is the string that draws the outline,
        //is how you tell the svg to draw the path
        .attr('d', path)
        //fill color
        //here d is a param that is the data item that represents the country
        .attr('fill', function (d) {
            const country_name = d.properties.name;
            const total_production = wine_production
                .filter((row) => row.Entity === country_name)
                .map((row) => parseInt(row.tonnes))
                .reduce((acc, a) => acc + a, 0);
            
            return color_sequential(total_production);
        })
        .attr('stroke-width', 1)
        .attr('stroke', '#999999')
        //mouse moves on country
        .on('mouseover', function (event, d) {
            d3.select(this).attr('stroke-width', 3);
            if (clicked_country === undefined) {
                buildVis2(d.properties.name);
            }
        })
        //mouse moves off country
        .on('mouseout', function (event, d) {
            d3.select(this).attr('stroke-width', 1);
            if(clicked_country === undefined) {
                buildVis2('World');
            }
        })
        //mouse click
        .on('click', function (event, d) {
            //sets all countries to unclicked
            countries_group
                .selectAll('path')
                .classed('clicked', false);

            //click a country twice to unselect it
            if (clicked_country === d.properties.name) {
                clicked_country = undefined;
            } else {
                //track the clicks to unselect it if clicked twice
                clicked_country = d.properties.name;
                //rebuild mini graph
                buildVis2(clicked_country);
                //sets the css clicked class on
                d3.select(this).classed('clicked', true);
            }

            event.stopPropagation();
        })
    ;
}

//calls function
buildVis1();

