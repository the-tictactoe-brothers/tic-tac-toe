/* eslint-disable */
const remote = require('electron').remote
const path = require('path')

const MessageTypes = remote.getGlobal('shared').MessageTypes
const currentWindow = remote.getCurrentWindow()
const req = remote.getGlobal('shared').req

let opponent = null

async function addNewUser(evt) {
  evt.preventDefault()
  const res = await req.request({
    type: MessageTypes.newUser,
    payload: document.getElementById('nick-field').value
  })

  const nickForm = document.getElementById('nick-form')
  if (res.type === MessageTypes.accepted) {
    const url = path.resolve(__dirname, 'html/matchmake.html')
    currentWindow.loadURL(`file://${url}`)
    console.log(res.nickname)
    remote.getGlobal('shared').username = res.nickname
  } else {
    const errorMessage = document.createElement('p')
    errorMessage.style.color = 'red'
    errorMessage.textContent = 'Nickname already being used!'
    const wrapper = document.getElementById('wrapper')
    wrapper.innerHTML = ''
    nickForm.insertBefore(errorMessage, document.getElementById('nick-field').nextSibling)
    setTimeout(() => {
      nickForm.removeChild(errorMessage)
      wrapper.innerHTML = '<br /><br />'
    }, 1000)
  }
}

function initGame() {
  createGrid(3, 3)
  req.registerAsyncCallback(MessageTypes.asyncMove, message => {
    // console.log(`Received oponentMove:`, message)
    const [x, y] = message.payload
    console.log(x, y)
    const slot = document.getElementById(`slot-${x}-${y}`)
    const shape = remote.getGlobal('shared').username === 'jose' ? 'cross' : 'circle'
    slot.style.background = `url(../assets/${shape}.png) no-repeat center center`
    slot.style.backgroundColor = '#cdcdcd'
    slot.onclick = undefined
    setBoardLocked(false)
    changeTurn(true)
  })

  req.registerAsyncCallback(MessageTypes.asyncEndGame, message => {
    // console.log(`Received oponentMove:`, message)
    const [x, y] = message.payload
    console.log(x, y)
    const slot = document.getElementById(`slot-${x}-${y}`)
    const shape = remote.getGlobal('shared').username === 'jose' ? 'cross' : 'circle'
    slot.style.background = `url(../assets/${shape}.png) no-repeat center center`
    slot.style.backgroundColor = '#cdcdcd'
    slot.onclick = undefined
    onEndGame()
  })
}

function onEndGame() {
  setBoardLocked(false)
}

function createGrid(n, m) {
  const board = document.getElementById('game-board')
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const slot = document.createElement('div')
      slot.setAttribute('id', `slot-${i}-${j}`)
      slot.classList.add('board-slot')
      slot.onclick = evt => onClick(evt)
      board.appendChild(slot)
    }
  }
}

function setBoardLocked(locked) {
  const d = document.getElementById('game-board')
  d.style.pointerEvents = locked ? 'none' : ''
}

function changeTurn(myTurn) {
  const turnDiv = document.getElementById('turn-result-div')
  turnDiv.innerHTML = myTurn ? "It's your turn" : "Opponent's turn"
}

async function onClick(e) {
  const id = e.target.id
  const regex = /slot-([0-9])-([0-9])/g
  const groups = regex.exec(id)
  groups.shift()
  const [x, y] = groups
  const username = remote.getGlobal('shared').username
  const res = await req.request({
    type: MessageTypes.move,
    targetUser: username === 'joao' ? 'jose' : 'joao',
    payload: [x, y]
  })
  console.log(x, y)

  // add image
  const slot = document.getElementById(id)
  const shape = username === 'joao' ? 'cross' : 'circle'
  slot.style.background = `url(../assets/${shape}.png) no-repeat center center`
  slot.style.backgroundColor = '#cdcdcd'
  slot.onclick = undefined
  setBoardLocked(true)
  changeTurn(false)
  console.log(`Server's response for ${username}: ${res.type}`)
}

async function getUsersList() {
  const res = await req.request({
    type: MessageTypes.listUsers
  })
  users = res.users
  return users
}

async function populateUserList() {
  users = await getUsersList()
  for (const i in users) {
    const inner = i == 0 ? ' self">You' : ' oponent" onclick="challengePlayer(this)">Challenge'

    document.getElementById('players-table-id').innerHTML +=
      '<tr><td>' +
      users[i].nickname +
      '</td>' +
      '<td>' +
      '<button class="challenge-cell' +
      inner +
      '</button>' +
      '</td></tr>'
  }

  req.registerAsyncCallback(MessageTypes.asyncStartGame, message => {
    opponent = message.payload
    const url = path.resolve(__dirname, 'game.html')
    currentWindow.loadURL(`file://${url}`)
  })
}

async function challengePlayer(element) {
  const index = element.closest('tr').rowIndex
  opponentNick = document.getElementById('players-table-id').rows[index].cells[0].innerHTML

  const res = await req.request({
    type: MessageTypes.start,
    payload: opponentNick
  })

  console.log(res)

  if (res.type === MessageTypes.accepted) {
    opponent = res.nickname
    const url = path.resolve(__dirname, 'game.html')
    currentWindow.loadURL(`file://${url}`)
  } else {
    alert('Failed to start game')
  }
}
