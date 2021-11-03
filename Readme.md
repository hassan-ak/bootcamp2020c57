# bootcamp2020c57 - AWS AppSync

## AWS AppSync With DynamoDB As A Datasource

### Class Notes

Uptil this point we learned how to use Lambda function as a data-source with AppSync. AppSync comminute with lambda function and lambda function is then connected to DynamoDB. Now we are going to coonect AppSync with DynamoDB.
AppSync will sent a request to ddb and the request contains the operation along with data associated with it. DDB will recieve the request do the operation and the response is mapped to the AppSync. Using this way we are able to avoid some extra operation, fast response and also every thing is done using cdk.

### Sections

- [Integrate AppSync with DynamoDB as a Datasource](./step08_appsync_dynamodb_as_datasource_mappingtemplate_methods)

### Class Videos

- [YouTube English](https://www.youtube.com/watch?v=DkMpDT-gsMk)
- [Facebook English](https://www.facebook.com/zeeshanhanif/videos/10225337767976064)
- [YouTube Urdu](https://www.youtube.com/watch?v=lpKaoZ4yAiE&ab_channel=PanacloudServerlessSaaSTraininginUrdu)
- [Facebook Urdu](https://www.facebook.com/zeeshanhanif/videos/10225347091729152)
