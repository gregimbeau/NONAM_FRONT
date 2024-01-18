import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import JobStatus from "./JobStatus";

function SirenForm({ onJobIdUpdate }) {
  const [sirenNumber, setSirenNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobId, setJobId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Request to your Node.js backend
      const response = await axios.get(`http://localhost:3000/entreprise`, {
        params: { siren: sirenNumber },
      });

      if (response.data.jobId) {
        setJobId(response.data.jobId); // Set the jobId received from the backend
        onJobIdUpdate(response.data.jobId); // Update jobId in parent component if needed
      } else {
        setError("No job ID returned from the backend");
      }
    } catch (error) {
      setError("Error fetching company details");
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Siren Number:
          <input
            type='text'
            value={sirenNumber}
            onChange={(e) => setSirenNumber(e.target.value)}
            required
          />
        </label>
        <button type='submit' disabled={loading}>
          {loading ? "Loading..." : "Fetch Company"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {jobId && <JobStatus jobId={jobId} />}
    </div>
  );
}

SirenForm.propTypes = {
  onJobIdUpdate: PropTypes.func,
};

export default SirenForm;
