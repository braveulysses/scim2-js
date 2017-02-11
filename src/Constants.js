module.exports = {
  /**
   * The media type for SCIM 2 messages.
   * @name Constants.SCIM_MEDIA_TYPE
   * @constant
   * @type {string}
   * @default
   */
  SCIM_MEDIA_TYPE: 'application/scim+json',

  /**
   * The SCIM 2 search request URN.
   * @name Constants.SCIM_SEARCH_REQUEST_URN
   * @constant
   * @type {string}
   * @default
   */
  SCIM_SEARCH_REQUEST_URN: 'urn:ietf:params:scim:api:messages:2.0:SearchRequest',

  /**
   * The SCIM 2 list response URN.
   * @name Constants.SCIM_LIST_RESPONSE_URN
   * @constant
   * @type {string}
   * @default
   */
  SCIM_LIST_RESPONSE_URN: 'urn:ietf:params:scim:api:messages:2.0:ListResponse',

  /**
   * The SCIM 2 patch request URN.
   * @name Constants.SCIM_PATCH_MESSAGE_URN
   * @constant
   * @type {string}
   * @default
   */
  SCIM_PATCH_MESSAGE_URN: 'urn:ietf:params:scim:api:messages:2.0:PatchOp',

  /**
   * The SCIM 2 bulk request URN.
   * @name Constants.SCIM_BULK_REQUEST_MESSAGE_URN
   * @constant
   * @type {string}
   * @default
   */
  SCIM_BULK_REQUEST_MESSAGE_URN: 'urn:ietf:params:scim:api:messages:2.0:BulkRequest',

  /**
   * The SCIM 2 bulk response URN.
   * @name Constants.SCIM_BULK_RESPONSE_MESSAGE_URN
   * @constant
   * @type {string}
   * @default
   */
  SCIM_BULK_RESPONSE_MESSAGE_URN: 'urn:ietf:params:scim:api:messages:2.0:BulkResponse',

  /**
   * The SCIM 2 error message URN.
   * @name Constants.SCIM_ERROR_MESSAGE_URN
   * @constant
   * @type {string}
   * @default
   */
  SCIM_ERROR_MESSAGE_URN: 'urn:ietf:params:scim:api:messages:2.0:Error'
};