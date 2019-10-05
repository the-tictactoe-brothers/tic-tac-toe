/**
 * Creates new backend requestor
 *
 * @example
 *  const req = new Requestor('10.7.2.50')
 *  req.request({
 *    message: 'Hello'
 *  })
 */
class Requestor {
  constructor(host = '127.0.0.1', port = '5000') {
    const net = require('net')
    this.socket = new net.Socket().connect(port, host)
  }

  request(message) {
    this.socket.write(message)
  }
}

const MessageTypes = {
  newUser: 'newUser', // mensagem de novo usuário ao servidor
  move: 'move', // mensagem de nova jogada ao servidor
  endGame: 'endGame'
}

/**
 * Create new game move
 * @param {[number, number]} to
 * @example
 *  makeGameMove([0, 2])
 */
function makeGameMove(to) {
  return {
    type: MessageTypes.move,
    to
  }
}

module.exports = {
  Requestor,
  MessageTypes,
  makeGameMove
}
