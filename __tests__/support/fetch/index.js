const successResponse = (url) => ({
  ok: true,
  redirected: false,
  size: 1,
  status: 200,
  statusText: 'OK',
  timeout: 100,
  url,
  headers: [{ key: 'Content-Type', value: 'application/json; charset=UTF-8' }],
  blob: {
    type: 'type',
    buffer: [],
  },
  text: () => 'return text',
  json: () => ({ key: 'value' }),
});

const fetch = async (url, _context, _options) => {
  switch (url) {
    case 'http://http://error.com?name=foo':
      throw new Error('Something went wrong.');
    case 'https://test.test/101':
      return {
        ...successResponse(url),
        text: () => 'return url',
      };

    case 'https://test.test/body':
      return {
        ...successResponse(url),
        text: () => _context.body,
      };
    default:
      return successResponse(url);
  }
};

export default fetch;
