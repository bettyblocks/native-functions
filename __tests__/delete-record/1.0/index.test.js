import deleteRecord from '../../../functions/delete-record/1.0';
import { fetchRecord } from '../../../functions/utils';

describe('Native delete', () => {
  test('It deletes a record', async () => {
    const { result } = await deleteRecord({
      record: {
        data: { id: 1 },
        model: { name: 'User' },
      },
    });

    const record = await fetchRecord('User', 1);

    expect(result).toBe('Record deleted');
    expect(record).toBeNull();
  });

  test('It throws an error for non existing records', async () => {
    expect.assertions(1);

    try {
      await deleteRecord({
        record: {
          data: null,
          model: { name: 'User' },
        },
      });
    } catch (error) {
      expect(error.message).toBe('Record not found');
    }
  });

  test('It throws an error for non existing models', async () => {
    expect.assertions(1);

    try {
      await deleteRecord({
        record: {
          data: { id: 1 },
          model: { name: 'invalidModel' },
        },
      });
    } catch (errors) {
      expect(errors.length).toEqual(1);
    }
  });
});
