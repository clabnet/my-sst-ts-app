import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const response = {
    data: 'Hello, World! This is another lambda but with JSON'
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  };
};