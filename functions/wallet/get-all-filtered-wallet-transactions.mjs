/**
 * This function used by admin to retrive all the wallet transaction based on 
 * the referenceId or transaction type. Eg: gold, bid, cashback etc...
 */

import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

const walletTable = process.env.WALLET_TRANSACTION_TABLE;
const limit = 30;

export const getAllFilteredWalletTransactions = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };

  try {
    const { exclusiveStartKey , sortKeyPrefix } = JSON.parse(event.body);
    let ExclusiveStartKey;
    if (exclusiveStartKey) {
      ExclusiveStartKey = exclusiveStartKey || null;
    }

    //DynamoDB query parameters
    const params = {
      TableName: walletTable,
      Limit: limit,
      ExclusiveStartKey: ExclusiveStartKey,
      FilterExpression: "begins_with(referenceId, :referenceId)",
      ExpressionAttributeValues: {
        ":referenceId": sortKeyPrefix,
      },
    };

    const { Items, LastEvaluatedKey } = await ddbDocClient.send(
      new ScanCommand(params)
    );

    response.body = JSON.stringify({
      status: 200,
      data: Items,
      message:
        "All referenceId-based wallet transactions retrieved successfully!.",
      lastEvaluatedKey: LastEvaluatedKey || null,
    });
  } catch (error) {
    console.error("Error:", error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      status: 500,
      error: "Internal Server Error",
      message: "The server encountered an unexpected error. Please try again later.",
    });
  }

  return response;
};
