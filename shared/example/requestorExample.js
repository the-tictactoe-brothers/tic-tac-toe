const Requestor = require('../../src/utils/requestor')

let req = new Requestor()
;(async () => {
  const res1 = await req.request({
    type: 'message',
    value: 'hello'
  })
  console.log(res1)

  const res2 = await req.request({
    type: 'message',
    value: 'new'
  })
  console.log(res2)

  const res3 = await req.request({
    type: 'message',
    value: 'world'
  })
  console.log(res3)
  // req
  //   .request({
  //     type: 'message',
  //     value: 'hello'
  //   })
  //   .then(response => {
  //     // req.socket.end()
  //     console.log(response)
  //   })

  // req
  //   .request({
  //     type: 'message',
  //     value: 'new'
  //   })
  //   .then(response => {
  //     // req.socket.end()
  //     console.log(response)
  //   })

  // req
  //   .request({
  //     type: 'message',
  //     value: 'world'
  //   })
  //   .then(response => {
  //     // req.socket.end()
  //     console.log(response)
  //   })
})()
