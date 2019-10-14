const MessageTypes = {
  newUser: 'newUser', // mensagem de novo usuário ao servidor
  move: 'move', // mensagem de nova jogada ao servidor
  endGame: 'endGame',
  err: 'err',
  listUsers: 'listUsers',
  start: 'start', // mesagem enviada ao iniciar um jogo
  accepted: 'accepted',
  denied: 'denied'
}

module.exports = MessageTypes
