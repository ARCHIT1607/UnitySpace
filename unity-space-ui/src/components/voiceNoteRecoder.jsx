import { AudioRecorder } from 'react-audio-voice-recorder';
import axios from 'axios';
import { useSelector } from 'react-redux';
const VoiceNoteRecorder = () => {
  const token = useSelector((state) => state.token);
  const handleAudioStop = async (data) => {
    console.log("voiceNoteRecorder", data);
    const file = new Blob([data], { type: 'application/octet-stream' });
    const formData = new FormData();
    formData.append('file', file, 'voice_note.webm');
    try {
      const response = await axios.post('http://localhost:9000/auth/send-email', formData, {
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