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
  let req = new Requestor()
  const res = await req.request({
    type: MessageTypes.listUsers
  })
  return res
}

async function populateUserList() {
  users = await getUsersList()
  document.getElementById('players-table-id').innerHTML +=
    '<tr><td>' + users + "</td><td><a href='game.html'>Challenge</a></td></tr>"
}
