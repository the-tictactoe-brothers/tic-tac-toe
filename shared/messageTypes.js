const MessageTypes = {
  newUser: 'newUser', // mensagem de novo usuário ao servidor
  move: 'move', // mensagem de nova jogada ao servidor
  asyncMove: 'asyncMove',
  endGame: 'endGame',
  asyncEndGame: 'asyncEndGame',
  err: 'err',
  listUsers: 'listUsers',
  start: 'start', // mesagem enviada ao iniciar um jogo
  asyncStartGame: 'asyncStartGame',
  accepted: 'accepted',
  denied: 'denied'
}

module.exports = MessageTypes
