const MessageTypes = require('../shared/messageTypes')

/** (Matrix structure used)
 *
 * let matriz = [
 *   [
 *     undefined,
 *     undefined,
 *     undefined
 *   ],
 *   [
 *     undefined,
 *     undefined,
 *     undefined
 *   ],
 *   [
 *     undefined,
 *     undefined,
 *     undefined
 *   ],
 * ];
 *
 */

let matriz = Array.from(
  { length: 3 },
  coluna => (coluna = Array.from({ length: 3 }, linha => (linha = undefined)))
)

/*
const data = {
  payload: [2,1],
  type: 'asyncMessage'
}
*/

function printMatriz() {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      console.log(matriz[i][j])
    }
  }
}

function addPosition(position, symb) {
  let x = position[0]
  let y = position[1]

  if (matriz[x][y]) {
    // if value != undefined
    return MessageTypes.denied
  } else {
    matriz[x][y] = symb
    return MessageTypes.accepted
  }
}

function rmvPosition(position) {
  let x = position[0]
  let y = position[1]

  matriz[x][y] = undefined
}
