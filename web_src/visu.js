// Button to add a visualization
function addVisualization() {
    $(function() {
        $('#dialog').dialog();
    });
}

// Display the chart selection dialog
function selectChart() {
    closeDialog('dialog');
    $(function() {
        $('#dialog-chart').dialog();
    });
}

// Add a test chart
function displayChart(transformation) {

    // Prepare the histogram
    var chartId = 'chartjs-' + Math.random();
    appendToBody('Chart test', '<canvas id="' + chartId + '" width="400" height="400"></canvas>');
    var ctx = document.getElementById(chartId).getContext('2d');

    // Prepare the data
    labels = {};
    data = {};
    switch (transformation) {

        case 'yearly-mean-by-city':
            
        break;

    }

    // Add data to histogram
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

// Select a year for the map
function selectMapYear() {
    closeDialog('dialog');
    $(function() {
        $('#dialog-map-year').dialog();
    });
}

// Add a map to the page
function addMap(title, geoData, typeMap) {

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

    map.on('load', function () {

        map.addSource("source",{
            "data": geoData,
            "type": "geojson",
        });

        switch (typeMap){
            case "normalMap":
                map.addLayer({
                    "id": "points",
                    "type": "circle",
                    "source": "source1",
                    "paint":{
                        "circle-color" :"#F00",
                        "circle-radius": ["number", ['get', 'sizec'], 2],
                        "circle-stroke-width": 1
                    }
                });
            case "heatMap":
                map.addLayer({
                    id: 'trees-heat',
                    type: 'heatmap',
                    source: 'source',
                    maxzoom: 15,
                    paint: {
                    // increase weight as diameter breast height increases
                    'heatmap-weight': {
                        property: 'dbh',
                        type: 'exponential',
                        stops: [
                        [1, 0],
                        [62, 1]
                        ]
                    },
                    // increase intensity as zoom level increases
                    'heatmap-intensity': {
                        stops: [
                        [11, 1],
                        [15, 3]
                        ]
                    },
                    // assign color values be applied to points depending on their density
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(236,222,239,0)',
                        0.2, 'rgb(208,209,230)',
                        0.4, 'rgb(166,189,219)',
                        0.6, 'rgb(103,169,207)',
                        0.8, 'rgb(28,144,153)'
                    ],
                    // increase radius as zoom increases
                    'heatmap-radius': {
                        stops: [
                        [11, 15],
                        [15, 20]
                        ]
                    },
                    // decrease opacity to transition into the circle layer
                    'heatmap-opacity': {
                        default: 1,
                        stops: [
                        [14, 1],
                        [15, 0]
                        ]
                    },
                    }
                }, 'waterway-label');
            default:
                console.log("ERROR : type map / switch case") 
        }       
    });
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
    divTitle.innerHTML = escapeHtml(title) + '<div class="close-visu" title="Supprimer" onclick="javascript:removeVisualization(\'' + id.visualization + '\');"></div>';
    div.appendChild(divTitle);
    var divContent = document.createElement('div');
    divContent.className = 'content';
    divContent.id = id.content;
    divContent.innerHTML = content;
    div.appendChild(divContent);
    document.getElementById('page-content').appendChild(div);
    
    return id;
}

// Removes a visualization
function removeVisualization(id) {
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}