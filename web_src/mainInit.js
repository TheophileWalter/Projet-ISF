let fullLocations = [];

function mainInit() {
    // Check the links between towns and geolocations
    // Iteration on years
    Object.keys(data).forEach(function(key) {
        // Iteration on values
        // Create an array containing the geo locations
        var preparedLocations = [];
        for (var i = 0; i < data[key].length; i++) {
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
                      "coordinates": [loc['lat'], loc['lon']]
                    },
                    "properties": {
                      "name": data[key][i]['Commune'],
                      "value": data[key][i]['Impôt moyen en €']
                    }
                  });
            }
        }

        // Creates the map
        fullLocations[key] = {"type": "FeatureCollection", "features": preparedLocations};
        console.log(fullLocations[key]);

        // Add button to map selector
        document.getElementById('dialog-map-year').innerHTML += '<input type="button" value="' + key + '" onclick="javascript:addMap(\'Carte de France - ' + key + '\', fullLocations[\'' + key + '\']);" /><br />';
    });
}
