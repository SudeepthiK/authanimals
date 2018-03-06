const users = require('./apiUsers');
const animals = require('./animals');

module.exports = {
  getAnimals: ()=>{
    return animals;
  },
  getUsers: ()=>{
    return users;
  }
}
