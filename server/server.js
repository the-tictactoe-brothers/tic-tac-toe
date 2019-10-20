// Load the TCP Library
const net = require('net') // net module -: provides an asynchronous network API
const MessageTypes = require('../shared/messageTypes')
const MessageStructure = require('../shared/messageStructure')

function onclose(server, signal, callback) {
  return () => {
    console.log('Server closing...')
    server.close(callback && callback(signal))
  }
}

let waitList = [
  {
    nickname: 'rui',
    socket: null
  }
]

// List of users waiting to play
let playingList = []

// Start a TCP Server
const server = net
  .createServer(socket => {
    socket.setEncoding('utf8') // change the recieved type of data from buffer to string

    // Identify this client
    socket.name = socket.remoteAddress + ':' + socket.remotePort
    console.log(socket.name)

    // Wait for user messages
    socket.on('data', data => {
      let aux = JSON.parse(data) // convert string(JSON) to obj
      const nicknames = waitList.map(user => user.nickname)

      switch (aux.type) {
        case MessageTypes.newUser:
          // check if list is empty
          if (waitList.length) {
            if (!nicknames.includes(aux.payload)) {
              // When the User create the nickname -> add Object user in the waitList
              const user = {
                nickname: aux.payload,
                socket
              }
              waitList.push(user)
              socket.write(MessageStructure.messageNewUser(MessageTypes.accepted, aux.payload))
            } else {
              socket.write(MessageStructure.messageNewUser(MessageTypes.denied))
            }
          } else {
            // When the User create the nickname -> add Object user in the waitList
            const user = {
              nickname: aux.payload,
              socket
            }
            waitList.push(user)
            socket.write(MessageStructure.messageNewUser(MessageTypes.accepted, aux.payload))
          }
          break
        case MessageTypes.move:
          //const mType = addPosition(aux.payload, symb)
          if (mType === MessageTypes.accepted) {
            //mandar mes=nsagem para os dois clientes presentes na playingList
          } else {
            socket.write(MessageStructure.messageError(MessageTypes.denied))
          }
          break
        case MessageTypes.start:
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

process.once('SIGUSR2', onclose(server, 'SIGUSR2'))
process.once(
  'SIGINT',
  onclose(server, 'SIGINT', signal => {
    process.kill(process.pid, signal)
  })
)
