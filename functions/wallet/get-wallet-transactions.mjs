// Fetch all wallet transactions of a specific user with pagination
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

export const getWalletTransactions = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };

  try {
    const data = JSON.parse(event.body);
    const {exclusiveStartKey} = data;
    const userId = event.pathParameters.userId;
    const walletTable = process.env.WALLET_TRANSACTION_TABLE;
    const limit = 30;
    const params = {
      TableName: walletTable,
      Limit: limit || 10,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    if (exclusiveStartKey) {
        params.ExclusiveStartKey = exclusiveStartKey || null;
    }

    const walletTransaction = await ddbDocClient.send(new QueryCommand(params));
    console.log(walletTransaction); 
    response.body = JSON.stringify({
      status: 200,
      data: walletTransaction.Items,
      message: "User's all wallet transactions...",
      lastEvaluatedKey: walletTransaction.LastEvaluatedKey || null,
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
