const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const userRepository = require('../../app/repositories/users');
const reader = require('../../app/resources/reader');


describe("Given users repository",()=>{
  beforeEach(()=>{
    sandbox = sinon.sandbox.create();
  });
  afterEach(()=>{
    sandbox.restore();
  });

  describe("When a matching user with a clientId and secretKey exists", ()=>{
    it("Should return user that matched",()=> {
      const user = { id: "1", apiClientId: "1", apiSecretKey: "1" }
      sandbox.stub(reader, 'getUsers').returns([user]);
      return userRepository.getMatchingUser(user.apiClientId, user.apiSecretKey)
      .then((matchedUser)=>{
        expect(matchedUser.id).to.be.equal(user.id);
      })
    });
  });

  describe("When a matching user with a clientId and secretKey does NOT exist", ()=>{
    it("Should return null",()=> {
      const user = { id: "1", apiClientId: "1", apiSecretKey: "1" }
      sandbox.stub(reader, 'getUsers').returns([]);
      return userRepository.getMatchingUser(user.apiClientId, user.apiSecretKey)
      .then((matchedUser)=>{
        expect(matchedUser).to.be.null;
      })
    });
  });
});
