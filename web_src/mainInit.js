function mainInit() {
    // Check the links between towns and geolocations
    // Iteration on years
    Object.keys(data).forEach(function(key) {
        // Iteration on values
        for (var i = 0; i < data[key].length; i++) {
            var code = data[key][i]['Code commune'];
            var name = data[key][i]['Commune']
            var loc = locationFinder(code, name);
            if (loc === undefined) {
                console.log('Error on ' + code + ' year ' + key);
                console.log(data[key][i]);
            }
        }
    });
    alert('all loaded');
}