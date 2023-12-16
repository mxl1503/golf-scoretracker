import { UserSchema } from './models/user';
const crypto = require('crypto');

export async function emailAlreadyExists(email: string) {
  return await UserSchema.exists({ email });
}

export function validPassword(password: string): boolean {
  // count the number of digits in the password
  let numDigits = 0;
  const numArray = password.match(/\d/g);
  if (numArray !== null) {
    numDigits = numArray.length;
  }

  // count the number of alphabetical characters in the password
  let numAlphabetical = 0;
  const alphabeticalArray = password.match(/[a-zA-Z]/g);
  if (alphabeticalArray !== null) {
    numAlphabetical = alphabeticalArray.length;
  }

  // checking if a valid password is given
  if (password.length >= 8 && numDigits >= 1 && numAlphabetical >= 1) return true;
  return false;
}

export function validNameGiven(name: string): boolean {
  if (name.length < 2 || name.length > 20) return false;

  // check for invalid characters - note that the regex uses ^ to negate the character set
  const regex = /[^a-zA-Z\s'-]/;
  return !regex.test(name);
}

export function generateSalt(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';

  for (let i = 0; i < 8; i++) {
    salt += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return salt;
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
  return hashedPassword;
}
