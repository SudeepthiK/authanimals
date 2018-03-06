const service = require('../services/auth');

function isAuthorized(authorization) {
  const token = extractToken(authorization);
  if(!token) {
    return Promise.reject({ error: "No token passed" });
  }
  return service.verifyToken(token);
}

function extractToken(authorization) {
  if(!authorization) {
    return null;
  }
  const regex = /(Bearer|bearer) (.*)/g;
  const matches = regex.exec(authorization);
  if(!matches || matches.length < 3) {
    return null;
  }
  return matches[2];
}

module.exports = (req, res, next) => {
    const authorization = req.headers.authorization;
    return isAuthorized(authorization)
    .then((decodedToken)=>{
      req.decodedToken = decodedToken;
      return next(true);
    })
    .catch((err)=>{
      res.send(403, {
        error: "Forbidden to access, "+err
      })
      return next(false);
    });


}
