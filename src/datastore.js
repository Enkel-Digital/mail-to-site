const DB = {};

module.exports = {
  async add(obj) {
    // Use firebase add instead of generating like this to ensure no collisions
    const key = Math.random().toString(36).slice(2, 8);
    DB[key] = obj;

    return `http://localhost:3000/site/${key}`;
  },

  async get(key) {
    return DB[key];
  },

  async delete(key) {
    delete DB[key];
  },
};
