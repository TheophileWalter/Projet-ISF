var currentPres = 0;

// Button to add a visualization
function addVisualization(title, content) {
    switch(currentPres) {
        case 1:
            appendToBody("Hello ceci est ma visualisation", "And the Raven, never flitting, still is sitting, still is sitting<br />" +
            "On the pallid bust of Pallas just above my chamber door;<br />" +
            "And his eyes have all the seeming of a demon’s that is dreaming,<br />" +
            "And the lamp-light o’er him streaming throws his shadow on the floor;<br />" +
            "And my soul from out that shadow that lies floating on the floor<br />" +
            "Shall be lifted—nevermore!");
        break;
        case 0:
            addMap("Carte de France", fullLocations);
        break;
        case 2:
            addTestChart();
        break;
    }
    currentPres++;
}

// Add a test chart
function addTestChart() {
    var chartId = 'chartjs-' + Math.random();
    appendToBody('Chart test', '<canvas id="' + chartId + '" width="400" height="400"></canvas>');
    var ctx = document.getElementById(chartId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
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
        zoom: 4,
        center: [2.5, 46.5]
    });

    /*
    // French Map with marker
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Draw coordinates
    function setCoords(x, y, text) {
        var pointCoord = [x, y];
        marker = new mapboxgl.Marker()
                .setLngLat(pointCoord)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(text))
                .addTo(map);		
    }

    // loop data
    geoData.forEach(elements => {
        setCoords(elements[1], elements[0], "impôt moyen : "+elements[2]+"€<br />ville : "+elements[3]);
    });*/
}

// Append a visualization to the page
function appendToBody(title, content) {
    var r = Math.random();
    var id = {"visualization": "visualization-" + r, "title": "title-" + r, "content": "content-" + r};

    var div = document.createElement('div');
    div.className = 'visualization';
    div.id = id.visualization;
    var divTitle = document.createElement('div');
    divTitle.className = 'title';
    divTitle.id = id.title;
    divTitle.innerHTML = escapeHtml(title);
    div.appendChild(divTitle);
    var divContent = document.createElement('div');
    divContent.className = 'content';
    divContent.id = id.content;
    divContent.innerHTML = content;
    div.appendChild(divContent);
    document.getElementById('page-content').appendChild(div);
    
    return id;
}