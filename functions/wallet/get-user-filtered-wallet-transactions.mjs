import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

const walletTable = process.env.WALLET_TRANSACTION_TABLE;
const limit = 30;

export const getUserFilteredWalletTransactions = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };
  try {
    const { exclusiveStartKey = null, sortKeyPrefix } = JSON.parse(event.body);
    let ExclusiveStartKey;
    if (exclusiveStartKey) {
      ExclusiveStartKey = exclusiveStartKey || null;
    }
    const userId = event.pathParameters.userId;

    //DynamoDB query parameters
    const params = {
      TableName: walletTable,
      Limit: limit,
      ExclusiveStartKey: ExclusiveStartKey,
      KeyConditionExpression:
        "userId = :userId AND begins_with(referenceId, :referenceId)",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":referenceId": sortKeyPrefix,
      },
    };

    const { Items, LastEvaluatedKey } = await ddbDocClient.send(
      new QueryCommand(params)
    );
    response.statusCode = 200;
    response.body = JSON.stringify({
      status: 200,
      data: Items,
      message:
        "Wallet transactions retrieved successfully based on user filtered..!!!",
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
