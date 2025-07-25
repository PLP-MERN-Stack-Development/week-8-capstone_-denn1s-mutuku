const StatsCards = () => {
  const stats = [
    { label: "Total Candidates", value: "1,247", growth: "+12%", icon: "👥" },
    { label: "Resumes Processed", value: "2,893", growth: "+8%", icon: "📄" },
    { label: "Top Skills Found", value: "156", growth: "+15%", icon: "🎓" },
    { label: "Processing Rate", value: "98.5%", growth: "+2%", icon: "📈" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <h2 className="text-2xl font-bold text-gray-800">{stat.value} <span className="text-green-500 text-sm">{stat.growth}</span></h2>
          </div>
          <div className="text-3xl">{stat.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;