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
            if (loc === undefined) {
                console.log('Error on ' + code + ' year ' + key);
                console.log(data[key][i]);
            } else {
                preparedLocations.push([loc['lat'], loc['lon'], data[key][i]['Impôt moyen en €']/1000, '#AA0000']);
            }
        }

        // Creates the map
        console.log(preparedLocations);

    });
}