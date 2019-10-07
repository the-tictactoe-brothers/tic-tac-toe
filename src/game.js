const Requestor = require('./utils')

let req = new Requestor()
req
  .request({
    type: 'message',
    value: 'hello'
  })
  .then(response => {
    console.log('response:\n', response, 'end')
    // console.log(response)
  })

// req
//   .request({
//     type: 'message',
//     value: 'new'
//   })
//   .then(response => {
//     console.log('response:\n', response, 'end')
//   })

// req
//   .request({
//     type: 'message',
//     value: 'world'
//   })
//   .then(response => {
//     console.log('response:\n', response, 'end')
//   })
