import { parseAssignedProperties, fetchRecord, listWrap } from '../../utils';

const update = async ({
  selectedRecord: {
    data: { id },
    model: { name: modelName },
  },
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

  const mutationName = `update${modelName}`;

  const mutation = `
    mutation($id: Int!, $input: ${modelName}Input, $validationSets: [String]) {
      ${mutationName}(id: $id, input: $input, validationSets: $validationSets) {
        id
      }
    }
  `;

  const { errors } = await gql(mutation, {
    id,
    input,
    validationSets: listWrap(validationSets),
  });

  if (errors) {
    throw errors;
  }

  const updatedRecord = await fetchRecord(modelName, id, fragment);

  return {
    as: updatedRecord,
  };
};

export default update;
