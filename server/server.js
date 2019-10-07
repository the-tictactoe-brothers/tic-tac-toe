// Load the TCP Library
const net = require('net')
const MessageTypes = require('../shared/messageTypes')

let waitList = [] //List of users waiting to play
let playingList = []

// Start a TCP Server
net
  .createServer(socket => {
    // Identify this client
    socket.name = socket.remoteAddress + ':' + socket.remotePort

    // Wait for user messages
    socket.on('data', data => {
      let aux = JSON.parse(data)

      if (aux.type === MessageTypes.newUser) {
        // When the User create the nickname -> add User in the waitList
        user = {
          nickname: data.nickname,
          socket
        }

        waitList.push(user)
      }
    })

    // Remove the client from the list when it leaves
    socket.on('end', function() {
      waitList.splice(waitList.indexOf(socket), 1)
    })
  })
  .listen(5000)
