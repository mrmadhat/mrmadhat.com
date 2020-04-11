---
slug: 'aws-vpc-beginners-guide-to-aws-virtual-private-cloud-in-plain-english'
title: 'AWS VPC: Beginners guide to AWS Virtual Private Cloud in plain english'
date: '2020-04-05'
description:
  'Throughout this post I’m hoping to demystify AWS VPC to allow you to use this
  service with confidence.'
redirects:
  - '/networking/aws-vpc-beginners-guide-to-aws-virtual-private-cloud-in-plain-english'
---

Amazon VPC is a service provided by amazon to enable users to create private
networks in the cloud. But why do we need our own network? What role does the
network play within AWS? And how does it all work? Throughout this post I’m
hoping to demystify VPC to allow you to use this service with confidence.

## Instances in the cloud

When utilising various AWS services such as AWS Elastic container service the
underlying backbone of the service is EC2
“[which creates virtual computing environments, known as instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)”
for your code to run on.

Whenever an EC2 instance is created it must be connected to a VPC, this actually
makes a lot of sense. If you want to run a machine that is connected in some way
to other machines, whether that be users accessing an application running on
your instance or other instances then it needs to be connected to a network to
do that. Our machine wouldn’t be very useful if we couldn’t communicate with it.

Our virtual private cloud is what provides the separation between everything
else outside of it. You can think of your VPC as a container that has a
predefined number of spaces available and when an instance runs inside our VPC
it takes up a unit of that space. Each instance that is created is assigned a
private IP address, the private IP is unique within the current VPC; if an EC2
instance has an IP of 172.31.40.50 then no other instance within the same VPC
will have that address.  The amount of available IP addresses is not infinite,
we define how many private IP addresses are available when we create our VPC, we
do this through something called a CIDR block.

## CIDR Block

A CIDR block looks like this 10.0.0.0/16 and defines a range of private IP
addresses available within the VPC. The IP address is defined by you, in the
previous example I chose 10.0.0.0 as 10.0.0.0 - 10.255.255.255 is defined in the
IPv4 specification as a private range of IP addresses. The /16 denotes the
amount of ip addresses available and to understand this we need to look at the
binary form of IP addresses

![binary-ip-bits-cidr](./images/binary-ip-bits-cidr.svg)

In the diagram above I’ve converted the 10.0.0.0 IP address to binary form. The
IP address contains 32 bits, the first 16 bits (10.0) are used as the host ID,
the remaining 16 bits are available to be used as identifiers for our instances
with the exception of ~5 ip addresses (5 + 1 reserved by each subnet you create)
that are reserved by AWS. This gives us:

```
totalBits = 32
bitsReservedByHost = 16

remainingBits = totalBits - bitsReservedByHost // 16 bits

reservedIPs = 5

availableIPs = 2^ramainingBits - reservedIPs // 65,531
```

This means we have 65,531 IP addresses are available inside our VPC. Our
“container” can hold 65,531 instances, that’s a lot of instances! We could
decide ahead of time that we won’t need that many IP address and could change
our CIDR block to reduce the amount of IP’s available. Because the /## denotes
the amount of bits used for the host address a lower CIDR, say /8, would
actually mean more IP’s are available within the VPC because our host address is
smaller. In contrast a larger CIDR means a larger host address and as a result
less IP addresses would be available within the VPC.

## Subnets

So we’ve created a VPC and have thousands of IP addresses available that can be
assigned to instances inside this virtual network. This is great, but having
instances run in the ‘top’ level of the VPC isn’t allowed by AWS. Your VPC
‘lives’ in amazon’s region space, in other words when you create a VPC you are
creating it within a specific region ‘eu-west-1’ for example. Each region is
split—by Amazon—into different availability zones. Our instances need to ‘live’
in a specific availability zone within the region. To do this we create
something called a subnet, which is a sub network within your VPC network. The
subnet is created using the same CIDR block method we used when creating our
VPC.

### Subnet size

A subnet can be as large as the VPC, meaning the subnet takes all 65,531
addresses,  but this usually isn’t practical. If we did this then any access
rules, for example allowing/denying access to the internet, would need to be
applied to the group as a whole. On the other side of the scale our subnet can
be a small as 10.0.0.0/28 which would allow for 15 IP addresses (16 - 1 for our
subnet).

#### **Example subnets within a 10.0.0.0/16 VPC**

> Subnet 1: 10.0.0.0/24 - Allocate 10.0.0.0 through 10.0.0.255 to this subnet
>
> Subnet 2: 10.0.1.0/24 - Allocate 10.0.1.0 through 10.0.1.255 to this subnet
>
> Subnet 3: 10.0.2.0/20 - Allocate 10.0.2.0 through 10.0.15.255 to this subnet
>
> Subnet 4: 10.0.16.0/28 - Allocate 10.0.16.0 through 10.0.16.15 to this subnet
>
> Subnet 5: 10.0.16.16…

