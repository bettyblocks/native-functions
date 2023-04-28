import { RelationKind } from './constants';

export const now = () =>
  new Date().toISOString().slice(0, 19).replace('T', ' ');

const isRecord = (value) =>
  value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.keys(value).length > 0 &&
  value.id !== undefined;

const belongsToValue = (value) => (isRecord(value) ? value.id : value);

const hasManyOrHasAndBelongsToManyValue = (value) => {
  if (Array.isArray(value)) {
    const recordIds = value.map((val) => (isRecord(val) ? val.id : val));
    return { id: recordIds };
  }

  return value;
};

const getAssignedValue = (kind, value) => {
  switch (kind) {
    case RelationKind.BELONGS_TO:
      return belongsToValue(value);
    case RelationKind.HAS_MANY:
    case RelationKind.HAS_AND_BELONGS_TO_MANY:
      return hasManyOrHasAndBelongsToManyValue(value);
    default:
      return value;
  }
};

export const parseAssignedProperties = (properties) =>
  properties.reduce((output, property) => {
    const {
      key: [{ name, kind }],
      value,
    } = property;

    return {
      ...output,
      [name]: getAssignedValue(kind, value),
    };
  }, {});

export const fetchRecord = async (modelName, id, fragment = {}) => {
  const queryName = `one${modelName}`;
  const { name, fragmentGql } = fragment;

  const query = `
  ${fragmentGql || ''}
  query($where: ${modelName}FilterInput) {
    ${queryName}(where: $where) {
      id
      ${fragmentGql ? `...${name}` : ''}
    }
  }
`;

  const { data, errors } = await gql(query, { where: { id: { eq: id } } });

  if (errors) {
    throw new Error(errors);
  }

  const { [queryName]: record } = data;

  return record;
};
