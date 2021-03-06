import objectPath from 'object-path';
import Filter from './Filter';

/**
 * A class representing a generic SCIM resource, such as a user.
 */
class Resource {
  constructor(data) {
    this.data = data;
    this._resolveSchema = this._resolveSchema.bind(this);
  }

  /**
   * Create a new {Resource} instance from a JSON string.
   *
   * @param {string} json - A SCIM resource in JSON format.
   * @returns {Resource} A SCIM resource object.
   * @static
   */
  static fromJSON(json) {
    return new Resource(JSON.parse(json));
  }

  static _parseValueFilter(path) {
    const VALUE_FILTER_RX = /(\w+)\[(.+)]/;
    let match = VALUE_FILTER_RX.exec(path);
    if (match) {
      const attr = match[1];
      const filter = Filter.parse(match[2]);
      return {
        attribute: attr,
        filterAttribute: filter.attrExp,
        operator: filter.operator,
        filterValue: filter.valuePath
      };
    }
    return null;
  }

  _resolveSchema(path) {
    const EXTENSION_FILTER_RX = /((urn:.+):)(.+)/;
    let match = EXTENSION_FILTER_RX.exec(path);
    if (match) {
      return {
        attributePath: match[3],
        data: this.data[match[2]]
      }
    } else {
      return {
        attributePath: path,
        data: this.data
      }
    }
  }

  _getValueFromFilter(obj, attributePath, filterAttribute, operator, filterValue) {
    const complexValue = objectPath.get(obj, attributePath);
    if (!complexValue) {
      return undefined;
    }
    switch(operator) {
      case 'eq': {
        return complexValue.find(attr => {
          if (typeof(attr[filterAttribute]) === "boolean") {
            return attr[filterAttribute].toString() === filterValue;
          }
          return attr[filterAttribute] === filterValue;
        });
      }
      case 'ne': {
        return complexValue.find(attr => {
          if (typeof(attr[filterAttribute]) === "boolean") {
            return attr[filterAttribute].toString() !== filterValue;
          }
          return attr[filterAttribute] !== filterValue;
        });
      }
      case 'sw': {
        return complexValue.find(attr => {
          return attr[filterAttribute].startsWith(filterValue);
        });
      }
      case 'ew': {
        return complexValue.find(attr => {
          return attr[filterAttribute].endsWith(filterValue);
        });
      }
      case 'pr': {
        return complexValue.find(attr => {
          return attr[filterAttribute] != null;
        });
      }
      case 'gt': {
        return complexValue.find(attr => {
          return attr[filterAttribute] > filterValue;
        });
      }
      case 'ge': {
        return complexValue.find(attr => {
          return attr[filterAttribute] >= filterValue;
        });
      }
      case 'lt': {
        return complexValue.find(attr => {
          return attr[filterAttribute] < filterValue;
        });
      }
      case 'le': {
        return complexValue.find(attr => {
          return attr[filterAttribute] <= filterValue;
        });
      }
      default: {
        throw new Error(`The '${operator}' operator is unsupported`);
      }
    }
  }

  /**
   * Get the SCIM resource id.
   * @returns {string} The SCIM resource id.
   */
  id() {
    return this.get('id');
  }

  /**
   * Get the SCIM resource's metadata. This might include the
   * resource's location and created/updated timestamps.
   * @returns {string} The SCIM resource's metadata.
   */
  meta() {
    return this.get('meta');
  }

  /**
   * Get the SCIM resource's schemas.
   * @returns {Array} An array of SCIM schema URNs.
   */
  schemas() {
    return this.get('schemas');
  }

  /**
   * Get the attribute value at the specified path.
   * @param {string} path - A SCIM attribute path.
   * @returns {(string|number|boolean|Object)} The value at the
   * specified path, or undefined if the path does not exist.
   */
  get(path) {
    const { attributePath, data } = this._resolveSchema(path);
    const parsedPath = Resource._parseValueFilter(attributePath);
    if (parsedPath) {
      try {
        return this._getValueFromFilter(
            data,
            parsedPath.attribute,
            parsedPath.filterAttribute,
            parsedPath.operator,
            parsedPath.filterValue
        );
      } catch (e) {
        return undefined;
      }
    }
    return objectPath.get(data, attributePath);
  }

  /**
   * Set an attribute value at the specified path.
   * @param {string} path - A SCIM attribute path.
   * @param {(string|number|boolean|Object)} value - The value to set.
   */
  set(path, value) {
    const { attributePath, data } = this._resolveSchema(path);
    const parsedPath = Resource._parseValueFilter(attributePath);
    if (parsedPath) {
      throw new Error('setting a value using a value filter is unsupported');
    }
    objectPath.set(data, attributePath, value);
  }

  /**
   * Get the SCIM resource as a JSON string.
   */
  toJSON() {
    return JSON.stringify(this.data);
  }
}

export default Resource;