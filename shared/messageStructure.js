const { maybe } = require('./utils')

/** README
 * Para acessar um dos objetos e seus atributos,
 * na classe server, crie um obj, que recebe o retorna de uma função:
 *
 * EX: const obj = MessageStructure.MessageStructure('Acepted', 'Parzival')
 *
 * Depois de criar o objeto e enviar os parametros para a função, o objeto pode ser
 * passado como resposta, depois de transformalo em string.
 *
 */

function messageNewUser(type, nickname) {
  return JSON.stringify({
    type,
    nickname
  })
}

function messageStartGame(type, nickname) {
  return JSON.stringify({
    type,
    nickname
  })
}

function messageError(type, payload) {
  return JSON.stringify({
    type,
    ...maybe('payload', payload)
  })
}

function messageMove(type, nickname, payload) {
  return JSON.stringify({
    type,
    ...maybe('nickname', nickname),
    ...maybe('payload', payload)
  })
}

function messageListUsers(message, users) {
  return JSON.stringify({
    message,
    users
  })
}

module.exports = {
  messageNewUser,
  messageStartGame,
  messageError,
  messageMove,
  messageListUsers
}
