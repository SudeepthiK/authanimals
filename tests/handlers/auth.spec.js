const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const authHandler = require('../../app/handlers/auth');
const authService = require('../../app/services/auth');

describe("Auth handler",()=>{
  let req;
  let res;
  let next;
  let sandbox;

  beforeEach(()=>{
    sandbox = sinon.sandbox.create();
    req = { body: {} };
    res = { send: sandbox.stub() };
    next = sandbox.stub();
  });
  afterEach(()=>{
    sandbox.restore();
  });

  const expectBadResponse = (res) => {
    expect(res.send.called).to.be.true;
    const responseArgs = res.send.getCalls(0)[0].args
    expect(responseArgs[0]).to.equal(400);
    expect(responseArgs[1]).to.have.property("error");
  }

  describe("Given a request that does not hold clientId and/or secretKey", ()=>{
    describe("When clientId and secretKey is NOT present",()=>{
      describe("When auth handler is invoked", ()=>{
        it("Should return bad request",()=>{
          authHandler(req, res, next);
          expectBadResponse(res);
        });
      });
    });

    describe("When clientId is NOT present",()=>{
      describe("When auth handler is invoked", ()=>{
        it("Should return bad request",()=>{
          req.body = {
            secretKey: "some-secret-key"
          }
          authHandler(req, res, next);
          expectBadResponse(res);
        });
      });
    });

    describe("When secretKey is NOT present",()=>{
      describe("When auth handler is invoked", ()=>{
        it("Should return bad request",()=>{
          req.body = {
            clientId: "some-secret-key"
          }
          authHandler(req, res, next);
          expectBadResponse(res);
        });
      });
    });

  });

  describe("Given a request that holds right clientId and secretKey", ()=>{
    describe("When auth handler is invoked", ()=>{
      it("Should authenticate the request and return the token",()=>{
        const token = "token";
        const authenticate = sandbox.stub(authService, 'authenticate').returns(Promise.resolve(token));
        const clientId = "some-client-id";
        const secretKey = "some-secret-key";
        req.body = {
          clientId: clientId,
          secretKey: secretKey
        }
        return authHandler(req, res, next)
        .then(()=>{
          expect(res.send.called).to.be.true;
          expect(authenticate.getCalls(0)[0].args[0]).to.be.equal(clientId);
          expect(authenticate.getCalls(0)[0].args[1]).to.be.equal(secretKey);
          const responseArgs = res.send.getCalls(0)[0].args;
          expect(responseArgs[0]).to.be.equal(200);
          expect(responseArgs[1]).to.be.equal(token);
        });
      });
    });
  });

  describe("Given a request that holds wrong clientId and secretKey", ()=>{
    describe("When auth handler is invoked", ()=>{
      it("Should authenticate the request and return the token",()=>{
        const authenticate = sandbox.stub(authService, 'authenticate').returns(Promise.resolve(null));
        const clientId = "some-wrong-client-id";
        const secretKey = "some-wrong-ecret-key";
        req.body = {
          clientId: clientId,
          secretKey: secretKey
        }
        return authHandler(req, res, next)
        .then(()=>{
          expect(res.send.called).to.be.true;
          expect(authenticate.getCalls(0)[0].args[0]).to.be.equal(clientId);
          expect(authenticate.getCalls(0)[0].args[1]).to.be.equal(secretKey);
          const responseArgs = res.send.getCalls(0)[0].args;
          expect(responseArgs[0]).to.be.equal(401);
          expect(responseArgs[1]).to.have.property("error");
        });

      });
    });
  });
})
