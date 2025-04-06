const GradingDetails = ({ gradingData }) => {
  if (!gradingData) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Grading Data:</h2>
      <pre className="bg-gray-100 p-2">
        {JSON.stringify(gradingData, null, 2)}
      </pre>
    </div>
  );
};

export default GradingDetails;
