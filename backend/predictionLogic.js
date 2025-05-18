const svc = require('./models/svc');

const symptomsDict = {
  fever: 0,
  headache: 1,
  cough: 2,
  cold: 3
};

const diseasesList = {
  0: 'Common Cold'
};

function getPredictedValue(patientSymptoms) {
  const inputVector = new Array(Object.keys(symptomsDict).length).fill(0);
  patientSymptoms.forEach(item => {
    if (symptomsDict[item] !== undefined) {
      inputVector[symptomsDict[item]] = 1;
    }
  });

  const predictedIndex = svc.predict([inputVector])[0];
  return diseasesList[predictedIndex];
}

function helper(disease) {
  return {
    description: 'A viral infection of your nose and throat.',
    precautions: ['Rest', 'Hydrate', 'Use tissues'],
    medications: ['Paracetamol', 'Cough Syrup'],
    diet: ['Soups', 'Warm liquids'],
    workout: ['Light stretching', 'Rest']
  };
}

module.exports = { getPredictedValue, helper };
