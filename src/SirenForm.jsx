import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import JobStatus from "./JobStatus";

function SirenForm() {
  const [sirenNumber, setSirenNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [directorCompanies, setDirectorCompanies] = useState({});

  const fetchDirectorCompanies = async (director) => {
    try {
      const response = await axios.get(
        `https://api.pappers.fr/v2/recherche-dirigeants`,
        {
          params: {
            api_token: "be45e2ad86f3bd6490df430b553cf5f8fff9cfb1c91e3089",
            siren: sirenNumber,
          },
        }
      );
      return response.data.resultats;
    } catch (error) {
      console.error(`Error fetching data for director ${director}:`, error);
      return []; // Return an empty array in case of error
    }
  };

  useEffect(() => {
    const fetchAllDirectorCompanies = async () => {
      let allDirectorCompanies = {};

      for (const director of directors) {
        const companies = await fetchDirectorCompanies(director);
        allDirectorCompanies[director] = companies;
      }

      setDirectorCompanies(allDirectorCompanies);
    };

    if (directors.length > 0) {
      fetchAllDirectorCompanies();
    }
  }, [directors]);

  const handleDirectorsExtracted = (extractedDirectors) => {
    setDirectors(extractedDirectors);
    // Now fetch the companies linked to each director
    extractedDirectors.forEach((director) => {
      fetchDirectorCompanies(director).then((companies) => {
        setDirectorCompanies((prevState) => ({
          ...prevState,
          [director]: companies,
        }));
      });
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResponse(null);
    setLoading(true);

    try {
      const apiKey = "be45e2ad86f3bd6490df430b553cf5f8fff9cfb1c91e3089"; // Your API token

      const result = await axios.get(`https://api.pappers.fr/v2/entreprise`, {
        params: {
          siren: sirenNumber,
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      console.log("API Response Data:", result.data);

      // Check if the response contains valid entreprise data
      if (result.data.nom_entreprise) {
        // Extract directors from the entreprise data (assuming it contains directors)
        const extractedDirectors = extractDirectorsFromResponse(result.data);

        // Set the response with the entreprise data
        setResponse(result.data);

        // Set the directors state
        setDirectors(extractedDirectors);
      } else {
        setError("No valid entreprise data in the API response");
      }
    } catch (error) {
      setError("Error fetching company details");
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
    }
  };

  function extractDirectorsFromResponse(responseData) {
    // Assuming responseData has a 'directors' field which is an array of director objects
    if (
      responseData &&
      responseData.directors &&
      Array.isArray(responseData.directors)
    ) {
      // Extracting and returning the names of the directors
      return responseData.directors.map((director) => director.name);
    }
    return []; // Return an empty array if the expected structure is not found
  }

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
      {response && (
        <div style={{ marginTop: "10px" }}>
          <h3>Company Details</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
          <JobStatus onDirectorsExtracted={handleDirectorsExtracted} />
        </div>
      )}
      <div>
        {Object.entries(directorCompanies).map(([director, companies]) => (
          <div key={director}>
            <h3>Director: {director}</h3>
            <h4>Linked Companies:</h4>
            <ul>
              {companies.map((company, index) => (
                <li key={index}>
                  {company.nom_entreprise || "Company Name Not Available"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

SirenForm.propTypes = {
  onJobIdUpdate: PropTypes.func.isRequired,
  jobId: PropTypes.string,
};

export default SirenForm;
