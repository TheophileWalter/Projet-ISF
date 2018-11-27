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

// Add a chart
function displayChart(transformation, year=null) {

    closeDialog('dialog-chart');

    // Prepare the histogram
    var chartId = 'chartjs-' + Math.random();
    var ids = appendToBody('Histogramme', '<canvas id="' + chartId + '" width="400" height="350"></canvas>');
    var ctx = document.getElementById(chartId).getContext('2d');

    // Prepare the data
    var chartLabels = [];
    var chartDatasets = [];
    switch (transformation) {

        case 'yearly-mean-by-city':
            var chartData = [];
            var cityTotal = [];
            Object.keys(data).forEach(function(key) {

                // For each city in the year
                for (var i = 0; i < data[key].length; i++) {
                    var city = data[key][i]['Commune'];

                    // Check if we must add the city in the list
                    if (chartLabels.indexOf(city) === -1) {
                        cityTotal.push(0);
                        chartLabels.push(city);
                        chartData.push(0);
                    }

                    // Get the index of the city
                    var index = chartLabels.indexOf(city);

                    // Add te value
                    chartData[index] += parseFloat(data[key][i]['Impôt moyen en €']);
                    cityTotal[index] += 1;

                }

            });

            // Divide the values to compute the mean
            for (var i = 0; i < chartData.length; i++) {
                chartData[i] = parseInt(chartData[i]/cityTotal[i]);
            }

            // Sort them
            chartLabels = refSort(chartLabels, chartData);
            chartData.sort(function(a, b) {return a-b});

            var chartDatasets = [{
                label: 'Moyenne annuelle par ville',
                data: chartData,
                borderWidth: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderColor: 'rgba(0, 0, 0, 0.5)'
            }];
        break;

        case 'mean-by-year':
            var chartData = [];
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
            var chartDatasets = [{
                label: 'Valeur moyenne par redevable',
                data: chartData,
                borderWidth: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderColor: 'rgba(0, 0, 0, 0.3)'
            }];
        break;

        case 'max-by-year':
        case 'min-by-year':
            var isMax = transformation.indexOf('max') === 0;
            var chartData = [];
            Object.keys(data).forEach(function(key) {
                chartLabels.push(key);
                var res = isMax ? 0 : Number.MAX_VALUE;
                for (var i = 0; i < data[key].length; i++) {
                    var v = parseFloat(data[key][i]['Impôt moyen en €']);
                    var func = isMax ? Math.max : Math.min;
                    res = func(res, v);
                }
                chartData.push(parseInt(res));
            });
            var chartDatasets = [{
                label: (isMax ? 'Max' : 'Min') + 'imum par année',
                data: chartData,
                borderWidth: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderColor: 'rgba(0, 0, 0, 0.3)'
            }];
        break;

        case 'city-by-year':
            var chartData = [];
            var cityTotal = [];

            // For each city in the year
            for (var i = 0; i < data[year].length; i++) {
                var city = data[year][i]['Commune'];

                // Check if we must add the city in the list
                if (chartLabels.indexOf(city) === -1) {
                    cityTotal.push(0);
                    chartLabels.push(city);
                    chartData.push(0);
                }

                // Get the index of the city
                var index = chartLabels.indexOf(city);

                // Add te value
                chartData[index] += parseFloat(data[year][i]['Impôt moyen en €']);
                cityTotal[index] += 1;

            }

            // Sort them
            chartLabels = refSort(chartLabels, chartData);
            chartData.sort(function(a, b) {return a-b});

            var chartDatasets = [{
                label: 'Impôt moyen par ville en ' + year,
                data: chartData,
                borderWidth: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderColor: 'rgba(0, 0, 0, 0.5)'
            }];
        break;

    }

    var maxY = 0;
    for (; maxY-5e3 < globalMax; maxY += 5e3);

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
                        beginAtZero: true,
                        max: maxY
                    }
                }]
            },
            // Need to initialize the annotations to be able to add new after
            annotation: {
                annotations: []
            }
        }
    });

    // Saves the chart
    var chartId = "chart-" + Math.random();
    chartList[chartId] = myChart;

    // Add the checkboxs
    var checkBoxes = document.createElement('div');
    checkBoxes.innerHTML = 
        '<table cellspacing="0" cellpadding="0" border="0" style="width:100%;"><tr>' +
        '<td style="width:25%;"><label for="' + ids.content + '-mean">Moyenne</label><input type="checkbox" id="' + ids.content + '-mean" onchange="javascript:checkboxAnnotation(this,\'' + chartId + '\',\'mean\');"></td>' +
        '<td style="width:25%;"><label for="' + ids.content + '-min">Minimum</label><input type="checkbox" id="' + ids.content + '-min" onchange="javascript:checkboxAnnotation(this,\'' + chartId + '\',\'min\');"></td>' +
        '<td style="width:25%;"><label for="' + ids.content + '-max">Maximum</label><input type="checkbox" id="' + ids.content + '-max" onchange="javascript:checkboxAnnotation(this,\'' + chartId + '\',\'max\');"></td>' +
        '<td style="width:25%;"><label for="' + ids.content + '-med">Médiane</label><input type="checkbox" id="' + ids.content + '-med" onchange="javascript:checkboxAnnotation(this,\'' + chartId + '\',\'med\');"></td>' +
        '</tr></table>';
    document.getElementById(ids.content).appendChild(checkBoxes);

}

