# Remote Development

- [Cloud9](#cloud9)
- [EC2 SpotOne](#ec2-spotone)

## Overview

The following is an exploration into provisioning and configured remote development environments to extend local environments.

Ideally, SSM Sessions will be used by way of SSH, which will require a key to be established.

After establishing SSH Key, choose an EnvironmentType to deploy.

## SSH key setup and SSM

On local host:

```bash
ssh-keygen -b 4096 -C 'Dev SSH user' -t rsa -f ~/.ssh/id_rsa-remotedev
chmod 400 ~/.ssh/id_rsa-remotedev.pub
```

Setup [AWS Session Manager Plugin for AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)

## Environment Types

### EC2 SpotOne

#### References (EC2 SpotOne)

- <https://github.com/pahud/cdk-spot-one>

#### Setup (EC2 SpotOne)

Deploy resources

```bash
npm install
cdk deloy --context type=spotone
```

Configure SSH Authorized Key on EC2.

```bash
pubkey="$HOME/.ssh/id_rsa-remotedev.pub"
instanceId=$(aws ec2 describe-instances --filters 'Name=instance-state-name,Values=running' 'Name=tag:Name,Values=Ec2RemoteDevelopmentStack*' --output text --query 'Reservations[*].Instances[*].InstanceId')
az=$(aws ec2 describe-instances --filters 'Name=instance-state-name,Values=running' 'Name=tag:Name,Values=Ec2RemoteDevelopmentStack*' --output text --query 'Reservations[*].Instances[*].Placement.AvailabilityZone')

echo "Copying key to $instanceId"
aws ec2-instance-connect send-ssh-public-key --instance-id ${instanceId} --instance-os-user ec2-user \
--ssh-public-key file://${pubkey} --availability-zone ${az}

echo "Updating SSH Config"
echo -e "\nHost Spotone-$instanceId\n  IdentityFile $pubkey\n  User ec2-user\n  HostName $instanceId\n  ProxyCommand sh -c \"~/.ssh/ssm-proxy.sh %h %p\"" >> ~/.ssh/config
```

#### Cleanup (EC2 SpotOne)

```bash
cdk destroy --context type=spotone
```

### Cloud9

#### References (Cloud9)

- <https://aws.amazon.com/blogs/architecture/field-notes-use-aws-cloud9-to-power-your-visual-studio-code-ide/>
- <https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloud9.CfnEnvironmentEC2.html>

#### Setup (Cloud9)

```bash
npm install
cdk deploy --context type=cloud9
```

#### Usage (Cloud9)

Configure SSH Authorized Key on the Cloud9 EC2.

```bash
pubkey="$HOME/.ssh/id_rsa-remotedev.pub"
instanceId=$(aws ec2 describe-instances --filters 'Name=instance-state-name,Values=running' 'Name=tag:Name,Values=aws-cloud9-RemoteDevelopment*' --output text --query 'Reservations[*].Instances[*].InstanceId')
az=$(aws ec2 describe-instances --filters 'Name=instance-state-name,Values=running' 'Name=tag:Name,Values=aws-cloud9-RemoteDevelopment*' --output text --query 'Reservations[*].Instances[*].Placement.AvailabilityZone')

echo "Copying key to instance"
aws ec2-instance-connect send-ssh-public-key --instance-id ${instanceId} --instance-os-user ec2-user \
--ssh-public-key file://${pubkey} --availability-zone ${az}

echo "Updating SSH config"
echo -e "\nHost Cloud9-$instanceId\n  IdentityFile $pubkey\n  User ec2-user\n  HostName $instanceId\n  ProxyCommand sh -c \"~/.ssh/ssm-proxy.sh %h %p\"" >> ~/.ssh/config
```

#### Cleanup (Cloud9)

```bash
cdk destroy --context type=cloud9
```
