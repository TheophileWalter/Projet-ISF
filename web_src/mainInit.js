let fullLocations = {};
let globalMax = Number.MIN_SAFE_INTEGER, globalMin = Number.MAX_SAFE_INTEGER;

function mainInit() {

    // Check the links between towns and geolocations
    // Iteration on years
    Object.keys(data).forEach(function(key) {

        // Iteration on values
        // Create an array containing the geo locations
        var preparedLocations = [];
        for (var i = 0; i < data[key].length; i++) {

            var valueInt = parseInt(data[key][i]['Impôt moyen en €']);

            // Check for min and max
            if (globalMax < valueInt) {
                globalMax = valueInt;
            }
            if (globalMin > valueInt) {
                globalMin = valueInt;
            }

            // Prepare the location
            var code = data[key][i]['Code commune'];
            var name = data[key][i]['Commune'];
            var loc = locationFinder(code, name);
            if (loc === undefined || isNaN(loc['lat']) || isNaN(loc['lon'])) {
                console.log('Error on ' + code + ' year ' + key);
                console.log(data[key][i]);
            } else {
                preparedLocations.push({
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": [loc['lon'], loc['lat']]
                    },
                    "properties": {
                      "name": data[key][i]['Commune'],
                      "value": valueInt,
                      "redevables": parseInt(data[key][i]['Nombre de redevables'])
                    }
                  });
            }
        }

        // Creates the map
        fullLocations[key] = {"type": "FeatureCollection", "features": preparedLocations};

        // Add button to map selector
        document.getElementById('dialog-map-year').innerHTML += '<input type="button" value="' + key + '" onclick="javascript:selectMapType(' + key + ');" /><br />';

    });
}
