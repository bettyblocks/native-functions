/* eslint-disable no-await-in-loop */
const loop = async ({ data = [] }, steps) => {
  for (let index = 0; index < data.length; index += 1) {
    await steps({ iterator: data[index], index });
  }
};

export default loop;
