import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AssignmentViewer from "./pages/AssignmentViewer";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="assignment-viewer" element={<AssignmentViewer />} />
          <Route path="student-dashboard" element={<StudentDashboard />} />
          <Route path="teacher-dashboard" element={<TeacherDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}