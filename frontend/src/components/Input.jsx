const Input = ({ label, icon, className = "", ...props }) => {
  const Icon = icon;

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
        {Icon && <Icon className="text-gray-400 mr-2" />}
        <input
          {...props}
          className={`w-full outline-none ${className}`}
        />
      </div>
    </div>
  );
};

export default Input;