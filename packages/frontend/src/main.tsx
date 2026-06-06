import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { greetUser, UserSchema, type User } from '@kindness/shared';
import './index.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setCreatedUser(null);

    // Generate valid UUID mock for client simulation
    const mockId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
    const payload = {
      id: mockId,
      name,
      email,
      createdAt: new Date(),
    };

    const result = UserSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const formattedErrors: Record<string, string[]> = {};
      Object.entries(fieldErrors).forEach(([key, val]) => {
        if (val) formattedErrors[key] = val;
      });
      setErrors(formattedErrors);
      return;
    }

    const validatedUser = result.data;
    setCreatedUser(validatedUser);
    setSuccessMessage(greetUser(validatedUser));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-rose-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <header className="relative z-10 mb-10 text-center">
        <h1 className="bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          KindnessApp
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Strict MERN Stack Monorepo Orchestrated via npm Workspaces & TS Project References
        </p>
      </header>

      <main className="relative z-10 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Architecture Checklist Card */}
        <div className="glow-card flex flex-col justify-between rounded-2xl p-6">
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-200">
              <span className="text-rose-400">🛡️</span> Strict Architecture Check
            </h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-400">✓</span>
                <div>
                  <strong>Native ESM:</strong> Pure imports with full path-resolution compliance.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-400">✓</span>
                <div>
                  <strong>TS Project References:</strong> Clean compilation isolation via TS
                  composite mode.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-400">✓</span>
                <div>
                  <strong>Prettier & ESLint 9:</strong> Standardized flat configuration format and
                  Tailwind utility class ordering.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-400">✓</span>
                <div>
                  <strong>Workspace Sharing:</strong> Schemas and types imported in frontend /
                  backend from <code>@kindness/shared</code>.
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-400">
            Path resolves: <code>@kindness/shared</code> &rarr;{' '}
            <code>packages/shared/src/index.ts</code>
          </div>
        </div>

        {/* Validation Playroom Card */}
        <div className="glow-card rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-200">
            <span className="text-purple-400">⚡</span> Shared Validation Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-slate-100 transition-all placeholder:text-slate-600 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-rose-400">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                type="text"
                placeholder="jane@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-slate-100 transition-all placeholder:text-slate-600 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-rose-400">{errors.email[0]}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-rose-950/20 transition-all duration-200 hover:from-rose-600 hover:to-purple-700 hover:shadow-xl"
            >
              Validate & Greet
            </button>
          </form>

          {successMessage && (
            <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
              <p className="text-xs font-medium text-emerald-400">{successMessage}</p>
              {createdUser && (
                <pre className="mt-2 overflow-x-auto rounded border border-slate-900 bg-slate-950/50 p-2 font-mono text-[10px] text-slate-400">
                  {JSON.stringify(createdUser, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 mt-16 text-center text-xs text-slate-500">
        KindnessApp Monorepo Skeleton &bull; Designed with Type Safety in Mind
      </footer>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
