class Repository {
  constructor(repoImpl) {
    // repoImpl is the class that manages what db table is referenced
    this.repoImpl = repoImpl;
  }

  async add(data) {
    return this.repoImpl.add(data);
  }

  async update(data) {
    return this.repoImpl.update(data);
  }

  async getByFilter(filterCriteria, options) {
    return this.repoImpl.getByFilter(filterCriteria, options);
  }
}

module.exports = { Repository };
