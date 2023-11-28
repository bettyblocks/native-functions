import Liquid from './liquid.min';

const engine = new Liquid();

const parseHeaders = (headers) =>
  headers.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

const parseQueryParameters = (queryParameters) =>
  queryParameters
    .map(({ key, value }, index) => {
      const paramKey = index === 0 ? `?${key}` : key;
      return `${paramKey}=${encodeURIComponent(value)}`;
    })
    .join('&');

const parseLiquid = async (body, bodyParameters) =>
  engine.parseAndRenderSync(
    body,
    bodyParameters.reduce((parameter, { key, value }) => {
      // eslint-disable-next-line no-param-reassign
      parameter[key] = value;
      return parameter;
    }, {}),
  );

const generateUrl = (url, protocol, queryParameters) =>
  `${protocol}://${url}${parseQueryParameters(queryParameters)}`;

const http = async ({
  url,
  method,
  body,
  headers = [],
  protocol,
  queryParameters = [],
  bodyParameters,
  urlParameters,
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
  const data = await response.text();

  return { as: data };
};

export default http;
