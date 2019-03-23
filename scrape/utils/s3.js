const fs = require("fs")
 
const bucketName = 'larryhudson-gigmap'
 
const uploadFiles = (s3) => {
const venuesPath = '../site/src/data/venues.json'
const eventsPath = '../site/src/data/events.json'

s3.upload({
	  Bucket: bucketName,
	  Key: ('events.json'),
	  ACL: 'bucket-owner-full-control',
	  Body: fs.createReadStream(eventsPath)},
	)
  .promise()
  .then(res => {
  	console.log("uploaded file: events.json")
  	s3.upload({
	  Bucket: bucketName,
	  Key: ('venues.json'),
	  ACL: 'bucket-owner-full-control',
	  Body: fs.createReadStream(venuesPath)},
	)
    .promise()
    .then(res => {
    	console.log("uploaded file: venues.json")
    })
    .catch(e => {
  	console.log("error: ")
    console.log(e);
  	});
  })
  .catch(e => {
  	console.log("error: ")
    console.log(e);
  });

}

const readJSONfromS3 = (s3, array) => {
	var params = {Bucket: bucketName,
				  Key: (array + '.json')};
  	return s3.getObject(params).promise()
  	.then(response => {
  		console.log("got file from S3: " + array + '.json')
  		return JSON.parse(response.Body.toString())
  	}).
  	catch(e => {
  		console.log("error: ")
  		console.log(e);
  	})
}



// uploadFile(filePath, bucketName, key)
module.exports = {readJSONfromS3, uploadFiles}