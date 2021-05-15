let map = L.map("map").setView([0, 0], 2);
map.attributionControl.addAttribution('Created by <a href="https://fechan.github.io/">Frederick Chan</a>');

let basemap = L.tileLayer('https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'basemap &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
basemap.addTo(map);


/**
 * Hacky function to turn strings into colors
 * taken from https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
 */
String.prototype.toColor = function() {
	var colors = ["#e51c23", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#5677fc", "#03a9f4", "#00bcd4", "#009688", "#259b24", "#8bc34a", "#afb42b", "#ff9800", "#ff5722", "#795548", "#607d8b"]
	
  var hash = 0;
	if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
      hash = this.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    hash = ((hash % colors.length) + colors.length) % colors.length;
    return colors[hash];
}

/**
 * Get marker rendering options by name of civ (makes all cities of a civ have same color)
 * @param {String} civName 
 * @returns marker options
 */
function markerOptions(civName) {
  return {
    radius: 3,
    color: civName.toColor(),
    fillColor: civName.toColor(),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
};

L.geoJSON(CIV_LYR, {
  onEachFeature: function(feature, layer) {
    return layer.bindPopup(feature.properties.name + "<br>" + feature.properties.civ)
  },
  pointToLayer: function (feature, latlng) {
    let marker = L.circleMarker(latlng, markerOptions(feature.properties.civ))
      .bindTooltip(feature.properties.name + "<br>" + feature.properties.civ);
    return marker;
  },
  attribution: 'Civ 6 city names from <a href="https://civilization.fandom.com/wiki/Category:Cities_(Civ6)">Civ Wiki</a>. City coordinates located with <a href="https://www.wikidata.org/wiki/Wikidata:Main_Page">Wikidata</a>'
}).addTo(map);