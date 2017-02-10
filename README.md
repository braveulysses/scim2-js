[![Build Status](https://travis-ci.org/braveulysses/scim2-js.svg?branch=master)](https://travis-ci.org/braveulysses/scim2-js)

# scim2-js

This is a simple JavaScript library for [SCIM 2](http://www.simplecloud.info/) applications. SCIM 2 is a set of standards that defines a schema for representing identities and a REST API for creating, retrieving, updating, and deleting them.

This library's feature set is not exhaustive and covers a limited set of common cases. These include:

* Parsing a JSON document into a SCIM resource object.
  * Getting attribute values from a SCIM object using SCIM paths like `userName` or `emails[value eq "user@example.com"]`. (Not supported: filters containing multiple expressions)
* Modifying a SCIM resource object.
* Building a PATCH request.

This library will help you parse SCIM responses and formulate certain kinds of requests, but it doesn't actually provide an HTTP client, since numerous generic options are already available that work well. For example, see [Axios](https://github.com/mzabriskie/axios), [whatwg-fetch](https://github.com/github/fetch), or [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch).

If you're looking for a SCIM 2 library with more comprehensive support for the SCIM 2 standard, see the [UnboundID SCIM 2 SDK for Java](https://github.com/UnboundID/scim2). I'm not aware of a comparable JavaScript SDK.

## Installation

```
npm install @braveulysses/scim2-js
```

Or

```
yarn add @braveulysses/scim2-js
```

## Example

```javascript
import { Resource, Patch, Constants } from 'scim2-js';

const url = 'https://example.com/scim/v2/Users/7f93b9ae-85ce-4bce-baf8-1c18f25ace64';
const accessToken = '...';
const expectedUsername = '...';

// This example uses the Fetch API, but the request mechanism is up to you.
fetch(url, {
  method: 'get',
  headers: {
    'Authorization': 'Bearer ' + accessToken,
    'Accept': Constants.SCIM_MEDIA_TYPE
  }
}).then(function(response) {
  return response.json();
}).then(function(json) {
  const user = new Resource(json);
  expect(user.id()).toEqual('7f93b9ae-85ce-4bce-baf8-1c18f25ace64');
  expect(user.schemas()).toContain('urn:ietf:params:scim:schemas:core:2.0:User');
  expect(user.get('userName')).toEqual(expectedUsername);
  
  // Modify an attribute.
  const phoneNumbers = user.get('phoneNumbers');
  phoneNumbers.push({
    value: "+1 555 555 1234",
    type: "other",
    primary: false
  });
  user.set('phoneNumbers', phoneNumbers);
  // You could then apply the modification by replacing the resource with PUT.
  expect(user.get('phoneNumbers')).toEqual(phoneNumbers);
  
  // Alternatively, you could build a partial modification request...
  const patch = Patch.patchRequest(
    Patch.addOperation('phoneNumbers', {
      value: "+1 555 555 1234",
      type: "other",
      primary: false
    })
  );
  // ... and then apply the modification by sending a PATCH request.
});
```

## License

This is licensed under the Apache License 2.0.