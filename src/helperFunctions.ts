import { UserSchema } from './models/user';
import {
  Round,
} from './models/modelTypes';
const crypto = require('crypto');

/**
 * Checks if an email is already in use.
 *
 * @param email
 * @returns userSchema
 */
export async function emailAlreadyExists(email: string) {
  return await UserSchema.exists({ email });
}

/**
 * Checks if a password is of a valid format.
 *
 * @param password
 * @returns boolean
 */
export function validPassword(password: string): boolean {
  // Checks if the password is longer than 8 characters, and contains at least 1 digit
  // and 1 alphabetical character
  return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
}

/**
 * Checks if a name given is of a valid format.
 *
 * @param name
 * @returns boolean
 */
export function validNameGiven(name: string): boolean {
  if (name.length < 2 || name.length > 20) return false;

  // Check for invalid characters - note that the regex uses ^ to negate the character set
  const regex = /[^a-zA-Z\s'-]/;
  return !regex.test(name);
}

/**
 * Generates a random string that is to be used as a salt appended to passwords.
 *
 * @returns string
 */
export function generateSalt(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';

  for (let i = 0; i < 8; i++) {
    salt += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return salt;
}

/**
 * Hashes a string created by appending a salt to a password and return the string.
 *
 * @param password
 * @param salt
 * @returns string
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

/**
 * Takes a round and calculates the total number of shots for each player. The array
 * is ordered in the same order that player names appear in the players array that
 * is contained within an object of type 'Round'.
 *
 * @param round
 * @returns number[]
 */
export function shotsTakenHelper(round: Round): number[] {
  return round.players.map(playerName => {
    const playerScore = round.holeScore.find(score => score.playerName === playerName);
    return playerScore.score.reduce((sum, scoreObject) => sum + scoreObject.playerScore, 0);
  });
}
