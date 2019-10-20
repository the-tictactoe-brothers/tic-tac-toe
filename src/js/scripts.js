/* eslint-disable */
const remote = require('electron').remote
const path = require('path')

const MessageTypes = remote.getGlobal('shared').MessageTypes
const currentWindow = remote.getCurrentWindow()
const req = remote.getGlobal('shared').req

async function addNewUser(evt) {
  evt.preventDefault()
  const res = await req.request({
    type: MessageTypes.newUser,
    payload: document.getElementById('nick-field').value
  })

  console.log(res)
  const nickForm = document.getElementById('nick-form')
  if (res.message === MessageTypes.accepted) {
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
  return res
}

async function populateUserList() {
  users = await getUsersList()

  for (const i in users) {
    document.getElementById('players-table-id').innerHTML +=
      '<tr><td>' +
      users[i].nickname +
      '</td>' +
      '<td>' +
      // eslint-disable-next-line max-len
      '<button class="challenge-cell" id="challenge" onclick="challengePlayer(this)">Challenge</button>' +
      '</td></tr>'
  }
}

async function challengePlayer(element) {
  const index = element.closest('tr').rowIndex
  opponent = document.getElementById('players-table-id').rows[index].cells[0].innerHTML

  //alert(opponent)

  const req = await req.Request({
    type: MessageTypes.start,
    payload: opponent
  })

  console.log(res)

  const gameCont = document.getElementById('game-container')
  if (res.message === MessageTypes.accepted) {
    const url = path.resolve(__dirname, 'game.html')
    currentWindow.loadURL(`file://${url}`)
  } else {
    const errorMessage = document.createElement('p')
    errorMessage.style.color = 'red'
    errorMessage.style.textAlign = 'center'
    errorMessage.textContent = 'Failed to start game'
    gameCont.insertBefore(errorMessage, gameCont.childNodes[2])
    setTimeout(() => {
      gameCont.removeChild(errorMessage)
    }, 1000)
  }
}
