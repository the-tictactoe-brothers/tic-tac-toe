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

// List of users waiting to play
let waitList = []

// List of users playing
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

      let challenger, challenged
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
          let positionArray = 0
          // Looking for players on playingList
          for (var i in playingList) {
            const found = playingList[i].find(user => user.socket === socket)
            if (found) {
              challenger = found
              challenged = playingList[i].find(user => user.socket !== socket)
              positionArray = i
              break
            }
          }
          // returns 1 if position is added, returns 2 if you have a winner, otherwise returns 0
          const answer = Matriz.addPosition(aux.payload, challenger.symbol)
          switch (answer.type) {
            case 0:
              challenger.socket.write(MessageStructure.messageError(MessageTypes.denied))
              break
            case 1:
              challenger.socket.write(
                MessageStructure.messageMove(MessageTypes.accepted, answer.array)
              )
              challenged.socket.write(
                MessageStructure.messageMove(MessageTypes.asyncMove, answer.array)
              )
              break
            case 2:
              swappingLists(challenger, challenged, positionArray)

              const answerEnd = {
                nickname: challenger.nickname,
                array: answer.array
              }

              challenger.socket.write(MessageStructure.messageMove(MessageTypes.endGame, answerEnd))
              challenged.socket.write(
                MessageStructure.messageMove(MessageTypes.asyncEndGame, answerEnd)
              )
              break
            case 3:
              swappingLists(challenger, challenged, positionArray)

              const answerTie = {
                nickname: undefined,
                array: answer.array
              }

              challenger.socket.write(MessageStructure.messageMove(MessageTypes.endGame, answerTie))
              challenged.socket.write(
                MessageStructure.messageMove(MessageTypes.asyncEndGame, answerTie)
              )
              break
          }
          break
        case MessageTypes.start:
          challenged = waitList.find(user => user.nickname === aux.payload)
          challenger = waitList.find(user => user.socket === socket)
          if (challenged && challenger && challenger.nickname !== challenged.nickname) {
            waitList.splice(waitList.indexOf(challenged), 1)
            waitList.splice(waitList.indexOf(challenger), 1)

            const lucky = Math.random() > 0.5 ? 'x' : 'o'
            challenger.symbol = lucky
            challenged.symbol = lucky === 'x' ? 'o' : 'x'
            playingList.push([challenged, challenger])

            const challengerPayload = {
              nickname: challenger.nickname,
              symbol: lucky
            }
            const challengedPayload = {
              nickname: challenged.nickname,
              symbol: challenged.symbol
            }

            socket.write(
              MessageStructure.messageStartGame(MessageTypes.accepted, challengedPayload)
            )
            challenged.socket.write(
              MessageStructure.messageStartGame(MessageTypes.asyncStartGame, challengerPayload)
            )
          } else {
            // Mensagem para o usuário desafiante caso negado
            socket.write(MessageStructure.messageError(MessageTypes.denied))
          }
          break
        case MessageTypes.err:
          break
        case MessageTypes.listUsers:
          const users = waitList.filter(user => user.socket !== socket)
          const me = waitList.find(user => user.socket === socket)
          users.unshift(me)
          socket.write(MessageStructure.messageListUsers(MessageTypes.accepted, users))
          // listar usuários
          break
        default:
          break
      }
    })

    // Remove the client from the list when it leaves
    socket.on('end', function() {
      console.log('end\n')
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

function swappingLists(myChallenger, myChallenged, myPositionArray) {
  playingList.splice(myPositionArray, 1)
  delete myChallenger.symb
  waitList.push(myChallenger)
  delete myChallenged.symb
  waitList.push(myChallenged)
}
