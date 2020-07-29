const tls = require('tls');

const remoteServerConfig = {
    port: 853,
    host: '1.1.1.1',
    servername: 'cloudflare-dns.com'
}

// Recibes the data Buffer from the client and just proxys it to DoT Server and then send the response back.
function tcpProxy(data, sock) {
    let remote = new tls.TLSSocket;
    // Connects to DoT Server
    remote = tls.connect(remoteServerConfig, () => {
        // Sends the data Buffer to remote
        remote.write(data);
    });

    // Handle data response from remote
    remote.on('data', (data) => {
      console.log('TCP-TLS data: ', data);
        // Sends back the remote response to the client socket
        sock.write(data);
    });

    // Handle client connection termination.
    remote.on('close', () => {
        console.log(`TCP-TLS ${remote.remoteAddress}:${remote.remotePort} Terminated the connection`);
        remote.end();
    });

    // Handle Remote connection error.
    remote.on('error', (error) => {
        console.error(`TCP-TLS ${remote.remoteAddress}:${remote.remotePort} Connection Error ${error}`);
        remote.end();
    });
}

exports.tcpProxy = tcpProxy;
