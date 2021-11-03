import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";

export class Step09AppsyncDynamodbDatasourceVtlStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // AppSync Api
    const api = new appsync.GraphqlApi(this, "step09API", {
      name: "step09NotesApi",
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

    // print URL, Key, id and region of API
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

    // DDB table creation
    const ddbTable = new ddb.Table(this, "step09Table", {
      tableName: "Step09Table",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    // connect ddb as data source to AppSync
    const ddb_data_source = api.addDynamoDbDataSource("dataSource", ddbTable);
  }
}
