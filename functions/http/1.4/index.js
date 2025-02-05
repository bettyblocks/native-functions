import Liquid from '../../utils/liquid.min';

let engine = null;

// eslint-disable-next-line no-return-assign
const makeEngine = () => engine || (engine = new Liquid());

const parseHeaders = (headers) =>
  Object.fromEntries(headers.map(({ key, value }) => [key, value]));

const parseQueryParameters = (queryParameters) =>
  queryParameters
    .map(({ key, value }, index) => {
      const paramKey = index === 0 ? `?${key}` : key;
      return `${paramKey}=${encodeURIComponent(value)}`;
    })
    .join('&');

const parseLiquid = (body, bodyParameters) => {
  const variables = Object.fromEntries(
    bodyParameters.map(({ key, value }) => [key, value]),
  );

  return makeEngine().parseAndRender(body, variables);
};

const generateUrl = (url, protocol, queryParameters) => {
  let trimmedUrl = url;
  if (trimmedUrl.startsWith('http://')) {
    [, trimmedUrl] = trimmedUrl.split('http://');
  }
  if (trimmedUrl.startsWith('https://')) {
    [, trimmedUrl] = trimmedUrl.split('https://');
  }

  return `${protocol}://${trimmedUrl}${parseQueryParameters(queryParameters)}`;
};

const optionallyParseJson = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

const http = async ({
  url,
  method,
  body,
  headers = [],
  protocol,
  queryParameters = [],
  bodyParameters = [],
  urlParameters = [],
}) => {
  const parsedBody =
    bodyParameters.length > 0 ? await parseLiquid(body, bodyParameters) : body;
  const parsedUrl =
    urlParameters.length > 0 ? await parseLiquid(url, urlParameters) : url;

  const fetchUrl = generateUrl(parsedUrl, protocol, queryParameters);

  const options = {
    method,
    headers: parseHeaders(headers),
    ...(method !== 'get' && { body: parsedBody }),
  };

  const response = await fetch(fetchUrl, options);
  const responseCode = response.status;
  const data = response.text();

  return { as: optionallyParseJson(data), responseCode };
};

export default http;
