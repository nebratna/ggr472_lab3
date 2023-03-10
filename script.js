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
                ['get', 'grlan19_12'], // GET expression retrieves property value from 'capacity' data field
                '#a64dff', // Colour assigned to any values < first step
                0.1, '#ffffcc', // Colours assigned to values >= each step
                0.22, '#c2e699',
                0.31, '#78c679',
                0.39, '#31a354', //0.39 to 0.49
                0.49, '#006837', //0.49 and higher
                
            ],
            'fill-opacity': 0.8,
            'fill-outline-color': 'black'
        },
        'source-layer': 'NDVI_byNeighb_TO_2019-6rygf7'
    });
});

/*Add a mouse click event for  layer*/

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
        .setHTML("<b>NDVI:</b> " + e.features[0].properties.grlan19_12) //Use click event properties to write text for popup
        .addTo(map); //Show  popup on map
});



