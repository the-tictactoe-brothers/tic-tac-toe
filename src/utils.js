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

  /**
   * Performs a request to server
   * @param {Object | String} message
   * @returns {Promise<any>} response
   * @example
   *  request({
   *    message: 'Hello!'
   *  }).then(response => console.log(response)) // gets the response!
   */
  request(message) {
    message = typeof message === 'object' && JSON.stringify(message)
    this.socket.write(message)
    return new Promise(resolve => {
      let response = ''
      // console.log(response)
      this.socket.on('data', data => {
        const res = data.toLocaleString()
        console.log('data:', res)
        response += res
        if (res.includes('end')) resolve(response)
      })
    })
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
function makeGameMove(target) {
  return {
    type: MessageTypes.move,
    target
  }
}

/**
 *
 * @param {String | Buffer} data
 * @returns {Object} converted data
 */
function toObject(data) {
  return JSON.parse(data.toLocaleString())
}

module.exports = {
  Requestor,
  MessageTypes,
  makeGameMove,
  toObject
}
