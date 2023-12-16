// import { skip } from "node:test";

// const { dropCollections } = require('./databaseHelper');
const { requestUserRegister } = require('./requestHelpers');

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

  test('successful return', async () => {
    const token = requestUserRegister('validemail@domain.com', 'password1234', 'Developer', 'Testing');
    expect(token).toStrictEqual({ token: expect.any(String) });
  });

  test('error: existing email', async () => {
    expect(() => requestUserRegister('validemail@domain.com', 'password1234', 'Developer', 'Testing')).toThrow(Error);
  });
});
