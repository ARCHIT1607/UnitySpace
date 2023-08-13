import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTAzMTc5MTQtZjU3MS00ZDU5LWE3ODktYjU1YWE5MTRhN2ZhIiwidHlwZSI6ImFwaV90b2tlbiJ9.I3ATFdVlpK3FhSJmDgSUU4y-5PWKW_R--UVI_NBNCv0';
const API_URL = 'https://api.edenai.run/v2/image/explicit_content';

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