import { useState } from "react";
import axios from "axios";

export default function TeacherDashboard() {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [questionsFile, setQuestionsFile] = useState(null);
  const [textbookFile, setTextbookFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionsFile || !textbookFile) {
      setMessage("Please upload both PDFs");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("course_id", courseId);
    formData.append("due_date", dueDate);
    formData.append("questions_pdf", questionsFile);
    formData.append("textbook_pdf", textbookFile);

    try {
      const res = await axios.post("/api/teacher/create-assignment", formData);
      setMessage("Assignment created successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create assignment.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Create Assignment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <div>
          <label className="block font-medium">Upload Questions PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setQuestionsFile(e.target.files[0])}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Upload Textbook PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setTextbookFile(e.target.files[0])}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-red-300 text-black py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
}
