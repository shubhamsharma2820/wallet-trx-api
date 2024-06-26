// This function will create a new item in coin table with all the details of transaction.

import { ddbDocClient } from "../../libs/ddbDocClient.mjs";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const coinTable = process.env.COIN_TRANSACTION_TABLE;

export const createCoinTransaction = async (event) => {
    console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
    const response = { statusCode: 200, body: "" };

    try {
        const { userId, txnType, description, isCredited, amount, txnId, timeStamp } =
          JSON.parse(event.body);

        const params = {
          TableName: coinTable,
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
        response.statusCode = 200;
        response.body = JSON.stringify({
            status: 200,
            message: "Coin transaction created successfully...!",
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
