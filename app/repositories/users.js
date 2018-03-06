const reader = require('../resources/reader');

function getMatchingUser(clientId, secretKey) {
  const users = reader.getUsers();

  if(!users) {
    return Promise.resolve(null);
  }

  const matches = users.filter((user)=>{
    return (user.apiClientId === clientId) && (user.apiSecretKey === secretKey)
  });
  if(matches.length === 0) {
    return Promise.resolve(null);
  }
  return Promise.resolve(matches[0])
}
module.exports = {
  getMatchingUser: getMatchingUser
}
