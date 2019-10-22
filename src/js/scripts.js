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

  console.log(res)
  const nickForm = document.getElementById('nick-form')
  if (res.type === MessageTypes.accepted) {
    const url = path.resolve(__dirname, 'html/matchmake.html')
    currentWindow.loadURL(`file://${url}`)
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

function createGrid(n, m) {
  const board = document.getElementById('game-board')
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const slot = document.createElement('div')
      slot.setAttribute('id', `slot-${i}-${j}`)
      slot.classList.add('board-slot')
      slot.addEventListener('click', evt => onClick(evt))
      board.appendChild(slot)
    }
  }
}

function onClick(e) {
  const id = e.target.id
  const regex = /slot-([0-9])-([0-9])/g
  const groups = regex.exec(id)
  groups.shift()
  const [x, y] = groups
  console.log(x, y)
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

  req.registerAsyncCallback(message => {
    opponent = message.payload
    const url = path.resolve(__dirname, 'game.html')
    currentWindow.loadURL(`file://${url}`)
  })
}

async function challengePlayer(element) {
  const index = element.closest('tr').rowIndex
  opponentNick = document.getElementById('players-table-id').rows[index].cells[0].innerHTML

  const req = await req.Request({
    type: MessageTypes.start,
    payload: opponentNick
  })

  console.log(res)

  if (res.type === MessageTypes.accepted) {
    opponent = res.payload
    const url = path.resolve(__dirname, 'game.html')
    currentWindow.loadURL(`file://${url}`)
  } else {
    alert('Failed to start game')
  }
}
