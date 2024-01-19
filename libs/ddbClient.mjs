/* 
Purpose:
ddbClient.js is a helper function that creates an Amazon DynamoDB service client.
*/

// Create the DynamoDB service client module.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// set the AWS Region.
const DEFAULT_REGION = "ap-south-1";

// Create an Amazon DynamoDB service client object.
export const ddbClient = new DynamoDBClient({ region: DEFAULT_REGION });