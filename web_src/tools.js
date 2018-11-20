// Try to resolve a code to a geolocation
function locationFinder(code, name) {
    if (locations[code] !== undefined) {
        return locations[code];
    }
    // Special codes
    name = name.toLowerCase();
    if (name == 'monaco') {
        // Not in France, but even in the list
        return {'lat': 43.731377, 'lon': 7.419787};
    }
    // Problem due to borough and special codes
    var specials = {'lyon': '69381', 'marseille': '13201', 'ajaccio': '2A004',
        'bastia': '2B033', "le gosier": '97113', "schoelcher": '97229', "fort de france": '97209',
        "la possession": '97408', 'saint andre': '97409', 'saint denis': '97411', 'saint paul': '97415',
        'saint pierre': '97416', 'sainte marie': '97418', 'tampon': '97422'};
    return locations[specials[name]];
}

// Escape the HTML special chars
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Close a JQuery UI popup
function closeDialog(id) {
    $(function() {
        $('#' + id).dialog('close');
    });
}

// Sort two arrays based on the values of the first
function refSort (targetData, refData) {
    // Create an array of indices [0, 1, 2, ...N].
    var indices = Object.keys(refData);

    // Sort array of indices according to the reference data.
    indices.sort(function(indexA, indexB) {
      if (refData[indexA] < refData[indexB]) {
        return -1;
      } else if (refData[indexA] > refData[indexB]) {
        return 1;
      }
      return 0;
    });

    // Map array of indices to corresponding values of the target array.
    return indices.map(function(index) {
      return targetData[index];
    });
}