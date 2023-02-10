const j2s = require('joi-to-swagger');
const {
  growerAccountPostQuerySchema,
  growerAccountGetQuerySchema,
  growerAccountPatchQuerySchema,
} = require('./schemas');

const { swagger: growerAccountPostSchema } = j2s(growerAccountPostQuerySchema);
const { swagger: growerAccountGetSchema } = j2s(growerAccountGetQuerySchema);
const { swagger: growerAccountPatchSchema } = j2s(
  growerAccountPatchQuerySchema,
);

const singleGrowerAccountResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/GrowerAccount',
      },
    },
  },
};

const growerAccountSwagger = {
  '/grower_accounts': {
    post: {
      tags: ['grower accounts'],
      summary: 'create a new grower account',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...growerAccountPostSchema },
          },
        },
      },
      responses: {
        201: singleGrowerAccountResponse,
        200: singleGrowerAccountResponse,
      },
    },
    get: {
      tags: ['grower accounts'],
      summary: 'get all grower accounts',
      parameters: [
        {
          schema: {
            ...growerAccountGetSchema,
          },
          in: 'query',
          name: 'query',
          description: 'Allowed query parameters',
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tags: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/GrowerAccount',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: ['grower accounts'],
      summary: 'upsert a grower account',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...growerAccountPostSchema },
          },
        },
      },
      responses: {
        201: singleGrowerAccountResponse,
        200: singleGrowerAccountResponse,
      },
    },
  },
  '/grower_accounts/{grower_account_id}': {
    get: {
      tags: ['grower accounts'],
      summary: 'get a single grower account',
      parameters: [
        {
          schema: { type: 'string', format: 'uuid' },
          in: 'path',
          required: true,
          name: 'grower_account_id',
          description: 'id of grower account to return',
        },
      ],
      responses: {
        200: singleGrowerAccountResponse,
      },
    },
    patch: {
      tags: ['grower accounts'],
      summary: 'update a grower account',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              ...growerAccountPatchSchema,
            },
          },
        },
      },
      responses: {
        200: singleGrowerAccountResponse,
      },
    },
  },
};

const growerAccountComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    reference_id: { type: 'number' },
    wallet: { type: 'string' },
    person_id: { type: 'string', format: 'uuid' },
    organization_id: { type: 'string', format: 'uuid' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    about: { type: 'string' },
    lat: { type: 'number' },
    lon: { type: 'number' },
    location: { type: 'string' },
    image_url: { type: 'string' },
    image_rotation: { type: 'string' },
    organizations: { type: 'array', items: { type: 'string', format: 'uuid' } },
    images: { type: 'array', items: { type: 'string' } },
    status: { type: 'string' },
    first_registration_at: { type: 'string', format: 'date-time' },
    gender: { type: 'string', enum: ['active', 'deleted'] },
    bulk_pack_file_name: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

module.exports = { growerAccountSwagger, growerAccountComponent };
