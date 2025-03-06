import React from 'react';
import './styles/ChatBoxContainer.css';

const MessageArea = ({ messages }) => {
  return (
    <div className="message-area">
      {messages.map((message, index) => (
        <div key={index} className={message.sender}>
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageArea;
