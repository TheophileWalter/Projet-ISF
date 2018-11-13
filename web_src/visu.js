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

    closeDialog('dialog-chart');

    // Prepare the histogram
    var chartId = 'chartjs-' + Math.random();
    appendToBody('Chart test', '<canvas id="' + chartId + '" width="400" height="400"></canvas>');
    var ctx = document.getElementById(chartId).getContext('2d');

    // Prepare the data
    var chartLabels = [];
    var chartData = [];
    var chartDatasets = [];
    switch (transformation) {

        case 'yearly-mean-by-city':

        break;

        case 'mean-by-year':
            Object.keys(data).forEach(function(key) {
                chartLabels.push(key);
                var sum = 0;
                var total = 0;
                for (var i = 0; i < data[key].length; i++) {
                    var nb = parseFloat(data[key][i]['Nombre de redevables']);
                    sum += parseFloat(data[key][i]['Impôt moyen en €']) * nb;
                    total += nb;
                }
                chartData.push(parseInt(sum/total));
            });
            chartDatasets = [{
                label: 'Valeur moyenne par redevable',
                data: chartData,
                borderWidth: 1
            }];
            console.log(chartDatasets);
        break;

    }

    // Add data to histogram
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: chartDatasets
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

    map.on('load', function () {

        map.addSource("source1",{
            "data": geoData,
            "type": "geojson",
        });

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
    });
}
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