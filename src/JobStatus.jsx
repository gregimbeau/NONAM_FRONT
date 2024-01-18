import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function JobStatus({ jobId, onDirectorsExtracted }) {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let intervalId;

    const fetchJobDetails = async () => {
      if (!jobId) return; // Exit if jobId is not available

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `http://localhost:3000/jobs?jobId=${jobId}`
        );
        setJobDetails(response.data);

        if (response.data.status === "Completed") {
          clearInterval(intervalId); // Stop polling
          const extractedDirectors = extractDirectorsFromResponse(
            response.data.data
          );
          onDirectorsExtracted(extractedDirectors);
        }
      } catch (error) {
        setError("Failed to fetch job details.");
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      // Initial fetch
      fetchJobDetails();

      // Poll every 2 seconds
      intervalId = setInterval(() => {
        fetchJobDetails();
      }, 2000);
    }

    return () => {
      // Cleanup interval on unmount
      clearInterval(intervalId);
    };
  }, [jobId, onDirectorsExtracted]);

  if (loading) {
    return <div>Loading job details...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      {jobDetails ? (
        <div>
          <h3>Job Status: {jobDetails.status}</h3>
          <div>
            Company Details:
            <pre>{JSON.stringify(jobDetails.data, null, 2)}</pre>
          </div>
        </div>
      ) : jobId ? (
        <p>Job ID: {jobId} (waiting for status...)</p>
      ) : (
        <p>No Job Selected</p>
      )}
    </div>
  );
}

JobStatus.propTypes = {
  jobId: PropTypes.string,
  onDirectorsExtracted: PropTypes.func.isRequired,
};

export default JobStatus;

function extractDirectorsFromResponse(responseData) {
  if (
    responseData &&
    responseData.directors &&
    Array.isArray(responseData.directors)
  ) {
    return responseData.directors.map((director) => director.name);
  }
  return [];
}
