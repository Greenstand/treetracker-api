const sinon = require('sinon');
const chai = require('chai');
const assertArrays = require('chai-arrays');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(assertArrays);
const { expect } = chai;

const { treeInsertObject, createTree } = require('./tree');
const TreeRepository = require('../infra/repositories/TreeRepository');
const EventRepository = require('../infra/repositories/EventRepository');

describe('executing treeInsertObject function', () => {
  const tree = treeInsertObject({
    capture_id: 'fde165f6-5ebe-4ef6-aa46-fc0e391c1b78',
    image_url: 'http://test',
    lat: 10.15,
    lon: 15.03,
  });

  it('should return an immutable tree object', () => {
    tree.arandomNewAttribute = 1;
    expect(tree.arandomNewAttribute).to.equal(undefined);
  });

  it('should return an object with the required parameters', function () {
    expect(Object.keys(tree)).to.eql([
      'id',
      'latest_capture_id',
      'image_url',
      'lat',
      'lon',
      'gps_accuracy',
      'morphology',
      'age',
      'status',
      'attributes',
      'species_id',
      'created_at',
      'updated_at',
      'point',
    ]);
  });
});

describe('executing createTree function', () => {
  const tree = treeInsertObject({
    capture_id: 'fde165f6-5ebe-4ef6-aa46-fc0e391c1b78',
    image_url: 'http://test',
    lat: 10.15,
    lon: 15.03,
  });

  const repository = new TreeRepository();
  const eventRepository = new EventRepository();
  const stub = sinon.stub(repository, 'add');
  const eventStub = sinon.stub(eventRepository, 'add');
  const executeCreateTree = createTree(repository, eventRepository);

  it('should add tree to the repository', async () => {
    await executeCreateTree(tree);
    expect(stub).calledWith(tree);
    stub.restore();
    eventStub.restore();
  });
});
