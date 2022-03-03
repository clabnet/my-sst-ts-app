import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import badRequestResponse from "../responses/badRequestResponse";
import internalErrorResponse from "../responses/internalErrorResponse";
import successResponse from "../responses/successResponse";

type RequestParams = {
    noteId?: string;
    userId?: string
};

const db = new DynamoDB.DocumentClient();

const parseBody = (event: APIGatewayProxyEventV2): RequestParams => {
    const pathData = event.pathParameters;
    const queryData = event.queryStringParameters;

    return {
        noteId: pathData?.noteId,
        userId: queryData?.userId
    };
};

const isValid = (data: RequestParams) => typeof data.noteId !== "undefined" && typeof data.userId !== 'undefined'

const getOne = async (tableName: string, noteId: string, userId: string) => {
    const result = await db.get({
        TableName: tableName,
        Key: {
            userId: userId,
            noteId: noteId
        }
    }).promise();

    return result.Item
};

export const handler: APIGatewayProxyHandlerV2 = async (
    event: APIGatewayProxyEventV2
) => {
    const data = parseBody(event);

    if (typeof process.env.tableName === "undefined")
        return internalErrorResponse("tableName is undefined");

    const tableName = process.env.tableName;

    if (!isValid(data)) return badRequestResponse("noteId is required in path, userId is required in query");

    const items = await getOne(tableName, data.noteId as string, data.userId as string);

    return successResponse(items)
};

