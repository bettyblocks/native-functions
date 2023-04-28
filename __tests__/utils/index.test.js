import { fetchRecord, parseAssignedProperties } from '../../functions/utils';

const userFragment = {
  name: 'userFields',
  gql: 'fragment userFields on User {\n    firstName\nlastName\nage\n  }',
};

const userProperties = [
  {
    key: [
      {
        name: 'firstName',
        kind: 'STRING',
      },
    ],
    value: 'John',
  },
  {
    key: [
      {
        name: 'lastName',
        kind: 'STRING',
      },
    ],
    value: 'Doe',
  },
  {
    key: [
      {
        name: 'age',
        kind: 'INTEGER',
      },
    ],
    value: 30,
  },
];

const taskFragment = {
  name: 'taskFields',
  gql: 'fragment taskFields on Task {\n    id\nname\nuser {\n      firstName\nid\nlastName\nage\n    }\n  }',
};

describe('Utility functions', () => {
  test('parseAssignedProperties', () => {
    expect(parseAssignedProperties(userProperties)).toStrictEqual({
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    });
  });

  test('fetchRecord returns an existing record', async () => {
    const result = await fetchRecord('User', 1, userFragment);

    expect(result).toMatchObject({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    });
  });

  test('fetchRecord returns an error when no record is found', async () => {
    const result = await fetchRecord('User', -1, userFragment);

    expect(result).toBeNull();
  });

  test('It throws an error for invalid input', async () => {
    expect.assertions(1);

    try {
      await fetchRecord('InvalidModel', 0);
    } catch ({ message }) {
      expect(message).toContain('Unknown type');
    }
  });

  test('fetchRecord returns an record with a belongs to relation', async () => {
    const result = await fetchRecord('Task', 1, taskFragment);
    expect(result).toMatchObject({
      id: 1,
      name: 'First task',
      user: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      },
    });
  });
});
