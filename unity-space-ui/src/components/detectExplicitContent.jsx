import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWRjZDAxYTktN2I0NS00MzA2LWIwNWEtNTRlYjQ1MTExNmI3IiwidHlwZSI6ImFwaV90b2tlbiJ9.MgNVNGEEGso-bDe4iwI76_A2BisQA03tMdhcviU1AK0';
const API_URL = 'https://api.edenai.run/v2/image/explicit_content';

const detectExplicitContent = async (image) => {
  console.log("eden api result ",image);
  const formData = new FormData();
  formData.append('providers', 'amazon');
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

export default detectExplicitContent;