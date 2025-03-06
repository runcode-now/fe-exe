import React, { useState } from "react";
import "./styles/ChatBoxContainer.css";

const InputArea = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="input-area">
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a new message here"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default InputArea;
