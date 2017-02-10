import { Resource, Patch, Constants } from '../index';

describe('The README example', () => {
  const RESOURCE = `
{
    "schemas": [
        "urn:example.com:scim:schemas:example:1.0",
        "urn:ietf:params:scim:schemas:core:2.0:User"
    ],
    "id": "7f93b9ae-85ce-4bce-baf8-1c18f25ace64",
    "meta": {
        "created": "2016-11-16T17:14:57.836Z",
        "lastModified": "2016-11-19T18:24:27.433Z",
        "resourceType": "Users",
        "location": "https://example.com/scim/v2/Users/7f93b9ae-85ce-4bce-baf8-1c18f25ace64"
    },
    "userName": "rkn",
    "enabled": true,
    "name": {
        "familyName": "Narayanaswami",
        "formatted": "R.K. Narayan",
        "givenName": "Rasipuram"
    },
    "emails": [
        {
            "value": "rk.narayan@gmail.com",
            "primary": true,
            "type": "home"
        },
        {
            "value": "rknarayan@example.com",
            "primary": false,
            "type": "work"
        }
    ],
    "phoneNumbers": [
        {
            "value": "+1 361 720 7250",
            "type": "mobile",
            "primary": true
        },
        {
            "value": "+1 361 456 3207",
            "type": "work",
            "primary": false
        },
        {
            "value": "+1 361 720 7251",
            "type": "home",
            "primary": false
        }
    ],
    "addresses": [
        {
            "streetAddress": "85287 Church Street",
            "locality": "Toledo",
            "region": "RI",
            "postalCode": "02824",
            "country": "US",
            "primary": true,
            "type": "home"
        }
    ],
    "urn:example.com:scim:schemas:example:1.0": {
        "birthDate": "1906-10-10",
        "cats": [
            {
                "name": "Ravana",
                "color": "black"
            },
            {
                "name": "Hanuman",
                "color": "orange tabby"
            }
        ]
    }
}
`;

  class Response {
    constructor(obj) {
      this.obj = obj;
      this.json = this.json.bind(this);
    }

    json() {
      return Promise.resolve(this.obj);
    }
  }

  const fetch = (url, options) => {
    const response = new Response(JSON.parse(RESOURCE));
    return Promise.resolve(response);
  };

  it('Actually works', () => {
    expect(Constants.SCIM_MEDIA_TYPE).toEqual('application/scim+json');

    const url = 'https://example.com/scim/v2/Users/7f93b9ae-85ce-4bce-baf8-1c18f25ace64';
    const accessToken = '...';
    const expectedUsername = 'rkn';

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

      const phoneNumbers = user.get('phoneNumbers');
      phoneNumbers.push({
        value: "+1 555 555 1234",
        type: "other",
        primary: false
      });
      user.set('phoneNumbers', phoneNumbers);
      expect(user.get('phoneNumbers')).toEqual(phoneNumbers);

      const patch = Patch.patchRequest(
          Patch.addOperation('phoneNumbers', {
            value: "+1 555 555 1234",
            type: "other",
            primary: false
          })
      );
      const expectedPatch = `{"schemas":["urn:ietf:params:scim:api:messages:2.0:PatchOp"],"Operations":[{"op":"add","path":"phoneNumbers","value":{"value":"+1 555 555 1234","type":"other","primary":false}}]}`;
      expect(JSON.parse(patch)).toEqual(JSON.parse(expectedPatch));
    });
  });
});