const remote = require('electron').remote

const MessageTypes = remote.getGlobal('shared').messageTypes
const req = remote.getGlobal('shared').req

async function addNewUser() {
  try {
    const res = await req.request({
      type: MessageTypes.newUser,
      value: document.getElementById('nick-field').value
    })
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}

console.log('game!' + MessageTypes.err)
