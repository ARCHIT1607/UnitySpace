import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTAzMTc5MTQtZjU3MS00ZDU5LWE3ODktYjU1YWE5MTRhN2ZhIiwidHlwZSI6ImFwaV90b2tlbiJ9.I3ATFdVlpK3FhSJmDgSUU4y-5PWKW_R--UVI_NBNCv0';
const API_URL = 'https://api.edenai.run/v2/text/sentiment_analysis';

const SentimentAnalysis = async (text) => {
  console.log("eden api text ",text);
  const formData = new FormData();
  formData.append('providers', 'amazon');
  formData.append('text', text);
  formData.append("language","en");
  formData.append("response_as_dict",false);

  const response = await axios.post(API_URL, formData, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

export default SentimentAnalysis;