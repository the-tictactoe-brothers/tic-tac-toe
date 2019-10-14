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

function scrap(users) {
  spl_users = users.split('}')
  users_list = []

  for (const i in spl_users) {
    if (i == spl_users.length - 1) {
      break
    }

    const begin = spl_users[i].search('nickname') + 11
    const end = spl_users[i].search('socket') - 3
    const user = spl_users[i].slice(begin, end)

    users_list.push(user)
  }

  return users_list
}

async function populateUserList() {
  users = await getUsersList()
  users_list = scrap(users)

  for (const i in users_list) {
    document.getElementById('players-table-id').innerHTML += '<tr><td>' + users_list[i] + '</td>'
    document.getElementById('players-table-id').innerHTML +=
      '<td><a id="challenge" href="game.html">Challenge</a></td></tr>'
  }

  document.getElementById('challenge').onclick = async function() {
    // const req = await req.Request({
    //   type:
    // })
  }
}
