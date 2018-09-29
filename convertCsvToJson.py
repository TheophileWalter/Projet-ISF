
# FUNCTION : convert CSV into JSON
function convertCsvJson(csvFile) {
	
	# read CSV file
	var fs = require('fs');
 
	# Asynchronous read
	fs.open(csvFile, 'r', function (err, data) {
	   if (err) {
		  return console.error(err);
	   }
	   console.log("Asynchronous read: " + data.toString());
	});
	 
	# Synchronous read
	var data = fs.readFileSync('../differentDir/input.txt');
	console.log("Synchronous read: " + data.toString());
	 
	console.log("Program Ended");
		
	# split CSV file into lines 
	var csvLines = str.split("\n");
	
	console.log(csvLines);
	# remove blanks
	csvLines = csvLines.replace(/(^\s|\s$)/g, '');
	
	# remove blanks near ";"
	csvLines = csvLines.replace(/(\s)?;(\s)?/g, ';');
	
	# get headers from CSV lines
	var csvHeaders = csvLines[0].split(";");
	
	var finalResult = [];
	
	# for each CSV line
	for (var i = 1; i < csvLines.length; i++) {
		
		# split CSV lines into values
		var csvValues = csvLines[i].split(";");
	
		# init json object
		var jsonObj = {};
		
		# for each CSV header
		for (var j = 0; j < csvHeaders.length; j++) {
						
			# build json object
			jsonObj[csvHeaders[j]] = csvValues[j];
		}
	
		# push json object into final json
		finalResult.push(jsonObj);
	}
	
	# close CSV file
	csvFile.close();
	
	# return json 
	console.log(finalResult);
	return JSON.stringify(finalResult);
}

convertCsvJson("data/2016.csv");
