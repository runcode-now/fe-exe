import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams để lấy eventeventId từ URL
import axios from "axios"; // Import axios để gọi API

const CalenderDetail = () => {
    const { eventId } = useParams(); // Lấy eventeventId từ URL
    const [loading, setLoading] = useState(true);

    // Sử dụng useState để quản lý sự kiện
    const [events, setEvents] = useState([]);

    // Tạo hàm random color
    const getRandomColor = () => {
        const colors = ["#FFB3B3", "#FFEB99", "#B3FF99", "#99CCFF", "#FFD1E6", "#D1F2FF", "#E3F9E5", "#FFECF0", "#FFE0B2", "#C5CAE9"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    useEffect(() => {
        fetchEventDetails(); // Gọi API khi component được render

        if (eventId) {
            fetchEventDetails(); // Gọi API khi có eventId
        }
    }, [eventId]); // Chạy lại khi eventeventId thay đổi

    const fetchEventDetails = async () => {
        try {
            setLoading(true); // Set loading true khi bắt đầu gọi API
            const response = await axios.get(`http://103.179.185.149:8435/api/Agenda/getByEvent/${eventId}`); // Gọi API lấy chi tiết sự kiện

            // Trích xuất dữ liệu từ API response
            const { message, data } = response.data;
            console.log("API Response:", data);
            if (Array.isArray(data)) {
                const formattedEvents = data.map(event => {
                    // Lấy phần thời gian mà không có microseconds
                    const timeString = event.timeStart.split('.')[0]; // Chỉ giữ phần trước dấu chấm (giờ:phút:giây)
                    
                    // Chuyển đổi chuỗi thời gian thành đối tượng Date và lấy giờ phút (không có AM/PM)
                    const eventDate = new Date(`1970-01-01T${timeString}Z`); // Tạo đối tượng Date
                
                    // Trừ đi 8 giờ
                    eventDate.setHours(eventDate.getHours() - 8);  // Trừ đi 8 giờ
                
                    // Lấy thời gian sau khi trừ đi 8 giờ
                    const eventStartTime = eventDate.toLocaleTimeString([], {
                        hour: '2-digit',  // Lấy giờ
                        minute: '2-digit',  // Lấy phút
                        hour12: false, // Sử dụng định dạng 24 giờ, không có AM/PM
                    });
                
                    return {
                        title: event.description, // Mô tả sự kiện
                        start: eventStartTime, // Thời gian bắt đầu chỉ lấy giờ và phút (không có AM/PM)
                        color: getRandomColor(), // Màu sắc ngẫu nhiên cho sự kiện
                        textColor : "#FFF"
                    };
                });
            
                setEvents(formattedEvents); // Cập nhật events
            } else {
                console.error("Dữ liệu không hợp lệ hoặc không phải mảng");
            }
        } catch (error) {
            console.error("Error fetching event details:", error);
        } finally {
            console.log("Finally block executed");
            setLoading(false); // Set loading false khi hoàn thành
        }
    };

    // Kiểm tra trạng thái loading
    if (loading) {
        return <div>Đang tải dữ liệu...</div>; // Hiển thị khi đang tải dữ liệu
    }

    if (!events.length) {
        return <div>Không có sự kiện để hiển thị.</div>; // Hiển thị khi không có dữ liệu sự kiện
    }

    return (
        <div style={{ padding: "20px", backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Agenda</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                {events.map((event, index) => (
                    <tr key={index} style={{ marginBottom: "20px" }}>
                        <td
                            style={{
                                paddingLeft: "10px",
                                borderRight: "1px soleventId #ddd",
                                width: "5%",
                                paddingRight: "30px",
                                verticalAlign: "top",
                                textAlign: "right",
                            }}
                        >
                            {event.start}
                        </td>
                        <td
                            style={{
                                padding: "5px",
                                borderTop: "1px soleventId #FFF",
                                borderBottom: "1px soleventId #FFF",
                                width: "95%",
                                verticalAlign: "meventIddle",
                            }}
                        >
                            <div
                                style={{
                                    height: "80px",
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: event.color,
                                    color: "#000",
                                    borderRadius: "2px",
                                }}
                            >
                                <span style={{ fontSize: "14px", marginRight: "8px", marginLeft: "10px" }}>⚠️</span>
                                <span>{event.title}</span>
                            </div>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default CalenderDetail;
