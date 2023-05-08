import create from '../../../functions/create/1.1';

const mapping = [
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

describe('Native create', () => {
  test('It creates a record with primitive properties', async () => {
    const { as: result } = await create({ model: { name: 'User' }, mapping });

    expect(result).toHaveProperty('id');
    expect(result).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    });
  });

  test('It creates a record and sets a belongs to relation based on a record variable', async () => {
    const { as: result } = await create({
      model: { name: 'User' },
      mapping: [
        ...mapping,
        {
          key: [
            {
              name: 'city',
              kind: 'BELONGS_TO',
            },
          ],
          value: {
            id: 1,
            name: 'Amsterdam',
          },
        },
      ],
    });

    expect(result).toHaveProperty('id');
    expect(result).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      city: {
        id: 1,
        name: 'Amsterdam',
      },
    });
  });

  test('It creates a record and sets a belongs to relation based on a number variable', async () => {
    const { as: result } = await create({
      model: { name: 'User' },
      mapping: [
        ...mapping,
        {
          key: [
            {
              name: 'city',
              kind: 'BELONGS_TO',
            },
          ],
          value: 1,
        },
      ],
    });

    expect(result).toHaveProperty('id');
    expect(result).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      city: {
        id: 1,
      },
    });
  });

  test('It creates a record and sets a belongs to relation based on a id that doesnt exist', async () => {
    const { as: result } = await create({
      model: { name: 'User' },
      mapping: [
        ...mapping,
        {
          key: [
            {
              name: 'city',
              kind: 'BELONGS_TO',
            },
          ],
          value: 55,
        },
      ],
    });

    expect(result).toHaveProperty('id');
    expect(result).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      city: null,
    });
  });

  test('It creates a record and sets a has and belongs to many relation based on a collection variable', async () => {
    const { as: result } = await create({
      model: { name: 'User' },
      mapping: [
        ...mapping,
        {
          key: [
            {
              name: 'tasks',
              kind: 'HAS_AND_BELONGS_TO_MANY',
            },
          ],
          value: [{ id: 1, name: 'Write tests' }],
        },
      ],
    });
    expect(result).toHaveProperty('id');
    expect(result).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      tasks: [
        {
          id: 1,
          name: 'Write tests',
        },
      ],
    });
  });

  test('It creates a record and sets a has many relation based on a number array variable', async () => {
    const { as: result } = await create({
      model: { name: 'User' },
      mapping: [
        ...mapping,
        {
          key: [
            {
              name: 'tasks',
              kind: 'HAS_MANY',
            },
          ],
          value: [1],
        },
      ],
    });

    expect(result).toHaveProperty('id');
    expect(result).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      tasks: [
        {
          id: 1,
        },
      ],
    });
  });

  test('It creates a record and sets an has many or habtm relation based on an empty array ', async () => {
    const { as: result } = await create({
      model: { name: 'User' },
      mapping: [
        ...mapping,
        {
          key: [
            {
              name: 'tasks',
              kind: 'HAS_MANY',
            },
          ],
          value: [],
        },
      ],
    });

    expect(result).toHaveProperty('id');
    expect(result).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      tasks: [],
    });
  });

  test('It creates a record with supplied validationSet', async () => {
    const { as: result } = await create({
      model: { name: 'User' },
      mapping: [
        ...mapping,
        {
          key: [
            {
              name: 'firstName',
              kind: 'STRING',
            },
          ],
          value: 'Pete',
        },
      ],
      validates: false,
    });

    expect(result).toHaveProperty('id');
    expect(result).toMatchObject({
      firstName: 'Pete',
      lastName: 'Doe',
      age: 30,
    });
  });

  test('It fails creates a record with supplied validationSet', async () => {
    try {
      await create({
        model: { name: 'User' },
        mapping: [
          ...mapping,
          {
            key: [
              {
                name: 'firstName',
                kind: 'STRING',
              },
            ],
            value: 'Pete',
          },
        ],
      });
    } catch (errors) {
      expect(errors).toHaveLength(1);
      const error = errors[0];
      expect(error).toMatchObject(Error('firstName should be John'));
    }
  });

  test('It throws an error for invalid input', async () => {
    expect.assertions(1);

    try {
      await create({ model: { name: 'invalidModel' }, mapping: [] });
    } catch (errors) {
      expect(errors.length).toBeGreaterThan(0);
    }
  });
});
