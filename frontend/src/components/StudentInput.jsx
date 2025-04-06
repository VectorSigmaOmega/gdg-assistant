import { useState } from 'react';

const StudentInput = ({ onStudentSubmit }) => {
  const [studentId, setStudentId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId) return;
    onStudentSubmit(studentId);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="Enter Student ID"
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Get Assignments
      </button>
    </form>
  );
};

export default StudentInput;
