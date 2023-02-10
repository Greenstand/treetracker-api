const j2s = require('joi-to-swagger');
const {
  treePostSchema: postJoiSchema,
  treeGetQuerySchema: getJoiSchema,
  treeTagPatchSchema: treeTagsJoiPatchSchema,
  treeTagsPostSchema: treeTagsJoiPostSchema,
  treePotentialMatchestSchema,
  treePatchSchema: patchJoiSchema,
} = require('./schemas');

const { swagger: treePostSchema } = j2s(postJoiSchema);
const { swagger: treeGetSchema } = j2s(getJoiSchema);
const { swagger: treePatchSchema } = j2s(patchJoiSchema);
const { swagger: treeTagsPostSchema } = j2s(treeTagsJoiPostSchema);
const { swagger: treeTagPatchSchema } = j2s(treeTagsJoiPatchSchema);
const { swagger: potentialMatchesSchema } = j2s(treePotentialMatchestSchema);

const singleTreeResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Tree',
      },
    },
  },
};

const singleTreeTagResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/TreeTag',
      },
    },
  },
};

const treeSwagger = {
  '/trees': {
    get: {
      tags: ['trees'],
      summary: 'get all trees',
      parameters: [
        {
          schema: {
            ...treeGetSchema,
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
                      $ref: '#/components/schemas/Tree',
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
      tags: ['trees'],
      summary: 'create a new tree',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...treePostSchema },
          },
        },
      },
      responses: {
        201: singleTreeResponse,
        200: singleTreeResponse,
      },
    },
  },
  '/trees/{tree_id}': {
    get: {
      tags: ['trees'],
      summary: 'get a single tree',
      parameters: [
        {
          schema: { type: 'string', format: 'uuid' },
          in: 'path',
          required: true,
          name: 'tree_id',
          description: 'id of tree to return',
        },
      ],
      responses: {
        200: singleTreeResponse,
      },
    },
    patch: {
      tags: ['trees'],
      summary: 'update a tree',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              ...treePatchSchema,
            },
          },
        },
      },
      responses: {
        200: singleTreeResponse,
      },
    },
  },
  '/trees/{tree_id}/tags': {
    get: {
      tags: ['tree tags'],
      summary: 'get all tags for a single tree',
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
                      $ref: '#/components/schemas/TreeTag',
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
      tags: ['tree tags'],
      summary: 'add tags to a tree',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...treeTagsPostSchema },
          },
        },
      },
      responses: { 204: {} },
    },
  },
  '/trees/{tree_id}/tags/{tag_id}': {
    get: {
      tags: ['tree tags'],
      summary: 'get a single tag for a single tree',
      parameters: [
        {
          schema: { type: 'string', format: 'uuid' },
          in: 'path',
          required: true,
          name: 'tree_id',
          description: 'id of tree to return',
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
        200: singleTreeTagResponse,
      },
    },
    patch: {
      tags: ['tree tags'],
      summary: 'update a tree tag relationship',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              ...treeTagPatchSchema,
            },
          },
        },
      },
      responses: {
        200: singleTreeTagResponse,
      },
    },
  },
  '/trees/potential_matches': {
    get: {
      tags: ['trees'],
      summary: 'get potential tree matches for a capture',
      parameters: [
        {
          schema: {
            ...potentialMatchesSchema,
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
                      $ref: '#/components/schemas/TreePotentialMatches',
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
};

const treeComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    latest_capture_id: { type: 'string', format: 'uuid' },
    image_url: { type: 'string' },
    lat: { type: 'number' },
    lon: { type: 'number' },
    gps_accuracy: { type: 'number' },
    morphology: { type: 'string' },
    age: { type: 'number' },
    status: { type: 'string' },
    attributes: { type: 'object' },
    species_id: { type: 'string', format: 'uuid' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

const treeTagComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    tree_id: { type: 'string', format: 'uuid' },
    tag_id: { type: 'string', format: 'uuid' },
    tag_name: { type: 'string' },
    status: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

const treePotentialMatchesComponent = {
  type: 'object',
  properties: {
    ...treeComponent.properties,
    captures: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/Capture',
      },
    },
  },
};

module.exports = {
  treeSwagger,
  treeComponent,
  treeTagComponent,
  treePotentialMatchesComponent,
};
