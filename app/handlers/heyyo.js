const service = require('../services/animals');
module.exports = (req, res, next) => {
  const arr = Array.from(Array(101).keys()).slice(1);
  const mappedArray = arr.map((n)=>{
    if(n%15 === 0) {
      return "HeyYo";
    }
    if(n%5 === 0) {
      return "Yo";
    }
    if(n%3 === 0){
      return "Hey";
    }
    return n;
  });
  res.send(200, mappedArray);
}
