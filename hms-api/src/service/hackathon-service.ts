/* eslint-disable require-jsdoc */

import {
  deleteHackathon,
  getHackathon,
  listHackathons,
  putHackathon,
} from '../repository/hackathon-repository';
import {listParticipants} from '../repository/participant-repository';
import {usersFor} from './user-service';
import {listCategories} from '../repository/category-repository';
import {listIdeasForHackathon} from '../repository/idea-repository';
import Uuid from '../util/Uuid';
import Hackathon from '../repository/domain/Hackathon';
import HackathonResponse from '../rest/HackathonResponse';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import HackathonListResponse from '../rest/HackathonListResponse';
import HackathonDeleteResponse from '../rest/HackathonDeleteResponse';
import NotFoundError from '../error/NotFoundError';
import {removeIdeasForHackathon} from './idea-service';
import DeletionError from '../error/DeletionError';
import {removeCategoriesForHackathon} from './category-service';
import {removeParticipantsForHackathon} from './participant-service';
import ValidationError from '../error/ValidationError';

export async function createHackathon(
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
): Promise<Hackathon> {
  const hackathon = new Hackathon(title, description, startDate, endDate);
  const result = hackathon.validate();
  if (result.hasFailed()) {
    throw new ValidationError(`Cannot create Hackathon`, result);
  }

  await putHackathon(hackathon);

  return hackathon;
}

export async function getHackathonResponse(
  id: Uuid,
): Promise<HackathonResponse> {
  let participants;
  try {
    participants = await listParticipants(id);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Hackathon with id: ${id}, unable to list Participants`,
    );
  }

  let users;
  try {
    users = await usersFor(participants);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Hackathon with id: ${id}, ` +
        `unable to find Users for Participants ` +
        `${participants.map((p) => p.id)}`,
    );
  }

  let categories;
  try {
    categories = await listCategories(id);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Hackathon with id: ${id}, unable to list Categories`,
    );
  }

  let ideas;
  try {
    ideas = await listIdeasForHackathon(id);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Hackathon with id: ${id}, unable to list Ideas`,
    );
  }

  const hackathon = await getHackathon(id);
  return HackathonResponse.from(
    hackathon,
    participants,
    users,
    categories,
    ideas,
  );
}

export async function getHackathonListResponse(): Promise<HackathonListResponse> {
  const hackathons = await listHackathons();
  return HackathonListResponse.from(hackathons);
}

export async function editHackathon(
  id: Uuid,
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
): Promise<void> {
  let existing: Hackathon;
  try {
    existing = await getHackathon(id);
    existing.title = title;
    existing.description = description;
    existing.startDate = startDate;
    existing.endDate = endDate;
  } catch (e) {
    throw new NotFoundError(
      `Cannot edit Hackathon with id: ${id}, it does not exist`,
    );
  }

  const result = existing.validate();
  if (result.hasFailed()) {
    throw new ValidationError(`Cannot edit Hackathon with id: ${id}`, result);
  }

  await putHackathon(existing);
}

export async function removeHackathon(
  id: Uuid,
): Promise<HackathonDeleteResponse> {
  try {
    await removeIdeasForHackathon(id);
    await removeCategoriesForHackathon(id);
    await removeParticipantsForHackathon(id);
  } catch (e) {
    throw new DeletionError(
      `Unable to remove Hackathon with id: ${id}, ` +
        `nested failure is: ${e.message}`,
    );
  }
  await deleteHackathon(id);
  return new HackathonDeleteResponse(id);
}
