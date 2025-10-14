
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("/api/assignments/")
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !selectedAssignment || !file) {
      setMessage("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("student_id", studentId);
    formData.append("assignment_id", selectedAssignment);
    formData.append("file", file);

    try {
      const res = await axios.post(
        "/api/upload-assignment",
        formData
      );
      setMessage("Graded successfully!");
      console.log("Grading result:", res.data.grading);
    } catch (err) {
      console.error(err);
      setMessage("Upload or grading failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Submit Assignment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />

        <select
          className="w-full p-2 border rounded"
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
          required
        >
          <option value="">Select Assignment</option>
          {assignments.map((a) => (
            <option key={a.assignment_id} value={a.assignment_id}>
              {a.title} ({a.due_date})
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-black py-2 px-4 rounded hover:bg-green-600"
        >
          Upload & Submit
        </button>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
}
