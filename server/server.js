// Load the TCP Library
const net = require('net')

// Keep track of the chat clients
const clients = []

// Start a TCP Server
net
  .createServer(socket => {
    // Identify this client
    socket.name = socket.remoteAddress + ':' + socket.remotePort

    // Put this new client in the list
    clients.push(socket)

    // Send a nice welcome message and announce
    // socket.write('Welcome ' + socket.name + '\n')
    broadcast(socket.name + ' joined the chat\n', socket)

    // Handle incoming messages from clients.
    socket.on('data', data => {
      socket.write('OK' + '\n' + 'end')
      broadcast(socket.name + '> ' + data, socket)
      // console.log(JSON.parse(data))
    })

    // socket.write('Hello again ' + socket.name + ' !\n')
    // socket.write('end')
    // Remove the client from the list when it leaves
    socket.on('end', function() {
      clients.splice(clients.indexOf(socket), 1)
      broadcast('\n' + socket.name + ' left the chat.\n')
    })

    // Send a message to all clients
    function broadcast(message, sender) {
      clients.forEach(client => {
        // Don't want to send it to sender
        if (client === sender) return
        client.write(message)
      })
      // Log it to the server output too
      process.stdout.write(message + '\n')
    }
  })
  .listen(5000)

// Put a friendly message on the terminal of the server.
console.log('Chat server running at port 5000\n')
