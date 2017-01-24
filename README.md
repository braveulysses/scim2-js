[![Build Status](https://travis-ci.org/braveulysses/scim2-js.svg?branch=master)](https://travis-ci.org/braveulysses/scim2-js)

# scim2-js

A simple JavaScript library for [SCIM 2](http://www.simplecloud.info/) applications.

This is a work in progress. Its current feature set is limited to:

* Parsing a JSON document into a read-only SCIM resource object.
  * Getting attribute values from a SCIM object using SCIM paths like `emails[value eq "user@example.com"]`. (Not supported: filters containing multiple expressions)

## Example

```javascript
import { Resource, Constants } from 'scim2-js';

const accessToken = '...';

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
  const user = Resource.fromJSON(json);
  console.log(user.id());
  console.log(user.schemas());
  console.log(user.get('userName'));
  console.log(user.get('phoneNumbers[type eq "mobile"]'));
});
```