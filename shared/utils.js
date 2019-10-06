const MessageTypes = require('../shared/messageTypes')

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
  makeGameMove,
  toObject
}
