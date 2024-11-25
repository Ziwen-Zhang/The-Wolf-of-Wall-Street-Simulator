
function ErrorModal({ isVisible, onClose, title, message }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-gray-300 p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold text-red-400 mb-4">{title || "Error"}</h2>
        <p>{message || "An unexpected error occurred."}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-700 text-white py-2 rounded-md font-bold hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
