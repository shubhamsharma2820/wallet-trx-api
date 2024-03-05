// This function creates a new item in table with all the details of wallet transaction.

import { ddbDocClient } from "../../libs/ddbDocClient.mjs";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const walletTable = process.env.WALLET_TRANSACTION_TABLE;

export const createWalletTransaction = async (event) => {
  console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
  const response = { statusCode: 200, body: "" };

  try {
    const { userId, txnType, description, isCredited, amount, txnId, timeStamp } =
      JSON.parse(event.body);
    const params = {
      TableName: walletTable,
      Item: {
        userId: userId,
        txnId: txnId,
        description: description,
        isCredited: isCredited,
        timeStamp: timeStamp,
        txnType: txnType,
        amount: amount,
      },
    };
    
    const data = await ddbDocClient.send(new PutCommand(params));
    response.body = JSON.stringify({
      status: 200,
      message: "Wallet transaction created successfully...!",
      data: data,
    });
  }
  catch (error) {
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
