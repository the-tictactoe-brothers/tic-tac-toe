function messageNewUser(message, nickname) {
  let newuser = {
    message,
    nickname
  }
  return newUser
}

function messageStartGame(message, nickname) {
  let startGame = {
    message,
    nicknamen
  }
  return starGame
}

obj = {
  messageNewUser,
  messageStartGame
}

module.exports = obj

/** README
 * Para acessar um dos objetos e seus atributos,
 * na classe server tu usa a variavel MessageStructure(Linha 4).
 *
 * EX: MessageStructure.starGame.replyMessage
 *
 * Inicialmente os atributos do objeto (EX:startGame) vão estar vazios.
 *
 * Depois de adicionar os valores deles, o objeto (EX:startGame) pode ser
 * passado como resposta, depois de transformalo em string.
 *
 */
