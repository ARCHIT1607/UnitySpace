import axios from 'axios';

const API_KEY = '';
const API_URL = '';

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