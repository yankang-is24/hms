export enum HackathonDropdownMode {
  Archive = 'ARCHIVE',
  IdeaPortal = 'IDEA_PORTAL',
  Home = 'HOME',
  MyIdeas = 'MY_IDEAS',
}

export enum HackathonDetailsType {
  Header = 'HEADER',
  FullInfo = 'FULLINFO',
  Archive = 'ARCHIVE',
}

export enum IdeaCardType {
  Owner = 'OWNER',
  Admin = 'ADMIN',
  Voting = 'VOTING',
  IdeaPortal = 'IDEA_PORTAL',
  Archive = 'ARCHIVE',
}

export enum HackathonStatus {
  RegistrationOpen = 'REGISTRATION_OPEN',
  RegistrationClosed = 'REGISTRATION_CLOSED',

  HackathonOpen = 'HACKATHON_OPEN',
  HackathonClosed = 'HACKATHON_CLOSED',

  VotingOpen = 'VOTING_OPEN',
  VotingClosed = 'VOTING_CLOSED',
}

export type HackathonPreview = {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
}

export type Hackathon = {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  participants?: ParticipantPreview[]
  categories?: CategoryPreview[]
  ideas?: IdeaPreview[]
}

export type HackathonSerializable = {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  participants?: ParticipantPreview[]
  categories?: CategoryPreview[]
  ideas?: IdeaPreview[]
}

export const parseHackathon = (json: any): Hackathon =>
  ({
    id: json.id,
    title: json.title,
    description: json.description,
    startDate: new Date(json.startDate),
    endDate: new Date(json.endDate),
    ideas: json.ideas ? parseIdeaPreviews(json.ideas) : [],
    categories: json.categories ? parseCategoryPreviews(json.categories) : [],
    participants: json.participants
      ? parseParticipantPreviews(json.participants)
      : [],
  } as Hackathon)

export const parseHackathonPreview = (json: any): HackathonPreview =>
  ({
    id: json.id,
    title: json.title,
    description: json.description,
    startDate: new Date(json.startDate),
    endDate: new Date(json.endDate),
  } as HackathonPreview)

export const parseHackathons = (jsonArray: any[]): Hackathon[] =>
  jsonArray.map((json) => parseHackathon(json))

export const parseHackathonPreviews = (jsonArray: any[]): HackathonPreview[] =>
  jsonArray.map((json) => parseHackathonPreview(json))

export type IdeaPreview = {
  id: string
  title: string
}

const parseIdeaPreviews = (jsonArray: any[]): IdeaPreview[] =>
  jsonArray.map(
    (json) =>
      ({
        id: json.id,
        title: json.title,
      } as IdeaPreview)
  )

export type Idea = {
  id: string
  owner?: OwnerPreview
  hackathon?: HackathonPreview
  participants?: ParticipantPreview[]
  title: string
  description: string
  problem: string
  goal: string
  requiredSkills?: SkillPreview[]
  category?: CategoryPreview
  creationDate: Date
}

export type CategoryPreview = {
  id: string
  title: string
}

const parseCategoryPreviews = (jsonArray: any[]): CategoryPreview[] =>
  jsonArray.map(
    (json) =>
      ({
        id: json.id,
        title: json.title,
      } as CategoryPreview)
  )

export type Category = {
  id: string
  title: string
  description: string
  hackathonId: string
}

export type ParticipantPreview = {
  id: string
  user: UserPreview
}

const parseParticipantPreviews = (jsonArray: any[]): ParticipantPreview[] =>
  jsonArray.map(
    (json) =>
      ({
        id: json.id,
        user: parseUserPreview(json.user),
      } as ParticipantPreview)
  )

export type Participant = {
  userId: string
  hackathonId: string
  id: string
  creationDate: Date
}

export type UserPreview = {
  id: string
  lastName?: string
  firstName?: string
  imageUrl?: string
}

const parseUserPreview = (json: any): UserPreview =>
  ({
    id: json.id,
    lastName: json.lastName,
    firstName: json.firstName,
    imageUrl: json.imageUrl,
  } as UserPreview)

export type User = {
  id: string
  lastName?: string
  firstName: string
  emailAddress: string
  roles: string[]
  skills: SkillPreview[]
  imageUrl?: string
  creationDate: Date
}

export type ActiveDirectoryUser = {
  id: string
  displayName: string
  givenName: string
  surname: string
  mail: string
  userPrincipalName: string
}

export type SkillPreview = {
  id: string
  name: string
}

export type OwnerPreview = {
  id: string
  user: UserPreview
}
