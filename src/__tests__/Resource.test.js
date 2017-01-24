import Resource from '../Resource';

describe('A SCIM resource parsed from JSON', () => {
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

  it('can get the resource ID', () => {
    const resource = Resource.fromJSON(RESOURCE);
    expect(resource.id()).toEqual('7f93b9ae-85ce-4bce-baf8-1c18f25ace64');
  });

  it('can get the schema URNs', () => {
    const resource = Resource.fromJSON(RESOURCE);
    expect(resource.schemas()).toContain('urn:ietf:params:scim:schemas:core:2.0:User');
    expect(resource.schemas()).toContain('urn:example.com:scim:schemas:example:1.0');
  });

  it('can get a simple single-valued attribute', () => {
    const resource = Resource.fromJSON(RESOURCE);
    expect(resource.get('userName')).toEqual('rkn');
  });

  it('can get a complex single-valued attribute', () => {
    const resource = Resource.fromJSON(RESOURCE);
    expect(resource.get('name')).toBeInstanceOf(Object);
    expect(resource.get('name').givenName).toEqual('Rasipuram');
    expect(resource.get('name.givenName')).toEqual('Rasipuram');
    expect(resource.get('name').familyName).toEqual('Narayanaswami');
    expect(resource.get('name.familyName')).toEqual('Narayanaswami');
  });

  it('can get a boolean attribute', () => {
    const resource = Resource.fromJSON(RESOURCE);
    expect(resource.get('enabled')).toBeTruthy();
  });

  it('can get a complex multivalued attribute', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const mobilePhone = resource.get('phoneNumbers').find((phoneNumber) => {
      return phoneNumber.type === 'mobile';
    });
    expect(mobilePhone).toBeDefined();
    const workPhone = resource.get('phoneNumbers').find((phoneNumber) => {
      return phoneNumber.type === 'work';
    });
    expect(workPhone).toBeDefined();
  });

  it('can select attribute members using an equality filter', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const mobilePhone = resource.get('phoneNumbers[type eq "mobile"]');
    expect(mobilePhone).toBeDefined();
    expect(mobilePhone.value).toEqual('+1 361 720 7250');
    expect(mobilePhone.primary).toBeTruthy();
  });

  it('can select attribute members using an inequality filter', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const notMobilePhone = resource.get('phoneNumbers[type ne "mobile"]');
    expect(notMobilePhone).toBeDefined();
    expect(notMobilePhone.value).not.toEqual('+1 099 720 7250');
    expect(notMobilePhone.primary).toBeFalsy();
  });

  it('can select attribute members using a starts with filter', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const homeEmail = resource.get('emails[value sw "rk.narayan"]');
    expect(homeEmail).toBeDefined();
    expect(homeEmail.value).toEqual('rk.narayan@gmail.com');
    expect(homeEmail.primary).toBeTruthy();
  });

  it('can select attribute members using an ends with filter', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const workEmail = resource.get('emails[value ew "example.com"]');
    expect(workEmail).toBeDefined();
    expect(workEmail.value).toEqual('rknarayan@example.com');
    expect(workEmail.primary).not.toBeTruthy();
  });

  it('can select attribute members using the present filter', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const address = resource.get('addresses[locality pr]');
    expect(address).toBeDefined();
    expect(address.locality).toEqual('Toledo');
  });

  it('returns null when attempting to get a nonexistent path', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const cats = resource.get('cats');
    expect(cats).not.toBeDefined();
  });

  it('returns null when a filter does not match', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const otherEmail = resource.get('emails[type eq "other"]');
    expect(otherEmail).not.toBeDefined();
  });

  it('can select a simple extension attribute', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const birthday = resource.get('urn:example.com:scim:schemas:example:1.0:birthDate');
    expect(birthday).toEqual('1906-10-10');
  });

  it('can select a complex extension attribute', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const cats = resource.get('urn:example.com:scim:schemas:example:1.0:cats');
    expect(cats).toBeDefined();
    const ravana = cats.find((cat) => {
      return cat.name === 'Ravana';
    });
    expect(ravana).toBeDefined();
    expect(ravana.name).toEqual('Ravana');
    expect(ravana.color).toEqual('black');
    const hanuman = cats.find((cat) => {
      return cat.name === 'Hanuman';
    });
    expect(hanuman).toBeDefined();
    expect(hanuman.name).toEqual('Hanuman');
    expect(hanuman.color).toEqual('orange tabby');
  });

  it('can select extension attribute members using a filter', () => {
    const resource = Resource.fromJSON(RESOURCE);
    const cat = resource.get('urn:example.com:scim:schemas:example:1.0:cats[name eq "Hanuman"]');
    expect(cat).toBeDefined();
    expect(cat.name).toEqual('Hanuman');
  });

  it('can be serialized back to JSON', () => {
    let resource = Resource.fromJSON(RESOURCE);
    const json = resource.toJSON();
    expect(json).not.toBeNull();
    resource = new Resource(JSON.parse(json));
    expect(resource.id()).toEqual('7f93b9ae-85ce-4bce-baf8-1c18f25ace64');
    expect(resource.get('userName')).toEqual('rkn');
  });
});