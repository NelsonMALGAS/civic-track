import { Suspense } from "react";
import { getServerSession } from "./server-actions";
import {
  ShieldAlert,
  UserRound,
  LockKeyhole,
  Code2,
  Loader2,
} from "lucide-react";

async function UserSession() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/10">
          <ShieldAlert className="h-8 w-8 text-amber-600 dark:text-amber-500" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Authentication Required
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          You are currently unauthenticated. Please sign in to access your
          account information and protected resources.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          <LockKeyhole className="h-4 w-4" />
          No active session found
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-6 py-6 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
            <UserRound className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              Authenticated User
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Your current session user information
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              User JSON
            </span>
          </div>

          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            Authenticated
          </span>
        </div>

        <pre className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-7 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-emerald-400">
          <code>{JSON.stringify(user, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}

function SessionFallback() {
  return (
    <div className="flex min-h-75 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-400" />
        <p className="text-sm text-zinc-500">Checking authentication...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-12 font-sans dark:bg-zinc-950">
      <div className="w-full max-w-2xl">
        <Suspense fallback={<SessionFallback />}>
          <UserSession />
        </Suspense>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Authentication & Session Management
        </p>
      </div>
    </main>
  );
}