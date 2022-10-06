const Session = require('../infra/database/Session');
const Tree = require('../models/tree');
const QueueService = require('./QueueService');

class TreeService {
  constructor() {
    this._session = new Session();
    this._tree = new Tree(this._session);
  }

  async getTrees(filter, limitOptions) {
    return this._tree.getTrees(filter, limitOptions);
  }

  async getTreesCount(filter) {
    return this._tree.getTreesCount(filter);
  }

  async getTreeById(treeId) {
    return this._tree.getTreeById(treeId);
  }

  async createTree(treeObject) {
    try {
      await this._session.beginTransaction();
      const { tree, domainEvent, status } = await this._tree.createTree(
        treeObject,
      );

      await this._session.commitTransaction();

      if (domainEvent) {
        const queueService = new QueueService(this._session);
        await queueService.init();
        queueService.publishTreeCreatedMessage(domainEvent);
        queueService.tearDown();
      }

      return { tree, status };
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async updateTree(treeObject) {
    try {
      await this._session.beginTransaction();
      const tree = await this._tree.updateTree(treeObject);
      await this._session.commitTransaction();
      return tree;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async getPotentialMatches(captureId) {
    return this._tree.getPotentialMatches(captureId);
  }
}

module.exports = TreeService;
