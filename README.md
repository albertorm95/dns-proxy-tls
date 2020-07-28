# DNS to DNS-over-TLS

## Microservice that proxy a TCP DNS request to a DNS-over-TLS server

A TCP Server was created on port 53, when a new connection is created, this will be just proxy the `data` from the new connection to a new TLS socket that connects to CloudFlare DNS-over-TLS server, then the `data` is written to the TLS socket and finally the result is written back to the initial TCP connection.

## Repository structure

``` string
├── Dockerfile
├── Jenkinsfile
├── README.md
├── package-lock.json
├── package.json
└── src
    ├── index.js
    ├── proxy.js
    ├── tcpServer.js
    └── udpServer.js <WIP>
```

<!-- * file detailing your implementation, your choices -->
I decide to just forward the data to the remote destination, so as the client request the DNS the proxy will request it to the Remote TLS Server.

I choose NodeJS because it is the language in which I feel more comfortable with.

## Questions

* Imagine this proxy being deployed in an infrastructure. What would be the security concerns you would raise?
  * I would implement policies to the deployment so it can only be accessible by some specific microservices.

* How would you integrate that solution in a distributed, microservices-oriented and containerized architecture?
  * Depends on the infrastructure, but imagine it is a Kubernetes Cluster, I would define a deployment and service for this new microservice.

* What other improvements do you think would be interesting to add to the project?
  * ???
