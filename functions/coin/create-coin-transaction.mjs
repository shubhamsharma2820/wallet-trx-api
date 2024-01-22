// This will create a new item in table with all the details of transaction.
import { ddbDocClient } from "../../libs/ddbDocClient.mjs";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const createCoinTransaction = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };
  try {
    const data = JSON.parse(event.body);
    const { userId, referenceId, description, isCredited, coin } = data;
    const coinTable = process.env.COIN_TRANSACTION_TABLE;
    const CoinTransaction = await ddbDocClient.send(
      new PutCommand({
        TableName: coinTable,
        Item: {
          userId: userId,
          referenceId: referenceId,
          description: description,
          isCredited: isCredited,
          timeStamp: new Date(Date.now()).toISOString(),
          coin: coin,
        },
      })
    );
    console.log(CoinTransaction);
    response.body = JSON.stringify({
      status: 200,
      message: "Coin transaction created successfully...!",
      data: CoinTransaction,
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      status: 500,
      error: "Internal Server Error",
      message:
        "The server encountered an unexpected error. Please try again later.",
    });
    return response;
  }
};