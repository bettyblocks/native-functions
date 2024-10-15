/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

function isAsyncIterator(object) {
  return object != null && typeof object[Symbol.asyncIterator] === 'function';
}

const loop = async ({ array = [] }, steps) => {
  if (isAsyncIterator(array)) {
    let index = 0;
    for await (const value of array) {
      await steps({ iterator: value, index });
      index += 1;
    }
  } else {
    for (let index = 0; index < array.length; index += 1) {
      await steps({ iterator: array[index], index });
    }
  }
};

export default loop;
