import {
  aws_cloud9 as cloud9,
  CfnOutput,
  Stack,
  StackProps,
} from "aws-cdk-lib";

import { Construct } from "constructs";

export class Cloud9RemoteDevelopmentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const remoteEnvironment = new cloud9.CfnEnvironmentEC2(
      this,
      "RemoteDevelopment",
      {
        instanceType: "t3.micro",
        automaticStopTimeMinutes: 30,
        connectionType: "CONNECT_SSM",
      }
    );

    new CfnOutput(this, "Instance", {
      description: "Link to get InstanceId",
      value: `https://${props?.env?.region}.console.aws.amazon.com/ec2/v2/home?region=${props?.env?.region}#Instances:search=${remoteEnvironment.ref};sort=tag:Name`,
    });
  }
}
