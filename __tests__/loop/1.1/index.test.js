import loop from '../../../functions/loop/1.1';

describe('Native loop 1.1', () => {
  test('It loops over an array and execustes child steps', async () => {
    const array = [{ id: 1 }, { id: 2 }];
    const childSteps = jest.fn();

    await loop({ array }, childSteps);

    expect(childSteps).toHaveBeenCalledTimes(array.length);
    expect(childSteps).toHaveBeenLastCalledWith({
      iterator: array.slice(-1).pop(),
      index: array.length - 1,
    });
  });

  test('It handles empty collections', async () => {
    const childSteps = jest.fn();

    await loop({}, childSteps);

    expect(childSteps).not.toHaveBeenCalled();
  });
});
