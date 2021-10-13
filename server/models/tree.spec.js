const sinon = require('sinon');
const chai = require('chai');
const assertArrays = require('chai-arrays');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(assertArrays);
const { expect } = chai;

const { treeFromRequest, createTree } = require('./tree.js');
const TreeRepository = require('../infra/database/TreeRepository');

describe('executing treeFromRequest function', () => {
  const tree = treeFromRequest({
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
    expect(Object.keys(tree)).to.equalTo([
      'id',
      'latest_capture_id',
      'image_url',
      'lat',
      'lon',
      'species_id',
      'morphology',
      'age',
      'status',
    ]);
  });
});

describe('executing createTree function', () => {
  const tree = treeFromRequest({
    capture_id: 'fde165f6-5ebe-4ef6-aa46-fc0e391c1b78',
    image_url: 'http://test',
    lat: 10.15,
    lon: 15.03,
  });

  const repository = new TreeRepository();
  const stub = sinon.stub(repository, 'add');
  const executeCreateTree = createTree(repository);

  it('should add tree to the repository', async () => {
    await executeCreateTree(tree);
    expect(stub).calledWith(tree);
    stub.restore();
  });
});
