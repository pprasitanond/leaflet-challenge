// Visualizing-Data-with-Leaflet 

// Earthquakes URL Variables
var dataurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create map
   var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
});

//tiles
var graymap  =L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",        
    accessToken: API_KEY,
}
).addTo(myMap)


//   // Grab the data with d3
d3.json(dataurl, function (data) {
  L.geoJson(data,).addTo(myMap);
});