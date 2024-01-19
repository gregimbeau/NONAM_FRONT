import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import JobStatus from "./JobStatus";
import { REACT_APP_API_URL } from "../config";

function SirenForm({ onJobIdUpdate }) {
  const [sirenNumber, setSirenNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobId, setJobId] = useState(null);

  // Handles preset SIREN numbers for quick testing
  const handlePresetSiren = async (siren) => {
    setSirenNumber(siren);
    await trySubmit(siren);
  };

  // Envoi du SIREN au backend
  const trySubmit = async (siren) => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(`${REACT_APP_API_URL}/entreprise`, {
        params: { siren: siren },
      });

      console.log("Received job ID:", response.data.jobId);
      setJobId(response.data.jobId);
      onJobIdUpdate(response.data.jobId);
    } catch (error) {
      setError(
        "An error occurred while fetching company details. Please try again."
      );
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
    }
  };

  // form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    await trySubmit(sirenNumber);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='sirenNumber' className='form-label'>
            Siren Number:
          </label>
          <input
            type='text'
            id='sirenNumber'
            className='form-control'
            value={sirenNumber}
            onChange={(e) => setSirenNumber(e.target.value)}
            required
          />
        </div>
        <button type='submit' className='btn btn-primary' disabled={loading}>
          {loading ? "Loading..." : "Fetch Company"}
        </button>
        <div className='mt-3'>
          {/* Preset SIREN buttons for quick access */}
          <button
            className='btn btn-secondary me-2'
            onClick={() => handlePresetSiren("911872695")}>
            Nonam (911 872 695)
          </button>
          <button
            className='btn btn-secondary me-2'
            onClick={() => handlePresetSiren("914072780")}>
            Cop or Drop (914 072 780)
          </button>
          <button
            className='btn btn-secondary'
            onClick={() => handlePresetSiren("722003936")}>
            McDonald's France (722 003 936)
          </button>
        </div>
      </form>
      {error && <div className='error-message'>{error}</div>}
      {jobId && <JobStatus jobId={jobId} />}
    </div>
  );
}

SirenForm.propTypes = {
  onJobIdUpdate: PropTypes.func.isRequired,
};

export default SirenForm;
