const FilterPanel = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">🔍 Search & Filter Candidates</h2>
      <p className="text-sm text-gray-500 mb-4">Find the perfect candidates using our advanced filtering system</p>

      <input
        type="text"
        placeholder="Search by name, skills, experience or education..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />
    </div>
  );
};

export default FilterPanel;