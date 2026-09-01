import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AccountRegister() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  async function executeRegister() {
    const response = await fetch("/api/accounts/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim(),
        password,
      }),
    });

    if (!response.ok) {
      if (response.status === 400 || response.status === 409) {
        throw new Error(
          "An account with this email or username already exists.",
        );
      }
      throw new Error("Registration failed. Please try again later.");
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage("Username is required.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await executeRegister();
      navigate("/login", {
        state: { message: "Account created successfully! Please sign in." },
      });
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-[400px] w-full bg-black border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-6 text-center">
          Create your account
        </h1>

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
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-neutral-400 mb-1.5"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              disabled={isLoading}
              placeholder="Username"
              className="w-full px-3.5 py-3 bg-black border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm disabled:opacity-50"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-neutral-400 mb-1.5"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              disabled={isLoading}
              placeholder="Email address"
              className="w-full px-3.5 py-3 bg-black border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm disabled:opacity-50"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-neutral-400 mb-1.5"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              disabled={isLoading}
              placeholder="Password (min. 6 characters)"
              className="w-full px-3.5 py-3 bg-black border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm disabled:opacity-50"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-neutral-400 mb-1.5"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              disabled={isLoading}
              placeholder="Confirm Password"
              className="w-full px-3.5 py-3 bg-black border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-sm disabled:opacity-50"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-full transition-colors text-sm cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Have an account already?{" "}
          <Link to="/login" className="text-white font-medium hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
