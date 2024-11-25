import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";


function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        credential,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
      navigate('/user')
    }
  };

  const handleDemoUserLogin = async (e) => {
    e.preventDefault();

    const demoResponse = await dispatch(
      thunkLogin({
        email: "demo@d.com",
        password: "password",
      })
    );

    if (demoResponse) {
      setErrors(demoResponse);
    } else {
      closeModal();
      navigate('/user')
    }
  };

  return (
    <div className="p-6 bg-gray-900">
      <h1 className="text-2xl font-bold text-green-400 mb-4">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-yellow-400">
            Email/Username
          </label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-green-500 rounded-md shadow-sm bg-gray-800 text-yellow-400 placeholder-gray-500 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
          />
          {errors.credential && (
            <p className="mt-1 text-sm text-red-500">{errors.credential}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-400">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-green-500 rounded-md shadow-sm bg-gray-800 text-green-300 placeholder-gray-500 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600 active:scale-95 active:bg-green-700 transition-transform duration-150"
          >
            Log In
          </button>
        </div>
        <div>
          <button
            onClick={handleDemoUserLogin}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600 active:scale-95 active:bg-green-700 transition-transform duration-150"
          >
            Log In demo user
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
