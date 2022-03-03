import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import badRequestResponse from "../responses/badRequestResponse";
import internalErrorResponse from "../responses/internalErrorResponse";
import successResponse from "../responses/successResponse";

type PathParams = {
    userId?: string;
};

const db = new DynamoDB.DocumentClient();

const parseBody = (event: APIGatewayProxyEventV2): PathParams => {
    const data = event.queryStringParameters;

    return {
        userId: data?.userId,
    };
};

const isValid = (data: PathParams) => typeof data.userId !== "undefined";

const getByUserId = async (tableName: string, userId: string) => {
    const result = await db.query({
        TableName: tableName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    }).promise();

    return result.Items
};

export const handler: APIGatewayProxyHandlerV2 = async (
    event: APIGatewayProxyEventV2
) => {
    const data = parseBody(event);

    if (typeof process.env.tableName === "undefined")
        return internalErrorResponse("tableName is undefined");

    const tableName = process.env.tableName;

    if (!isValid(data)) return badRequestResponse("userId is required in query");

    const items = await getByUserId(tableName, data.userId as string);

    return successResponse(items)
};