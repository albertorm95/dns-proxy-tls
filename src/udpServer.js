const dgram = require('dgram');

const proxy = require('./proxy');

const udpServerConfig = {
    port: 53
}

// Creates new Server for clients connections for then proxying them out to DoT Server
const udpServer = dgram.createSocket('udp4', onConnectionProxyToDoT);
    
udpServer.bind(udpServerConfig.port, () => {
    const address = udpServer.address();
    console.log(`UDP Server started on: ${address.address}:${address.port}`);
});

function onConnectionProxyToDoT(msg, rinfo){
    proxy.udpProxy(msg);
    console.log(msg);
    console.log(rinfo);
    udpServer.on('message', (msg, rinfo) => {
        console.log(`UDP Server got Message from ${rinfo.address}:${rinfo.port} : ${msg}`);
        // Proxy to CloudFlare
        proxy.udpProxy(msg);
    });
    
    udpServer.on('listening', () => {
        const address = udpServer.address();
        console.log(`UDP Server started on Port: ${address.address}:${address.port}`);
    });
    udpServer.on('error', (error) => {
        console.error(`Connection Error ${error}`);
        udpServer.close();
    });
}

module.exports = {
    udpServer
};
