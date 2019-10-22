const Requestor = require('../src/utils/requestor')
const MessageTypes = require('../shared/messageTypes')

const req1 = new Requestor()
const req2 = new Requestor()
const req3 = new Requestor()
;(async () => {
  await req1.request({
    type: MessageTypes.newUser,
    payload: 'Pedro'
  })

  await req2.request({
    type: MessageTypes.newUser,
    payload: 'Paulo'
  })

  await req3.request({
    type: MessageTypes.newUser,
    payload: 'Maria'
  })

  const res = await req1.request({
    type: MessageTypes.listUsers
  })

  console.log(res)
})()
