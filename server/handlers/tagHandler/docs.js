const j2s = require('joi-to-swagger');
const {
  tagPostQuerySchema,
  tagPatchQuerySchema,
  tagGetQuerySchema,
} = require('./schemas');

const { swagger: tagPostSwagger } = j2s(tagPostQuerySchema);
const { swagger: tagPatchSwagger } = j2s(tagPatchQuerySchema);
const { swagger: tagGetSwagger } = j2s(tagGetQuerySchema);

const singleTagResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Tag',
      },
    },
  },
};

const tagSwagger = {
  '/tags': {
    post: {
      tags: ['tags'],
      summary: 'create a tag',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              ...tagPostSwagger,
            },
          },
        },
      },
      responses: {
        201: singleTagResponse,
      },
    },
    get: {
      tags: ['tags'],
      summary: 'get all tags',
      parameters: [
        {
          schema: {
            ...tagGetSwagger,
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
                      $ref: '#/components/schemas/Tag',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/tags/{tag_id}': {
    get: {
      tags: ['tags'],
      summary: 'get a single tag',
      parameters: [
        {
          schema: { type: 'string', format: 'uuid' },
          in: 'path',
          required: true,
          name: 'tag_id',
          description: 'id of tag to return',
        },
      ],
      responses: {
        200: singleTagResponse,
      },
    },
    patch: {
      tags: ['tags'],
      summary: 'update a tag',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              ...tagPatchSwagger,
            },
          },
        },
      },
      responses: {
        200: singleTagResponse,
      },
    },
  },
};

const tagComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    isPublic: { type: 'boolean' },
    status: { type: 'string', enum: ['active', 'deleted'] },
    owner_id: { type: 'string', format: 'uuid' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

module.exports = { tagSwagger, tagComponent };
