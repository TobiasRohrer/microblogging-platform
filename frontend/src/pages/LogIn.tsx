import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/AuthStore";

interface LoginResponse {
  jwtToken: string;
  username: string;
}

export default function LogIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  async function executeLogin() {
    const response = await fetch("/api/accounts/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid email or password. Please try again.");
      }
      throw new Error("Something went wrong. Please try again later.");
    }

    const data: LoginResponse = await response.json();
    login(data.jwtToken, data.username);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    try {
      setIsLoading(true);
      await executeLogin();
      navigate("/home");
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-[400px] w-full bg-black border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-6 text-center">
          Sign in
        </h2>

        {errorMessage && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-lg text-sm bg-red-950/40 text-red-400 border border-red-900/60"
          >
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled={isLoading}
              className="w-full px-3.5 py-3 bg-black border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm disabled:opacity-50"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              disabled={isLoading}
              className="w-full px-3.5 py-3 bg-black border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm disabled:opacity-50"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-400">
              <input
                type="checkbox"
                className="rounded border-neutral-800 bg-neutral-900 text-white focus:ring-white"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="text-neutral-400 hover:text-white hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-full transition-colors text-sm cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-white font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
