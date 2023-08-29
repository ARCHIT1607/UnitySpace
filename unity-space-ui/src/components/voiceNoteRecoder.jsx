import { AudioRecorder } from 'react-audio-voice-recorder';
import axios from 'axios';
import { useSelector } from 'react-redux';
const VoiceNoteRecorder = () => {
  const token = useSelector((state) => state.token.token);
  const sid = useSelector((state) => state.user.sid);
  const handleAudioStop = async (data) => {
    console.log("voiceNoteRecorder", data);
    const file = new Blob([data], { type: 'application/octet-stream' });
    const formData = new FormData();
    formData.append('file', file, 'voice_note.webm');
    try {
      const response = await axios.post(window.API_URL+"/auth/send-email", formData, {
        params:{
          to:sid
        },
        headers: {
          'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <AudioRecorder
        onRecordingComplete={(data) => handleAudioStop(data)}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        onNotAllowedOrFound={(err) => console.table(err)}
        // downloadOnSavePress={true}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        showVisualizer={true}
      />
      <br />
    </div>
  );
};

export default VoiceNoteRecorder;