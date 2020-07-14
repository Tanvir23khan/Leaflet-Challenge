# Leaflet-Challenge
Visualization of USGS Earthquake GeoJSON data with Leaflet and JavaScript

The data pulled were all the eathquakes from the past 7 days. The visualization tool used to create this map is Leaflet combined with Mapbox API. Various map skins were used as potential layers in this visualization. The map is located at https://tanvir23khan.github.io/Leaflet-Challenge/.

This map contains the locations of recent earthquakes around the world as well as their magnitude as indicated by the bubble size/color. A pop up window will appear if the user clicks on a bubble and return more information about the earthquake. A tectonic plate layer was also added to the map to show how close most earthquakes are to the earth's tectonic plates. The earthquake layer is always kept on top of the tectonic plate layer (resource to accomplish this is https://gis.stackexchange.com/questions/183914/how-to-keep-vector-layer-on-top-of-all-layers-despite-toggling-order).
