import { Link } from "react-router-dom";

const StatsCard = ({ title, quantity, icon: Icon, to = "#" }) => {
  
  return (
    <Link
      to={to}
      className="group relative flex items-center gap-5 rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-all duration-300 group-hover:scale-110">
          <Icon size={28} />
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h2 className="mt-1 text-3xl font-bold text-gray-800">{quantity}</h2>
      </div>
    </Link>
  );
};

export default StatsCard;