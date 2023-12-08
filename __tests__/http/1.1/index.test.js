import http from '../../../functions/http/1.1';

describe('Native http', () => {
  test('Makes a succesfull http call.', async () => {
    expect.assertions(1);

    const request = {
      url: 'http://example.com',
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

  test('Url parameters get parsed correctly', async () => {
    expect.assertions(1);

    const request = {
      protocol: 'https',
      urlParameters: [{ key: 'id', value: '101' }],
      url: 'test.test/{{id}}',
      method: 'get',
      body: '',
      headers: [
        { key: 'Content-Type', value: 'application/json; charset=UTF-8' },
      ],
      queryParameters: [],
      bodyParameters: [],
    };

    const { as } = await http(request);

    expect(as).toBe('return url');
  });

  test('Body parameters get parsed correctly', async () => {
    expect.assertions(1);

    const request = {
      protocol: 'https',
      url: 'test.test/body',
      method: 'post',
      body: 'Hello {{name}}',
      headers: [
        { key: 'Content-Type', value: 'application/json; charset=UTF-8' },
      ],
      queryParameters: [],
      bodyParameters: [{ key: 'name', value: 'foo' }],
    };

    const { as } = await http(request);

    expect(as).toBe('Hello foo');
  });

  test('Will crash when fetch throws errors.', () => {
    expect.assertions(1);

    const request = {
      url: 'http://error.com',
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
