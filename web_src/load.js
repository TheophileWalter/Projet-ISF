// Load the jsons
let years = ['2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2013', '2014', '2015', '2016', 'location'];
let data = {};
let locations;
years.forEach(element => {
    // Load the year
    $.getJSON('data_json/' + element + '.json', function(json) {
        var key = json['Année'];
        if (key === null || key === undefined) {
            key = 'location';
        }
        // When JSon is loaded
        console.log(key + ' loaded');
        if (key == 'location') {
            locations = json;
        } else {
            data[key] = json['Data'];
        }
        // Remove file from list
        var index = years.indexOf(key);
        if (index > -1) {
            years.splice(index, 1);
        }
        // Check if the last file has been loaded
        if (years.length == 0) {
            // Call the initialization function
            mainInit();
        }
    });
});
