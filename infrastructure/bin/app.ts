#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChariotClaimsStack } from '../lib/chariot-claims-stack';

const app = new cdk.App();

// Get environment from context or default to development
const environment = app.node.tryGetContext('environment') || 'development';
const account = app.node.tryGetContext('account') || process.env.CDK_DEFAULT_ACCOUNT;
const region = app.node.tryGetContext('region') || process.env.CDK_DEFAULT_REGION || 'us-east-1';

// Create stack with environment-specific configuration
new ChariotClaimsStack(app, `ChariotClaims-${environment}`, {
  environment: environment as 'development' | 'staging' | 'production',
  env: {
    account,
    region,
  },
  description: `Chariot Claims ${environment} infrastructure stack`,
  tags: {
    Environment: environment,
    Project: 'ChariotClaims',
    ManagedBy: 'CDK',
  },
});