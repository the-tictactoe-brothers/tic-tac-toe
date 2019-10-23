const Requestor = require('../src/utils/requestor')
const MessageTypes = require('../shared/messageTypes')

const reqs = Array.from({ length: 5 }, () => new Requestor())

;(async () => {
  // Needs to create first at least some users
  for (const r in reqs) {
    await reqs[r].request({
      type: MessageTypes.newUser,
      payload: `User${r}`
    })
  }

  // Could be another index
  const challengedId = 0
  const challengerId = 2
  const req = reqs[challengerId]
  const { users } = await req.request({
    type: MessageTypes.listUsers
  })

  const challengedUser = users.find(user => user.nickname === `User${challengedId}`)
  reqs[challengedId].registerAsyncCallback(MessageTypes.asyncStartGame, message => {
    console.log('async >>>', message)
  })

  const res = await req.request({
    type: MessageTypes.start,
    payload: challengedUser.nickname
  })

  console.log('response:', res)
})()
