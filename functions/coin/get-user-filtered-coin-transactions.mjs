/**
 * This function will retrive all the coin transaction of a specific usre based on
 * the referenceId or transaction type. Eg: gold, bid, cashback etc...
 */

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

const coinTable = process.env.COIN_TRANSACTION_TABLE;

export const getUserFilteredCoinTransactions = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };

  const { exclusiveStartKey, sortKeyPrefix, limit } = JSON.parse(event.body);
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
       TableName: coinTable,
       Limit: limit > 10 ? limit : 10,
       ExclusiveStartKey: ExclusiveStartKey,
       KeyConditionExpression: "userId = :userId",
       ExpressionAttributeValues: {
         ":userId": userId,
         ":txnType": sortKeyPrefix,
       },
       FilterExpression: "begins_with(txnType, :txnType)",
       ScanIndexForward: false,
     };
    const { Items, LastEvaluatedKey } = await ddbDocClient.send(
      new QueryCommand(params)
    );

    response.body = JSON.stringify({
      status: 200,
      data: Items,
      message:
        "User's all filtere based coin transactions retrieved successfully!. ",
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
