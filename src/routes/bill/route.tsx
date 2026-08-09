import { useState } from "react";
import { createFileRoute, Outlet, Link, useLocation, useRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStaff } from "@/lib/useStaff";
import { Toaster } from "@/components/ui/sonner";

const posQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: true, staleTime: 10_000 } },
});

export const Route = createFileRoute("/bill")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Staff Billing — Green Valley Food One" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Internal billing panel for Green Valley Food One staff." },
    ],
  }),
  component: BillLayout,
  errorComponent: ({ error }) => (
    <div className="p-8 text-red-700" role="alert">
      Billing panel error: {error.message}
    </div>
  ),
});

function StaffLogin() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/bill` },
        });
        if (err) throw err;
        if (!data.session) setInfo("Account created. Check your email to confirm, then sign in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
        autoComplete="on"
      >
        <h1 className="text-lg font-bold text-slate-900">Green Valley — Staff Billing</h1>
        <p className="mt-1 text-sm text-slate-500">Authorised staff only.</p>

        <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
        />

        {error ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {info ? <p className="mt-3 text-sm text-emerald-700">{info}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-md bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create staff account"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
            setInfo("");
          }}
          className="mt-3 w-full text-center text-xs text-slate-500 underline"
        >
          {mode === "signin"
            ? "First time setup? Create the first staff account"
            : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}

const NAV = [
  { to: "/bill", label: "Billing" },
  { to: "/bill/history", label: "Bill history" },
  { to: "/bill/reports", label: "Sales" },
  { to: "/bill/reservations", label: "Reservations" },
  { to: "/bill/menu", label: "Website menu" },
  { to: "/bill/settings", label: "Settings" },
];

function Shell() {
  const { loading, user, isStaff, isAdmin } = useStaff();
  const location = useLocation();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-200">
        Loading billing panel…
      </div>
    );
  }

  if (!user) return <StaffLogin />;

  if (!isStaff) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-900 px-4 text-center text-slate-200">
        <p>This account has no billing access. Ask an administrator to grant you a role.</p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="rounded-md bg-slate-700 px-4 py-2 text-sm"
        >
          Sign out
        </button>
      </div>
    );
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await router.navigate({ to: "/bill", replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="no-print sticky top-0 z-40 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2.5 text-slate-100">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <span className="hidden text-sm font-bold uppercase tracking-wide sm:inline">Green Valley POS</span>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV.filter((n) => n.to !== "/bill/settings" || isAdmin).map((n) => {
              const active =
                n.to === "/bill" ? location.pathname === "/bill" : location.pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded px-3 py-1.5 text-sm font-medium ${
                    active ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            {user.email} · {isAdmin ? "Admin" : "Cashier"}
          </span>
          <button onClick={signOut} className="rounded bg-slate-700 px-3 py-1.5 hover:bg-slate-600">
            Sign out
          </button>
        </div>
      </header>
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
}

function BillLayout() {
  return (
    <QueryClientProvider client={posQueryClient}>
      <Shell />
    </QueryClientProvider>
  );
}
