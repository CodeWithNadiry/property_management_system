import StatsCard from "./StatsCard";

const StatsList = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {stats
        .filter((stat) => stat.show !== false)
        .map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
    </div>
  );
};
export default StatsList;
