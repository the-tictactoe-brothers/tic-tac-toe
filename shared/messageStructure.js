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

function messageNewUser(message, nickname) {
  return JSON.stringify({
    message,
    nickname
  })
}

function messageStartGame(message, nickname) {
  return JSON.stringify({
    message,
    nickname
  })
}

function messageError(message, payload) {
  return JSON.stringify({
    message,
    ...maybe('payload', payload)
  })
}

module.exports = {
  messageNewUser,
  messageStartGame,
  messageError
}
