const Session = require('../models/Session');
const Tree = require('../models/tree');
const { dispatch } = require('../models/DomainEvent');
const { publishMessage } = require('./RabbitMQService');

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

  async createTag(treeObject) {
    try {
      await this._session.beginTransaction();
      const { tree, domainEvent, eventRepo } = await this._tree.createTree(
        treeObject,
      );

      await this._session.commitTransaction();

      if (domainEvent) {
        const eventDispatch = dispatch(eventRepo, publishMessage);
        eventDispatch('tree-created', domainEvent);
      }

      return tree;
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
