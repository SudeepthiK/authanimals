const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const tokenValidationHandler = require('../../app/handlers/token-validation');
const authService = require('../../app/services/auth');

describe("Token valdation handler",()=>{
  let req;
  let res;
  let next;
  let sandbox;

  beforeEach(()=>{
    sandbox = sinon.sandbox.create();
    req = { headers: {} };
    res = { send: sandbox.stub() };
    next = sandbox.stub();
  });
  afterEach(()=>{
    sandbox.restore();
  });

  function checkExpectsForForbiddenError(res) {
    expect(res.send.called).to.be.true;
    expect(res.send.getCalls(0)[0].args[0]).to.be.equal(403);
    expect(res.send.getCalls(0)[0].args[1]).to.have.property("error");
    expect(next.getCalls(0)[0].args[0]).to.be.equal(false);
  }

  describe("When a request with a valid token is provided",()=>{
    it("Should invoke the next handler",()=>{
      const encodedToken = "some-encoded-token";
      const decodedToken = {
        userId: "1"
      };
      req.headers.authorization = "Bearer "+encodedToken;
      sandbox.stub(authService, 'verifyToken').returns(Promise.resolve(decodedToken));
      return tokenValidationHandler(req, res, next)
      .then(()=>{
        expect(next.called).to.be.true;
        expect(req.decodedToken).to.exist;
        expect(req.decodedToken).to.deep.equal(decodedToken);
      });
    });
  });

  describe("When a request with no token is provided",()=>{
    it("Should respond with 403 Forbidden",()=>{
      return tokenValidationHandler(req, res, next)
      .then(()=>{
        return checkExpectsForForbiddenError(res);
      });
    });
  });

  describe("When a request with an invalid token is provided",()=>{
    it("Should respond with 403 Forbidden",()=>{
      const encodedToken = "some-invalid-token";
      req.headers.authorization = "Bearer "+encodedToken;
      sandbox.stub(authService, 'verifyToken').returns(Promise.reject("Invalid token"));
      return tokenValidationHandler(req, res, next)
      .then(()=>{
        return checkExpectsForForbiddenError(res);
      });
    });
  });

  describe("When a request with a expired token is provided",()=>{
    it("Should respond with 403 Forbidden",()=>{
      const encodedToken = "some-invalid-token";
      req.headers.authorization = "Bearer "+encodedToken;
      sandbox.stub(authService, 'verifyToken').returns(Promise.reject("Expired token"));
      return tokenValidationHandler(req, res, next)
      .then(()=>{
        return checkExpectsForForbiddenError(res);
      });
    });
  });
});
