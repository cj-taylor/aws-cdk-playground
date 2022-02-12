#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Cloud9RemoteDevelopmentStack } from "../lib/cloud9-remote-development-stack";
import { Ec2RemoteDevelopmentStack } from "../lib/ec2-remote-development-stack";

const app = new cdk.App();

const environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const environmentType = app.node.tryGetContext("type");

if (environmentType === "cloud9") {
  new Cloud9RemoteDevelopmentStack(app, "Cloud9RemoteDevelopmentStack", {
    env: environment,
  });
}

if (environmentType === "spotone") {
  new Ec2RemoteDevelopmentStack(app, "Ec2RemoteDevelopmentStack", {
    env: environment,
  });
}
