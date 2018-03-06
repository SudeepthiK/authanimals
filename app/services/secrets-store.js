const config = require('../../config');

module.exports = {
  getKey: (key) => {
    const value = config[key];
    if(!value) {
      throw new Error("Could not find "+key+" in config");
    }
    return value;
  }
}
