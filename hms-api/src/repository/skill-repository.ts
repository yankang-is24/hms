/* eslint-disable require-jsdoc */
// TODO add error handling
// TODO add paging for lists

import Skill from './domain/Skill';
import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {Uuid} from '../util/uuids';
import {getClient} from './dynamo-db';

const table = process.env.SKILL_TABLE;
const dynamoDBClient = getClient();

export async function listSkills(): Promise<Skill[]> {
  const output = await dynamoDBClient.send(new ScanCommand({
    TableName: table,
  }));

  return output.Items.map((item) => itemToSkill(item));
}

export async function createSkill(skill: Skill) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: table,
    Item: {
      name: {S: skill.name},
      description: {S: skill.description},
      id: {S: skill.id},
    },
  }));
}

export async function getSkill(id: Uuid): Promise<Skill | undefined> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  return item ? itemToSkill(item) : undefined;
}

export async function getSkills(ids: Uuid[]): Promise<Skill[]> {
  const skills: Skill[] = [];
  for (const id of ids) {
    skills.push(await getSkill(id));
  }

  return skills;
}

export async function removeSkill(id: Uuid) {
  // TODO determine if something was actually deleted
  await dynamoDBClient.send(new DeleteItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));
}

function itemToSkill(item: { [key: string]: AttributeValue }): Skill {
  return new Skill(
      item.name.S,
      item.description.S,
      item.id.S,
  );
}
