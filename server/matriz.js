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

let matriz = Array.from({ length: 3 }, () => Array.from({ length: 3 }))

let answer = {
  type: undefined,
  array: undefined
}

// Contador para verificar questão de empate
let count = 0

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
    answer.type = 0
    answer.array = position
    return answer
  } else {
    matriz[x][y] = symb
    return verify(position, symb)
  }
}

function resetMatrix() {
  count = 0

  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz.length; j++) {
      matriz[i][j] = undefined
    }
  }
}

function verify(position, symb) {
  let x = position[0]
  let y = position[1]
  console.log(symb)

  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz.length; j++) {
      // horizontal check
      if (x == i && matriz[x][0] == matriz[x][1] && matriz[x][1] == matriz[x][2]) {
        answer.array = [[x, 0], [x, 1], [x, 2]]
        answer.type = 2
        return answer
      }

      // Vertical check
      if (y == j && matriz[0][y] == matriz[1][y] && matriz[1][y] == matriz[2][y]) {
        answer.array = [[0, y], [1, y], [2, y]]
        answer.type = 2
        return answer
      }

      // Main Diagonal check
      if (x == y && matriz[0][0] == matriz[1][1] && matriz[1][1] == matriz[2][2]) {
        answer.array = [[0, 0], [1, 1], [2, 2]]
        answer.type = 2
        return answer
      }

      // Secondary Diagonal check
      if (
        ((x == 1 && y == 1) || (x == 0 && y == 2) || (x == 2 && y == 0)) &&
        matriz[0][2] == matriz[1][1] &&
        matriz[1][1] == matriz[2][0]
      ) {
        answer.array = [[0, 2], [1, 1], [2, 0]]
        answer.type = 2
        return answer
      }
    }
  }
  count++

  // Tie check
  if (count == 9) {
    answer.array = [x, y]
    answer.type = 3
    return answer
  }

  answer.array = [x, y]
  answer.type = 1
  return answer
}

module.exports = {
  addPosition,
  printMatriz,
  resetMatrix,
  verify
}
