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
function toolsEscapeHtml(unsafe) {
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

// Make a canvas fit it's container
// From https://stackoverflow.com/a/10215724
function fitToContainer(canvas, ratio){
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetWidth*ratio;
}

// Return the length of an on bject
function oLength(o) {
    var c = 0;
    Object.keys(o).forEach(function() {
        c++;
    });
    return c;
}

// Draw a line in a context
function drawLine(ctx, fromX, fromY, toX, toY, color='black') {
    var oldColor = ctx.fillStyle;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.strokeStyle = oldColor;
}

// Converts HSV color to RGV
// From https://stackoverflow.com/a/17243070
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// Add data to a chart.js
function chartAddData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

// Add annotations
function chartAddAnnotations(chart, annotation) {
    chart.options.annotation.annotations.push(annotation);
    chart.update();
}

// Remove data from a chart.js
function chartRemoveData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

// Add an horizontal line to a chart
function chartAddHorizontalLine(chart, value, name, color) {
    chartAddAnnotations(chart, {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: value,
        borderColor: color,
        borderWidth: 4,
        label: {
            enabled: true,
            content: name
        }
    });
}

// Function for checkbox change
function checkboxAnnotation(box, chartId, type) {

    // Configuration
    var names = {'mean':'Moyenne', 'min':'Minimum', 'max':'Maximum', 'med':'Médiane'};
    var colors = {'mean':'#e55039', 'min':'#f6b93b', 'max':'#78e08f', 'med':'#6a89cc'};

    // Add line
    if (box.checked) {

        // Compute the value
        var value = 0;
        switch (type) {
            case 'mean':
                for (var i = 0; i < chartList[chartId].data.datasets[0].data.length; i++) {
                    value += chartList[chartId].data.datasets[0].data[i];
                }
                value /= chartList[chartId].data.datasets[0].data.length;
                break;
            case 'min':
                value = Math.min(...chartList[chartId].data.datasets[0].data);
                break;
            case 'max':
                value = Math.max(...chartList[chartId].data.datasets[0].data);
                break;
            case 'med':
                values = chartList[chartId].data.datasets[0].data.slice();
                values.sort(function(a,b){return a-b;});
                if (values.length === 0) {
                    value = 0;
                } else {
                    var half = Math.floor(values.length / 2);
                    if (values.length % 2) {
                        value = values[half];
                    } else {
                        value = (values[half - 1] + values[half]) / 2.0;
                    }
                }
                break;
        }

        chartAddHorizontalLine(chartList[chartId], value, names[type], colors[type]); 
    }
    // Remove line
    else {

        // Find the ID
        var id = -1;
        for (var i = 0; i < chartList[chartId].options.annotation.annotations.length; i++) {
            if (chartList[chartId].options.annotation.annotations[i].label.content == names[type]) {
                chartList[chartId].options.annotation.annotations.splice(i, 1);
                break;
            }
        }

        // Update
        chartList[chartId].update();

    }
}