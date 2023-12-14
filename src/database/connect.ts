const mongoose = require('mongoose');

export const connectDatabase = (url: string): Promise<typeof mongoose> => {
  return mongoose.connect(url);
};
