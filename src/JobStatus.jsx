import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { REACT_APP_API_URL } from "./config";

function JobStatus({ jobId }) {
  console.log("JobStatus component received jobId:", jobId);

  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let intervalId;

    const fetchJobDetails = async () => {
      if (!jobId) return;

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${REACT_APP_API_URL}/jobs?jobId=${jobId}`
        );
        setJobDetails(response.data);

        if (response.data.status === "Completed") {
          clearInterval(intervalId);
        }
      } catch (error) {
        setError("Failed to fetch job details.");
        console.error("Error fetching job details:", error);
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

  console.log("Directors Details:", jobDetails?.data?.directorsDetails);

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
    <div>
      {jobDetails ? (
        <div>
          <h3>Job Status: {jobDetails.status}</h3>
          <div>
            {isDirectorsArray && (
              <div>
                <h4>Dirigeants:</h4>
                {directors.map((director, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid black",
                      margin: "10px",
                      padding: "10px",
                    }}>
                    <p>Qualités: {director.qualites.join(", ")}</p>
                    <p>Nom: {director.nom}</p>
                    <p>Prénom: {director.prenom}</p>
                    <h5>Entreprises Liées:</h5>
                    {director.entreprises.map((entreprise, idx) => (
                      <div key={idx}>
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

            <div
              style={{
                border: "1px solid black",
                margin: "10px",
                padding: "10px",
              }}>
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
