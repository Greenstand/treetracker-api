const j2s = require('joi-to-swagger');
const { growerAccountImagePatchSchema } = require('./schemas');

const { swagger: imagePatchSchema } = j2s(growerAccountImagePatchSchema);

const singleImageResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/GrowerAccountImage',
      },
    },
  },
};

const growerAccountImageSwagger = {
  '/grower_accounts/image': {
    post: {
      tags: ['grower accounts'],
      summary: 'upload an image for a grower account',
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                image: {
                  type: 'string',
                  format: 'binary',
                },
                grower_account_id: {
                  type: 'string',
                  format: 'uuid',
                },
              },
            },
          },
        },
      },
      responses: {
        201: singleImageResponse,
      },
    },
  },
  '/grower_accounts/image/{image_id}': {
    patch: {
      tags: ['grower accounts'],
      summary: 'update a grower account image',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              ...imagePatchSchema,
            },
          },
        },
      },
      responses: {
        200: singleImageResponse,
      },
    },
  },
};

const growerAccountImageComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    grower_account_id: { type: 'string', format: 'uuid' },
    image_url: { type: 'string' },
    active: { type: 'boolean' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

module.exports = { growerAccountImageSwagger, growerAccountImageComponent };
