

function getAverage(yearList, dataType) {
    
    var nbValues = 0;
    var resAve = 0;

    // Iteration on selected years
    Object.keys(data).forEach(function(key) {
        // if current year is selected
        if (jQuery.inArray(key, yearList)) {
            // Iteration on dataType values
            for (var i = 0; i < data[key].length; i++) {
                resAve += data[key][i][dataType];
                nbValues += 1;
            }
        }        
    });

    // return average
    return (resAve / nbValues);
}


function getMediane(yearList, dataType) {
    
    var listValues = [];

    // Iteration on selected years
    Object.keys(data).forEach(function(key) {
        // if current year is selected
        if (jQuery.inArray(key, yearList)) {
            // Iteration on dataType values
            for (var i = 0; i < data[key].length; i++) {
                listValues.push(data[key][i][dataType]);
            }
        }        
    });

    // sort list
    listValues.sort();
    
    // if list is empty
    if (listValues.length == 0) {
        return -1;
    // if length is not pair
    } else if (listValues.length % 2 === 0) {
        return (listValues[listValues.length / 2] - 1);
    // length is impair, average of two middle values
    } else {
        // impair list middle + 1
        var lengthMiddle = Math.round(listValues.length / 2) - 1;
        return ((listValues[lengthMiddle]) - (listValues[lengthMiddle - 1]));
    }
}


function getMaximum(yearList, dataType) {
    
    var resMax = 0;

    // Iteration on selected years
    Object.keys(data).forEach(function(key) {
        // if current year is selected
        if (jQuery.inArray(key, yearList)) {
            // Iteration on dataType values
            for (var i = 0; i < data[key].length; i++) {
                if (resMax < data[key][i][dataType]) {
                    resMax = data[key][i][dataType];
                }
            }
        }        
    });

    // return maximum
    return resMax;
}


function getMinimum(yearList, dataType) {
    
    var resMin = 0;

    // Iteration on selected years
    Object.keys(data).forEach(function(key) {
        // if current year is selected
        if (jQuery.inArray(key, yearList)) {
            // Iteration on dataType values
            for (var i = 0; i < data[key].length; i++) {
                if (resMin > data[key][i][dataType]) {
                    resMin = data[key][i][dataType];
                }
            }
        }        
    });

    // return maximum
    return resMin;
}