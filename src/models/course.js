const mongoose = require('mongoose');
const { Schema } = mongoose;

const parObjectSchema = new Schema({
  mensPar: Number,
  womensPar: Number
});

const courseSchema = new Schema({
  name: { type: String, unique: true },
  description: String,
  totalPar: parObjectSchema,
  totalDistance: Number,
  holePars: [parObjectSchema],
  holeDistance: [Number]
});

const Course = mongoose.model('Course', courseSchema);
