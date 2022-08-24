class Pagination {
  constructor(page, size) {
    this.page = page;
    this.size = size;

    this.limit = this.size ? +this.size : 15;

    this.offset = this.page ? (this.page - 1) * this.limit : 0;

    return {
      limit: this.limit,
      offset: this.offset,
    };
  }
}

module.exports = Pagination;
