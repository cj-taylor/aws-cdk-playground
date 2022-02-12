import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { InstanceType } from "aws-cdk-lib/aws-ec2";
import { SpotFleet, BlockDuration } from "cdk-spot-one";
import { Construct } from "constructs";

export class Ec2RemoteDevelopmentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // create the first fleet for one hour and associate with our existing EIP
    const fleet = new SpotFleet(this, "SpotFleet", {
      defaultInstanceType: new InstanceType("t3.micro"),
      blockDuration: BlockDuration.NONE,
    });

    new CfnOutput(this, "SpotFleetInstanceId", {
      value: fleet.instanceId!,
    });
  }
}
