// This funciton fetch wallet transactions of a specific user with pagination limit set to 30

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

const walletTable = process.env.WALLET_TRANSACTION_TABLE;

export const getWalletTransactions = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };
  const { exclusiveStartKey, limit } = JSON.parse(event.body);
  let ExclusiveStartKey;
  if (exclusiveStartKey) {
    ExclusiveStartKey = exclusiveStartKey || null;
  }
  const userId = event.pathParameters.userId;
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "User id required.",
      }),
    };
  }
  try {
    //DynamoDB query parameters
    const params = {
      TableName: walletTable,
      Limit: limit > 10 ? limit : 10,
      ExclusiveStartKey: ExclusiveStartKey,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ScanIndexForward: false,
    };

    const { Items, LastEvaluatedKey } = await ddbDocClient.send(
      new QueryCommand(params)
    );

    response.body = JSON.stringify({
      status: 200,
      data: Items,
      message: "Wallet transactions retrieved successfully!.",
      metadata: LastEvaluatedKey || null,
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
