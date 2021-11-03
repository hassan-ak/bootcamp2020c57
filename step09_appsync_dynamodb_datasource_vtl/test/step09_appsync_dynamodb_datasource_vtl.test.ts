import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Step09AppsyncDynamodbDatasourceVtl from '../lib/step09_appsync_dynamodb_datasource_vtl-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Step09AppsyncDynamodbDatasourceVtl.Step09AppsyncDynamodbDatasourceVtlStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT));
});
