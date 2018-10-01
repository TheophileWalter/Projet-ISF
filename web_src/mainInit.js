function mainInit() {

    // Check the links between towns and geolocations
    // Iteration on years
    Object.keys(data).forEach(function(key) {
        // Iteration on values
        for (var i = 0; i < data[key].length; i++) {
            var codeCommune = data[key][i]['Code commune'];

            if (locations[codeCommune] === undefined) {
                console.log('Error on ' + codeCommune);
                console.log(data[key][i]);
            }

        }
    });

    alert('all loaded');
}