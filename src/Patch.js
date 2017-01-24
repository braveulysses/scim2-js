import { SCIM_PATCH_MESSAGE_URN } from './Constants';

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

export function addOperation(path, value) {
  return _request('add', path, value);
}

export function removeOperation(path) {
  return _request('remove', path, null);
}

export function replaceOperation(path, value) {
  return _request('replace', path, value);
}