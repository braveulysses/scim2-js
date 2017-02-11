import { SCIM_PATCH_MESSAGE_URN } from './Constants';

/**
 * Create a PATCH request from the provided patch operations.
 * @name Patch.patchRequest
 * @function
 * @param {Object} operations - One or more patch operations.
 * @return {string} A PATCH request as a JSON string.
 */
export function patchRequest(...operations) {
  const request = {
    schemas: [
      SCIM_PATCH_MESSAGE_URN
    ],
    Operations: operations
  };
  return JSON.stringify(request);
}

function _request(op, path, value) {
  let request = {
    op: op
  };
  if (path) {
    request.path = path;
  }
  if (value) {
    request.value = value;
  }
  return request;
}

/**
 * Create an 'add' patch operation.
 * @name Patch.addOperation
 * @function
 * @param {string} path - A SCIM attribute path.
 * @param {(string|number|boolean|Object)} value - The value to add.
 * @returns {Object} An 'add' patch operation object.
 */
export function addOperation(path, value) {
  return _request('add', path, value);
}

/**
 * Create a 'remove' patch operation.
 * @name Patch.removeOperation
 * @function
 * @param {string} path - A SCIM attribute path.
 * @returns {Object} A 'remove' patch operation object.
 */
export function removeOperation(path) {
  return _request('remove', path, null);
}

/**
 * Create a 'replace' patch operation.
 * @name Patch.replaceOperation
 * @function
 * @param {string} path - A SCIM attribute path.
 * @param {(string|number|boolean|Object)} value - The new value to set.
 * @returns {Object} A 'replace' patch operation object.
 */
export function replaceOperation(path, value) {
  return _request('replace', path, value);
}