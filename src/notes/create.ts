import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v1 } from "uuid";
import internalErrorResponse from "../responses/internalErrorResponse";
import successResponse from "../responses/successResponse";
import badRequestResponse from "../responses/badRequestResponse"
import Note from "./Note";

const db = new DynamoDB.DocumentClient();

const toItem = (data: string, content: string): Note => {
    return {
        userId: data,
        noteId: v1(),
        content: content,
        createdAt: Date.now(),
    };
};

const parseBody = (event: APIGatewayProxyEventV2) => {
    const data = JSON.parse(event.body || "{}");

    return {
        userId: data.userId,
        content: data.content,
    };
};

const isValid = (data: Partial<Note>) =>
    typeof data.userId !== "undefined" && typeof data.content !== "undefined";

const create = async (tableName: string, item: Note) => {
    await db.put({ TableName: tableName, Item: item }).promise();
};

export const handler: APIGatewayProxyHandlerV2 = async (
    event: APIGatewayProxyEventV2
) => {
    if (typeof process.env.tableName === "undefined")
        return internalErrorResponse("tableName is undefined");

    const tableName = process.env.tableName;
    const data = parseBody(event);

    if (!isValid(data)) return badRequestResponse("userId and content are required");

    const item = toItem(data.userId, data.content);
    await create(tableName, item);

    return successResponse(item)
};