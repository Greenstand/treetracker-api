const {
  captureSwagger,
  captureComponent,
  captureTagComponent,
} = require('./captureHandler/docs');
const {
  treeSwagger,
  treeComponent,
  treeTagComponent,
  treePotentialMatchesComponent,
} = require('./treeHandler/docs');
const { tagSwagger, tagComponent } = require('./tagHandler/docs');
const {
  growerAccountSwagger,
  growerAccountComponent,
} = require('./growerAccountHandler/docs');
const {
  growerAccountImageSwagger,
  growerAccountImageComponent,
} = require('./growerAccountImageHandler/docs');
const { version } = require('../../package.json');

const paths = {
  ...tagSwagger,
  ...treeSwagger,
  ...captureSwagger,
  ...growerAccountSwagger,
  ...growerAccountImageSwagger,
};

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Treetracker API',
    version,
  },
  paths,
  components: {
    schemas: {
      Tag: { ...tagComponent },
      Tree: { ...treeComponent },
      TreeTag: { ...treeTagComponent },
      Capture: { ...captureComponent },
      CaptureTag: { ...captureTagComponent },
      GrowerAccount: { ...growerAccountComponent },
      GrowerAccountImage: { ...growerAccountImageComponent },
      TreePotentialMatches: { ...treePotentialMatchesComponent },
    },
  },
};

module.exports = swaggerDefinition;
