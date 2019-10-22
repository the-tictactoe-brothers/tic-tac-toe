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

let matriz = Array.from({ length: 3 }, coluna => Array.from({ length: 3 }, linha => undefined))

function printMatriz() {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz.length; j++) {
      console.log(matriz[i][j])
    }
  }
}

function addPosition(position, symb) {
  let x = position[0]
  let y = position[1]

  if (matriz[x][y]) {
    return 0
  } else {
    matriz[x][y] = symb
    return this.verify(position, symb)
  }
}

function rmvPosition(position) {
  let x = position[0]
  let y = position[1]

  matriz[x][y] = undefined
}

function verify(position, symb) {
  let x = position[0]
  let y = position[1]

  loop1: for (let i = 0; i < matriz.length; i++) {
    loop2: for (let j = 0; j < matriz.length; j++) {
      // horizontal check
      if (x == i && matriz[x][0] == matriz[x][1] && matriz[x][1] == matriz[x][2]) {
        return 2
      }

      // Vertical check
      if (y == j && matriz[0][y] == matriz[1][y] && matriz[1][y] == matriz[2][y]) {
        return 2
      }

      // Main Diagonal check
      if (x == y && matriz[0][0] == matriz[1][1] && matriz[1][1] == matriz[2][2]) {
        return 2
      }

      // Secondary Diagonal check
      if (
        (x == y || (x == 0 && y == 2) || (x == 2 && y == 0)) &&
        matriz[0][2] == matriz[1][1] &&
        matriz[1][1] == matriz[2][0]
      ) {
        return 2
      }
    }
  }
  return 1
}

module.exports = {
  addPosition
}
