# Step 09 - Integrate AppSync with DynamoDB as a Datasource

## Class Notes

Working with appSync where ddb is used as data source we can use vtl in resolvers. vtl is a declarative language. Where we need to write the code in string form. If we need to make changes to the request or response before it intract with the DDB or thr client we need some intermeduatry thing to do so "vtl" can be of greate use in this case. One way is to use a new lambda function other is to use vtl. The main idea of vtl is to create a bridge between b/w cleint and server.

## Steps to code

1. Create a new directory by using `mkdir step09_appsync_dynamodb_datasource_vtl`
2. Naviagte to the newly created directory using `cd step09_appsync_dynamodb_datasource_vtl`
3. Create a cdk app using `cdk init app --language typescript`
4. Use `npm run watch` to auto build our app as we code
5. Install AppSync in the app using `npm i @aws-cdk/aws-appsync`
6. Install dynamoDB in the app using `npm i @aws-cdk/aws-dynamodb`
7. Update "lib/step09_appsync_dynamodb_datasource_vtl-stack.ts" to import appsync, lambda and dynamoDB in the stack

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

9. Update "lib/step09_appsync_dynamodb_datasource_vtl-stack.ts" to create new AppSync Api

   ```
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
   ```

10. Update "lib/step09_appsync_dynamodb_datasource_vtl-stack.ts" to print URL, Key, id and region of API

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

11. Update "lib/step09_appsync_dynamodb_datasource_vtl-stack.ts" to create DynamoDB table.

    ```
    const ddbTable = new ddb.Table(this, "step09Table", {
      tableName: "Step09Table",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
    ```

12. Update "lib/step09_appsync_dynamodb_datasource_vtl-stack.ts" to connect ddb table as data source to the appsync Api.

    ```
    const ddb_data_source = api.addDynamoDbDataSource("dataSource", ddbTable);
    ```

13. Update "lib/step09_appsync_dynamodb_datasource_vtl-stack.ts" to create createNote resolvers

    ```
    ddb_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "createNote",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        ## Automaticaly set the id if it's not passed in
        $util.qr($context.arguments.put("id",$util.defaultIfNull($context.arguments.id,$util.autoId())))
        {
          "version" : "2017-02-28",
          "operation" : "PutItem",
          "key": {
            "id": $util.dynamodb.toDynamoDBJson($context.arguments.id)
          },
          "attributeValues" : $util.dynamodb.toMapValuesJson($context.arguments)
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($context.error)
          $util.error($context.error.message, $context.error.type)
        #else
          $utils.toJson($context.result)
        #end
      `),
    });
    ```

14. Update "lib/step09_appsync_dynamodb_datasource_vtl-stack.ts" to create notes resolvers

    ```
    ddb_data_source.createResolver({
      typeName: "Query",
      fieldName: "notes",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "operation" : "Scan"
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($context.error)
          $util.error($context.error.message, $context.error.type)
        #else
          $utils.toJson($context.result.items)
        #end
      `),
    });
    ```

15. Update "lib/step09_appsync_dynamodb_datasource_vtl-stack.ts" to create deleteNotes resolvers
    ```
    ddb_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
      {
        "version" : "2017-02-28",
        "operation" : "DeleteItem",
        "key" : {
          "id" : $util.dynamodb.toDynamoDBJson($ctx.args.id)
        }
      }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($context.error)
          $util.error($context.error.message, $context.error.type)
        #else
          $utils.toJson($context.result)
        #end
      `),
    });
    ```
16. Deploy the app using `cdk deploy`
17. Test the Api using postman or AWS console
18. Destroy the app using `cdk destroy`

## Reading Material
