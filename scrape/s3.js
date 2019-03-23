const fs = require("fs")
const AWS = require('aws-sdk')
require('dotenv').config()

var s3 = new AWS.S3();
 
const filePath = '../site/src/data/venues.json'
const bucketName = 'larryhudson-gigmap'
const key = 'venues.json'
 
const uploadFile = array => {
	const filePath = '../../site/src/data/' + array + '.json'

  s3.upload({
	  Bucket: 'larryhudson-gigmap',
	  Key: (array + '.json'),
	  ACL: 'bucket-owner-full-control',
	  Body: fs.createReadStream(filePath),
	  ContentType: "application/json"},
	)
  .promise()
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });

}

const downloadFile = array => {
	const filePath = '../../site/src/data/' + array + '.json'
	var params = {Bucket: bucketName, Key: (array + '.json')};
  var file = fs.createWriteStream(filePath);
	var writeFile = s3.getObject(params).createReadStream().pipe(file); 
 	writeFile.on('finish', function () {
 		console.log('finished downloading file to ' + filePath)
 	});
}

// uploadFile(filePath, bucketName, key)
downloadFile('venues')