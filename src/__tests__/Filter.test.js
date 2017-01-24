import Filter from '../Filter';

describe('The SCIM filter parser', () => {
  it('accepts the equality operator', () => {
    const parsed = Filter.parse('userName eq "bjensen"');
    expect(parsed).not.toBeNull();
    expect(parsed.attrExp).toEqual('userName');
    expect(parsed.operator).toEqual('eq');
    expect(parsed.valuePath).toEqual('bjensen');
  });

  it('accepts a dotted attribute path', () => {
    const parsed = Filter.parse(`name.familyName co "O'Malley"`);
    expect(parsed).not.toBeNull();
    expect(parsed.attrExp).toEqual('name.familyName');
    expect(parsed.operator).toEqual('co');
    expect(parsed.valuePath).toEqual("O'Malley");
  });

  it('accepts the starts with operator', () => {
    const parsed = Filter.parse('userName sw "J"');
    expect(parsed).not.toBeNull();
    expect(parsed.attrExp).toEqual('userName');
    expect(parsed.operator).toEqual('sw');
    expect(parsed.valuePath).toEqual('J');
  });

  it('accepts a URN-prefixed attribute path', () => {
    const parsed = Filter.parse('urn:ietf:params:scim:schemas:core:2.0:User:userName sw "J"');
    expect(parsed).not.toBeNull();
    expect(parsed.attrExp).toEqual('urn:ietf:params:scim:schemas:core:2.0:User:userName');
    expect(parsed.operator).toEqual('sw');
    expect(parsed.valuePath).toEqual('J');
  });

  it('accepts the present operator', () => {
    const parsed = Filter.parse('title pr');
    expect(parsed).not.toBeNull();
    expect(parsed.attrExp).toEqual('title');
    expect(parsed.operator).toEqual('pr');
    expect(parsed.valuePath).toBeNull();
  });

  it('accepts the greater than operator', () => {
    const parsed = Filter.parse('meta.lastModified gt "2011-05-13T04:42:34Z"');
    expect(parsed).not.toBeNull();
    expect(parsed.attrExp).toEqual('meta.lastModified');
    expect(parsed.operator).toEqual('gt');
    expect(parsed.valuePath).toEqual('2011-05-13T04:42:34Z');
  });

  it('accepts the greater than or equals operator', () => {
    const parsed = Filter.parse('meta.lastModified ge "2011-05-13T04:42:34Z"');
    expect(parsed).not.toBeNull();
    expect(parsed.attrExp).toEqual('meta.lastModified');
    expect(parsed.operator).toEqual('ge');
    expect(parsed.valuePath).toEqual('2011-05-13T04:42:34Z');
  });

  it('accepts the less than operator', () => {
    const parsed = Filter.parse('meta.lastModified lt "2011-05-13T04:42:34Z"');
    expect(parsed).not.toBeNull();
    expect(parsed.attrExp).toEqual('meta.lastModified');
    expect(parsed.operator).toEqual('lt');
    expect(parsed.valuePath).toEqual('2011-05-13T04:42:34Z');
  });

  it('accepts the less than or equals operator', () => {
    const parsed = Filter.parse('meta.lastModified le "2011-05-13T04:42:34Z"');
    expect(parsed).not.toBeNull();
    expect(parsed.attrExp).toEqual('meta.lastModified');
    expect(parsed.operator).toEqual('le');
    expect(parsed.valuePath).toEqual('2011-05-13T04:42:34Z');
  });
});