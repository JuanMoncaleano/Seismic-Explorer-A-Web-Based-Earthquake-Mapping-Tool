// Initialize the map
var myMap = L.map("map").setView([37.09, -95.71], 5);

// Add a tile layer (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// URL to get the GeoJSON data
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the data
fetch(queryUrl)
  .then((response) => response.json())
  .then((data) => {
    // Process the data
    data.features.forEach((feature) => {
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];

      // Define marker size based on magnitude
      var markerSize = magnitude * 10000;

      // Define color based on depth
      var color;
      if (depth > 400) {
        color = "red";
      } else if (depth > 300) {
        color = "orange";
      } else if (depth > 200) {
        color = "yellow";
      } else if (depth > 100) {
        color = "limegreen";
      } else {
        color = "green";
      }

      // Create a circle marker
      L.circle(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
        {
          color: color,
          fillColor: color,
          fillOpacity: 0.75,
          radius: markerSize,
        }
      )
        .bindPopup(
          `<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`
        )
        .addTo(myMap);
    });

    // Define the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var labels = ["<strong>Depth</strong>"];
      var categories = [
        "< 100 km",
        "100 - 200 km",
        "200 - 300 km",
        "300 - 400 km",
        "> 400 km",
      ];
      var colors = ["green", "limegreen", "yellow", "orange", "red"];

      for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
          (labels[i] || "") +
          '<br><i style="background:' +
          colors[i] +
          '"></i> ' +
          categories[i] +
          "<br>";
      }

      return div;
    };
    legend.addTo(myMap);
  });
