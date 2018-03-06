const service = require('../services/auth');

function isValidRequest(clientId, secretKey) {
  const noNulls = ([clientId, secretKey].filter((prop) => !prop)).length === 0;
  return noNulls;
}

module.exports = (req, res, next) => {
    const clientId = req.body? req.body.clientId : null;
    const secretKey = req.body? req.body.secretKey : null;

    if(!isValidRequest(clientId, secretKey)) {
      res.send(400, {
        error: "clientId and/or secretKey cannot be empty"
      });
      return next(false);
    }

    return service.authenticate(clientId, secretKey)
    .then((token)=>{
      if(!token) {
        res.send(401, {
          error: "Unauthorized"
        });
        return next(false);
      }
      res.send(200, token);
      return next();
    });
}
