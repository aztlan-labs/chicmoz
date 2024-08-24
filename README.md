## General

### Git LFS

TODO: is this needed?

Git LFS (Large File Storage) is used to commit and push large files and do it more efficiently. We use Git LFS for the Yarn PnP packages.

Install Git LFS here: <https://github.com/git-lfs/git-lfs?utm_source=gitlfs_site&utm_medium=installation_link&utm_campaign=gitlfs#installing>

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
