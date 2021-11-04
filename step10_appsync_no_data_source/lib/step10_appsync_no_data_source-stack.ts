import * as cdk from "@aws-cdk/core";
import * as appSync from "@aws-cdk/aws-appsync";

export class Step10AppsyncNoDataSourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // AppSync Api
    const api = new appSync.GraphqlApi(this, "noDataSourceAPI", {
      name: "noDataSourceAPI",
      logConfig: {
        fieldLogLevel: appSync.FieldLogLevel.ALL,
      },
      schema: appSync.Schema.fromAsset("graphql/schema.gql"),
    });

    // Print API URl
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });
  }
}
