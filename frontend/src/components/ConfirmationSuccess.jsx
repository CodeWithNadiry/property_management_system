const ConfirmationSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Confirmation Successful
        </h1>

        <p className="text-gray-600 mb-6">
          Your form has been submitted successfully. You can now safely leave
          this page.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmationSuccess;
