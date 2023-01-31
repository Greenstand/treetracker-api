const GrowerAccountImageRepository = require('../repositories/GrowerAccountImageRepository');

class GrowerAccountImage {
  constructor(session) {
    this._growerAccountImageRepository = new GrowerAccountImageRepository(
      session,
    );
  }

  static GrowerAccountImage({
    id,
    grower_account_id,
    image_url,
    active,
    updated_at,
    created_at,
  }) {
    return Object.freeze({
      id,
      grower_account_id,
      image_url,
      active,
      updated_at,
      created_at,
    });
  }

  _response(growerAccountImage) {
    return this.constructor.GrowerAccountImage(growerAccountImage);
  }

  async createImage({ image_url, grower_account_id }) {
    const createdImage = await this._growerAccountImageRepository.create({
      image_url,
      grower_account_id,
    });

    return this._response(createdImage);
  }

  async updateImage(imageObject) {
    const updatedImage = await this._growerAccountImageRepository.update({
      ...imageObject,
      updated_at: new Date().toISOString(),
    });

    return this._response(updatedImage);
  }
}

module.exports = GrowerAccountImage;
