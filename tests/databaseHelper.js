const mongoose = require('mongoose');
// require('dotenv').config();

const dropCollections = async () => {
  // await mongoose.connect(process.env.MONGO_URI);

  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
      console.log(`Collection ${collectionName} dropped!`);
    } catch (error) {
      // This error is thrown when the collection does not exist. It can be ignored.
      if (error.message !== 'ns not found') throw error;
    }
  }
};

module.exports = { dropCollections };
