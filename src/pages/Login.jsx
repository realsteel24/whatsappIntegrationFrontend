// pages/Login.jsx
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center text-white">
      <div className="bg-zinc-950 p-10 rounded-xl shadow-lg w-full max-w-md border border-zinc-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-500">Welcome Back</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
