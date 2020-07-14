// earthquake data for the last day:
// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// earthquake data for the last hour:
//var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// earthquake data for the last 7 days/week:
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(earthquakeURL);

var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
console.log(tectonicPlatesURL);

function getColor(d){
  return d > 5 ? "#ce0000":
  d  > 4 ? "#FF0000":
  d > 3 ? "#ff6600":
  d > 2 ? "#ffb37e":
  d > 1 ? "#ffff66":
           "#90ee90";
}

d3.json(earthquakeURL,function (data){
	createFeatures(data.features);
});

// Define a function we want to run once for each feature in the features array
// Create a GeoJSON layer containing the features array on the earthquakeData object
// Give each feature a popup describing the place and time of the earthquake
function createFeatures(earthquakeData) {
	var earthquakes = L.geoJSON(earthquakeData,{
		onEachFeature: function(feature,layer){
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3>Magnitude: <strong>" + feature.properties.mag + "</strong><hr><p>" 
      + new Date(feature.properties.time) + "</p>");
        },
        

        // Run the onEachFeature function once for each piece of data in the array
		pointToLayer:function(feature,latlng){
			return new L.circle(latlng,{
        // radius: getRadius(feature.properties.mag),
        //Change the maginutde of the earthquake by a factor of 25,000 for the radius of the circle.
        radius: feature.properties.mag * 30000,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        fillOpacity: 0.9,  
        stroke:true,
			})
		}
	});

	createMap(earthquakes);
}

// Define tileLayers
function createMap(earthquakes) {
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
        maxZoom: 18,
        accessToken:API_KEY
      });
  
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
        maxZoom: 18,
        accessToken:API_KEY
      });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
        maxZoom: 18,
        accessToken: API_KEY
      });

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        accessToken: API_KEY
      });
    var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

// Define a baseMaps object to hold our base layers
    var baseMaps = {
    	"Outdoors": outdoors,
    	"Satellite": satellite,
      "Dark Map": darkmap,
      "GraySclae": grayscale,
      "Light Map": streetmap
    };

    var tectonicplates = new L.LayerGroup();

    var overlayMaps ={
    	"Earthquakes": earthquakes,
    	"Tectonic Plates": tectonicplates
    };

    
// Create our map, giving it the satellite and earthquakes layers to display on load
  	var myMap = L.map("map", {
  		center: [31.7917, 7.0926],
  		zoom: 3,
  		layers: [outdoors, earthquakes, tectonicplates]
  	}); 

  	d3.json(tectonicPlatesURL, function(plateData) {
  		L.geoJSON(plateData,{
  			color:"gold",
  			weight:2.5
  		})
  		.addTo(tectonicplates);
    });
    
// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
  	L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

// Keep the earthquakes layer on top at all times when it is on
    myMap.on("overlayadd", function (event) {
      earthquakes.bringToFront();
  });

// Add & Setup the legend
// Please refer Day 2 Activity-4 for legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function(myMap){
      var div = L.DomUtil.create('div', 'info legend')
      var labels = []
      var labels = ['<strong>Magnitude (M)</strong>']
      var magnitudes = [0, 1, 2, 3, 4, 5]

      for (var i = magnitudes.length -1; i >=0; i--) {
        div.innerHTML += labels.push(

            '<li style="background:' + getColor(magnitudes[i] + 1) + '"></li> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+'));
    }
    div.innerHTML = '<ul>' + labels.join('<br>') + '</ul>'
    return div
  }
  legend.addTo(myMap);
}





  
