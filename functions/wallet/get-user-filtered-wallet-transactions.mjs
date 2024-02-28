/**
 * This function will retrive all the wallet transaction of a specific usre based on
 * the referenceId or transaction type. Eg: gold, bid, cashback etc...
 */

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";

const walletTable = process.env.WALLET_TRANSACTION_TABLE;
const limit = 30;

export const getUserFilteredWalletTransactions = async (event) => {
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
      TableName: walletTable,
      Limit: limit > 10 ? limit : 10,
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
    Items.sort((a, b) => {
      const timestampA = parseIndianStandardTime(a.timeStamp).getTime();
      const timestampB = parseIndianStandardTime(b.timeStamp).getTime();
      return timestampB - timestampA;
    });
    response.statusCode = 200;
    response.body = JSON.stringify({
      status: 200,
      data: Items,
      message: "Wallet transactions retrieved successfully!",
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
function parseIndianStandardTime(timestamp) {
  const [date, time] = timestamp.split(", ");
  const [day, month, year] = date.split("/");
  const [hour, minute, second, meridiem] = time.split(/:| /);

  let hour24 = parseInt(hour, 10);
  if (meridiem === "pm") {
    hour24 += 12;
  }
  return new Date(Date.UTC(year, month - 1, day, hour24, minute, second));
}
