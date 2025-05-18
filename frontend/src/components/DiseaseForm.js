// import React, { useState } from 'react';
// import { getDiseasePrediction } from '../api/diseaseApi';

// const DiseaseForm = () => {
//     const [symptoms, setSymptoms] = useState('');
//     const [prediction, setPrediction] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const result = await getDiseasePrediction(symptoms.split(','));
//         setPrediction(result);
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     value={symptoms}
//                     onChange={(e) => setSymptoms(e.target.value)}
//                     placeholder="Enter symptoms"
//                 />
//                 <button type="submit">Get Prediction</button>
//             </form>
//             {prediction && <div>Predicted Disease: {prediction}</div>}
//         </div>
//     );
// };

// export default DiseaseForm;
