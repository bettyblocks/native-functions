const log = async ({ severity, variables }) => {
  variables.forEach((variable) => {
    // eslint-disable-next-line no-console
    console[severity](`${variable.key} : ${JSON.stringify(variable.value)}`);
  });
};

export default log;
