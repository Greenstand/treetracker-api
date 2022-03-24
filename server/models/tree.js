const { raiseEvent, DomainEvent } = require('./DomainEvent');
const TreeRepository = require('../repositories/TreeRepository');
const EventRepository = require('../repositories/EventRepository');

class Tree {
  constructor(session) {
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

  async getTrees(filter, limitOptions) {
    const trees = await this._treeRepository.getByFilter(
      { ...filter, status: 'active' },
      limitOptions,
    );
    return trees.map((row) => this.constructor.Tree(row));
  }

  async getTreesCount(filter) {
    return this._treeRepository.countByFilter(filter);
  }

  async getTreeById(treeId) {
    const tree = await this._treeRepository.getById(treeId);
    return this.constructor.Tree(tree);
  }

  async createTree(treeObject) {
    const eventRepo = new EventRepository(this._session);

    const newTree = {
      ...treeObject,
      point: `POINT( ${treeObject.lon} ${treeObject.lat} )`,
      attributes: treeObject.attributes
        ? { entries: treeObject.attributes }
        : null,
      // created_at: new Date().toISOString(),
      // updated_at: new Date().toISOString(),
    };
    const existingTree = await this.getTreeById(newTree.id);
    if (existingTree) {
      const domainEvent = await eventRepo.getDomainEvent(newTree.id);
      if (domainEvent.status !== 'sent') {
        return { domainEvent, tree: existingTree, eventRepo };
      }
      return { tree: existingTree };
    }
    const createdTree = await this._treeRepository.create(newTree);

    const raiseTreeEvent = raiseEvent(eventRepo);
    const domainEvent = await raiseTreeEvent(DomainEvent(createdTree));

    return { domainEvent, tree: createdTree, eventRepo };
  }

  async updateTree(treeObject) {
    return this._treeRepository.update({
      ...treeObject,
      updated_at: new Date().toISOString,
    });
  }

  async getPotentialMatches(captureId, getCaptures) {
    const distance = 6;
    const potentialTrees = await this._treeRepository.getPotentialMatches(
      captureId,
      distance,
    );

    const matches = await Promise.all(
      potentialTrees.map(async (tree) => {
        const treeCopy = { ...tree };
        const captures = await getCaptures({ tree_id: tree.id });
        treeCopy.captures = captures;
        return treeCopy;
      }),
    );

    return matches;
  }
}

module.exports = Tree;
