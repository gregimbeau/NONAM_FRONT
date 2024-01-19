import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { REACT_APP_API_URL } from "../config";
import "../css/JobStatus.css";

function JobStatus({ jobId }) {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let intervalId;

    const fetchJobDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `http://localhost:3000/jobs?jobId=${jobId}`
        );
        setJobDetails(response.data);
        if (response.data.status === "Completed") {
          clearInterval(intervalId);
        }
      } catch (err) {
        // Log or development/debugging purposes
        console.error("Error occurred while fetching job details:", err);

        // Specific error handling
        if (!err.response) {
          setError("Network error, please check your internet connection.");
        } else if (err.response.status === 404) {
          setError("Job details not found.");
        } else {
          // Fallback error message
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
      intervalId = setInterval(fetchJobDetails, 2000);
    }

    return () => clearInterval(intervalId);
  }, [jobId]);

  if (loading) {
    return <div>Loading job details...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const directors = jobDetails?.data?.directorsDetails?.resultats;

  const isDirectorsArray = Array.isArray(directors);

  const renderCompanyDetails = (companyDetails) => {
    const details = [];

    for (const key in companyDetails) {
      if (companyDetails[key] && typeof companyDetails[key] === "object") {
        details.push(
          <div key={key}>
            <strong>{key}:</strong>
            <div style={{ paddingLeft: "20px" }}>
              {renderCompanyDetails(companyDetails[key])}
            </div>
          </div>
        );
      } else {
        details.push(
          <div key={key}>
            <strong>{key}:</strong> {companyDetails[key]?.toString()}
          </div>
        );
      }
    }

    return details;
  };

  return (
    <div className='job-status-container'>
      {error && <div className='error-message'>{error}</div>}
      {jobDetails ? (
        <div>
          <h3>Job Status: {jobDetails.status}</h3>
          <div>
            {isDirectorsArray && (
              <div>
                <h4>Dirigeants:</h4>
                {directors.map((director, index) => (
                  <div key={index} className='director-card'>
                    <p>Qualités: {director.qualites.join(", ")}</p>
                    <p>Nom: {director.nom}</p>
                    <p>Prénom: {director.prenom}</p>
                    <h5>Entreprises Liées:</h5>
                    {director.entreprises.map((entreprise, idx) => (
                      <div key={idx} className='director-details'>
                        <p>Nom de l'entreprise: {entreprise.nom_entreprise}</p>
                        <p>SIREN: {entreprise.siren}</p>
                        <p>Domaine d'activité: {entreprise.domaine_activite}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <h4>Company Details:</h4>

            <div className='company-details-card'>
              {renderCompanyDetails(jobDetails.data.companyDetails)}
            </div>
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
  jobId: PropTypes.string.isRequired,
};

export default JobStatus;
