const remote = require('electron').remote
const path = require('path')

const MessageTypes = remote.getGlobal('shared').MessageTypes
const currentWindow = remote.getCurrentWindow()
// const req = remote.getGlobal('shared').req

async function addNewUser(evt) {
  evt.preventDefault()
  const res = await req.request({
    type: MessageTypes.newUser,
    payload: document.getElementById('nick-field').value
  })

  const nickForm = document.getElementById('nick-form')
  if (res.type === MessageTypes.OK) {
    const url = path.resolve(__dirname, 'html/matchmake.html')
    currentWindow.loadURL(`file://${url}`)
  } else {
    const errorMessage = document.createElement('div')
    errorMessage.style.color = 'red'
    errorMessage.textContent = 'Nickname already being used!'
    nickForm.insertBefore(
      errorMessage,
      document.getElementById('nick-field').nextSibling
    )
  }
}
