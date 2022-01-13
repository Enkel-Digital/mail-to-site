// Get firestore object only
const fs = require("@enkeldigital/firebase-admin").firestore();

module.exports = {
  add: async (obj) =>
    fs
      .collection("data")
      // Use add to auto generate keys to ensure no collisions
      .add(obj)
      .then(({ id }) => `http://localhost:3000/site/${id}`),

  get: async (key) =>
    fs
      .collection("data")
      .doc(key)
      .get()
      .then((snapshot) => snapshot.data()),

  del: async (key) => fs.collection("data").doc(key).delete(),
};
