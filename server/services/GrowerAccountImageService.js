const fs = require('fs');
const Session = require('../infra/database/Session');
const GrowerAccountImage = require('../models/GrowerAccountImage');
const { uploadImage } = require('./S3Service');

class GrowerAccountImageService {
  constructor() {
    this._session = new Session();
    this._growerAccount = new GrowerAccountImage(this._session);
  }

  async createImage({ file, body }) {
    try {
      // upload image
      const key = `treetracker_grower_account_image/${new Date().toISOString()}_${
        body.grower_account_id
      }`;
      const fileBuffer = await fs.promises.readFile(file.path);
      const uploadResult = await uploadImage(fileBuffer, key, file.mimetype);

      const growerAccountImage = await this._growerAccount.createImage({
        grower_account_id: body.grower_account_id,
        image_url: uploadResult.Location,
      });

      // delete temp file
      await fs.promises.unlink(file.path);

      return growerAccountImage;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }

      // delete temp file
      await fs.promises.unlink(file.path);
      throw e;
    }
  }

  async updateImage(imageObject) {
    try {
      const growerAccountImage = await this._growerAccount.updateImage(
        imageObject,
      );
      return growerAccountImage;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = GrowerAccountImageService;