// Select a year for the chart
function selectChartYear() {
    closeDialog('dialog');
    $(function() {
        $('#dialog-chart-year').dialog();
    });
}

// Select a year for the map
function selectMapYear() {
    closeDialog('dialog');
    $(function() {
        $('#dialog-map-year').dialog();
    });
}

// Select a type for the map
function selectMapType(year) {
    closeDialog('dialog-map-year');
    document.getElementById('dialog-map-year-normal').year = year;
    document.getElementById('dialog-map-year-heat').year = year;
    $(function() {
        $('#dialog-map-type').dialog();
    });
}

// Called on click on add map button
function addMapButton(type, year) {
    addMap('Carte de France ' + year, fullLocations[year], type);
    closeDialog('dialog-map-type');
}

// Disolays the raw data
function addRawData() {
    var v = appendToBody("Données JSON brutes", renderJSON(data));
    var e = document.getElementById(v.content);
    e.style.maxHeight = "500px";
    e.style.overflow = "auto";
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
        switch (typeMap){
            case "normalMap":
                map.addSource("source",{
                    data: geoData,
                    type: "geojson",
                    cluster: true,
                    clusterMaxZoom: 16,
                    clusterRadius: 50,
                });

                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'source',
                    paint: {
                        'circle-color': {
                            property: 'point_count',
                            type: 'interval',
                            stops: [
                                [0, '#8DB255'],
                                [10, '#41A337'],
                                [30, '#2D7026'],
                                [75, '#407A52'],
                                [150, '#006442']
                            ]
                        },
                        'circle-radius': {
                            property: 'point_count',
                            type: 'interval',
                            stops: [
                                [0, 10],
                                [10, 15],
                                [30, 20],
                                [75, 30],
                                [150, 45]
                            ]
                        }
                    }
                });
    
                map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'source',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                });
    
                map.addLayer({
                    id: 'airport',
                    type: 'circle',
                    source: 'source',
                    filter: ['!has', 'point_count'],
                    paint: {
                        'circle-color': '#1EF008',
                        'circle-radius': 6,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#fff'
                    }
                });

                break;
            
            case "heatMap":
                map.addSource("source",{
                    "data": geoData,
                    "type": "geojson",
                });
    
                map.addLayer({
                    id: 'trees-heat',
                    type: 'heatmap',
                    source: 'source',
                    maxzoom: 22,
                    paint: {
                    // increase weight as diameter breast height increases
                    "heatmap-weight": [
                        "interpolate",
                        ["linear"],
                        ["get", "value"],
                        0, 0,
                        6, 1
                    ],
                    // increase intensity as zoom level increases
                    "heatmap-intensity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0, 1,
                        9, 3
                    ],
                    // assign color values be applied to points depending on their density
                    "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0, "rgba(33,102,172,0)",
                        0.2, "rgb(103,169,207)",
                        0.4, "rgb(209,229,240)",
                        0.6, "rgb(253,219,199)",
                        0.8, "rgb(239,138,98)",
                        1, "rgb(178,24,43)"
                    ],
                    // increase radius as zoom increases
                    'heatmap-radius': {
                        stops: [
                        [11, 15],
                        [15, 20]
                        ]
                    },
                    // decrease opacity to transition into the circle layer
                    "heatmap-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7, 1,
                        9, 0
                    ],
                    }
                }, 'waterway-label');

                map.addLayer({
                    "id": "heat-point",
                    "type": "circle",
                    "source": "source",
                    "minzoom": 7,
                    "paint": {
                        "circle-radius": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            7, [
                                "interpolate",
                                ["linear"],
                                ["get", "value"],
                                1, 1,
                                25000, 10
                            ],
                            16, [
                                "interpolate",
                                ["linear"],
                                ["get", "value"],
                                1, 5,
                                25000, 50
                            ]
                        ],
                        "circle-color": [
                            "interpolate",
                            ["linear"],
                            ["get", "value"],
                            1, "rgba(33,102,172,0)",
                            2, "rgb(103,169,207)",
                            3, "rgb(209,229,240)",
                            4, "rgb(253,219,199)",
                            5, "rgb(239,138,98)",
                            6, "rgb(178,24,43)"
                        ],
                        "circle-stroke-color": "white",
                        "circle-stroke-width": 1,
                        "circle-opacity": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            7, 0,
                            8, 1
                        ]
                    }
                }, 'waterway-label');

                map.addLayer({
                    id: "cluster-count",
                    type: "symbol",
                    source: "source",
                    filter: ["has", "value"],
                    layout: {
                        "text-field": "{value}",
                        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                        "text-size": 12
                    }
                });
                break;
        }       
    });
}

