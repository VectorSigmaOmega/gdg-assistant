import { useState } from "react";
import AssignmentList from "../components/AssignmentList";

export default function AssignmentViewer() {
  const [studentId, setStudentId] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedId(studentId);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Assignment Viewer</h1>
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center">
          <input
            className="w-full p-3 border rounded-l-md"
            type="text"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-r-md hover:bg-blue-600">
            Fetch Assignments
          </button>
        </div>
      </form>
      {submittedId && <AssignmentList studentId={submittedId} />}
    </div>
  );
}