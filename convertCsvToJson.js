// FUNCTION : convert CSV into JSON
function convertCsvJson(csvLines) {
	console.log("    START [convertCsvJson()]");
	// get headers from CSV lines
	var csvHeaders = csvLines[0].split(";");
	// final json object
	var finalResult = [];
	// for each CSV line
	for (var i = 1; i < csvLines.length; i++) {
		// split CSV lines into values
		var csvValues = csvLines[i].split(";");
		// init json object
		var jsonObj = {};
		// for each CSV header
		for (var j = 0; j < csvHeaders.length; j++) {
			// build json object
			jsonObj[csvHeaders[j]] = csvValues[j];
		}
		// push json object into final json
		finalResult.push(jsonObj);
	}
	// return json 
	//console.log(finalResult);
	console.log("    END [convertCsvJson()]");
	return JSON.stringify(finalResult);
}

// FUNCTION : open CSV file
function openFile(csvPathFile) {
	console.log("  START [openFile()]");
	// read CSV file
	var fs = require('fs');
	// split CSV file into lines 
	var csvFile = fs.readFileSync(csvPathFile).toString();
	// remove blanks
	csvFile = csvFile.replace(/(^\s|\s$)/g, '');
	// remove blanks near ";"
	csvFile = csvFile.replace(/(\s)?;(\s)?/g, ';');
	// remove ";;;;;;;"
	csvFile = csvFile.replace(/;;;;;;;/g, '');
	
	var csvLines = csvFile.split("\n");
	
	//console.log("csvLines : " + csvLines[0]);
	convertCsvJson(csvLines);
	console.log("  END [openFile()]");
}

// FUNCTION : list all csv files in folder
function getCsvFiles() {
	console.log("START [getCsvFiles()]");
	
	let path = 'data/';
	var fs = require('fs');
	var files = fs.readdirSync(path);
	
	files.forEach(function(filename) {
		if (filename.split('.').pop() == "csv") {
			openFile(path+filename);
		}
	});
	console.log("END [getCsvFiles()]");
}

getCsvFiles();