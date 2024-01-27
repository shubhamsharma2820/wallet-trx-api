// Fetch all coin transactions of the a specific user with pagenation
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

const coinTable = process.env.COIN_TRANSACTION_TABLE;
const limit = 30;

export const getCoinTransactions = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };

  try {
    const { exclusiveStartKey } = JSON.parse(event.body);
    let ExclusiveStartKey;
    if (exclusiveStartKey) {
      ExclusiveStartKey = exclusiveStartKey || null;
    }
    const userId = event.pathParameters.userId;

    //DynamoDB query parameters
    const params = {
      TableName: coinTable,
      Limit: limit,
      ExclusiveStartKey: ExclusiveStartKey,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const { Items, LastEvaluatedKey } = await ddbDocClient.send(
      new QueryCommand(params)
    );
    response.body = JSON.stringify({
      status: 200,
      data: Items,
      message: "Coin transactions retrieved successfully!.",
      lastEvaluatedKey: LastEvaluatedKey || null,
    });
  } catch (error) {
    console.error("Error:", error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      status: 500,
      error: "Internal Server Error",
      message:
        "The server encountered an unexpected error. Please try again later.",
    });
  }
  return response;
};
