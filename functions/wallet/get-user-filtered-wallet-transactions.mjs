// #bor = based on referenceId
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

export const getUserFilteredWalletTransactions = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };
  //   #bor = based on referenceId
  try {
    const data = JSON.parse(event.body);
    const { exclusiveStartKey, sortKeyPrefix } = data;
    const userId = event.pathParameters.userId;
    const walletTable = process.env.WALLET_TRANSACTION_TABLE;
    const limit = 30;

    const params = {
      TableName: walletTable,
      Limit: limit || 10,
      KeyConditionExpression: "userId = :u AND begins_with(referenceId, :r)",
      ExpressionAttributeValues: {
        ":u": userId,
        ":r": sortKeyPrefix,
      },
    };
    if (exclusiveStartKey) {
      params.ExclusiveStartKey = exclusiveStartKey || null;
    }
    const Result = await ddbDocClient.send(new QueryCommand(params));
    console.log(Result);
    response.body = JSON.stringify({
      status: 200,
      data: Result.Items,
      message: "User's all wallet transactions...",
      lastEvaluatedKey: Result.LastEvaluatedKey || null,
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
