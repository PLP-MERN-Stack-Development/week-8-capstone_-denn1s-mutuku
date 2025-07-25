import { useEffect, useState } from "react";
import axios from "axios";
import StatsCards from "./StatsCards";
import FilterPanel from "./FilterPanel";
import CandidateTable from "./CandidateTable";
import ErrorBoundary from "./ErrorBoundary";

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("/api/candidates");

        // Validate response to be an array
        if (Array.isArray(response.data)) {
          setCandidates(response.data);
          setFilteredCandidates(response.data);
        } else {
          console.warn("Expected an array, got:", response.data);
          setCandidates([]);
          setFilteredCandidates([]);
        }
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
        setCandidates([]);
        setFilteredCandidates([]);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();

    if (!Array.isArray(candidates)) return;

    const filtered = candidates.filter((c) => {
      const name = c.name?.toLowerCase() || "";
      const skills = Array.isArray(c.skills) ? c.skills.map((s) => s.toLowerCase()) : [];
      const experience = c.experience?.toLowerCase() || "";
      const education = c.education?.toLowerCase() || "";

      return (
        name.includes(lowerQuery) ||
        skills.some((s) => s.includes(lowerQuery)) ||
        experience.includes(lowerQuery) ||
        education.includes(lowerQuery)
      );
    });

    setFilteredCandidates(filtered);
  }, [searchQuery, candidates]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("/api/upload", formData);
      alert("Resume uploaded and parsed successfully");
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">ResumeAI</h1>
          <p className="text-sm text-gray-600">
            Intelligent Resume Processing Platform
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="border px-2 py-1 rounded text-sm"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Upload Resume
          </button>
        </div>
      </header>

      {/* Stats */}
      <StatsCards />

      {/* Filter Section */}
      <div className="mt-10">
        <FilterPanel
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Candidates Table with Error Boundary */}
      <div className="mt-10">
        <ErrorBoundary>
          <CandidateTable candidates={filteredCandidates} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Dashboard;
