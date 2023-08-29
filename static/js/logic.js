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

// Get modal and close button elements
var modal = document.getElementById("infoModal");
var closeButton = document.getElementsByClassName("close-button")[0];

// Show modal function
function showInfo() {
  modal.style.display = "block";
}

// Close the modal when the close button is clicked
closeButton.onclick = function () {
  modal.style.display = "none";
};

// Close the modal when clicking outside of it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Add information button
var infoButton = L.control({ position: "topleft" });
infoButton.onAdd = function () {
  var div = L.DomUtil.create("div", "info-button");
  div.innerHTML = '<button onclick="showInfo()">Info</button>';
  return div;
};
infoButton.addTo(myMap);

// Fetch the data
fetch(queryUrl)
  .then((response) => response.json())
  .then((data) => {
    // Process the data
    data.features.forEach((feature) => {
      var magnitude = feature.properties.mag;
      var depth = Math.ceil(feature.geometry.coordinates[2]);

      // Define marker size based on depth
      var markerSize;
      if (depth < 70) {
        markerSize = 30000; // Shallow earthquakes
      } else if (depth < 300) {
        markerSize = 20000; // Intermediate-depth earthquakes
      } else {
        markerSize = 10000; // Deep earthquakes
      }

      // Define color based on magnitude instead of depth
      var color;
      if (magnitude >= 6) {
        color = "black";
      } else if (magnitude > 5) {
        color = "red";
      } else if (magnitude > 4) {
        color = "orange";
      } else if (magnitude > 3) {
        color = "yellow";
      } else if (magnitude > 2) {
        color = "green";
      } else {
        color = "limegreen";
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

    // Define the legend (now based on Magnitude)
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var labels = ["<strong>Magnitude</strong>"];
      var categories = ["< 2", "2 - 3", "3 - 4", "4 - 5", "5 - 6", ">= 6"];
      var colors = ["limegreen", "green", "yellow", "orange", "red", "black"];

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
