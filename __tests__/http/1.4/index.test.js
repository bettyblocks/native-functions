import http from '../../../functions/http/1.4';

describe('Native http', () => {
  test('It makes a succesfull http call.', async () => {
    expect.assertions(2);

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

    const { as, responseCode } = await http(request);

    expect(as).toBe('return text');
    expect(responseCode).toBe(200);
  });

  test('It makes a succesfull http call trims protocol off', async () => {
    expect.assertions(2);

    const request = {
      url: 'https://example.com',
      method: 'get',
      body: '',
      headers: [
        { key: 'Content-Type', value: 'application/json; charset=UTF-8' },
      ],
      protocol: 'https',
      queryParameters: [{ key: 'name', value: 'foo' }],
    };

    const { as, responseCode } = await http(request);

    expect(as).toBe('return text');
    expect(responseCode).toBe(200);
  });

  test('It will parse the Url parameters correctly', async () => {
    expect.assertions(2);

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

    const { as, responseCode } = await http(request);

    expect(as).toBe('return url');
    expect(responseCode).toBe(200);
  });

  test('It will parse the body parameters correctly', async () => {
    expect.assertions(2);

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

    const { as, responseCode } = await http(request);

    expect(as).toBe('Hello foo');
    expect(responseCode).toBe(200);
  });

  test('It will crash when fetch throws errors.', () => {
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
