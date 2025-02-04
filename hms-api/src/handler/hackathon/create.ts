import {buildResponse} from '../../rest/responses';
import {createHackathon} from '../../service/hackathon-service';
import {wrapHandler} from '../handler-wrapper';
import HackathonCreateRequest from '../../rest/HackathonCreateRequest';
import HackathonCreateResponse from '../../rest/HackathonCreateResponse';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const request = HackathonCreateRequest.parse(event.body);
    const hackathon = await createHackathon(
      request.title,
      request.description,
      request.startDate,
      request.endDate,
    );

    callback(
      null,
      buildResponse(201, new HackathonCreateResponse(hackathon.id)),
    );
  }, callback);
}
