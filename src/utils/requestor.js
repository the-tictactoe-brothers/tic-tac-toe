const { EventEmitter } = require('events')

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
    this.asyncReceiver = new EventEmitter()
    this.events = []

    this.socket.on('data', data => {
      const messageData = JSON.parse(data.toLocaleString())
      if (this.events.includes(messageData.type)) {
        console.log('async:', messageData)
        this.asyncReceiver.emit(messageData.type, messageData)
      }
    })
  }

  registerAsyncCallback(asyncEvent, callback) {
    this.events.push(asyncEvent)
    this.asyncReceiver.on(asyncEvent, callback)
  }

  request(message) {
    message = typeof message === 'object' && JSON.stringify(message)
    return new Promise(resolve => {
      this.socket.write(message)
      this.socket.once('data', data => {
        const response = JSON.parse(data.toLocaleString())
        if (!this.events.includes(response.type)) {
          resolve(response)
        }
      })
    })
  }
}

module.exports = Requestor
