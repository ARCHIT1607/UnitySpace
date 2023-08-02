import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWRjZDAxYTktN2I0NS00MzA2LWIwNWEtNTRlYjQ1MTExNmI3IiwidHlwZSI6InNhbmRib3hfYXBpX3Rva2VuIn0.5KgooGB6v2rsTKrPF2PTevjtC1FeEr3a_NX8ErnTt_o';
const API_URL = 'https://api.edenai.run/v2/image/explicit_content';

const detectExplicitContent = async (image) => {
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