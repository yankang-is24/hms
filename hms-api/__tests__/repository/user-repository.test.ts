import {
  mockGetItem,
  mockGetItemOnce,
  mockPutItem,
  mockQuery,
  mockSend,
  userTable,
} from './dynamo-db-mock';
import {
  deleteUser,
  getUser,
  getUsers,
  listUsers,
  putUser,
  userExists,
} from '../../src/repository/user-repository';
import Uuid, {uuid} from '../../src/util/Uuid';
import NotFoundError from '../../src/repository/error/NotFoundError';
import {randomUser} from './domain/user-maker';
import User from '../../src/repository/domain/User';
import {AttributeValue} from '@aws-sdk/client-dynamodb';
import {mapRolesToStrings} from '../../src/repository/domain/Role';

describe('Get User', () => {
  test('User doesn\'t exist', async () => {
    const id = uuid();
    mockGetItem(null);

    await expect(getUser(id)).rejects.toThrow(NotFoundError);

    getExpected(id);
  });

  test('User exists', async () => {
    const expected = randomUser();
    mockGetItem(itemFromUser(expected));

    expect(await getUser(expected.id)).toStrictEqual(expected);

    getExpected(expected.id);
  });
});

describe('Put User', () => {
  test('Happy Path', async () => {
    mockPutItem();
    const expected = randomUser();

    await putUser(expected);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: userTable,
            Item: itemFromUser(expected),
          }),
        }));
  });
});

describe('Delete User', () => {
  test('Happy Path', async () => {
    const id = uuid();

    await deleteUser(id);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: userTable,
            Key: {id: {S: id}},
          }),
        }),
    );
  });
});

describe('Get Users', () => {
  test('All users missing', async () => {
    mockGetItemOnce(null);
    mockGetItemOnce(null);
    const id1 = uuid();
    await expect(getUsers([id1, uuid()]))
        .rejects
        .toThrow(NotFoundError);

    getExpected(id1);
  });

  test('1 user missing', async () => {
    const user1 = randomUser();
    mockGetItemOnce(itemFromUser(user1));
    mockGetItemOnce(null);
    const id2 = uuid();
    await expect(getUsers([user1.id, id2]))
        .rejects
        .toThrow(NotFoundError);

    getExpected(user1.id);
    getExpected(id2);
  });

  test('0 users missing', async () => {
    const user1 = randomUser();
    mockGetItemOnce(itemFromUser(user1));
    const user2 = randomUser();
    mockGetItemOnce(itemFromUser(user2));
    expect(await getUsers([user1.id, user2.id]))
        .toStrictEqual([user1, user2]);

    getExpected(user1.id);
    getExpected(user2.id);
  });
});

describe('List Users', () => {
  test('Query returns null', async () => {
    mockQuery(null);

    await expect(listUsers()).rejects.toThrow(NotFoundError);

    listExpected();
  });

  test('0 Users exist', async () => {
    mockQuery([]);

    expect(await listUsers()).toStrictEqual([]);

    listExpected();
  });

  test('1 User exists', async () => {
    const user = randomUser();
    mockQuery([itemFromUser(user)]);

    expect(await listUsers()).toStrictEqual([user]);

    listExpected();
  });

  test('2 Users exist', async () => {
    const user1 = randomUser();
    const user2 = randomUser();
    mockQuery([
      itemFromUser(user1),
      itemFromUser(user2),
    ]);

    expect(await listUsers()).toStrictEqual([user1, user2]);

    listExpected();
  });
});

describe('User Exists', () => {
  test('Item is non-null', async () => {
    mockGetItem({});

    const id = uuid();
    expect(await userExists(id)).toBe(true);

    getExpected(id);
  });

  test('Item is null', async () => {
    mockGetItem(null);

    const id = uuid();
    expect(await userExists(id)).toBe(false);

    getExpected(id);
  });
});

const itemFromUser = (user: User): { [key: string]: AttributeValue } => ({
  lastName: {S: user.lastName},
  firstName: {S: user.firstName},
  emailAddress: {S: user.emailAddress},
  roles: {SS: mapRolesToStrings(user.roles)},
  skills: {SS: user.skills},
  imageUrl: {S: user.imageUrl},
  id: {S: user.id},
  creationDate: {S: user.creationDate.toISOString()},
});

const getExpected = (id: Uuid) =>
  expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: userTable,
          Key: {id: {S: id}},
        }),
      }));

const listExpected = () =>
  expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: userTable,
        }),
      }));

