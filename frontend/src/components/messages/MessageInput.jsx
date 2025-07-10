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

  // Image attachment state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();

  // Audio recording handlers
  const handleMicMouseDown = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      let chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          await sendMessage(base64Audio, "audio", `audio_${Date.now()}.webm`);
        };
        reader.readAsDataURL(blob);
        setMediaRecorder(null);
        setRecording(false);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      alert("Microphone permission denied or not available.");
    }
  };

  const handleMicMouseUp = () => {
    if (mediaRecorder && recording) {
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
    <form className="px-4 py-4" style={{ backgroundColor: '#393E46', borderTop: '2px solid #00ADB5' }} onSubmit={handleSubmit}>
      {/* Image preview */}
      {imagePreview && (
        <div className="flex items-center mb-4 p-3 rounded-lg" style={{ backgroundColor: '#222831' }}>
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-[120px] max-h-[120px] rounded-lg mr-4"
            style={{ border: '2px solid #00ADB5' }}
          />
          <button
            type="button"
            className="px-4 py-2 rounded-lg mr-2 font-semibold"
            style={{ backgroundColor: '#00ADB5', color: '#222831' }}
            onClick={sendImage}
          >
            Send Image
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg font-semibold"
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
      <div className="w-full relative flex items-center gap-3">
        <input
          type="text"
          className="text-sm rounded-lg block w-full p-3"
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
          className="p-3 rounded-full transition-colors"
          style={{ backgroundColor: recording ? "#dc2626" : "transparent" }}
          onMouseDown={handleMicMouseDown}
          onMouseUp={handleMicMouseUp}
          onMouseLeave={handleMicMouseUp}
          title={recording ? "Recording... Release to send" : "Hold to record audio"}
          onMouseEnter={(e) => {
            if (!recording) e.target.style.backgroundColor = '#222831';
          }}
          onMouseLeave={(e) => {
            if (!recording) e.target.style.backgroundColor = 'transparent';
          }}
        >
          <FaMicrophone color={recording ? "#EEEEEE" : "#00ADB5"} size={20} />
        </button>
        <label className="p-3 rounded-full transition-colors cursor-pointer" title="Send Image"
               onMouseEnter={(e) => e.target.style.backgroundColor = '#222831'}
               onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleAttachmentUpload}
          />
          <FaPaperclip color="#00ADB5" size={20} />
        </label>
        <button type="submit" className="p-3 rounded-full transition-colors" style={{ backgroundColor: '#00ADB5' }}>
          {loading ? (
            <div className="loading loading-spinner w-5 h-5"></div>
          ) : (
            <BsSend color="#222831" size={20} />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
