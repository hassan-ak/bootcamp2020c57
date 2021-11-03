import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";

export class Step08AppsyncDynamodbAsDatasourceMappingtemplateMethodsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // New appSync API
    const api = new appsync.GraphqlApi(this, "step08API", {
      name: "step08NotesApi",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(20)),
          },
        },
      },
      xrayEnabled: true,
    });

    // URL, Key, id and region of API
    new cdk.CfnOutput(this, "API_Url", {
      value: api.graphqlUrl,
    });
    new cdk.CfnOutput(this, "API_Key", {
      value: api.apiKey || "",
    });
    new cdk.CfnOutput(this, "API_Region", {
      value: this.region,
    });
    new cdk.CfnOutput(this, "API_ID", {
      value: api.apiId,
    });

    // DynamoDB table creation
    const ddbTable = new ddb.Table(this, "step08Table", {
      tableName: "Step08Table",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    // Connect ddb table as data source to appSync
  }
}
