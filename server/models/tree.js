const { raiseEvent, DomainEvent } = require('./DomainEvent');
const TreeRepository = require('../repositories/TreeRepository');
const EventRepository = require('../repositories/EventRepository');
const Capture = require('./Capture');
const knex = require('../infra/database/knex');

class Tree {
  constructor(session) {
    this._session = session;
    this._treeRepository = new TreeRepository(session);
  }

  static Tree({
    id,
    latest_capture_id,
    image_url,
    lat,
    lon,
    gps_accuracy,
    morphology,
    age,
    status,
    attributes,
    species_id,
    created_at,
    updated_at,
  }) {
    return Object.freeze({
      id,
      latest_capture_id,
      image_url,
      lat,
      lon,
      gps_accuracy,
      morphology,
      age,
      status,
      attributes,
      species_id,
      created_at,
      updated_at,
    });
  }

  _response(tree) {
    return this.constructor.Tree(tree);
  }

  async getTrees(filter, limitOptions) {
    const trees = await this._treeRepository.getByFilter(
      { ...filter, status: 'active' },
      limitOptions,
    );
    return trees.map((row) => this._response(row));
  }

  async getTreesCount(filter) {
    return this._treeRepository.countByFilter({ ...filter, status: 'active' });
  }

  async getTreeById(treeId) {
    const tree = await this._treeRepository.getById(treeId);
    return this._response(tree);
  }

  async createTree(treeObject) {
    const eventRepo = new EventRepository(this._session);

    const location = knex.raw(
      `ST_PointFromText('POINT(${treeObject.lon} ${treeObject.lat})', 4326)`,
    );

    const newTree = {
      ...treeObject,
      attributes: treeObject.attributes
        ? { entries: treeObject.attributes }
        : null,
      estimated_geometric_location: location,
      estimated_geographic_location: location,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const existingTrees = await this._treeRepository.getByFilter({
      id: newTree.id,
    });
    const [existingTree] = existingTrees;
    if (existingTree) {
      const domainEvent = await eventRepo.getDomainEvent(newTree.id);
      if (domainEvent.status !== 'sent') {
        return { domainEvent, tree: existingTree, eventRepo, status: 200 };
      }
      return { tree: this._response(existingTree), status: 200 };
    }

    const createdTree = await this._treeRepository.create({
      ...newTree,
    });

    const raiseTreeEvent = raiseEvent(eventRepo);
    const domainEvent = await raiseTreeEvent(DomainEvent(createdTree));

    return {
      domainEvent,
      tree: this._response(createdTree),
      eventRepo,
      status: 201,
    };
  }

  async updateTree(treeObject) {
    const updatedTree = await this._treeRepository.update({
      ...treeObject,
      updated_at: new Date().toISOString(),
    });

    return this._response(updatedTree);
  }

  async getPotentialMatches(captureId) {
    const capture = new Capture(this._session);
    const distance = 6;
    const potentialTrees = await this._treeRepository.getPotentialMatches(
      captureId,
      distance,
    );

    const matches = await Promise.all(
      potentialTrees.map(async (tree) => {
        const treeCopy = { ...tree };
        const captures = await capture.getCaptures({ tree_id: tree.id });
        treeCopy.captures = captures;
        return treeCopy;
      }),
    );

    return matches;
  }
}

module.exports = Tree;
