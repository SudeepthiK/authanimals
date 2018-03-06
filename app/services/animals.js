const animalsRepository = require('../repositories/animals');

function getAnimalsForUser(userId) {
  return animalsRepository.getAnimalsGroupedByType(userId)
  .then((groups)=>{
    const byTypes = Object.keys(groups).map((key)=>{
      return {
        type: key,
        names: groups[key]
      }
    });
    return {
      apiUserId: userId,
      animals: byTypes
    }
  })
}

module.exports = {
  getAnimalsForUser: getAnimalsForUser
}
