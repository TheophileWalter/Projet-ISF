// FUNCTION : convert CSV into JSON
function convertCsvJson(filename, csvLines) {	
	// get headers from CSV lines
	var csvHeaders = ["Régions", "Départements", "Code commune", "Commune", "Nombre de redevables", "Patrimoine moyen en €", "Impôt moyen en €"];
	// final json object
	var finalResult = [];	
	// for each CSV line
	for (var i = 1; i < csvLines.length; i++) {
		// ignore wrong and empty lines
		if (csvLines[i].includes("Aucune ville de plus de") || csvLines[i] == "") {
			continue;
		} else {
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
	}
	// build json
	var jsonData = {};
	jsonData["Année"] = filename;
	jsonData["Data"] = finalResult;
	var data = JSON.stringify(jsonData);
	
	var fs = require('fs');
	fs.writeFile("../data_json/"+filename + ".json", data, (error) => {});	
		
	return data;
}

// FUNCTION : open CSV file
function openFile(filename, csvPathFile) {
	// read CSV file
	var fs = require('fs');
	// split CSV file into lines 
	var csvFile = fs.readFileSync(csvPathFile).toString();
	// remove 3th INSEE number 
	csvFile = csvFile.replace(/(;\d\d)\d(\d\d\d;)/g, '$1$2');
	// remove blanks
	csvFile = csvFile.replace(/^\s+/g, '');
	// remove blanks
	csvFile = csvFile.replace(/\s+$/g, '\n');
	// remove blanks near ";"
	csvFile = csvFile.replace(/\s*;/g, ';');
	// remove ";$"
	csvFile = csvFile.replace(/;+$/g, '\n');
	// remove ";;;;;;;"
	csvFile = csvFile.replace(/;+/g, ';');
	// remove space in numbers
	csvFile = csvFile.replace(/(\d)\s(\d)/g, '$1$2');
	// remove "\r"
	csvFile = csvFile.replace(/\r/g, '');
	
	var csvLines = csvFile.split("\n");
	
	convertCsvJson(filename, csvLines);
}

// FUNCTION : list all csv files in folder
function getCsvFiles() {
	let path = '../data/';
	var fs = require('fs');
	var files = fs.readdirSync(path);
	
	files.forEach(function(filename) {
		if (filename.split('.').pop() == "csv") {
			openFile(filename.split('.')[0], path+filename);
		}
	});
}

// launch script
getCsvFiles();
console.log("[OK] convertCsvToJson.js");