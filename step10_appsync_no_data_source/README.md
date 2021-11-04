# Step 10 - Appsync without any data source

## Class Notes

So far we have discussed how to use lambda and dynamoDb as datasources for Appsync. In this step we will be seeing an example in which the Appsync has no data source. In other words it is not connected to any other service for saving or processing the incoming data.

Appsync with no data source is usually used when you wish to invoke a GraphQL operation without connecting to a data source, such as performing data transformation with resolvers or triggering a subscription to be invoked from a mutation.

This could be very useful in scenarios where you want to subscribe to the status of some back-end process from client-side. In this case you can run the mutation from back-end which just updates the status without saving it to any database and your client-side can subscribe to it.

The example shown in this step passes the exact data from input to output. You can also apply some data transformation using vtl in the request and response mapping templates if need be.

## Steps to code

1. Create a new directory by using `mkdir step10_appsync_no_data_source`
2. Naviagte to the newly created directory using `cd step10_appsync_no_data_source`
3. Create a cdk app using `cdk init app --language typescript`
4. Use `npm run watch` to auto build our app as we code
5. Install AppSync in the app using `npm i @aws-cdk/aws-appsync`
6. Update "lib/step10_appsync_no_data_source-stack.ts" to import appsync in the stack

   ```
   import * as appSync from "@aws-cdk/aws-appsync";
   ```

7. create "graphql/schema.gql" to define schema for the api

   ```
   type Resp {
    status: String!
   }
   type Query {
    readStatus: Resp!
   }
   type Mutation {
    changeStatus(status: String!): Resp!
   }
   ```

8. Update "lib/step10_appsync_no_data_source-stack.ts" to create new AppSync Api

   ```
   const api = new appSync.GraphqlApi(this, "noDataSourceAPI", {
      name: "noDataSourceAPI",
      logConfig: {
        fieldLogLevel: appSync.FieldLogLevel.ALL,
      },
      schema: appSync.Schema.fromAsset("graphql/schema.gql"),
    });
   ```

9. Update "lib/step10_appsync_no_data_source-stack.ts" to print URL API

   ```
   new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });
   ```

10. Update "lib/step10_appsync_no_data_source-stack.ts" to create no data source

    ```
    const dataSource = api.addNoneDataSource("noDataSource", {
      name: "noDataSource",
      description: "Does not save incoming data anywhere",
    });
    ```

11. Update "lib/step10_appsync_no_data_source-stack.ts" to create resolvers

    ```
    dataSource.createResolver({
      typeName: "Mutation",
      fieldName: "changeStatus",
      requestMappingTemplate: appSync.MappingTemplate.fromString(`{
        "version" : "2017-02-28",
        "payload": $util.toJson($context.arguments)
        }`),
      responseMappingTemplate: appSync.MappingTemplate.fromString(
        "$util.toJson($context.result)"
      ),
    });
    ```

12. Deploy the app using `cdk deploy`
13. Test the Api using postman or AWS console
14. Destroy the app using `cdk destroy`

## Reading Material

- [Read more about Data Sources](https://docs.aws.amazon.com/appsync/latest/APIReference/API_DataSource.html)
- [learn more about Appsync CDK](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-appsync-readme.html)
