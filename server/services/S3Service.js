const s3 = require('../infra/S3/s3');

const uploadImage = async (image, key, mimetype) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    ContentType: mimetype,
    Key: key,
    Body: image,
    ACL: 'public-read',
  };

  const uploadPromise = s3.upload(params).promise();
  return uploadPromise;
};

module.exports = {
  uploadImage,
};
