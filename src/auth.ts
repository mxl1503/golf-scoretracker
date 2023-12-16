import isEmail from 'validator/lib/isEmail.js';
import HTTPError from 'http-errors';
import {
  PasswordObject,
} from './models/modelTypes';
import {
  emailAlreadyExists,
  validPassword,
  validNameGiven,
  generateSalt,
  hashPassword,
} from './helperFunctions';
import {
  UserSchema,
} from './models/user';
import {
  Round,
} from './models/modelTypes';

const jwt = require('jsonwebtoken');
require('dotenv').config();

const defaultRound: Round = {
  course: 'default',
  players: [],
  complete: false,
  date: new Date(),
  mensParUsed: false,
  scoringFormat: 'default',
  currentPoints: [],
  currentTotal: [],
  currentPar: [],
  holeScore: [],
};

export async function registerNewUser(email: string, password: string, nameFirst: string, nameLast: string): Promise<string> {
  try {
    const existingEmail = await emailAlreadyExists(email);
    if (existingEmail) {
      throw HTTPError(400, 'Email already in use');
    }

    if (!isEmail(email)) {
      throw HTTPError(400, 'Invalid email passed in');
    }

    if (!validPassword(password)) {
      throw HTTPError(400, 'Invalid password passed in');
    }

    if (!validNameGiven(nameFirst) || !validNameGiven(nameLast)) {
      throw HTTPError(400, 'Invalid name passed in');
    }

    // Generate 6 digit Id
    const randomUserId = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);
    const passwordObj: PasswordObject = {
      hashedPassword: hashedPassword,
      salt: salt
    };

    const token = jwt.sign({ id: randomUserId }, process.env.JWT_SECRET, { expiresIn: '10h' });

    // Add user to the database
    const newUser = new UserSchema({
      userId: randomUserId,
      nameFirst: nameFirst,
      nameLast: nameLast,
      email: email,
      password: passwordObj,
      JWT: token,
      previousRounds: [],
      currentRound: defaultRound,
    });

    newUser.save().then(() => console.log('User added successfully')).catch(err => console.log(err));

    return token;
  } catch (error) {

    console.log(error);
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<string> {
  try {
    const existingUser = await UserSchema.find({ email: email });
    if (existingUser.length === 0) {
      throw HTTPError(400, 'No such user exists');
    }

    const userObject = existingUser[0];
    const hashedPassword = await hashPassword(password, userObject.password.salt);

    if (hashedPassword !== userObject.password.hashedPassword) {
      throw HTTPError(400, 'Incorrect password passed in');
    }

    const token = jwt.sign({ id: userObject.userId }, process.env.JWT_SECRET, { expiresIn: '10h' });

    return token;
  } catch (error) {

    console.log(error);
    throw error;
  }
}