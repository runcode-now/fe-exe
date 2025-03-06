import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate
import "react-big-calendar/lib/css/react-big-calendar.css";
import './styles/Calendar.css';

const localizer = momentLocalizer(moment);


const getRandomColor = () => {
  const colors = ["red", "blue", "green", "orange", "purple", "pink", "brown", "teal"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Calender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // Hook điều hướng
  const { userId } = useParams(); // Lấy ID từ URL

  const API_URL = `http://103.179.185.149:8435/api/Event/getByOrganizer/${userId}`; // API danh sách sự kiện
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_URL);

      const { message, data } = response.data; 
      console.log("API Response:", data);

      if (!Array.isArray(data)) {
        throw new Error("API response data is not an array");
      }
      console.log("API Response:", data);
      const formattedEvents = data.map(event => ({
        id: event.eventId, // Lưu ID để dùng khi click vào event
        title: event.eventName, 
        start: moment(event.startDate).toDate(),
        end: moment(event.endDate).toDate(),
        color: getRandomColor(),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  console.log("Selected event:", events);

  // Xử lý khi click vào event
  const handleSelectEvent = async (events) => {
    try {
      navigate(`/displayEvent/${events.id}`);
    } catch (error) {
      console.error("Error fetching agenda:", error);
    }
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: "transparent",
      color: event.color,
    };
    return { style };
  };

  const components = {
    event: ({ event }) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: "14px", marginRight: "5px" }}>•</span>
        <span style={{ color: event.color }}>{event.title}</span>
      </div>
    )
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setCurrentDate(newDate);
  };

  return (
    <div style={{ height: "80vh", padding: "20px " }}>
      <div style={{ backgroundColor: "#F2F2F7", padding: "15px", marginBottom: "10px" }}>
        <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #FFA07A", borderRadius: "10px", padding: "5px", backgroundColor: "#FFF" }}>
          <button onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'month').toDate())} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", color: "#FF4500" }}>❮</button>
          <input
            type="month"
            value={moment(currentDate).format("YYYY-MM")}
            onChange={handleDateChange}
            style={{ padding: "5px", border: "none", fontFamily: "sans-serif", fontSize: "13px", fontWeight: "bold", textAlign: "center" }}
          />
          <button onClick={() => setCurrentDate(moment(currentDate).add(1, 'month').toDate())} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", color: "#FF4500" }}>❯</button>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        eventPropGetter={eventStyleGetter}
        views={{ month: true }}
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        onSelectEvent={handleSelectEvent} // Khi click vào event, gọi hàm này
        toolbar={false}
        components={components}
      />
    </div>
  );
};

export default Calender;
