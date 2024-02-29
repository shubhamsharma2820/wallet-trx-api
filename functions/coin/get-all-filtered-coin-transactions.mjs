/**
 * This function used by admin to retrive all the coin transaction based on
 * the referenceId or transaction type. Eg: gold, bid, cashback etc...
 */

import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

const coinTable = process.env.COIN_TRANSACTION_TABLE;

export const getAllFilteredCoinTransactions = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };
  const { exclusiveStartKey, sortKeyPrefix, limit } = JSON.parse(event.body);
  let ExclusiveStartKey;
  if (exclusiveStartKey) {
    ExclusiveStartKey = exclusiveStartKey || null;
  }
  try {
    //DynamoDB query parameters
    const params = {
      TableName: coinTable,
      Limit: limit > 10 ? limit : 10,
      ExclusiveStartKey: ExclusiveStartKey,
      FilterExpression: "begins_with(txnType, :txnType)",
      ExpressionAttributeValues: {
        ":txnType": sortKeyPrefix,
      },
    };

    const { Items, LastEvaluatedKey } = await ddbDocClient.send(
      new ScanCommand(params)
    );

    response.statusCode = 200;
    response.body = JSON.stringify({
      status: 200,
      data: Items,
      message:
        "All referenceId-based coin transactions retrieved successfully!.",
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

