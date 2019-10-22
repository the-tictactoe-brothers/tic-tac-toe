const Requestor = require('../src/utils/requestor')
const MessageTypes = require('../shared/messageTypes')

let req = new Requestor()
;(async () => {
  const res = await req.request({
    type: MessageTypes.newUser,
    payload: 'Josicleidson'
  })
  console.log(res)
})()
