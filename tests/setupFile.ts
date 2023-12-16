// import * as mongoose from 'mongoose';
const mongoose = require('mongoose');

beforeAll(async () => {
  // put your client connection code here, example with mongoose:
  console.log('running - connecting to mongoose?')
  console.log(process.env['MONGO_URI']);
  await mongoose.connect(process.env['MONGO_URI']);
});

afterAll(async () => {
  // put your client disconnection code here, example with mongodb:
  await mongoose.disconnect();
});