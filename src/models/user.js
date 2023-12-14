const mongoose = require('mongoose');
const { Schema } = mongoose;

const passwordObjectSchema = new Schema({
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true }
});

const playerTallySchema = new Schema({
  playerName: String,
  tally: Number
});

const holeScoreSchema = new Schema({
  holePar: Number,
  playerScore: Number
});

const playerHoleScoreSchema = new Schema({
  playerName: String,
  score: [holeScoreSchema]
});

const roundSchema = new Schema({
  course: String,
  players: [String],
  date: Date,
  mensParUsed: Boolean,
  scoringFormat: String,
  currentPoints: [playerTallySchema],
  currentTotal: [playerTallySchema],
  currentPar: [playerTallySchema],
  holeScore: [playerHoleScoreSchema]
});

const userSchema = new Schema({
  nameFirst: String,
  nameLast: String,
  email: { type: String, unique: true },
  password: passwordObjectSchema,
  JWT: String,
  previousRounds: [roundSchema],
  currentRound: roundSchema
});

const User = mongoose.model('User', userSchema);
