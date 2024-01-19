# Wallet Coin api service
The Address API service provides functionality to manage user addresses. It enables user to get, create, update and delete address in the DynamoDB **"Addresses" table**. These addresses can be used for gold or any other product delivery.

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
├── functions                     # Lambda configuration and source code folder   
│   ├── get-address.mjs             # Get all addresses of the user.
│   ├── create-address.mjs          # Create a new address for user.
│   ├── update-address.mjs          # Update address with required userId and addressId.
│   └── delete-address.mjs          # Delete address with required userId, and addressId.
│   
├── libs                          # Lambda shared code
│   ├── ddbClient.mjs               # DynamoDB client helpers
│   └── ddbDocClient.mjs            # DynamoDB document dlient helper
│
├── package.json
└── serverless.yml                  # Serverless service file
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
<br/>

Cheers,<br/>**The :zap: Spark Team**