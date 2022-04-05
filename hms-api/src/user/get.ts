'use strict';

import {Uuid} from '../core';
import {getUser} from '../mock/user';

// eslint-disable-next-line require-jsdoc
export function get(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(getUser(id)),
  };

  callback(null, response);
}
