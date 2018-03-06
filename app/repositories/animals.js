const reader = require('../resources/reader');

function getAnimalsGroupedByType(userId) {
  const animals = reader.getAnimals();

  if(!animals) {
    return Promise.resolve([]);
  }

  return Promise.resolve(animals.reduce((acc, animal)=>{
      if(animal.apiUserId === userId) {
        if(!acc[animal.type]) { acc[animal.type] = [] }
        acc[animal.type].push(animal.name);
      }
      return acc;
    }, {})
  );
}

module.exports = {
  getAnimalsGroupedByType: getAnimalsGroupedByType
}
