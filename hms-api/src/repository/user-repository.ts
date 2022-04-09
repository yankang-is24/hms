/* eslint-disable require-jsdoc */
// TODO add error handling
// TODO add paging for lists

import User from './domain/User';
import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {Uuid} from '../util/uuids';
import {getClient, safeTransformArray} from './dynamo-db';
import {mapRolesToStrings, mapStringToRoles} from './domain/Role';

const table = process.env.USER_TABLE;
const dynamoDBClient = getClient();

export async function listUsers(): Promise<User[]> {
  const output = await dynamoDBClient.send(new ScanCommand({
    TableName: table,
  }));

  return output.Items.map((item) => itemToUser(item));
}

export async function createUser(user: User) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: table,
    Item: {
      lastName: {S: user.lastName},
      firstName: {S: user.firstName},
      emailAddress: {S: user.emailAddress},
      roles: safeTransformArray(mapRolesToStrings(user.roles)),
      skills: safeTransformArray(user.skills),
      imageUrl: {S: user.imageUrl},
      id: {S: user.id},
      creationDate: {S: user.creationDate.toString()},
    },
  }));
}

export async function getUser(id: Uuid): Promise<User | undefined> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  return item ? itemToUser(item) : undefined;
}

export async function removeUser(id: Uuid) {
  // TODO determine if something was actually deleted
  await dynamoDBClient.send(new DeleteItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));
}

function itemToUser(item: { [key: string]: AttributeValue }): User {
  return new User(
      item.lastName.S,
      item.firstName.S,
      item.emailAddress.S,
      mapStringToRoles(item.roles.SS),
      item.skills.SS,
      item.imageUrl.S,
      item.id.S,
      new Date(item.creationDate.S),
  );
}
