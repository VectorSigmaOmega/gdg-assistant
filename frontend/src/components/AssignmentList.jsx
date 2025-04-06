import { useEffect, useState } from "react";
import axios from "axios";
import GradingDetails from "./GradingDetails"; // ⬅️ Import here

function AssignmentList({ studentId }) {
  const [assignments, setAssignments] = useState([]);
  const [gradingData, setGradingData] = useState(null); // ⬅️ New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`https://5000-idx-gdg-doordie-1743806459319.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev/api/grades/${studentId}`);
        setAssignments(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch assignments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [studentId]);

  const handleViewDetails = async (assignmentId) => {
    try {
      const res = await axios.get(`https://5000-idx-gdg-doordie-1743806459319.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev/api/grades/${studentId}/${assignmentId}`);
      setGradingData(res.data);
    } catch (err) {
      console.error("Error fetching grading details:", err);
      setGradingData({ error: "Could not load grading details." });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Assignments for Student ID: {studentId}</h2>

      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        assignments.map((assignment) => (
          <div key={assignment.assignment_id} className="mb-4 border p-4">
            <h3>Assignment ID: {assignment.assignment_id}</h3>
            <a
              href={assignment.assignment_pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View PDF
            </a>
            <br />
            <button
              onClick={() => handleViewDetails(assignment.assignment_id)}
              className="mt-2 bg-blue-500 text-black px-3 py-1 rounded"
            >
              View Details
            </button>
          </div>
        ))
      )}

      {/* Show Grading Details if present */}
      {gradingData && <GradingDetails gradingData={gradingData} />}
    </div>
  );
}

export default AssignmentList;
