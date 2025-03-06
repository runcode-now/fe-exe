import { Routes, Route } from "react-router-dom";
import Homee from "../home/Home";
import GenEventForm from "../event/GenEventForm";
import Agenda from "../event/Agenda";
import { SidebarProvider } from "../common/SidebarProvider";
import Layout from "../common/Layout";
import ChatBoxContainer from "../chatbox/ChatBoxContainer";
import DisplayInfoEvent from "../event/DisplayInfoEvent";
import ProtectedRoute from "../Authentication/ProtectedRoute";
import Calender from "../schedule/Calender";
import CalenderDetail from "../schedule/CalenderDetail";

function ComRoutes() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Homee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createEvent"
            element={
              <ProtectedRoute>
                <GenEventForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <ChatBoxContainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/displayEvent/:eventId"
            element={
              <ProtectedRoute>
                <DisplayInfoEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agenda/:eventId"
            element={
              <ProtectedRoute>
                <Agenda />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule/:userId"
            element={
              <ProtectedRoute>
                <Calender />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule-detail/:eventId"
            element={
              <ProtectedRoute>
                <CalenderDetail />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </SidebarProvider>
  );
}

export default ComRoutes;