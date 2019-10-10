async function addNewUser() {
  const Requestor = request('./utils/requestor')
  const MessageTypes = request('../shared/messageTypes')

  let req = new Requestor()
  const res = await req.request({
    type: MessageTypes.newUser,
    value: document.getElementById('nick-field').value
  })
  console.log(res)
}
