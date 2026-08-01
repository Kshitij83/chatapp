import { useRef, useState } from "react";
import { BsEmojiSmile, BsSend } from "react-icons/bs";
import { FaMicrophone, FaPaperclip, FaTimes } from "react-icons/fa";
import useSendMessage from "../../hooks/useSendMessage";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";
import { chatEmojis } from "../../utils/emojis";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { loading, sendMessage } = useSendMessage();
  const { selectedConversation } = useConversation();
  const { socket } = useSocketContext();
  const typingTimeout = useRef();

  const emitTyping = () => {
    if (!socket || !selectedConversation) return;
    socket.emit("typing", { receiverId: selectedConversation._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(
      () => socket.emit("stopTyping", { receiverId: selectedConversation._id }),
      1400
    );
  };

  const stopTyping = () => {
    if (!socket || !selectedConversation) return;
    clearTimeout(typingTimeout.current);
    socket.emit("stopTyping", { receiverId: selectedConversation._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    stopTyping();
    await sendMessage(message.trim(), "text");
    setMessage("");
    setShowEmoji(false);
  };

  // Audio recording state
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingStartTime, setRecordingStartTime] = useState(null);

  // Image attachment state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();

  const handleMicMouseDown = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          sampleSize: 16,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/mp4";
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = "audio/wav";
          }
        }
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });
      let chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        try {
          if (chunks.length === 0) return;

          const blob = new Blob(chunks, { type: mimeType });
          const recordingDuration = Date.now() - recordingStartTime;

          if (recordingDuration < 500) {
            alert("Recording too short. Please hold the button longer.");
            return;
          }

          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = reader.result;
            const fileName = `audio_${Date.now()}.${mimeType.includes("webm") ? "webm" : mimeType.includes("mp4") ? "mp4" : "wav"}`;
            await sendMessage(base64Audio, "audio", fileName);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          alert("Failed to process recording: " + error.message);
        } finally {
          stream.getTracks().forEach((track) => track.stop());
          setMediaRecorder(null);
          setRecording(false);
          setRecordingStartTime(null);
        }
      };

      recorder.onerror = (e) => {
        alert("Recording error: " + e.error);
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setRecordingStartTime(null);
      };

      recorder.onstart = () => setRecordingStartTime(Date.now());

      recorder.start(250);
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied or not available: " + err.message);
      setRecording(false);
      setRecordingStartTime(null);
    }
  };

  const handleMicMouseUp = () => {
    if (mediaRecorder && recording && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

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
    stopTyping();
    await sendMessage(imagePreview, "image", imageFile.name);
    setImagePreview(null);
    setImageFile(null);
  };

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  return (
    <>
      {/* Image preview */}
      {imagePreview && (
        <div className="px-4 pt-3">
          <div className="flex items-center gap-3 rounded-xl bg-surface-2 border border-[var(--border)] p-3 max-w-md">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <span className="text-sm text-ink-muted flex-1">Send this image?</span>
            <button
              onClick={sendImage}
              className="btn-primary !py-2 !px-4 text-sm"
            >
              Send
            </button>
            <button
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
              }}
              className="icon-btn icon-btn-danger !w-9 !h-9"
              title="Cancel"
            >
              <FaTimes size={13} />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-[var(--border)] bg-surface-2 relative"
      >
        {/* Emoji picker */}
        {showEmoji && (
          <div className="absolute bottom-20 left-4 right-4 sm:left-auto sm:w-[320px] rounded-2xl bg-surface-3 border border-[var(--border)] shadow-2xl p-3 animate-fade-up z-20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
                Emojis
              </span>
              <button
                type="button"
                onClick={() => setShowEmoji(false)}
                className="text-ink-muted hover:text-ink"
              >
                <FaTimes size={12} />
              </button>
            </div>
            <div className="emoji-grid max-h-44 overflow-y-auto">
              {chatEmojis.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  className="emoji-item"
                  onClick={() => addEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            className={`icon-btn ${showEmoji ? "!text-primary !bg-primary-soft !border-primary" : ""}`}
            title="Emoji"
          >
            <BsEmojiSmile size={19} />
          </button>

          <input
            type="text"
            className="input-modern flex-1 py-3"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              emitTyping();
            }}
          />

          <button
            type="button"
            className={`icon-btn ${recording ? "!bg-danger !text-white !border-danger" : ""}`}
            title={recording ? "Recording... release to send" : "Hold to record audio"}
            onMouseDown={handleMicMouseDown}
            onMouseUp={handleMicMouseUp}
            onMouseLeave={handleMicMouseUp}
            onTouchStart={handleMicMouseDown}
            onTouchEnd={handleMicMouseUp}
          >
            {recording ? (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
            ) : (
              <FaMicrophone size={18} />
            )}
          </button>

          <label className="icon-btn cursor-pointer" title="Send Image">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAttachmentUpload}
            />
            <FaPaperclip size={18} />
          </label>

          <button
            type="submit"
            className="icon-btn !bg-primary !text-[var(--bubble-out-text)] !border-primary"
            title="Send"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <BsSend size={18} />
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default MessageInput;
