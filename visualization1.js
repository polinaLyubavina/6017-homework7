
//MAP VISUALIZATION

//imports
// import * as d3 from d3

//create SVG
const width = 400;
const height = 400;
const svg = d3.select('#visualization1').attr('width', width).attr('height', height);

//map projection
//scale scales it on the page
//translate can center it on the svg
const projection = d3.geoEqualEarth().scale(100).translate([width/2, height/2]); //TODO: Replace with another projection type
const path = d3.geoPath(projection);

//g is a specific svg element that goes into the svg
//g is what the group is called inside of an svg
const countries_group = svg.append('g');

d3.json('countries-110m.json').then(data => {
    // if you have topojson instead of geojason
    const countries = topojson.feature(data, data.objects.countries);
    console.log(countries);
    
    countries_group
        .selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path)
        // .attr('fill', (d) => d.properties.name === 'United States of America' ? '#000000' : '#FF0000')
        ;
});
