# geojson-network-node-lookup
Given a GeoJSON LineString network and a Location point object, return a lookup of the closest node to each point.

# What?

You have a network of points, and you want to route from an origin lat/lng to a destination lat/lng.
First you need to find the closest nodes in your network to these points.  You can either:

 * **A**. Look up on demand (useful if the total domain of origins/destinations can't be known ahead of time).

 * **B**. Look up once and store it (useful if you do know all possible origins/destinations ahead of time).

You get bonus points if you can do **B**, because your application will be much faster.

This library helps you implement **B**.

## Install

```
npm install geojson-network-node-lookup --save
```

## Usage

```
const fs = require('fs').promises;
const createNodeLookup = require('geojson-network-node-lookup');

main();

async function main() {

    const geojson_raw = await fs.readFile('./file.geojson');

    const geojson = JSON.parse(geojson_raw);

    const locations = {
                    "10001": {
                      "lat": 40.7506364,
                      "lng": -73.9971766
                    },
                    "10002": {
                      "lat": 40.7157758,
                      "lng": -73.9862109
                    }
                  };

    const lookup = createNodeLookup(geojson, locations);

    // lookup will look like:
    //   {
    //     "10001": [-73.998127, 40.750922],
    //     "10002": [-73.985698, 40.717708]
    //   }

}


```