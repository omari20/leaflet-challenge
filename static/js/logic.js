
// Create initial map object
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 3
});

// Add the tile layer (Background style)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// GeoJSON URL
var geoURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// use D3 to get geoJSON data from url
d3.json(geoURL).then(function(data) {

    // Function to determine marker size based on earthquake magnitude
    function markerSize(magnitude) {
        return magnitude * 4;
    }
    // Function that shows the color of based on the depth of the earthquake
    function severityColor(depth){
        if  (depth < 70) {
            return "red";
        } else if (depth < 300){
            return "orange";
        } else {
            return "green";
        }
    }
    // Giving each feature a popup with information that is relevant to it
    var earthquakes = L.geoJSON(data.features, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: severityColor(feature.geometry.coordinates[2]),
                color: "white",
                weight: 0.7,
                opacity: 0.7,
                fillOpacity: 0.8
            }).bindPopup("<h3>" + feature.properties.place +
                        "</h3><hr><p>Magnitude: " + feature.properties.mag +
                        "<br>Depth: " + feature.geometry.coordinates[2] + "</p>");
        }
    }).addTo(myMap);

    Legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
            depths = [0, 100, 200, 100],
            labels = [];

        // Loop through the depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
})