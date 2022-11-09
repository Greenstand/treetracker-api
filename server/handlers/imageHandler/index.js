const AWS = require('aws-sdk');
require('dotenv').config();
const log = require('loglevel');

AWS.config.update({ region: 'eu-west-3' });

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const uploadImage = async function ({ files }, res) {
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: files.file.name,
    Body: Buffer.from(files.file.data),
    ContentType: files.file.mimetype,
    ACL: 'public-read',
  };
  s3.upload(uploadParams, (err, data) => {
    if (err) {
      log.error('Error', err);
    } else {
      log.info(data);
      log.info('Upload Success', data.Location);
    }
  });
  res.send('Ok');
};

module.exports = {
  uploadImage,
};
