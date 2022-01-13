const DB = {};

module.exports = {
  async add(obj) {
    const key = Math.random().toString(36).slice(2, 8);
    DB[key] = obj;

    return `http://localhost:3000/site/${key}`;
  },

  async get(key) {
    return DB[key];
  },

  async del(key) {
    delete DB[key];
  },
};
