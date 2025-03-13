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
import Register from "../Authentication/Register";
import Login from "../Authentication/Login";
import ForgotPassword from "../Authentication/ForgotPassword";
import EmailBox from "../email/EmailBox";

function ComRoutes() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/email"
            element={
              <ProtectedRoute>
                <EmailBox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRoute>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
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
          {/* <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <ChatBoxContainer />
              </ProtectedRoute>
            }
          /> */}
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