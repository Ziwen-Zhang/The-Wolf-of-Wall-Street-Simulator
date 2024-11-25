import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { useNavigate } from "react-router-dom";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm_password) {
      return setErrors({
        confirm_password: "passwords must match",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        first_name,
        last_name,
        password,
        confirm_password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
      localStorage.removeItem("investingHistoryData")
      navigate("/user")
    }
  };

  return (
    <div className="p-6 bg-gray-900">
      <h1 className="text-2xl font-bold text-green-400 mb-4">Sign Up</h1>
      {errors.server && (
        <p className="mt-1 text-sm text-red-500">{errors.server}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-1">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-yellow-400">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-green-500 rounded-md shadow-sm bg-gray-800 text-yellow-400 placeholder-gray-500 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
          />
          <p className="mt-1 text-sm text-red-500 h-4">{errors.email}</p>
        </div>

        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-yellow-400">
            Username
          </label>
          <input
            type="text"
            value={username}
            maxLength={10}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-green-500 rounded-md shadow-sm bg-gray-800 text-yellow-400 placeholder-gray-500 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
          />
          <p className="mt-1 text-sm text-red-500 h-4">{errors.username}</p>
        </div>

        {/* First Name Field */}
        <div>
          <label className="block text-sm font-medium text-yellow-400">
            First Name
          </label>
          <input
            type="text"
            maxLength={10}
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-green-500 rounded-md shadow-sm bg-gray-800 text-yellow-400 placeholder-gray-500 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
          />
          <p className="mt-1 text-sm text-red-500 h-4">{errors.first_name}</p>
        </div>

        {/* Last Name Field */}
        <div>
          <label className="block text-sm font-medium text-yellow-400">
            Last Name
          </label>
          <input
            type="text"
            maxLength={10}
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-green-500 rounded-md shadow-sm bg-gray-800 text-yellow-400 placeholder-gray-500 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
          />
          <p className="mt-1 text-sm text-red-500 h-4">{errors.last_name}</p>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-yellow-400">
            Password
          </label>
          <input
            type="password"
            value={password}
            maxLength={20}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-green-500 rounded-md shadow-sm bg-gray-800 text-green-300 placeholder-gray-500 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
          />
          <p className="mt-1 text-sm text-red-500 h-4">{errors.password}</p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-yellow-400">
            Confirm Password
          </label>
          <input
            type="password"
            maxLength={20}
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-green-500 rounded-md shadow-sm bg-gray-800 text-green-300 placeholder-gray-500 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
          />
          <p className="mt-1 text-sm text-red-500 h-4">
            {errors.confirm_password}
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600 active:scale-95 active:bg-green-700 transition-transform duration-150"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
