const MessageTypes = require('../../shared/messageTypes')

/**
 * Performs a request to server
 * @param {Object | String} message
 * @returns {Promise<any>} response
 * @example
 *  request({
 *    message: 'Hello!'
 *  }).then(response => console.log(response)) // gets the response!
 */
class Requestor {
  constructor(host = '127.0.0.1', port = '5000') {
    const net = require('net')
    this.socket = new net.Socket().connect(port, host)
  }

  request(message) {
    message = typeof message === 'object' && JSON.stringify(message)
    return new Promise(resolve => {
      this.socket.write(message)
      this.socket.on('data', data => {
        const response = data.toLocaleString()
        if (response.includes(message))
          resolve(JSON.parse(data.toLocaleString()))
      })
    })
  }
}

module.exports = Requestor
