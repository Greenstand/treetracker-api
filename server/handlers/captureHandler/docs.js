const j2s = require('joi-to-swagger');
const {
  captureGetQuerySchema: getJoiSchema,
  captureTagPatchSchema: captureTagsJoiPatchSchema,
  captureTagsPostSchema: captureTagsJoiPostSchema,
  capturePatchSchema: patchJoiSchema,
  capturePostSchema: postJoiSchema,
} = require('./schemas');

const { swagger: capturePostSchema } = j2s(postJoiSchema);
const { swagger: captureGetSchema } = j2s(getJoiSchema);
const { swagger: capturePatchSchema } = j2s(patchJoiSchema);
const { swagger: captureTagsPostSchema } = j2s(captureTagsJoiPostSchema);
const { swagger: captureTagPatchSchema } = j2s(captureTagsJoiPatchSchema);

const singleCaptureResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Capture',
      },
    },
  },
};

const singleCaptureTagResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/CaptureTag',
      },
    },
  },
};

const captureSwagger = {
  '/captures': {
    get: {
      tags: ['captures'],
      summary: 'get all captures',
      parameters: [
        {
          schema: {
            ...captureGetSchema,
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
                      $ref: '#/components/schemas/Capture',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['captures'],
      summary: 'create a new capture',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...capturePostSchema },
          },
        },
      },
      responses: {
        201: singleCaptureResponse,
        200: singleCaptureResponse,
      },
    },
  },
  '/captures/{capture_id}': {
    get: {
      tags: ['captures'],
      summary: 'get a single capture',
      parameters: [
        {
          schema: { type: 'string', format: 'uuid' },
          in: 'path',
          required: true,
          name: 'capture_id',
          description: 'id of capture to return',
        },
      ],
      responses: {
        200: singleCaptureResponse,
      },
    },
    patch: {
      tags: ['captures'],
      summary: 'update a capture',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              ...capturePatchSchema,
            },
          },
        },
      },
      responses: {
        200: singleCaptureResponse,
      },
    },
  },
  '/captures/{capture_id}/tags': {
    get: {
      tags: ['capture tags'],
      summary: 'get all tags for a single capture',
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
                      $ref: '#/components/schemas/CaptureTag',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['capture tags'],
      summary: 'add tags to a capture',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...captureTagsPostSchema },
          },
        },
      },
      responses: { 204: {} },
    },
  },
  '/captures/{capture_id}/tags/{tag_id}': {
    get: {
      tags: ['capture tags'],
      summary: 'get a single tag for a single capture',
      parameters: [
        {
          schema: { type: 'string', format: 'uuid' },
          in: 'path',
          required: true,
          name: 'capture_id',
          description: 'id of capture to return',
        },
        {
          schema: { type: 'string', format: 'uuid' },
          in: 'path',
          required: true,
          name: 'tag_id',
          description: 'id of tag to return',
        },
      ],
      responses: {
        200: singleCaptureTagResponse,
      },
    },
    patch: {
      tags: ['capture tags'],
      summary: 'update a capture tag relationship',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              ...captureTagPatchSchema,
            },
          },
        },
      },
      responses: {
        200: singleCaptureTagResponse,
      },
    },
  },
};

const captureComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    reference_id: { type: 'number' },
    tree_id: { type: 'string', format: 'uuid' },
    image_url: { type: 'string' },
    lat: { type: 'number' },
    lon: { type: 'number' },
    created_at: { type: 'string', format: 'date-time' },
    status: { type: 'string' },
    captured_at: { type: 'string', format: 'date-time' },
    planting_organization_id: { type: 'string', format: 'uuid' },
    tag_array: { type: 'array', items: { type: 'string' } },
    grower_account_id: { type: 'string', format: 'uuid' },
    morphology: { type: 'string' },
    age: { type: 'number' },
    note: { type: 'string' },
    attributes: { type: 'object' },
    species_id: { type: 'string', format: 'uuid' },
    session_id: { type: 'string', format: 'uuid' },
    device_configuration_id: { type: 'string', format: 'uuid' },
  },
};

const captureTagComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    capture_id: { type: 'string', format: 'uuid' },
    tag_id: { type: 'string', format: 'uuid' },
    tag_name: { type: 'string' },
    status: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

module.exports = { captureSwagger, captureComponent, captureTagComponent };
