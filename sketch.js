/*

Notes on the data visualization: 
The Mercator projection, or the Google Mercator, used in Open Street Maps and Leaflet is not an accurate representation of the 
relative size of landmasses. It causes the landmasses near the poles to appear a lot bigger than they actually are!
When the radius of the circles is mapped to the data describing of the earthquakes - it can be misleading. A circle near the poles 
even if bigger can have misleading impact, in relation to one closer to the equator.
This disconnect might cause the user to presume that because a circle near the poles is bigger, it's impact might be bigger based
on the neighbouring landmass, as compared to a circle near the equator. 
Thus, radius of the circles cannot be the sole form in which any mode of data be encoded. 

The size of the circles, even when all same is misleading, especially to an uniniated user who doesn't know the distortions in the 
mercator projections. 

The group of earthquakes near Alaska are very misleading! Compared to the ones near the Philipine Sea. The circles representing the 
ones near Alaska are drawn bigger due to the distortion and apear to be more concentrated and packed than they are!!! 
I can't seem to find a mid-ground on circle size that can be a more accurate representation of the earthquakes. 

*/


var magnitudes;
// an array for depth
var depths;
// an array for lat & long, and place
var latitudes, longitudes;
var place; 

// minimum and maximum values for magnitude and depth
var magnitudeMin, magnitudeMax;
var depthMin, depthMax;

// the dots we'll be adding to the map
var circles = [];

// table as the data set
var table;

// my leaflet.js map
var mymap;

function preload() {
    // load the CSV data into our `table` variable and clip out the header row
    table = loadTable("assets/all_month.csv", "csv", "header");

    console.log('here');


}

function setup() {

    frameRate(1);

    radio = createRadio();
    radio.option('Concentration of Earthquakes');
    radio.option('Intensity of Earthquakes');
    radio.option('Depth of Earthquakes');
    radio.selected('Concentration of Earthquakes');
    // radio.style('width', '180px');
    //textAlign(CENTER);
    //fill(255, 0, 0);

    createCanvas(400, 35);
    

    // create your own map (default latitude and longitude, and maginification level)
    mymap = L.map('quake-map').setView([25, -0.09], 2.4);

    // load a set of map tiles – choose from the different providers demoed here:
    // https://leaflet-extras.github.io/leaflet-providers/preview/
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 6
}).addTo(mymap);

     // get the two arrays of interest: depth and magnitude
     depths = table.getColumn("depth");
     magnitudes = table.getColumn("mag");
     latitudes = table.getColumn("latitude");
     longitudes = table.getColumn("longitude");
     place = table.getColumn("place");
 
     // get minimum and maximum values for both
     magnitudeMin = 0.0;
     magnitudeMax = getColumnMax("mag");
     //console.log('magnitude range:', [magnitudeMin, magnitudeMax])
 
     depthMin = 0.0;
     depthMax = getColumnMax("depth");
    // console.log('depth range:', [depthMin, depthMax])

    // call our function (defined below) that populates the maps with markers based on the table contents
    //drawCircles_All();
    
    //removeAllCircles();
}

function draw(){
    background(255);
    textSize(14);
    text('Hover over circles to see more information.', 10, 20);
    drawCircles_All();
}

function drawCircles_All(){
    switch(radio.value())
    {
        case 'Concentration of Earthquakes':removeAllCircles(); 
                                        drawDataPoints_frequency();
                                        break;
        case 'Intensity of Earthquakes':removeAllCircles();
                                        drawDataPoints_intensity();
                                        break;
        case 'Depth of Earthquakes': removeAllCircles();
                                      drawDataPoints_depth();
                                      break;
    }
}

function drawDataPoints_frequency(){

    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<depths.length; i++){
        // create a new dot
        var circle = L.circle([latitudes[i], longitudes[i]], {
            stroke: false,
            color: (0,0,0),      // the dot stroke color
            fillColor: 'white', // the dot fill color
            fillOpacity: 0.3,// use some transparency so we can see overlaps
            radius: 10000
        });

        // place it on the map
        circle.addTo(mymap);

         //information displayed on hover
        circle.bindTooltip('<h4>'+place[i]+ '<br>Magnitude: ' + magnitudes[i] + '<br>Depth: ' + depths[i] + ' Km' +'</h4>');

        // save a reference to the circle for later
        circles.push(circle);
    }
}


function drawDataPoints_intensity(){

    //mapping the min and max values of the magnitude to a color palette
    var pal1 = Brewer.sequential('Greys', Infinity, magnitudeMax, magnitudeMin);


    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<depths.length; i++){
        const color1 = pal1.colorForValue(magnitudes[i]);
        // create a new dot
        var circle = L.circle([latitudes[i], longitudes[i]], {
            stroke: false,
            color: (0,0,0),      // the dot stroke color
            fillColor: color1, // the dot fill color
            fillOpacity: 0.1 * magnitudes[i],  // use some transparency so we can see overlaps
            radius: 70000 
        });

        // place it on the map
        circle.addTo(mymap);

         //information displayed on hover
        circle.bindTooltip('<h4>'+place[i]+ '<br>Magnitude: ' + magnitudes[i] + '<br>Depth: ' + depths[i] + ' Km' +'</h4>');

        // save a reference to the circle for later
        circles.push(circle);
    }
}

function drawDataPoints_depth(){

    //mapping the min and max values of the magnitude to a color palette
    var pal = Brewer.sequential('YlOrRd', Infinity, depthMax, depthMin);


    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<depths.length; i++){
        const color = pal.colorForValue(depths[i]);
        // create a new dot
        var circle = L.circle([latitudes[i], longitudes[i]], {
            stroke: false,
            color: (0,0,0),      // the dot stroke color
            fillColor: color, // the dot fill color
            fillOpacity: 0.2 * magnitudes[i],  // use some transparency so we can see overlaps
            radius: 50000 
        });

        // place it on the map
        circle.addTo(mymap);

        //information displayed on hover
        circle.bindTooltip('<h4>'+place[i]+ '<br>Magnitude: ' + magnitudes[i] + '<br>Depth: ' + depths[i] + ' Km' +'</h4>');

        
        // save a reference to the circle for later
        circles.push(circle);
    }
}


function removeAllCircles(){
    // remove each circle from the map and empty our array of references
    circles.forEach(function(circle, i){
        mymap.removeLayer(circle);
    })
    circles = [];
}

// get the maximum value within a column
function getColumnMax(columnName){
    // get the array of strings in the specified column
    var colStrings = table.getColumn(columnName);

    // convert to a list of numbers by running each element through the `float` function
    var colValues = _.map(colStrings, float);

    // find the max value by manually stepping through the list and replacing `m` each time we
    // encounter a value larger than the biggest we've seen so far
    var m = 0.0;
    for(var i=0; i<colValues.length; i++){
        if (colValues[i] > m){
            m = colValues[i];
        }
    }
    return m;

    // or do it the 'easy way' by using lodash:
    // return _.max(colValues);
}
