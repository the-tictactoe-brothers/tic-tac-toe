// Load the TCP Library
const net = require('net') // net module -: provides an asynchronous network API
const MessageTypes = require('../shared/messageTypes')
const MessageStructure = require('../shared/messageStructure')
const Matriz = require('../server/matriz')

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
          let challenger, challenged
          // Looking for players on playingList
          for (var i in playingList) {
            if (playingList[i].find(user => user.socket === socket)) {
              challenger = playingList[i].find(user => user.socket === socket)
              challenged = playingList[i].find(user => user.socket !== socket)
              break
            }
          }
          // returns 1 if position is added, returns 2 if you have a winner, otherwise returns 0
          switch (Matriz.addPosition(aux.payload, challenger.symb)) {
            case 0:
              challenger.socket.write(MessageStructure.messageError(MessageTypes.denied))
              break
            case 1:
              challenger.socket.write(
                MessageStructure.messageMove(MessageTypes.accepted, aux.payload)
              )
              challenged.socket.write(
                MessageStructure.messageMove(MessageTypes.asyncMove, aux.payload)
              )
              break
            case 2:
              challenger.socket.write(
                MessageStructure.messageMove(MessageTypes.endGame, challenger.nickname, aux.payload)
              )
              challenged.socket.write(
                MessageStructure.messageMove(
                  MessageTypes.asyncEndGame,
                  challenger.nickname,
                  aux.payload
                )
              )
              break
          }
          break
        case MessageTypes.start:
          const challenged = waitList.find(user => user.nickname === aux.payload)
          const challenger = waitList.find(user => user.socket === socket)
          if (challeged && challenger) {
            let removed = waitList.splice(waitList.indexOf(challegend), 1)
            playingList.push(removed[0])
            removed = waitList.splice(waitList.indexOf(challenger), 1)
            playingList.push(removed[0])

            socket.write(MessageStructure.messageStart(MessageTypes.accepted, challenger))
            challenged.socket.write(MessageStructure.asyncStart(MessageTypes.accepted, challenged))
          } else {
            //Menssagem para o usuário desafiante caso negado
            socket.write(MessageStructure.messageStart(MessageTypes.denied))
          }
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

process.once('SIGUSR2', onclose(server, 'SIGUSR2'))
process.once(
  'SIGINT',
  onclose(server, 'SIGINT', signal => {
    process.kill(process.pid, signal)
  })
)
