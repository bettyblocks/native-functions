import loop from '../../../functions/loop/1.2';

describe('Native loop 1.2', () => {
  test('It loops over an array and executes child steps', async () => {
    const array = [{ id: 1 }, { id: 2 }];
    const childSteps = jest.fn();

    await loop({ array }, childSteps);

    expect(childSteps).toHaveBeenCalledTimes(array.length);
    expect(childSteps).toHaveBeenLastCalledWith({
      iterator: array.slice(-1).pop(),
      index: array.length - 1,
    });
  });

  test('It loops over an asyncIterator and executes child steps', async () => {
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        yield { id: 1 };
        yield { id: 2 };
        yield { id: 3 };
      },
    };
    const childSteps = jest.fn();

    await loop({ array: asyncIterable }, childSteps);

    expect(childSteps).toHaveBeenCalledTimes(3);
    expect(childSteps).toHaveBeenLastCalledWith({
      iterator: { id: 3 },
      index: 2,
    });
  });

  test('It handles empty collections', async () => {
    const childSteps = jest.fn();

    await loop({}, childSteps);

    expect(childSteps).not.toHaveBeenCalled();
  });
});
