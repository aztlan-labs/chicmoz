## Deploying on AWS

TODO: is this needed?

### Configure Load Balancer

Follow these instructions to properly configure the load balancer:

- [configure proxy protocol support](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/enable-proxy-protocol.html)
- [configure correct ports](https://stackoverflow.com/a/56948614/8678661)

To check the port mappings run:

```sh
aws elb describe-load-balancers --load-balancer-name <my-load-balancer>
```
