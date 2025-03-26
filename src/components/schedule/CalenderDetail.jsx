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
        const colors = [
          "#FFB3B3", // Pink (chẳng hạn dùng cho sự kiện nữ)
          "#FFEB99", // Light Yellow (sự kiện vui tươi, như lễ hội)
          "#B3FF99", // Light Green (sự kiện thiên nhiên, môi trường)
          "#99CCFF", // Light Blue (sự kiện mang tính học hỏi hoặc hòa bình)
          "#FFD1E6", // Soft Pink (sự kiện gia đình, sinh nhật)
          "#D1F2FF", // Light Blue (sự kiện sáng tạo, như hội thảo, triển lãm)
          "#E3F9E5", // Light Green (sự kiện thể thao, outdoor)
          "#FFECF0", // Very Soft Pink (sự kiện nhỏ, thân mật)
          "#FFE0B2", // Peach (sự kiện dành cho trẻ em)
          "#C5CAE9", // Light Purple (sự kiện sang trọng hoặc tiệc tối)
          "#FF6347", // Tomato Red (sự kiện thể thao, sôi động)
          "#32CD32", // Lime Green (sự kiện ngoại trời, thể thao, outdoor)
          "#FF4500", // Orange Red (sự kiện năng động, mạnh mẽ)
          "#8A2BE2", // Blue Violet (sự kiện nghệ thuật, sáng tạo)
          "#FFD700", // Gold (sự kiện sang trọng, lễ trao giải)
          "#8B0000", // Dark Red (sự kiện nghiêm túc, tưởng niệm)
          "#20B2AA", // Light Sea Green (sự kiện thư giãn, wellness)
          "#ADFF2F", // Green Yellow (sự kiện sức khỏe, môi trường)
          "#FF1493", // Deep Pink (sự kiện đặc biệt, nữ quyền)
          "#00BFFF", // Deep Sky Blue (sự kiện liên quan đến công nghệ, đổi mới)
        ];
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
            console.log(response)
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
