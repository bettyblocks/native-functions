import http from '../../../functions/http/1.0';

describe('Native http', () => {
  test('Makes a succesfull http call.', async () => {
    expect.assertions(1);

    const request = {
      url: 'example.com',
      method: 'get',
      body: '',
      headers: [
        { key: 'Content-Type', value: 'application/json; charset=UTF-8' },
      ],
      protocol: 'http',
      queryParameters: [{ key: 'name', value: 'foo' }],
    };

    const { as } = await http(request);

    expect(as).toBe('return text');
  });
  test('Will crash when fetch throws errors.', () => {
    expect.assertions(1);

    const request = {
      url: 'error.com',
      method: 'get',
      body: '',
      headers: [
        { key: 'Content-Type', value: 'application/json; charset=UTF-8' },
      ],
      protocol: 'http',
      queryParameters: [{ key: 'name', value: 'foo' }],
    };
    http(request).catch(({ message }) => {
      expect(message).toBe('Something went wrong.');
    });
  });
});
