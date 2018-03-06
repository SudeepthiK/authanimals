const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const animalsRepository = require('../../app/repositories/animals');
const reader = require('../../app/resources/reader');


describe("Given animals repository",()=>{
  beforeEach(()=>{
    sandbox = sinon.sandbox.create();
  });
  afterEach(()=>{
    sandbox.restore();
  });

  describe("When animals for a given user exist", ()=>{
    it("Should return all animals grouped by type for that user ",()=> {
      const userId = "test1"
      const animals = [
        { "apiUserId": userId, "type": "dog", "name": "Max" },
        { "apiUserId": userId, "type": "cat", "name": "Max" },
        { "apiUserId": "test2", "type": "dog", "name": "Max" }
      ]
      sandbox.stub(reader, 'getAnimals').returns(animals);
      return animalsRepository.getAnimalsGroupedByType(userId)
      .then((matchedAnimals)=>{
        expect(Object.keys(matchedAnimals).length).to.be.equal(2);
        expect(matchedAnimals["dog"][0]).to.be.equal(animals[0].name);
        expect(matchedAnimals["cat"][0]).to.be.equal(animals[1].name);
      })
    });
  });

  describe("When animals for a given user do NOT exist", ()=>{
    it("Should return all animals grouped by type for that user ",()=> {
      const userId = "test1"
      const animals = [
        { "apiUserId": "test2", "type": "dog", "name": "Max" }
      ]
      sandbox.stub(reader, 'getAnimals').returns(animals);
      return animalsRepository.getAnimalsGroupedByType(userId)
      .then((matchedAnimals)=>{
        expect(Object.keys(matchedAnimals).length).to.be.equal(0);
      });
    });
  });
});
