const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const userRepository = require('../../app/repositories/users');
const authService = require('../../app/services/auth');
const jwt = require('jsonwebtoken');
const secretsStore = require('../../app/services/secrets-store');

describe("Auth service",()=>{
  let getSecretValue;
  beforeEach(()=>{
    sandbox = sinon.sandbox.create();
    getSecretValue = sandbox.stub(secretsStore, 'getKey').withArgs('secret').returns('test-secret');
  });
  afterEach(()=>{
    sandbox.restore();
  });

  describe("Given a clientId and secretKey", ()=>{
    describe("When a user with the corresponding clientId secretKey is present",()=>{
      it("Should return user with the matching id",()=>{
        const clientId = "client-id";
        const secretKey= "secret-key";
        const id = "user-id";
        const matchingUser = {
          clientId,
          secretKey,
          id
        };
        const getMatchingUser = sandbox.stub(userRepository, 'getMatchingUser').returns(Promise.resolve(matchingUser));
        return authService.authenticate(clientId, secretKey)
        .then((token)=>{
          expect(getMatchingUser.called).to.be.true;
          expect(getMatchingUser.getCalls(0)[0].args[0]).to.be.equal(clientId);
          expect(getMatchingUser.getCalls(0)[0].args[1]).to.be.equal(secretKey);

          const decrypted = jwt.verify(token, secretsStore.getKey("secret"));
          expect(decrypted.userId).to.be.equal(id);
        });
      });
    });

    describe("When a user with the corresponding clientId secretKey is NOT present",()=>{
      it("Should return null as token",()=>{
        const clientId = "client-id";
        const secretKey= "secret-key";
        const getMatchingUser = sandbox.stub(userRepository, 'getMatchingUser').returns(Promise.resolve(null));
        authService.authenticate(clientId, secretKey)
        .then((token)=>{
          expect(getMatchingUser.called).to.be.true;
          expect(getMatchingUser.getCalls(0)[0].args[0]).to.be.equal(clientId);
          expect(getMatchingUser.getCalls(0)[0].args[1]).to.be.equal(secretKey);
          expect(token).to.be.null;
        });
      });
    });
  });
});
