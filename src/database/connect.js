const mongoose = require('mongoose');

export const connectDatabase = (url) => {
  return mongoose.connect(url);
}
