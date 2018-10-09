// Button to add a visualization
function addVisualization(title, content) {
    appendToBody("Hello ceci est ma visualisation", "And the Raven, never flitting, still is sitting, still is sitting<br />" +
        "On the pallid bust of Pallas just above my chamber door;<br />" +
        "And his eyes have all the seeming of a demon’s that is dreaming,<br />" +
        "And the lamp-light o’er him streaming throws his shadow on the floor;<br />" +
        "And my soul from out that shadow that lies floating on the floor<br />" +
        "Shall be lifted—nevermore!");
    addMap("Carte de France", null);
}

// Add a map to the page
function addMap(title, geoData) {

    // Create a visualization
    var v = appendToBody(title, "");

    // Display Map
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXJlcm8iLCJhIjoiY2ptdzIwc2c0MzN6dzNrb2U0dHp6MzFpeiJ9.IyEBth3DnsPiNmeWGvnhpg';
    var map = new mapboxgl.Map({
        container: v.content,
        style: 'mapbox://styles/mapbox/streets-v10',
        zoom: 5.4,
        center: [2.5, 46.5]
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Draw coordinates
    function setCoords(x, y, text) {
        var pointCoord = [x, y];
        marker = new mapboxgl.Marker()
                .setLngLat(pointCoord)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(text))
                .addTo(map);		
    }

    setCoords(2.5, 46.5, "Texte");

}

// Append a visualization to the page
function appendToBody(title, content) {
    var r = Math.random();
    var id = {"visualization": "visualization-" + r, "title": "title-" + r, "content": "content-" + r};
    document.getElementById('page-content').innerHTML += '<div class="visualization" id="' + id.visualization + '"><div class="title" id="' + id.title + '">' + escapeHtml(title) + '</div><div class="content" id="' + id.content + '">' + content + '</div></div>';
    return id;
}