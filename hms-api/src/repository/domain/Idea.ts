import {uuid, Uuid} from '../../util/uuids';

/**
 * An Idea is... well an Idea idk it's a thing people work on
 */
export default class {
  id: Uuid;
  ownerId: Uuid;
  hackathonId: Uuid;
  participantIds: Uuid[];
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: string[];
  categoryId: Uuid;
  creationDate: Date;

  constructor(
      ownerId: Uuid,
      hackathonId: Uuid,
      participantIds: Uuid[],
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: string[],
      categoryId: Uuid,
  );
  constructor(
      ownerId: Uuid,
      hackathonId: Uuid,
      participantIds: Uuid[],
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: string[],
      categoryId: Uuid,
      id: Uuid,
      creationDate: Date,
  );

  // eslint-disable-next-line require-jsdoc
  constructor(
      ownerId: Uuid,
      hackathonId: Uuid,
      participantIds: Uuid[],
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: string[],
      categoryId: Uuid,
      id: Uuid = uuid(),
      creationDate: Date = new Date(),
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.hackathonId = hackathonId;
    this.participantIds = participantIds;
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.categoryId = categoryId;
    this.creationDate = creationDate;
  }
}
