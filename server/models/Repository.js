class Repository {
  constructor(repoImpl) {
    // repoImpl is the class that manages what db table is referenced
    this.repoImpl = repoImpl;
  }

  async add(data) {
    console.log('REPOSITORY MODEL add', this.repoImpl, data);
    return await this.repoImpl.add(data);
  }

  async update(data) {
    console.log('REPOSITORY MODEL update', this.repoImpl, data);
    return await this.repoImpl.update(data);
  }

  async getByFilter(filterCriteria, options) {
    console.log(
      'REPOSITORY MODEL getByFilter',
      this.repoImpl,
      filterCriteria,
      options,
    );
    return await this.repoImpl.getByFilter(filterCriteria, options);
  }
}

module.exports = { Repository };
