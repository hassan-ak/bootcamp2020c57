# Step 08 - Integrate AppSync with DynamoDB as a Datasource

## Class Notes

Uptil this point we learned how to use Lambda function as a data-source with AppSync. AppSync comminute with lambda function and lambda function is then connected to DynamoDB. Now we are going to coonect AppSync with DynamoDB.
AppSync will sent a request to ddb and the request contains the operation along with data associated with it. DDB will recieve the request do the operation and the response is mapped to the AppSync. Using this way we are able to avoid some extra operation, fast response and also every thing is done using cdk.

## Steps to code

1. Create a new directory by using `mkdir step08_appsync_dynamodb_as_datasource_mappingtemplate_methods`
2. Naviagte to the newly created directory using `cd step08_appsync_dynamodb_as_datasource_mappingtemplate_methods`
3. Create a cdk app using `cdk init app --language typescript`
4. Use `npm run watch` to auto build our app as we code
5. Install AppSync in the app using `npm i @aws-cdk/aws-appsync`
6. Install dynamoDB in the app using `npm i @aws-cdk/aws-dynamodb`
7. Update "lib/step08_appsync_dynamodb_as_datasource_mappingtemplate_methods-stack.ts" to import appsync, lambda and dynamoDB in the stack

   ```
   import * as appsync from "@aws-cdk/aws-appsync";
   import * as ddb from "@aws-cdk/aws-dynamodb";

   ```

8. create "graphql/schema.gql" to define schema for the api

   ```
   type Note {
    id: ID!
    title: String!
   }

   type Query {
    notes: [Note!]
   }

   type Mutation {
    createNote(title: String!): Note!
    deleteNote(id: String!): String!
    updateNote(id: String!, title: String!): Note!
   }
   ```

9. Update "lib/step08_appsync_dynamodb_as_datasource_mappingtemplate_methods-stack.ts" to create new AppSync Api

   ```
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
   ```

10. Update "lib/step08_appsync_dynamodb_as_datasource_mappingtemplate_methods-stack.ts" to print URL, Key, id and region of API

    ```
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
    ```

11. Update "lib/step08_appsync_dynamodb_as_datasource_mappingtemplate_methods-stack.ts" to create DynamoDB table.

    ```
    const ddbTable = new ddb.Table(this, "step08Table", {
      tableName: "Step08Table",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
    ```

12. Update "lib/step08_appsync_dynamodb_as_datasource_mappingtemplate_methods-stack.ts" to connect ddb table as data source to the appsync Api.

    ```
    const ddb_data_source = api.addDynamoDbDataSource("dataSource", ddbTable);
    ```

13. Update "lib/step08_appsync_dynamodb_as_datasource_mappingtemplate_methods-stack.ts" to create resolvers

    ```
    ddb_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "createNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition("id").auto(),
        appsync.Values.projecting()
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    ddb_data_source.createResolver({
      typeName: "Query",
      fieldName: "notes",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });

    ddb_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem(
        "id",
        "id"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    ddb_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition("id").is("id"),
        appsync.Values.projecting()
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    ```

14. Deploy the app using `cdk deploy`
15. Test the Api using postman or AWS console
16. Destroy the app using `cdk destroy`

## Reading Material
