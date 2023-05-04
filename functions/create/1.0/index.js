import { parseAssignedProperties, fetchRecord, listWrap } from '../../utils';

const create = async ({
  model: { name: modelName },
  mapping,
  validationSets = null,
}) => {
  const fragment = await parseToGqlFragment({
    propertyMap: mapping,
    modelName,
  });

  const assignProperties = parseAssignedProperties(mapping);

  const input = {
    ...assignProperties,
  };

  const mutationName = `create${modelName}`;

  const mutation = `
    mutation($input: ${modelName}Input, $validationSets: [String]) {
      ${mutationName}(input: $input, validationSets: $validationSets) {
        id
      }
    }
  `;

  const { data, errors } = await gql(mutation, {
    input,
    validationSets: listWrap(validationSets),
  });
  if (errors) {
    throw errors;
  }

  const {
    [mutationName]: { id },
  } = data;
  const createdRecord = await fetchRecord(modelName, id, fragment);

  return {
    as: createdRecord,
  };
};

export default create;
