const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-light-gray px-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-dark-blue mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-dark-gray mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-semibold bg-light-blue text-black hover:bg-dark-blue transition-colors"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
