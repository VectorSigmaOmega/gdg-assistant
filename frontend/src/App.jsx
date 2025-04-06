import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import AssignmentList from "./components/AssignmentList";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

function Home() {
  return (
    <div className="p-6 text-lg">
      <p>Welcome! Choose a dashboard or viewer from the navigation.</p>
    </div>
  );
}

function AssignmentViewer() {
  const [studentId, setStudentId] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedId(studentId);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assignment Viewer</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="border p-2 mr-2 rounded"
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-black px-4 py-2 rounded">
          Fetch Assignments
        </button>
      </form>
      {submittedId && <AssignmentList studentId={submittedId} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-gray-100 shadow-md p-4 w-full">
          <ul className="flex space-x-6 text-blue-700 font-medium">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/assignment-viewer">Assignment Viewer</Link></li>
            <li><Link to="/student-dashboard">Student Dashboard</Link></li>
            <li><Link to="/teacher-dashboard">Teacher Dashboard</Link></li>
          </ul>
        </nav>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assignment-viewer" element={<AssignmentViewer />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