// Add a parallel coordinates chart (handmade)
function addParallelCoordinates() {

    // Prepare the canvas and the context
    var canvasId = 'chartjs-' + Math.random();
    appendToBody('Coordonnées parallèles', 'Impôt moyen des villes par années<br /><canvas id="' + canvasId + '"></canvas>');
    var canvas = document.getElementById(canvasId);
    fitToContainer(canvas, 0.7);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";

    // Compute some sizes
    var offsetWidth = canvas.width/20;
    var offsetHeight = canvas.height/30;
    var yearWidth = (canvas.width-2*offsetWidth)/(oLength(data)-1);
    var fontSize = parseInt(canvas.width/50);
    var fontSmallSize = parseInt(canvas.width/70);
    var scale = (canvas.height-2*offsetHeight)/(globalMax-globalMin);

    // Draw the min and the max value
    ctx.font = fontSmallSize + "px Arial";
    ctx.textAlign = 'right';
    ctx.fillText(globalMin, offsetWidth - 5, canvas.height - offsetHeight - fontSmallSize/2);
    ctx.fillText(globalMax, offsetWidth - 5, offsetHeight + fontSmallSize);

    // Iterate over the years
    var lastYear = null;
    var i = -1;
    var cityColor = {};
    Object.keys(data).forEach(function(key) {

        // Increment a signed integer value from one (0x1)
        i++;

        // Draw the year vertical line
        var x = offsetWidth + i*yearWidth;
        var lastX = offsetWidth + (i-1)*yearWidth;
        drawLine(ctx, x, offsetHeight, x, canvas.height - offsetHeight);

        // Display the year
        ctx.font = fontSize + "px Arial";
        ctx.textAlign = 'center';
        ctx.fillText(key, x, canvas.height - offsetHeight + fontSize);

        // Skip the first year
        if (lastYear === null) {
            // Saves the "first" last year
            lastYear = key;
            return;
        }

        // Draw for each city
        for (let i = 0; i < data[key].length; i++) {

            if (!(data[key][i]['Commune'] in cityColor)) {
                cityColor[data[key][i]['Commune']] = HSVtoRGB(data[key][i]['Impôt moyen en €']/globalMax, 1, 1);
            }
                
            let c = cityColor[data[key][i]['Commune']];
            let color = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';

            // Seach the previous position of the city
            for (let j = 0; j < data[lastYear].length; j++) {

                if (data[key][i]['Commune'] == data[lastYear][j]['Commune']) {
                    drawLine(ctx, lastX, canvas.height-offsetHeight-scale*parseInt(data[lastYear][j]['Impôt moyen en €']-globalMin), x, canvas.height-offsetHeight-scale*parseInt(data[key][i]['Impôt moyen en €']-globalMin), color);
                    break;
                }
            }

        }

        lastYear = key;

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