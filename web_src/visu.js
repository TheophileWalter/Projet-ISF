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
    appendToBody('Histogramme', '<canvas id="' + chartId + '" width="400" height="350"></canvas>');
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

            console.log(chartData);
            console.log(chartLabels);

            var chartDatasets = [{
                label: 'Moyenne annuelle par ville',
                data: chartData,
                borderWidth: 1
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
                borderWidth: 1
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
                borderWidth: 1
            }];
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

        switch (typeMap) {
            case "normalMap":

                map.on('load', function () {

                    map.addSource("source",{
                        "data": geoData,
                        "type": "geojson",
                    });
                    map.addLayer({
                        "id": "points",
                        "type": "circle",
                        "source": "source",
                        "paint":{
                            "circle-color" :"#F00",
                            "circle-radius": ["number", ['get', 'sizec'], 2],
                            "circle-stroke-width": 1
                        }
                    });
                });

                break;
            case "heatMap":
                map.on('load', function () {

                    map.addSource("source",{
                        "data": geoData,
                        "type": "geojson",
                    });
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
                });
                break;
        }
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