# Wallet Coin api service

The Wallet-Coin API service simplifies the management of user coin and wallet transactions. It empowers both users and administrators to effortlessly perform essential operations such as creating, retrieving, updating, and deleting coin and wallet entries. These transactions are securely stored in DynamoDB tables named **"WalletTransaction"** and **"CoinTransaction"**, providing a reliable and scalable solution.

## Installation/deployment instructions

Follow the instructions below to deploy your project.

> **Requirements**: NodeJS `Runtime: nodejs18.x` ensure you're using the same Node version locally and in your lambda's runtime

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy --stage <STAGE>` to deploy this stack to AWS

## Configuration

Plugins used in the `serverless.yml`:

```yaml
plugins:
  - serverless-deployment-bucket
  - serverless-iam-roles-per-function
  - serverless-domain-manager
  - serverless-associate-waf
```

### Libraries

- "@aws-sdk/client-dynamodb": "^3.312.0",
- "@aws-sdk/lib-dynamodb": "^3.312.0",

## Test service

This service contains multiple lambda functions that can be triggered by an HTTP request made on the provisioned REST API Gateway.

> :warning: As is, this service, once deployed, opens a **public** endpoints within AWS account resources. Anybody with the URL can actively execute the API Gateway endpoint and the corresponding lambda. These endpoints are protected by the Cognito IAM User Pool authentication method and Web Application Firewall (WAF).

### Locally

In order to test the functions locally, run the following command:

- `npx sls invoke local -f {functionName} --path functions/{FunctionFile}` using NPM or
- `serverless invoke local --function functionName` using NPM

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` and `method` - found in the Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed service.

```
curl --location --request GET '<REPLACE_WITH_URL>' \
--header 'Content-Type: application/json, Authorization: <COGNITO_JWT_TOKEN>' \
--data-raw '{
    "imageData": "<BASE64_STRING>"
}'
```

## Project structure

The project code base is mainly located within the `functions` folder.

- `functions` - containing code base and configuration for lambda functions
- `libs` - containing shared code base between lambdas

```
.
├── functions  # Lambda configuration and source code folder
│ ├── coin     # Lambda functions related to coin transactions
│ │ ├── create-coin-transaction.mjs     # Lambda function to create a new coin transaction in the CoinTransaction table
│ │ ├── get-all-filtered-coin-transactions.mjs    # Lambda function to get all coin transactions with pagination for admin purposes
│ │ ├── get-coin-transactions.mjs   # Lambda function to get all coin transactions with pagination
│ │ └── get-user-filtered-coin-transactions.mjs    # Lambda function to get user-filtered coin transactions based on provided prefix with pagination
│ └── wallet # Lambda functions related to wallet transactions
│ ├── create-wallet-transaction.mjs   # Lambda function to create a new wallet transaction
│ ├── get-all-filtered-wallet-transactions.mjs   # Lambda function to get all wallet transactions with pagination
│ ├── get-user-filtered-wallet-transactions.mjs  # Lambda function to get user-filtered wallet transactions based on provided prefix with pagination
│ └── get-wallet-transactions.mjs   # Lambda function to get all wallet transactions with pagination
├── schemas   # JSON schemas for input/output validation
│ ├── coin   # Schemas related to coin transactions
│ │ ├── create-coin-transaction-schema.json   # Schema for creating a coin transaction
│ │ ├── get-all-filtered-coin-transactions-schema.json  # Schema for getting all coin transactions with pagination
│ │ ├── get-coin-transactions-schema.json  # Schema for getting all coin transactions with pagination
│ │ └── get-user-filtered-coin-transactions-schema.json  # Schema for getting user-filtered coin transactions with pagination
│ └── wallet  # Schemas related to wallet transactions
│ ├── create-wallet-transaction-schema.json   # Schema for creating a wallet transaction
│ ├── get-all-filtered-wallet-transactions-schema.json   # Schema for getting all wallet transactions with pagination
│ ├── get-user-filtered-wallet-transactions-schema.json  # Schema for getting user-filtered wallet transactions with pagination
│ └── get-wallet-transactions-schema.json   # Schema for getting all wallet transactions with pagination
├── libs  # Shared code for lambda functions
│ ├── ddbClient.mjs   # DynamoDB client helper functions
│ └── ddbDocClient.mjs   # DynamoDB document client helper functions
├── package.json  # Project dependencies and scripts
└── serverless.yml  # Serverless service configuration file
```

## Cleanup

To delete this service or stack that you created, you can run the following serverless command:

```
serverless remove --stage <STAGE> --region ap-south-1
```

## Contributing

> - No PR including modifications from `dev` to `main` branch will be accepted. Only pull request from `test` to `main` branch is acceptable.
> - Always pull the code from `main` branch before pushing the updated code.
> - Create new feature branches from `main` branch only.
> - Update documentation for the changes before submitting for PR.
> - Code must be clean, consistent, and properly formatted.
>   <br/>

Cheers,<br/>**The :zap: Spark Team**
