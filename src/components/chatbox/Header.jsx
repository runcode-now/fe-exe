import React from 'react';
import './styles/ChatBoxContainer.css';

const Header = () => {
  return (
    <div className="header">
      <img src="path-to-avatar-image" alt="Avatar" className="avatar" />
      <span className="chat-title">EventSet</span>
      <span className="subtitle">AI Chatbot Assistant</span>
    </div>
  );
};

export default Header;
