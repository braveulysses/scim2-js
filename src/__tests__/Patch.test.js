import {
  patchRequest, addOperation,
  removeOperation, replaceOperation
} from '../Patch';
import { SCIM_PATCH_MESSAGE_URN } from '../Constants';

function checkSchemas(patchObject) {
  expect(patchObject.schemas.length).toEqual(1);
  expect(patchObject.schemas[0]).toEqual(SCIM_PATCH_MESSAGE_URN);
}

describe('A PATCH request', () => {
  it('can include an add operation', () => {
    const value = [
      {
        display: 'Babs Jensen',
        '$ref': 'https://example.com/v2/Users/2819c223...413861904646',
        value: '2819c223-7f76-453a-919d-413861904646'
      }
    ];
    const patch = patchRequest(addOperation('members', value));
    const patchObject = JSON.parse(patch);
    checkSchemas(patchObject);
    const operations = patchObject.Operations;
    expect(operations.length).toEqual(1);
    expect(operations[0].op).toEqual('add');
    expect(operations[0].value).toBeInstanceOf(Array);
    expect(operations[0].value[0].display).toEqual('Babs Jensen');
    expect(operations[0].value[0]['$ref']).toEqual('https://example.com/v2/Users/2819c223...413861904646');
    expect(operations[0].value[0].value).toEqual('2819c223-7f76-453a-919d-413861904646');
  });

  it('can include an add operation that omits the attribute path', () => {
    const value = {
      emails: [
        {
          value: 'babs@jensen.org',
          type: 'home'
        }
      ],
      nickName: 'Babs'
    };
    const patch = patchRequest(addOperation(null, value));
    const patchObject = JSON.parse(patch);
    checkSchemas(patchObject);
    const operations = patchObject.Operations;
    expect(operations.length).toEqual(1);
    expect(operations[0].op).toEqual('add');
    expect(operations[0].value).toBeInstanceOf(Object);
    expect(operations[0].value.emails.length).toEqual(1);
    expect(operations[0].value.emails[0].value).toEqual('babs@jensen.org');
    expect(operations[0].value.emails[0].type).toEqual('home');
    expect(operations[0].value.nickName).toEqual('Babs');
  });

  it('can include a remove operation', () => {
    const patch = patchRequest(removeOperation('emails[type eq "work"]'));
    const patchObject = JSON.parse(patch);
    checkSchemas(patchObject);
    const operations = patchObject.Operations;
    expect(operations.length).toEqual(1);
    expect(operations[0].op).toEqual('remove');
    expect(operations[0].path).toEqual('emails[type eq "work"]');
  });

  it('can include a replace operation', () => {
    const value = [
      {
        display: 'Babs Jensen',
        '$ref': 'https://example.com/v2/Users/2819c223...413861904646',
        value: '2819c223...413861904646'
      },
      {
        display: 'James Smith',
        '$ref': 'https://example.com/v2/Users/08e1d05d...473d93df9210',
        value: '08e1d05d...473d93df9210'
      }
    ];
    const patch = patchRequest(replaceOperation('members', value));
    const patchObject = JSON.parse(patch);
    checkSchemas(patchObject);
    const operations = patchObject.Operations;
    expect(operations.length).toEqual(1);
    expect(operations[0].op).toEqual('replace');
    expect(operations[0].value).toEqual(value);
    expect(operations[0].value).toBeInstanceOf(Array);
    expect(operations[0].value.length).toEqual(2);
    expect(operations[0].value[0].display).toEqual('Babs Jensen');
    expect(operations[0].value[1].display).toEqual('James Smith');
  });

  it('can include multiple operations', () => {
    const value = [
      {
        display: 'James Smith',
        '$ref': 'https://example.com/v2/Users/08e1d05d...473d93df9210',
        value: '08e1d05d...473d93df9210'
      }
    ];
    const patch = patchRequest(
        removeOperation('members[value eq"2819c223...919d-413861904646"]'),
        addOperation('members', value)
    );
    const patchObject = JSON.parse(patch);
    checkSchemas(patchObject);
    const operations = patchObject.Operations;
    expect(operations.length).toEqual(2);
    expect(operations[0].op).toEqual('remove');
    expect(operations[1].op).toEqual('add');
  });
});