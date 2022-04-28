import {wrapHandler} from '../handler-wrapper';
import {buildResponse} from '../../rest/responses';
import {editCategory} from '../../service/category-service';
import CategoryEditRequest from '../../rest/CategoryEditRequest';
import CategoryEditResponse from '../../rest/CategoryEditResponse';

// eslint-disable-next-line require-jsdoc
export async function edit(event, context, callback) {
  await wrapHandler(async () => {
    const id = event.pathParameters.id;
    const request = CategoryEditRequest.parse(event.body);

    await editCategory(id, request.title, request.description);

    callback(null, buildResponse(200, new CategoryEditResponse(id)));
  }, callback);
}
