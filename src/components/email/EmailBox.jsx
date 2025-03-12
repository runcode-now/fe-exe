import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import emailjs from "emailjs-com"; // Import emailjs
import "./styles/EmailBox.css"; // Để tùy chỉnh CSS

const EmailBox = () => {
  const [emailContent, setEmailContent] = useState("");

  // Hàm xử lý khi người dùng gửi feedback
  const handleSendFeedback = () => {
    // Thực hiện gửi email
    const templateParams = {
      to_name: "Website Owner", // Tên người nhận
      from_name: "Anonymous",   // Tên người gửi (ẩn danh)
      message: emailContent,    // Nội dung email
    };

    // Gửi email qua EmailJS
    emailjs
      .send(
        "your_service_id", // service ID của bạn từ EmailJS
        "your_template_id", // template ID của bạn từ EmailJS
        templateParams,
        "your_user_id" // User ID của bạn từ EmailJS
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          alert("Feedback sent successfully!");
        },
        (error) => {
          console.log("Error sending email:", error);
          alert("Something went wrong, please try again.");
        }
      );
  };

  return (
    <div className="email-box-container">
      <h2>Email Feedback</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="ckeditor-container">
          <CKEditor
            editor={ClassicEditor}
            data={emailContent}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEmailContent(data);
            }}
          />
        </div>
        <button
          type="button"
          className="send-button"
          onClick={handleSendFeedback}
        >
          Send Feedback
        </button>
      </form>
    </div>
  );
};

export default EmailBox;
