import authenticateUser from '../../../functions/authenticate-user/1.0';

describe('Native authenticate user using username/password', () => {
  test('It authenticates a user', async () => {
    const authenticationProfile = {
      authenticationProfile: {
        id: 'username-password-profile-id',
        kind: 'usernamePassword',
      },
      username: 'test@test.test',
      password: 'test1234',
    };
    const { as } = await authenticateUser({ authenticationProfile });

    expect(as).toMatchObject({
      isValid: true,
      jwtToken: 'my-awesome-token',
      refreshToken: 'my-awesome-refresh-token',
    });
  });

  test('It handles errors for incorrect credentials', async () => {
    expect.assertions(2);

    const authenticationProfile = {
      authenticationProfile: {
        id: 'username-password-profile-id',
        kind: 'usernamePassword',
      },
      username: 'test@test.test',
      password: 'wrongPassword',
    };

    try {
      await authenticateUser({
        authenticationProfile,
      });
    } catch (errors) {
      const { message, extensions } = errors[0];
      expect(message).toBe('Wrong credentials, please try again');
      expect(extensions).toMatchObject({
        statusCode: 401,
      });
    }
  });
});

describe('Native authenticate user using ID', () => {
  test('It authenticates a user', async () => {
    const authenticationProfile = {
      authenticationProfile: {
        id: 'custom-authentication-profile-id',
        kind: 'customAuthentication',
      },
      userId: 1,
    };
    const { as } = await authenticateUser({ authenticationProfile });

    expect(as).toMatchObject({
      isValid: true,
      jwtToken: 'my-awesome-token',
      refreshToken: 'my-awesome-refresh-token',
    });
  });

  test('It handles error for incorrect credentials', async () => {
    expect.assertions(2);

    const authenticationProfile = {
      authenticationProfile: {
        id: 'custom-authentication-profile-id',
        kind: 'customAuthentication',
      },
      userId: -1,
    };

    try {
      await authenticateUser({
        authenticationProfile,
      });
    } catch (errors) {
      const { message, extensions } = errors[0];
      expect(message).toBe('Wrong credentials, please try again');
      expect(extensions).toMatchObject({
        statusCode: 401,
      });
    }
  });
});

describe('Unknown authentication profiles', () => {
  test('It handles error for unknown authentication profiles', async () => {
    expect.assertions(1);

    const authenticationProfile = {
      authenticationProfile: {
        id: 'unknown-authentication-profile-id',
        kind: 'customAuthentication',
      },
      userId: 1,
    };

    try {
      await authenticateUser({
        authenticationProfile,
      });
    } catch (errors) {
      const { message } = errors[0];
      expect(message).toBe('Unknown authentication profile');
    }
  });
});
