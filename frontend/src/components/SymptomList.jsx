import React from 'react'

const SymptomList = ({ symptoms, onRemove, onAdd }) => {
    const commonSymptoms = [
      "headache", "fever", "cough", "fatigue", 
      "nausea", "dizziness", "rash", "sore throat"
    ];
  
    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {symptoms.map((symptom, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {symptom}
              <button 
                onClick={() => onRemove(symptom)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {commonSymptoms.map((symptom, index) => (
            !symptoms.includes(symptom) && (
              <button
                key={index}
                onClick={() => onAdd(symptom)}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200"
              >
                + {symptom}
              </button>
            )
          ))}
        </div>
      </div>
    );
  };
  
  export default SymptomList;