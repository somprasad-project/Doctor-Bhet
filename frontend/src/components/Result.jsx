import React from "react";

const Results = ({ data }) => {
  if (!data) return null;

  return (
    <div>
      <h2>Prediction Results</h2>
      <h3>Disease: {data.predicted_disease}</h3>
      <p>Description: {data.description}</p>
      <h4>Precautions:</h4>
      <ul>
        {data.precautions.map((precaution, index) => (
          <li key={index}>{precaution}</li>
        ))}
      </ul>
      <h4>Medications:</h4>
      <ul>
        {data.medications.map((medication, index) => (
          <li key={index}>{medication}</li>
        ))}
      </ul>
      <h4>Diet Recommendations:</h4>
      <ul>
        {data.diet.map((diet, index) => (
          <li key={index}>{diet}</li>
        ))}
      </ul>
      <h4>Workout Recommendations:</h4>
      <ul>
        {data.workouts.map((workout, index) => (
          <li key={index}>{workout}</li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
