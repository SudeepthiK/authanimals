const service = require('../services/animals');
module.exports = (req, res, next) => {
  const userId = req.decodedToken? req.decodedToken.userId : null;
  if(!userId) {
    res.send(403,{
      error: "Forbidden to access"
    });
    return next(false);
  }

  return service.getAnimalsForUser(userId)
  .then((result)=>{
    res.send(200, result);
    next();
  });
}