You’ll notice in the above example that none of the IP addresses overlap, this
should hopefully make sense to you why that is. If not don’t worry, it’s because
each IP address within the VPC is unique so we can’t have two subnets that allow
for the same IP.

In the example above I haven’t specified the availability zone that the subnets
are added to. This is a choice you are presented with when creating a subnet and
it’s wise to spread your subnets across different availability zones so if one
availability zone experiences an outage your subnets in other availability zones
are not affected, making for a more robust infrastructure.

### Public and private subnets

By default our subnets are considered private, instances inside aren’t
automatically assigned a public IP address and can only communicate with other
instances inside the VPC.

Each subnet has an associated route table which controls how requests from
instances within the subnet should be handled. Our subnet is created with a
default route table that looks like this:

| Destination  | Target |
| ------------ | ------ |
| 10.0.0.0/16  | local  |

This says that any request sent by an instance to another instance within the
network, for example \`ping 10.0.0.28\` should be routed internally. If we want
to allow instances within our subnet to communicate with the internet or another
VPC then we need to update the route table accordingly. Amazon allows you to add
something called an internet gateway which is a
[“VPC component that allows communication between instances in your VPC and the internet”](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html).
After creating an internet gateway we need to attach it to the subnet you would
like to become public. We do this by adding an entry to our route table like so.

| Destination   | Target                |
| ------------- | --------------------- |
| 10.0.0.0/16   | local                 |
| 0.0.0.0/0     | igw-internetgatewayid |

0.0.0.0/0 says “If we haven’t explicitly defined a route for the target IP
address in our route table then this is how I want you to route the request.” In
this instance, send it to the internet gateway.

Our subnet is now considered public, however, our instances within this subnet
cannot send or receive traffic. We first need to make sure that our instances
are assigned a public IP address—we can be configured at the subnet level or on
an instance per instance basis—and give our instance the ‘right’ to send and
receive requests by attaching an appropriate security group.

## Security groups

Just because our subnet knows how to handle requests destined for the internet
does not mean that instances within that subnet are allowed to send and receive
requests. We need to explicitly state what instances are allowed (and not
allowed) to do. To do this we create a security group and assign that security
group to our instance.

Within a security group we specify inbound and outbound rules. For example, we
can create an inbound rule that allows SSH connections on port 22 from a
specific ip. Here’s an example of the flow:

_Note: remember all instances require a public IP in this example lets say we
have created an EC2 instance with a public IP of  34.244.219.215._

- Local machine sends request to 34.244.219.215: ssh -i “key_file.pem”
  ec2-user@34.244.219.215
- Our instance receives the request  and checks the security group rules, if the
  inbound rules allow the request then the request is processed
- The instance then attempts to send a response but again the security group
  rules are checked (the outbound rules in this case) to ensure the instance is
  allowed to send the response
- If it is allowed the route table is checked to see how the response should be
  handled
- As the destination IP allowed but not our VPC it is then sent to the internet
  gateway and back to the user

## Access Control Lists

A similar mechanism to security groups is Access Control Lists or ACL’s. ACL’s
do the same thing as security groups but rather than being assigned to specific
instances are assigned to subnets. So, if you block SSH access at the ACL level
then you won’t be able to SSH into any instances that reside within that subnet,
even if a security group assigned to an instance allows it.

## NAT Devices

Sometimes you will want allow your private instances access to the internet but
only when they instantiate the connection. You do this through Network Access
Translation (NAT) devices.  First you create a NAT device inside your public
subnet (as your public subnet has internet access through the internet gateway).
Then you update the route table associated with the private subnet to direct
internet bound traffic to the NAT gateway. When the NAT Gateway receives traffic
from the internet it will pass it back to the instance that started the request.
To demonstrate this you can do the following:

- Create an instance with a public IP inside a public subnet and allow SSH
  traffic
- Create an instance in a private subnet and allow all local traffic in the
  security group
- Create a NAT gateway in your public subnet
- Update the route table associated with your private subnet to pass internet
  bound traffic to the NAT gateway
- Upload your private key to your public instance
- Connect to your public instance via ssh then use your private key to ssh into
  your local machine using the local ip
- Ping google and you will see the packets being sent/received

## Summary

I hope this article has given you an understanding of AWS VPC and how it works.
I’ve covered a lot of the basic topics and only omitted more advanced topics
such as VPC peering. If there’s something that I’ve explained that you haven’t
understood then please reach out to me and I’ll do my best to help you
understand!
