const fs = require("fs")

function makeJSON(array, filepath) {
	arrayJSON = JSON.stringify(array)
	fs.writeFile(filepath, arrayJSON, function(err) {
		if (err) {
			console.log(err);
		}
	})
	console.log("wrote file: " + filepath);
	return arrayJSON
}

function readJSON(filePath) {
	let jsonFile = fs.readFileSync(filePath);
	return JSON.parse(jsonFile);
}

function clone(object) {
	return JSON.parse(JSON.stringify(object))
}

module.exports = {
	makeJSON,
	readJSON,
	clone
}