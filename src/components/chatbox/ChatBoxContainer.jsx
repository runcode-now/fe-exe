import React, { useState } from "react";
import Header from "./Header";
import MessageArea from "./MessageArea";
import InputArea from "./InputArea";
import "./styles/ChatBoxContainer.css";
import { useSidebar } from "../common/SidebarProvider";

const ChatBoxContainer = () => {
  const [messages, setMessages] = useState([]);
  const { isSidebarOpen } = useSidebar();

  const handleSendMessage = async (message) => {
    // Cập nhật tin nhắn người dùng
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "user" },
    ]);

    // Gửi yêu cầu đến Gemini API
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDFWLgnBucSvGbu4MKJV0rlZUDD1FQhDpM",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: message,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to get response from Gemini: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Kiểm tra và lấy phản hồi từ Gemini
      const geminiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, no valid response received.";

      // Cập nhật tin nhắn từ Gemini
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: geminiResponse, sender: "gemini" }, // Thêm phản hồi từ Gemini vào
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong.", sender: "gemini" },
      ]);
    }
  };

  return (
    <div
      className="chatbox-container"
      style={{
        height: "80vh",
        width: "90%",
        transition: "margin-left 0.3s ease",
        margin: "0 auto",
        marginTop: "40px",
      }}
    >
      <Header />
      <MessageArea messages={messages} />
      <InputArea onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatBoxContainer;
