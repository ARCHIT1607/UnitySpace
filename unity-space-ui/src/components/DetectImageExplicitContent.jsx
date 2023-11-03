import axios from 'axios';

const API_KEY = '';
const API_URL = '';

const DetectImageExplicitContent = async (image) => {
  console.log("eden api result ",image);
  const formData = new FormData();
  formData.append('providers', 'google');
  formData.append('file', image);
  formData.append("response_as_dict",false);

  const response = await axios.post(API_URL, formData, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
}

export default DetectImageExplicitContent;