import React, { useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { FaMicrophone, FaPaperclip } from "react-icons/fa";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  // Audio recording state
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingStartTime, setRecordingStartTime] = useState(null);

  // Image attachment state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();

  // Audio recording handlers
  const handleMicMouseDown = async () => {
    try {
      console.log('Starting audio recording...');
      
      // Request audio permission with better constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 48000,
          sampleSize: 16,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log('Audio stream obtained');
      
      // Check for supported MIME types
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/wav';
          }
        }
      }
      
      console.log('Using MIME type:', mimeType);
      
      const options = {
        mimeType: mimeType,
        audioBitsPerSecond: 128000
      };
      
      const recorder = new MediaRecorder(stream, options);
      let chunks = [];
      
      recorder.ondataavailable = (e) => {
        console.log('Data available:', e.data.size, 'bytes');
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = async () => {
        console.log('Recording stopped, total chunks:', chunks.length);
        
        try {
          if (chunks.length === 0) {
            console.error('No audio chunks recorded');
            alert("No audio was recorded. Please try again.");
            return;
          }
          
          const blob = new Blob(chunks, { type: mimeType });
          console.log('Created blob:', blob.size, 'bytes, type:', blob.type);
          
          if (blob.size === 0) {
            console.error('Audio blob is empty');
            alert("Recording failed - no audio data captured.");
            return;
          }
          
          // Calculate recording duration
          const recordingDuration = Date.now() - recordingStartTime;
          console.log('Recording duration:', recordingDuration, 'ms');
          
          if (recordingDuration < 500) {
            console.error('Recording too short');
            alert("Recording too short. Please hold the button longer.");
            return;
          }
          
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64Audio = reader.result;
              console.log('Base64 audio length:', base64Audio.length);
              
              if (!base64Audio || base64Audio.length < 100) {
                console.error('Base64 conversion failed or too small');
                alert("Failed to process audio recording.");
                return;
              }
              
              const fileName = `audio_${Date.now()}.${mimeType.includes('webm') ? 'webm' : mimeType.includes('mp4') ? 'mp4' : 'wav'}`;
              console.log('Sending audio with filename:', fileName);
              
              await sendMessage(base64Audio, "audio", fileName);
            } catch (error) {
              console.error('Error sending audio:', error);
              alert("Failed to send audio message: " + error.message);
            }
          };
          
          reader.onerror = () => {
            console.error('FileReader error');
            alert("Failed to process audio file.");
          };
          
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error processing recording:', error);
          alert("Failed to process recording: " + error.message);
        } finally {
          // Clean up stream
          stream.getTracks().forEach(track => {
            console.log('Stopping track:', track.kind);
            track.stop();
          });
          setMediaRecorder(null);
          setRecording(false);
          setRecordingStartTime(null);
        }
      };
      
      recorder.onerror = (e) => {
        console.error('MediaRecorder error:', e.error);
        alert("Recording error: " + e.error);
        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
        setRecordingStartTime(null);
      };
      
      recorder.onstart = () => {
        console.log('Recording started');
        setRecordingStartTime(Date.now());
      };
      
      // Start recording with time slice for better data capture
      recorder.start(250); // Collect data every 250ms
      setMediaRecorder(recorder);
      setRecording(true);
      
      console.log('MediaRecorder started, state:', recorder.state);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert("Microphone access denied or not available: " + err.message);
      setRecording(false);
      setRecordingStartTime(null);
    }
  };

  const handleMicMouseUp = () => {
    console.log('Mouse up event, recording:', recording);
    if (mediaRecorder && recording && mediaRecorder.state === 'recording') {
      console.log('Stopping recording...');
      mediaRecorder.stop();
    }
  };

  // Image attachment handlers
  const handleAttachmentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const sendImage = async () => {
    if (!imagePreview || !imageFile) return;
    await sendMessage(imagePreview, "image", imageFile.name);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message, "text");
    setMessage("");
  };

  return (
    <form className="px-6 py-4" style={{ backgroundColor: '#393E46', borderTop: '2px solid #00ADB5' }} onSubmit={handleSubmit}>
      {/* Image preview */}
      {imagePreview && (
        <div className="flex items-center mb-4 p-4 rounded-lg max-w-2xl" style={{ backgroundColor: '#222831' }}>
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-[150px] max-h-[150px] rounded-lg mr-4"
            style={{ border: '2px solid #00ADB5' }}
          />
          <button
            type="button"
            className="px-6 py-3 rounded-lg mr-3 font-semibold text-lg"
            style={{ backgroundColor: '#00ADB5', color: '#222831' }}
            onClick={sendImage}
          >
            Send Image
          </button>
          <button
            type="button"
            className="px-6 py-3 rounded-lg font-semibold text-lg"
            style={{ backgroundColor: '#dc2626', color: '#EEEEEE' }}
            onClick={() => {
              setImagePreview(null);
              setImageFile(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      
      <div className="w-full relative flex items-center gap-4 max-w-4xl mx-auto">
        <input
          type="text"
          className="text-base rounded-lg block w-full p-4"
          style={{ 
            backgroundColor: '#222831', 
            borderColor: '#00ADB5', 
            border: '2px solid #00ADB5',
            color: '#EEEEEE'
          }}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        
        <button
          type="button"
          className="p-4 rounded-full transition-colors relative"
          style={{ 
            backgroundColor: recording ? "#dc2626" : "transparent",
            border: recording ? "2px solid #EEEEEE" : "2px solid transparent"
          }}
          onMouseDown={handleMicMouseDown}
          onMouseUp={handleMicMouseUp}
          onMouseLeave={handleMicMouseUp}
          onTouchStart={handleMicMouseDown}
          onTouchEnd={handleMicMouseUp}
          title={recording ? "Recording... Release to send" : "Hold to record audio"}
        >
          <FaMicrophone 
            color={recording ? "#EEEEEE" : "#00ADB5"} 
            size={22} 
          />
          {recording && (
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </button>
        
        <label 
          className="p-4 rounded-full transition-colors cursor-pointer" 
          title="Send Image"
          onMouseEnter={(e) => e.target.style.backgroundColor = '#222831'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleAttachmentUpload}
          />
          <FaPaperclip color="#00ADB5" size={22} />
        </label>
        
        <button type="submit" className="p-4 rounded-full transition-colors" style={{ backgroundColor: '#00ADB5' }}>
          {loading ? (
            <div className="loading loading-spinner w-6 h-6"></div>
          ) : (
            <BsSend color="#222831" size={22} />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
