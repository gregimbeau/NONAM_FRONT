import { useState } from "react";
import Navbar from "./components/Navbar";
import SirenForm from "./components/SirenForm";
import "./css/App.css";

function App() {
  const [jobId, setJobId] = useState(null);

  const handleJobIdUpdate = (newJobId) => {
    setJobId(newJobId);
  };

  return (
    <div className='App'>
      <Navbar />
      <div className='content'>
        <h1>Company Information Fetcher</h1>
        <SirenForm onJobIdUpdate={handleJobIdUpdate} jobId={jobId} />
      </div>
    </div>
  );
}

export default App;
