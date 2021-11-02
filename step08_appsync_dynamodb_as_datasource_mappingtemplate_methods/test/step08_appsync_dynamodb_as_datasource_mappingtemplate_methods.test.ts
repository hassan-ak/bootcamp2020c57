import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Step08AppsyncDynamodbAsDatasourceMappingtemplateMethods from '../lib/step08_appsync_dynamodb_as_datasource_mappingtemplate_methods-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Step08AppsyncDynamodbAsDatasourceMappingtemplateMethods.Step08AppsyncDynamodbAsDatasourceMappingtemplateMethodsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT));
});
