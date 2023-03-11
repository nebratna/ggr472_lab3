//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoibmVicmF0bmEiLCJhIjoiY2xjdmZ6Z3I0MDdoODNycWtvNDVuYjJydCJ9.MU8-uPe3u6ya0aTiMr079g'; //default public map token from my Mapbox account

//Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/nebratna/clf2y6xcs002r01o5kcpwugoc',
    center: [-79.408, 43.7056],
    zoom: 10,

});


/*--------------------------------------------------------------------
ADD DATA AS CHOROPLETH MAP ON MAP LOAD
Use get expression to categorise data based on NDVI values
--------------------------------------------------------------------*/
//Add data source and draw initial visiualization of layer
map.on('load', () => {
    map.addSource('neighbNDVI', {
        'type': 'vector',
        'url': 'mapbox://nebratna.amkj53x7' // my tilesetID link from Mapbox
    });

    map.addLayer({
        'id': 'NDVI',
        'type': 'fill',
        'source': 'neighbNDVI',
        'type': 'fill',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'grlan19_12'], // 
                '#a64dff', // Colour assigned to any values < first step
                0.1, '#ffffcc', // Colours assigned to values >= each step
                0.22, '#c2e699',
                0.31, '#78c679',
                0.39, '#31a354', //0.39 to 0.49
                0.49, '#006837', //0.49 and higher

            ],
            'fill-opacity': 0.5,
            'fill-outline-color': 'black'
        },
        'source-layer': 'NDVI_byNeighb_TO_2019-6rygf7'
    });

    //Add another visualization of the neighbrouhood polygons when the mouse is hovering over it
    map.addLayer({
        'id': 'NDVI-hl', //Update id to represent highlighted layer
        'type': 'fill',
        'source': 'neighbNDVI',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'grlan19_12'],
                '#a64dff',
                0.1, '#ffffcc',
                0.22, '#c2e699',
                0.31, '#78c679',
                0.39, '#31a354',
                0.49, '#006837',

            ],
            'fill-opacity': 0.8,
            'fill-outline-color': 'black'
        },
        'source-layer': 'NDVI_byNeighb_TO_2019-6rygf7',
        'filter': ['==', ['get', 'FIELD_1'], ''] //Set an initial filter to return nothing
    })
});

/*-----------------------------------------------------------------
ADDING MOUSE CLICK EVENT FOR LAYER
-----------------------------------------------------------------*/

// Change the cursor to a pointer when the mouse is over the NDVI layer.
map.on('mouseenter', 'NDVI', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'NDVI', () => {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'NDVI', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Neighbourhood:</b> " + "<br>" + e.features[0].properties.FIELD_7 + "<br>" + "<b>NDVI:</b> " + e.features[0].properties.grlan19_12) //Use click event properties to write text for popup
        .addTo(map); //Show  popup on map
});

/*---------------------------------------------------------------------
SIMPLE HOVER EVENT
----------------------------------------------------------------------*/
map.on('mousemove', 'NDVI', (e) => {
    if (e.features.length > 0) {
        map.setFilter('NDVI-hl', ['==', ['get', 'FIELD_1'], e.features[0].properties.FIELD_1]);
    }
})

/*--------------------------------------------------------------------
ADDING MAPBOX CONTROLS AS ELEMENTS ON MAP
--------------------------------------------------------------------*/
//Create geocoder variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});

//Use geocoder div to position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

//Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());



/*--------------------------------------------------------------------
ADDING INTERACTIVITY BASED ON HTML EVENT
--------------------------------------------------------------------*/

//Add event listeneer which returns map view to full screen on button click
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.408, 43.7056],
        zoom: 10,
        essential: true
    });
});

//Change display of legend based on check box
let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});


//Filter data layer to show selected Neighbrourhood from dropdown selection
let neighbourhoodvalue;

document.getElementById("neighbourhoodfieldset").addEventListener('change', (e) => {
    neighbourhoodvalue = document.getElementById('neighbourhood').value;
    console.log(neighbourhoodvalue);

    if (neighbourhoodvalue == 'All') {
        map.setFilter(
            'NDVI', /*same as layer name on line 26*/
            ['has', 'FIELD_7'] //returns all polygons from layer that have a value in FIELD_7);
        );
    } else {
        map.setFilter(
            'NDVI',
            ['==', ['get', 'FIELD_7'], neighbourhoodvalue] //returns polygon with FIELD_7 value that matches dropdown selection);
        );
    }
});
