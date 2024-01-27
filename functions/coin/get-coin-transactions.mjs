// Fetch all coin transactions of the a specific user with pagenation
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

export const getCoinTransactions = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };

  try {
    const data = JSON.parse(event.body);
    const { exclusiveStartKey } = data;
    const userId = event.pathParameters.userId;
    const coinTable = process.env.COIN_TRANSACTION_TABLE;
    const limit = 30;
    const params = {
      TableName: coinTable,
      Limit: limit || 10,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    if (exclusiveStartKey) {
      params.ExclusiveStartKey = exclusiveStartKey || null;
    }

    const coinTransaction = await ddbDocClient.send(new QueryCommand(params));
    console.log(coinTransaction);
    response.body = JSON.stringify({
      status: 200,
      data: coinTransaction.Items,
      message: "User's all coin transactions...",
      lastEvaluatedKey: coinTransaction.LastEvaluatedKey || null,
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