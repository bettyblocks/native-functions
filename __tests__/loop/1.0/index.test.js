import loop from '../../../functions/loop/1.0';

describe('Native loop 1.0', () => {
  test('It loops over a collection and execustes child steps', async () => {
    const collection = { data: [{ id: 1 }, { id: 2 }] };
    const childSteps = jest.fn();

    await loop({ collection }, childSteps);

    expect(childSteps).toHaveBeenCalledTimes(collection.data.length);
    expect(childSteps).toHaveBeenLastCalledWith({
      iterator: collection.data.slice(-1).pop(),
      index: collection.data.length - 1,
    });
  });

  test('It handles empty collections', async () => {
    const childSteps = jest.fn();

    await loop({ collection: { data: [] } }, childSteps);

    expect(childSteps).not.toHaveBeenCalled();
  });
});
