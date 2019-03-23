const fs = require("fs")
 
const bucketName = 'larryhudson-gigmap'
 
const uploadFile = async (s3, array) => {
const filePath = '../site/src/data/' + array + '.json'

  return await s3.upload({
	  Bucket: bucketName,
	  Key: (array + '.json'),
	  ACL: 'bucket-owner-full-control',
	  Body: fs.createReadStream(filePath)},
	)
  .promise()
  .then(res => {
  	console.log("uploaded file: " + array + ".json")
  	console.log(res)
  })
  .catch(e => {
  	console.log("error: ")
    console.log(e);
  });

}

async function getS3File(filename) {
  const params = {
    Bucket: 'some-bucket-name',
    Key: filename,
    Body: fileIO,
  };

  const response = await s3.getObject(params, (err) => {
    if (err) {
      // handle errors
    }
  }).promise();

  return JSON.parse(response.Body.toString()); // your file as a string
}

const readJSONfromS3 = (s3, array) => {
	var params = {Bucket: bucketName,
				  Key: (array + '.json')};
  	return s3.getObject(params).promise()
  	.then(response => {
  		console.log(response.Body.toString())
  		return JSON.parse(response.Body.toString())
  	}).
  	catch(e => {
  		console.log("error: ")
  		console.log(e);
  	})
}



// uploadFile(filePath, bucketName, key)
module.exports = {readJSONfromS3, uploadFile}