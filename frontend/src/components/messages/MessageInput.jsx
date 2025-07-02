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
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      {/* Image preview before sending */}
      {imagePreview && (
        <div className="flex items-center mb-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-[120px] max-h-[120px] rounded-lg border mr-4"
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={sendImage}
          >
            Send Image
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setImagePreview(null);
              setImageFile(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <div className="w-full relative flex items-center gap-2">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {/* Audio message button (hold to record) */}
        <button
          type="button"
          className="ml-2"
          onMouseDown={handleMicMouseDown}
          onMouseUp={handleMicMouseUp}
          onMouseLeave={handleMicMouseUp}
          title={recording ? "Recording... Release to send" : "Hold to record audio"}
          style={{ background: recording ? "#fee2e2" : "transparent", borderRadius: "50%" }}
        >
          <FaMicrophone color={recording ? "red" : "white"} />
        </button>
        {/* Attachment button */}
        <label className="ml-2 cursor-pointer" title="Send Image">
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleAttachmentUpload}
          />
          <FaPaperclip color="white" />
        </label>
        <button type="submit" className="ml-2">
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <BsSend />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
