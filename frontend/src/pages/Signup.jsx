import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
const [form, setForm] = useState({
name: "",
email: "",
password: "",
});

const [error, setError] = useState("");
const [busy, setBusy] = useState(false);

const { login } = useAuth();
const navigate = useNavigate();

const handle = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};

const submit = async (e) => {
e.preventDefault();
setError("");
setBusy(true);


try {
  const res = await authApi.signup(form);

  login(res.data.token, res.data.user);
  navigate("/dashboard");
} catch (err) {
  console.log(err.response?.data);

  setError(
    err.response?.data?.message ||
    JSON.stringify(err.response?.data) ||
    "Signup failed"
  );
} finally {
  setBusy(false);
}


};

return ( <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4"> <div className="w-full max-w-md"> <div className="text-center mb-8"> <div className="text-5xl mb-4">🚀</div>

      <h1 className="text-3xl font-bold text-white">
        Create your account
      </h1>

      <p className="text-gray-400 mt-2 text-sm">
        Start shortening links in seconds
      </p>
    </div>

    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handle}
            placeholder="Your name"
            required
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handle}
            placeholder="you@example.com"
            required
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handle}
            placeholder="Minimum 8 characters with a number"
            required
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
        >
          {busy ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>

    <p className="text-center text-sm text-gray-500 mt-6">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-indigo-400 hover:text-indigo-300 font-medium"
      >
        Sign in
      </Link>
    </p>
  </div>
</div>
);
}
