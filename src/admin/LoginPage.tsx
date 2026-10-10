import { useState, type FormEvent } from "react";
import { useLogin, useNotify } from "react-admin";

/**
 * A small, self-contained login page — replaces ra-supabase's LoginPage
 * (see providers.ts for why). Calls react-admin's own useLogin(), which
 * forwards whatever we pass it straight to authProvider.login().
 */
export default function LoginPage() {
  const login = useLogin();
  const notify = useNotify();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      notify(err instanceof Error ? err.message : "Login failed", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#222222] border border-[#464646] rounded-lg p-8"
      >
        <p className="text-xs uppercase tracking-wide text-[#899474] mb-1">Ivar Delos Santos</p>
        <h1 className="text-xl font-semibold text-[#EDEBE6] mb-6">Admin sign in</h1>

        <label className="block text-xs uppercase tracking-wide text-[#A0A0A0] mb-2">
          Email
        </label>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#181818] border border-[#464646] rounded px-3 py-2 text-sm text-[#EDEBE6] mb-4 focus:outline-none focus:border-[#899474]"
        />

        <label className="block text-xs uppercase tracking-wide text-[#A0A0A0] mb-2">
          Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#181818] border border-[#464646] rounded px-3 py-2 text-sm text-[#EDEBE6] mb-6 focus:outline-none focus:border-[#899474]"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#899474] text-[#181818] font-semibold px-6 py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-xs text-[#A0A0A0] mt-5">
          No sign-up here by design — this account was created for you in the
          Supabase dashboard (Authentication → Users).
        </p>
      </form>
    </div>
  );
}
