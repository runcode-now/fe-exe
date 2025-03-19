import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatBoxContainer = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messageAreaRef = useRef(null);

  const handleSendMessage = async (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "user" },
    ]);

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
        throw new Error(`Failed to get response from Gemini: ${response.statusText}`);
      }

      const data = await response.json();
      const geminiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, no valid response received.";

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: geminiResponse, sender: "gemini" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong.", sender: "gemini" },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      handleSendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTo({
        top: messageAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="chatbox-floating">
      {/* Nút mở khung chat khi thu gọn */}
      {!isChatOpen && (
        <div
          className="chatbox-toggle"
          onClick={() => setIsChatOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ff9800",
            color: "#fff",
            padding: "10px",
            borderRadius: "25px",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease",
          }}
        >
          <img
            src="https://img.freepik.com/freevector/graident-ai-robot-vectorart_78370-4114.jpg"
            alt="Chat Icon"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "8px",
            }}
          />
          <span style={{ fontWeight: "bold" }}>Chat</span>
        </div>
      )}

      {/* Khung chat khi mở */}
      {isChatOpen && (
        <div
          className="chatbox-container"
          style={{
            width: "500px",
            height: "600px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="header"
            style={{
              backgroundColor: "#ff9800",
              color: "#fff",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <img
              src="https://img.freepik.com/freevector/graident-ai-robot-vectorart_78370-4114.jpg"
              alt="Avatar"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>EventSet</span>
            <span style={{ fontSize: "12px", marginLeft: "5px", opacity: 0.8 }}>
              AI Chatbot Assistant
            </span>
            <button
              onClick={() => setIsChatOpen(false)}
              style={{
                position: "absolute",
                right: "10px",
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Message Area */}
          <div
            ref={messageAreaRef}
            className="message-area"
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender}`}
                style={{
                  margin: "8px 0",
                  maxWidth: "80%",
                  ...(message.sender === "user"
                    ? { marginLeft: "auto" }
                    : { marginRight: "auto" }),
                  display: "flex",
                  alignItems: "flex-end",
                  flexDirection: message.sender === "user" ? "row-reverse" : "row",
                }}
              >
                {message.sender === "gemini" && (
                  <img
                    src="https://img.freepik.com/freevector/graident-ai-robot-vectorart_78370-4114.jpg"
                    alt="AI Avatar"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                )}
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px 15px",
                    borderRadius: "15px",
                    backgroundColor: message.sender === "user" ? "#ff9800" : "#e0e0e0",
                    color: message.sender === "user" ? "#fff" : "#333",
                    wordWrap: "break-word",
                  }}
                >
                  <ReactMarkdown
                    children={message.text}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p
                          style={{
                            margin: 0, 
                            lineHeight: "1.5",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      table: ({ children }) => (
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginBottom: "20px",
                          }}
                        >
                          {children}
                        </table>
                      ),
                      th: ({ children }) => (
                        <th
                          style={{
                            padding: "10px",
                            backgroundColor: "#f0f0f0",
                            textAlign: "center",
                            border: "1px solid #ddd",
                          }}
                        >
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td
                          style={{
                            padding: "8px",
                            textAlign: "center",
                            border: "1px solid #ddd",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          {children}
                        </td>
                      ),
                      tr: ({ children }) => <tr>{children}</tr>,
                    }}
                  />

                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div
            className="input-area"
            style={{
              borderTop: "1px solid #ddd",
              padding: "10px",
              backgroundColor: "#fff",
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", alignItems: "center" }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  outline: "none",
                  fontSize: "14px",
                  fontFamily: "'Roboto', sans-serif",
                  resize: "none",
                  minHeight: "40px",
                  maxHeight: "100px",
                  overflowY: "auto",
                  lineHeight: "1.5",
                }}
              />
              <button
                type="submit"
                style={{
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  marginLeft: "10px",
                  borderRadius: "50%", // Bo tròn thành hình tròn
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  width: "40px", // Kích thước cố định
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3106/3106794.png" // Icon gửi tin nhắn (mũi tên giấy)
                  alt="Send Icon"
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
              </button>
            </form>
          </div>
        </div>
      )}
      <style jsx>{`
        .chatbox-floating {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .chatbox-toggle:hover {
          background-color: #f4511e;
        }

        .input-area button:hover {
          background-color: #f4511e;
        }
      `}</style>
    </div>
  );
};

export default ChatBoxContainer;