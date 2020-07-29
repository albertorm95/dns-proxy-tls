const net = require('net');

const proxy = require('./proxy');

const tcpServerConfig = {
    port: 53
}

// Creates new Server for clients connections for then proxying them out to DoT Server
const tcpServer = net.createServer(onConnectionProxyToDoT);

tcpServer.listen(tcpServerConfig, () => {
    const address = tcpServer.address();
    console.log(`TCP Server started on: ${address.address}:${address.port}`);
});

// Declare connection listener function
function onConnectionProxyToDoT(sock){
    console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`);

     // Listen for data from the connected client.
    sock.on('data', (data) => {
        console.log(`TCP Server got Message from ${sock.remoteAddress}:${sock.remotePort} : ${data}`);
        // Proxy to CloudFlare
        proxy.tcpProxy(data, sock);
    });

    // Handle client connection termination.
    sock.on('close', () => {
        console.log(`TCP ${sock.remoteAddress}:${sock.remotePort} Terminated the connection`);
        sock.end();
    });

    // Handle Client connection error.
    sock.on('error', (error) => {
        console.error(`TCP ${sock.remoteAddress}:${sock.remotePort} Connection Error ${error}`);
        sock.end();
    });
}

module.exports = {
    tcpServer
};
