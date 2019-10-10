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
