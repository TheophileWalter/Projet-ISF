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
    if (name == 'lyon') {
        // Problem due to borough
        return locations['69381'];
    }
    if (name == 'marseille') {
        // Problem due to borough
        return locations['13201'];
    }
    if (name == 'ajaccio') {
        // Problem due to special postal code
        return locations['2A004'];
    }
    if (name == 'bastia') {
        // Proble due to special postal code
        return locations['2B033'];
    }
    return undefined;
}