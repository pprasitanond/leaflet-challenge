// Visualizing-Data-with-Leaflet - logic.js

// Earthquakes & Tectonic Plates GeoJSON URL Variables
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Initialize & Create Two Separate LayerGroups: earthquakes & tectonicPlates
var earthquakes = new L.LayerGroup();
var tectonicPlates = new L.LayerGroup();

// Define Variables for Tile Layers

// grayscale background.
var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoicHJpbXBhbGkiLCJhIjoiY2tmdHIzOHZiMHpucDJzbndxYjZseHd0ZCJ9.VtCHoZLdN0SEo5hPL-nmcg");

// outdoors background.
var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1IjoicHJpbXBhbGkiLCJhIjoiY2tmdHIzOHZiMHpucDJzbndxYjZseHd0ZCJ9.VtCHoZLdN0SEo5hPL-nmcg");

// Define baseMaps Object to Hold Base Layers
var baseMaps = {
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap
};

// Create Overlay Object to Hold Overlay Layers
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Fault Lines": tectonicPlates
};

// Create Map, Passing In satelliteMap & earthquakes as Default Layers to Display on Load
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [grayscaleMap, earthquakes]
});

// Create a Layer Control + Pass in baseMaps and overlayMaps + Add the Layer Control to the Map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Retrieve earthquakesURL (USGS Earthquakes GeoJSON Data) with D3
d3.json(earthquakesURL, function(earthquakeData) {
    // Function to Determine Size of Marker Based on the Magnitude of the Earthquake
    function markerSize(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 3;
    }
    // Function to Determine Style of Marker Based on the Magnitude of the Earthquake
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: chooseColor(feature.properties.mag),
          color: "#000000",
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }
    // Function to Determine Color of Marker Based on the Magnitude of the Earthquake
    function chooseColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#581845";
        case magnitude > 4:
            return "#900C3F";
        case magnitude > 3:
            return "#C70039";
        case magnitude > 2:
            return "#FF5733";
        case magnitude > 1:
            return "#FFC300";
        default:
            return "#DAF7A6";
        }
    }
    // Create a GeoJSON Layer Containing the Features Array on the earthquakeData Object
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        // Function to Run Once For Each feature in the features Array
        // Give Each feature a Popup Describing the Place & Time of the Earthquake
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    // Add earthquakeData to earthquakes LayerGroups 
    }).addTo(earthquakes);
    // Add earthquakes Layer to the Map
    earthquakes.addTo(myMap);

    // Retrieve platesURL (Tectonic Plates GeoJSON Data) with D3
    d3.json(platesURL, function(plateData) {
        // Create a GeoJSON Layer the plateData
        L.geoJson(plateData, {
            color: "#DC143C",
            weight: 2
        // Add plateData to tectonicPlates LayerGroups 
        }).addTo(tectonicPlates);
        // Add tectonicPlates Layer to the Map
        tectonicPlates.addTo(myMap);
    });

    // Set Up Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3>Magnitude</h3>"

        //assigning color
        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);
});