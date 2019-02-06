const KDBush = require('kdbush');
const geokdbush = require('geokdbush');

function createNodeLookup(geojson, locations, options = {}) {

  // options {}
  // set to true to toggle:
  // asCoordString; instead of [lng/lat] use "lng,lat"

  const features = Array.isArray(geojson) ? geojson : geojson.features;

  // get unique nodes
  const uniqueNodesSet = createValency(features);

  // format for kdbush
  const points = Object.keys(uniqueNodesSet).map(node => {
    const coords = node.split(',');
    return {
      node,
      lon: Number(coords[0]),
      lat: Number(coords[1])
    };
  });

  // index all the points
  const index = new KDBush(points, (p) => p.lon, (p) => p.lat);

  // find closest neighbor for each pair of zip
  const closest = {};
  Object.keys(locations).forEach(key => {
    const obj = locations[key];
    const nearest = geokdbush.around(index, obj.lng, obj.lat, 1);
    closest[key] = options.asCoordString
      ? nearest[0].node
      : (nearest[0].node.split(',')).map(d => Number(d));
  });

  return closest;

}


// createValency
function createValency(geo) {
  const uniqueNodesSet = {};
  geo.forEach(feature => {
    if(!feature.geometry) {
      return;
    }
    const coords = feature.geometry.coordinates;
    // start
    const start = coords[0].join(',');
    if (!uniqueNodesSet[start]) {
      uniqueNodesSet[start] = 1;
    } else {
      uniqueNodesSet[start]++;
    }
    // end
    const end = coords[coords.length - 1].join(',');
    if (!uniqueNodesSet[end]) {
      uniqueNodesSet[end] = 1;
    } else {
      uniqueNodesSet[end]++;
    }
  });
  return uniqueNodesSet;
}


exports.createNodeLookup = createNodeLookup;

module.exports = createNodeLookup;