import log from '../../../functions/log/2.0';

describe('Native condition', () => {
  const variables = [
    { key: 'Var1 text', value: 'text' },
    { key: 'Var object', value: { key: 'Value', value: 'value' } },
  ];
  test('Log variable on debug severity type', async () => {
    // eslint-disable-next-line no-console
    console.debug = jest.fn();
    await log({ severity: 'debug', variables });
    // eslint-disable-next-line no-console
    expect(console.debug.mock.calls[0][0]).toBe(
      `${variables[0].key} : ${JSON.stringify(variables[0].value)}`,
    );
  });

  test('Log variable on error severity type', async () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    await log({ severity: 'error', variables });
    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0]).toBe(
      `${variables[0].key} : ${JSON.stringify(variables[0].value)}`,
    );
  });
  test('Log variable on info severity type', async () => {
    // eslint-disable-next-line no-console
    console.info = jest.fn();
    await log({ severity: 'info', variables });
    // eslint-disable-next-line no-console
    expect(console.info.mock.calls[0][0]).toBe(
      `${variables[0].key} : ${JSON.stringify(variables[0].value)}`,
    );
  });
  test('Log variable on warn severity type', async () => {
    // eslint-disable-next-line no-console
    console.warn = jest.fn();
    await log({ severity: 'warn', variables });
    // eslint-disable-next-line no-console
    expect(console.warn.mock.calls[0][0]).toBe(
      `${variables[0].key} : ${JSON.stringify(variables[0].value)}`,
    );
  });
});
