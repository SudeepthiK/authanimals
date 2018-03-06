const userRepository = require('../repositories/users');
const jwt = require('jsonwebtoken');
const secretsStore = require('./secrets-store');
const config = require('../../config')

function authenticate(clientId, secretKey) {
  return userRepository.getMatchingUser(clientId, secretKey)
  .then((user)=>{
    if(!user) {
      return null;
    }
    return signedToken(user);
  });
}

function signedToken(user) {
  return new Promise((resolve, reject)=>{
    const secret = secretsStore.getKey("secret");
    jwt.sign({
      userId: user.id
      }, secret, {
      expiresIn: config["token-expiry"]
    }, (err, token)=>{
      if(err) {
        reject("Unable to create token, "+err);
        return;
      }
      resolve(token);
    });
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject)=>{
    const secret = secretsStore.getKey("secret");
    jwt.verify(token, secret, (err, decoded)=>{
      if(err) {
        (err.name === "TokenExpiredError") ? reject("Token has expired") : reject("Invalid token");
        return;
      }
      resolve(decoded);
      return;
    })
  })
}

module.exports = {
  authenticate: authenticate,
  verifyToken: verifyToken
}
