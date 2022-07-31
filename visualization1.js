
//MAP VISUALIZATION

//This function will give an asyncronuous context for the await key words to work
async function buildVis1() {
    //create SVG
    const width = 800;
    const height = 600;
    const svg = d3.select('#visualization1').attr('width', width).attr('height', height);

    //map projection
    //scale scales it on the page
    //translate can center it on the svg
    const projection = d3.geoEqualEarth().scale(150).translate([width/2, height/2]);
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
    var color_sequential = d3.scaleSequential(d3.interpolateRdPu)
        .domain([min_tonnes, max_tonnes]);

    const countries_data = await d3.json('countries-110m.json');

    //If you have topojson instead of geojason
    const countries = topojson.feature(countries_data, countries_data.objects.countries);

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
        .attr('fill', function (d, i) {
            const country_name = d.properties.name;
            const total_production = wine_production
                .filter((row) => row.Entity === country_name)
                .map((row) => parseInt(row.tonnes))
                .reduce((acc, a) => acc + a, 0);
            
            return color_sequential(total_production);
        })
        .attr('stroke-width', 1)
        .attr('stroke', '#999999')
        .on('mouseover', function (d, i) {
            d3.select(this).attr('stroke-width', 3);
        })
        .on('mouseout', function (d, i) {
            d3.select(this).attr('stroke-width', 1);
        });
    ;
}

//calls function
buildVis1();

