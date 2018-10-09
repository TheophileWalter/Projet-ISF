// Button to add a visualization
function addVisualization(title, content) {
    appendToBody("Hello ceci est ma visualisation", "And the Raven, never flitting, still is sitting, still is sitting<br />" +
        "On the pallid bust of Pallas just above my chamber door;<br />" +
        "And his eyes have all the seeming of a demon’s that is dreaming,<br />" +
        "And the lamp-light o’er him streaming throws his shadow on the floor;<br />" +
        "And my soul from out that shadow that lies floating on the floor<br />" +
        "Shall be lifted—nevermore!");
}

// Append a visualization to the page
function appendToBody(title, content) {
    document.getElementById('page-content').innerHTML += '<div class="visualization"><div class="title">' + escapeHtml(title) + '</div><div class="content">' + content + '</div></div>';
}