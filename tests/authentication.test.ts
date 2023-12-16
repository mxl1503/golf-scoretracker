// import { skip } from "node:test";

// const { dropCollections } = require('./databaseHelper');
const { requestUserRegister, requestUserLogin, requestUserDetails } = require('./requestHelpers');

// beforeEach(async () => {
//   await dropCollections();
// });

// afterEach(async () => {
//   await dropCollections();
// });

describe('Register Users Test ', () => {
  test('error: invalid email', async () => {
    expect(() => requestUserRegister('invalidemail@@@domaincom', 'password1234', 'Tester', 'Tester')).toThrow(Error);
  });

  test('error: invalid name', async () => {
    expect(() => requestUserRegister('validemail@domain.com', 'password1234', 'blah 5##', 'tw (9hdag')).toThrow(Error);
  });

  test('successful return of token upon user creation + testing login', async () => {
    const token = requestUserRegister('validemail@domain.com', 'password1234', 'Developer', 'Testing');
    expect(token).toStrictEqual({ token: expect.any(String) });

    expect(() => requestUserLogin('nosuchemail@gmaik.com', 'password')).toThrow(Error);
    expect(() => requestUserLogin('validemail@domain.com', 'incorrectpasswordhehe')).toThrow(Error);

    const loginToken = requestUserLogin('validemail@domain.com', 'password1234');
    expect(loginToken).toStrictEqual({ token: expect.any(String) });

    const details = requestUserDetails(token.token);
    expect(details).toStrictEqual({
      details: {
        userId: expect.any(Number),
        name: 'Developer Testing',
        email: 'validemail@domain.com',
        numRounds: 0,
      }
    });
  });

  test('error: existing email', async () => {
    expect(() => requestUserRegister('validemail@domain.com', 'password1234', 'Developer', 'Testing')).toThrow(Error);
  });
});
