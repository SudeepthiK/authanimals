const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const getAnimalsHanlder = require('../../app/handlers/get-animals');
const animalsService = require('../../app/services/animals');

describe("Get animals handler",()=>{
  let req;
  let res;
  let next;
  let sandbox;

  beforeEach(()=>{
    sandbox = sinon.sandbox.create();
    req = { };
    res = { send: sandbox.stub() };
    next = sandbox.stub();
  });
  afterEach(()=>{
    sandbox.restore();
  });
  describe("When a request with a decoded token exists",()=>{
    it("Should get the animals for the user to whom the token belongs",()=>{
      const userId = "1";
      req = { decodedToken: { userId: userId } };
      const result = {
        apiUserId: userId,
        animals: [ { "type": "dog", names: ["Lambda"] } ]
      }
      sandbox.stub(animalsService, 'getAnimalsForUser').returns(Promise.resolve(result));
      return getAnimalsHanlder(req, res, next)
      .then(()=>{
        expect(res.send.called).to.be.true;
        const responseArgs = res.send.getCalls(0)[0].args;
        expect(responseArgs[0]).to.be.equal(200);
        expect(responseArgs[1]).to.be.deep.equal(result);
      });
    })
  });

  describe("When a request with a decoded token does NOT exists",()=>{
    it("Should respond with 403 Forbidden",()=>{
      getAnimalsHanlder(req, res, next);
      expect(res.send.called).to.be.true;
      const responseArgs = res.send.getCalls(0)[0].args;
      expect(responseArgs[0]).to.be.equal(403);
      expect(responseArgs[1]).to.have.property("error");
    })
  });
});
