import Papa from "papaparse";

const CandidateTable = ({ candidates = [] }) => {
  const handleExportCSV = () => {
    const csv = Papa.unparse(
      candidates.map(({ name, title, company, email, phone, location, experience, education, rating, skills }) => ({
        name: name || "",
        title: title || "",
        company: company || "",
        email: email || "",
        phone: phone || "",
        location: location || "",
        experience: experience || "",
        education: education || "",
        rating: rating || "",
        skills: Array.isArray(skills) ? skills.join(", ") : ""
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "candidates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(candidates, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "candidates.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Candidates ({candidates.length})</h2>
        <div className="flex gap-4">
          <button onClick={handleExportCSV} className="text-blue-600 hover:underline">⬇️ Export CSV</button>
          <button onClick={handleExportJSON} className="text-green-600 hover:underline">⬇️ Export JSON</button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {candidates.map((c, i) => (
          <div key={i} className="py-4 flex flex-wrap justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-lg">{c.name || "N/A"}</h3>
              <p className="text-sm text-gray-500">{c.title || "No Title"}</p>
              <p className="text-sm text-gray-500">{c.company || "No Company"}</p>
            </div>

            <div className="text-sm text-gray-700">
              <p><strong>Email:</strong> {c.email || "N/A"}</p>
              <p><strong>Phone:</strong> {c.phone || "N/A"}</p>
              <p><strong>Location:</strong> {c.location || "N/A"}</p>
            </div>

            <div className="text-sm text-gray-700">
              <p><strong>Experience:</strong> {c.experience || "N/A"}</p>
              <p><strong>Education:</strong> {c.education || "N/A"}</p>
            </div>

            <div className="max-w-xs">
              <div className="flex flex-wrap gap-2 mb-2">
                {Array.isArray(c.skills) && c.skills.map((skill, idx) => (
                  <span key={idx} className="bg-gray-200 text-sm px-2 py-1 rounded">{skill}</span>
                ))}
              </div>
              <p className="text-yellow-500 font-semibold">⭐ {c.rating || "N/A"}</p>
              <button className="mt-2 text-blue-600 hover:underline text-sm">👁️ View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateTable;
