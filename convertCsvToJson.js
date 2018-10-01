// FUNCTION : convert CSV into JSON
function convertCsvJson(filename, csvLines) {
	console.log("    START [convertCsvJson()]");
	// get headers from CSV lines
	var csvHeaders = ["Régions", "Départements", "Code commune", "Commune", "Nombre de redevables", "Patrimoine moyen en €", "Impôt moyen en €"];
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

	var data = JSON.stringify(finalResult);
	var fs = require('fs');
	fs.writeFile("data_json/"+filename + ".json", data);	
	
	return data;
}

// FUNCTION : open CSV file
function openFile(filename, csvPathFile) {
	console.log("  START [openFile()]");
	// read CSV file
	var fs = require('fs');
	// split CSV file into lines 
	var csvFile = fs.readFileSync(csvPathFile).toString();
	// remove blanks
	csvFile = csvFile.replace(/(^(\s)*|(\s)*$)/g, '');
	// remove blanks near ";"
	csvFile = csvFile.replace(/(\s)*;(\s)*/g, ';');
	// remove ";;;;;;;"
	csvFile = csvFile.replace(/;;;;;;;/g, '');
	// remove space in numbers
	csvFile = csvFile.replace(/(\d)\s(\d)/g, '$1$2');
	// remove 3th INSEE number 
	csvFile = csvFile.replace(/(\d)(\d)\d(\d)(\d)(\d)/g, '$1$2$3$4$5');
	
	var csvLines = csvFile.split("\n");
	
	//console.log("csvLines : " + csvLines[0]);
	convertCsvJson(filename, csvLines);
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
			openFile(filename.split('.')[0], path+filename);
		}
	});
	console.log("END [getCsvFiles()]");
}

// launch script
getCsvFiles();