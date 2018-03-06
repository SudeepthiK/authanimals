const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const animalsRepository = require('../../app/repositories/animals');
const animalsService = require('../../app/services/animals');

describe("Animals service",()=>{
  beforeEach(()=>{
    sandbox = sinon.sandbox.create();
  });
  afterEach(()=>{
    sandbox.restore();
  });

  function checkExpectsForAnimalType(value, type, matchingAnimals) {
    const animals = value.animals.filter((animal)=>animal.type === type);
    let index = 0;
    return animals[0].names.forEach((a)=>{
      expect(a).to.be.equal(matchingAnimals[type][index]);
      index++;
    });
  }
  describe("Given that animals are present for a given userId",()=>{
    it("Should get the animals grouped by type",()=>{
      const userId = "1";
      const matchingAnimals = {
        "dog": ["Lambda", "Theta"],
        "cat": ["Haskell", "Curry"]
      };
      sandbox.stub(animalsRepository, 'getAnimalsGroupedByType').returns(Promise.resolve(matchingAnimals));
      return animalsService.getAnimalsForUser(userId)
      .then((value)=>{
        expect(value.apiUserId).to.be.equal(userId);
        expect(value.animals.length).to.be.equal(2);
        checkExpectsForAnimalType(value, "dog", matchingAnimals);
        checkExpectsForAnimalType(value, "cat", matchingAnimals);
      })
    });
  });

  describe("Given that animals are NOT present for a given userId",()=>{
    it("Should return empty array of animals",()=>{
      const userId = "1";
      sandbox.stub(animalsRepository, 'getAnimalsGroupedByType').returns(Promise.resolve({}));
      return animalsService.getAnimalsForUser(userId)
      .then((value)=>{
        expect(value.apiUserId).to.be.equal(userId);
        expect(value.animals.length).to.be.equal(0);
      })
    });
  });
})
