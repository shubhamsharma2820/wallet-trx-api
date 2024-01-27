// #bor = based on referenceId
// Admin side API
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

   const walletTable = process.env.WALLET_TRANSACTION_TABLE;

export const getAllFilteredWalletTransactions = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };

  try {
    const { exclusiveStartKey = null, sortKeyPrefix } = JSON.parse(event.body);
    const limit = 30;

    const params = {
      TableName: walletTable,
      Limit: limit || 10,
      FilterExpression: "begins_with(referenceId, :r)",
      ExpressionAttributeValues: {
        ":r": sortKeyPrefix,
      },
    };
    if (exclusiveStartKey) {
      params.ExclusiveStartKey = exclusiveStartKey || null;
    }

    const data = await ddbDocClient.send(new ScanCommand(params));
    console.log(result);

    response.body = JSON.stringify({
      status: 200,
      data: result.Items,
      message: "All referenceId-based wallet transactions...",
      lastEvaluatedKey: result.LastEvaluatedKey || null,
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