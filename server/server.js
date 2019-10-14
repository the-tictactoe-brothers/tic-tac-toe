// Load the TCP Library
const net = require('net') // net module -: provides an asynchronous network API
const MessageTypes = require('../shared/messageTypes')
const MessageStructure = require('../shared/messageStructure')

let waitList = [] //List of users waiting to play
let playingList = []

// Start a TCP Server
net
  .createServer(socket => {
    socket.setEncoding('utf8') //change the recieved type of data from buffer to string

    // Identify this client
    socket.name = socket.remoteAddress + ':' + socket.remotePort
    console.log(socket.name)

    // Wait for user messages
    socket.on('data', data => {
      let aux = JSON.parse(data) //convert string(JSON) to obj
      const nicknames = waitList.map(user => user.nickname)

      switch (aux.type) {
        case MessageTypes.newUser:
          // check if list is empty
          if (waitList.length) {
            if (nicknames.includes(aux.nickname)) {
              // When the User create the nickname -> add Object user in the waitList
              const user = {
                nickname: aux.nickname,
                socket
              }
              waitList.push(user)
              socket.write(MessageStructure.messageNewUser('accepted', aux.nickname))
            } else {
              socket.write(MessageStructure.messageNewUser('denied'))
            }
          } else {
            // When the User create the nickname -> add Object user in the waitList
            const user = {
              nickname: aux.nickname,
              socket
            }
            waitList.push(user)
            socket.write(MessageStructure.messageNewUser('accepted', aux.nickname))
          }
          break
        case MessageTypes.move:
          break
        case MessageTypes.start:
          // usar find
          break
        case MessageTypes.err:
          break
        default:
          break
      }
    })

    // Remove the client from the list when it leaves
    socket.on('end', function() {
      waitList.splice(waitList.indexOf(socket), 1)
    })
  })
  .listen(5000)
