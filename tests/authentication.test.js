const requestUserRegister = require('./requestHelpers/routes');

describe('Register Users Test ', () => {
  test('error: empty token', async () => {
    expect(() => requestUserRegister('invalidemail@@@domaincom', 'password1234', 'Kevin', 'Zhong')).toThrow(Error);
  });

  test.only('successful return', async () => {
    const token = requestUserRegister('validemail@domain.com', 'password1234', 'Developer', 'Testing');
    console.log(token);
    console.log('running properly');
  });
});
