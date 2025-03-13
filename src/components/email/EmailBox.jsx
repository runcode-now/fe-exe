import React, { useState } from "react";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import emailjs from "emailjs-com";
import "./styles/EmailBox.css";

const EmailBox = () => {
  const [emailContent, setEmailContent] = useState("");
  const [emailTitle, setEmailTitle] = useState("");

  const handleSendFeedback = () => {
    const templateParams = {
      to_name: "eventsetonline@gmail.com",
      title: emailTitle,
      message: emailContent,
    };
    emailjs
      .send(
        "service_hz6pc5i",
        "template_tw2so5g",
        templateParams,
        "2_c9yD0b-Cu3_Fige"
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          alert("Feedback sent successfully!");
          setEmailContent("");
          setEmailTitle("");
        },
        (error) => {
          console.error("Error sending email:", error);
          alert("Something went wrong, please try again.");
        }
      );
  };

  return (
    <div className="email-box-container">
      <h1 className="email-box-title">Email feedback</h1>
      <form onSubmit={(e) => e.preventDefault()} className="email-box-form">
        <div className="title-container">
          <input
            type="text"
            value={emailTitle}
            onChange={(e) => setEmailTitle(e.target.value)}
            placeholder="Enter email title..."
            className="title-input"
          />
        </div>
        <div className="quill-container">
          <Editor
            value={emailContent}
            onTextChange={(e) => setEmailContent(e.htmlValue || "")}
            placeholder="Type your feedback here..."
            theme="snow"
            style={{ minHeight: "500px", width: "100%" }}
            className="quill-editor"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "right" }}>
          <button
            type="button"
            className="send-button"
            onClick={handleSendFeedback}
          >
            Send Feedback
          </button>
        </div>

      </form>
    </div>
  );
};

export default EmailBox;