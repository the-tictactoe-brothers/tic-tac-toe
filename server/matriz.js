const MessageTypes = require('../shared/messageTypes')

/** (Matrix structure used)
 *
 * let matriz = [
 *   [
 *     [0,undefined],
 *     [0,undefined],
 *     [0,undefined]
 *   ],
 *   [
 *     [0,undefined],
 *     [0,undefined],
 *     [0,undefined]
 *   ],
 *   [
 *     [0,undefined],
 *     [0,undefined],
 *     [0,undefined]
 *   ],
 * ];
 *
 */

let matriz = Array.from(
  { length: 3 },
  coluna => (coluna = Array.from({ length: 3 }, linha => (linha = [0, undefined])))
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
      console.log(matriz[i][j][0])
    }
  }
}

function addPosition(position, symb) {
  let x = position[0]
  let y = position[1]

  if (matriz[x][y][0]) {
    // if value != 0
    return MessageTypes.denied
  } else {
    matriz[x][y][0] = 1
    matriz[x][y][1] = symb
    return MessageTypes.accepted
  }
}

function rmvPosition(position) {
  let x = position[0]
  let y = position[1]

  matriz[x][y][0] = 0
  matriz[x][y][1] = undefined
}
