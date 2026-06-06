import { useState, useEffect } from 'react';
import { User, ApiResponse } from '@mern-monorepo/shared';

export default function App() {
  const [greeting, setGreeting] = useState<string>('Loading greeting...');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch greeting
    fetch('/api/greeting?name=Monorepo+Developer')
      .then((res) => res.json())
      .then((data: ApiResponse<{ message: string }>) => {
        if (data.success && data.data) {
          setGreeting(data.data.message);
        } else {
          setError(data.error || 'Failed to fetch greeting');
        }
      })
      .catch((err: unknown) => {
        console.error(err);
        setError('Failed to connect to backend server. Make sure it is running on port 5000.');
      });

    // Fetch users
    fetch('/api/users')
      .then((res) => res.json())
      .then((data: ApiResponse<User[]>) => {
        if (data.success && data.data) {
          setUsers(data.data);
        }
      })
      .catch((err: unknown) => console.error(err));
  }, []);

  return (
    <div className="app-container">
      <header className="hero-section">
        <div className="badge">MERN Monorepo</div>
        <h1>MERN Stack Monorepo</h1>
        <p className="subtitle">
          Built with npm workspaces, native ESM, TypeScript project references, and ESLint v9+ flat configs.
        </p>
      </header>

      <main className="content-grid">
        <section className="card card-greeting">
          <h2>Backend Connection</h2>
          {error ? (
            <div className="status-error">
              <span className="status-dot"></span>
              <span className="error-text">{error}</span>
            </div>
          ) : (
            <div className="status-success">
              <span className="status-dot"></span>
              <span className="success-text">{greeting}</span>
            </div>
          )}
          <p className="card-description">
            This response is fetched from the Node/Express backend, which processes the request using greeting utilities imported directly from the shared package.
          </p>
        </section>

        <section className="card card-users">
          <h2>Shared TypeScript Models</h2>
          <p className="card-description">
            The data below is populated from the backend and typed strictly using the <code>User</code> interface from the <code>@mern-monorepo/shared</code> package.
          </p>
          <ul className="user-list">
            {users.map((user) => (
              <li key={user.id} className="user-item">
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                <span className="user-date">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
            {users.length === 0 && !error && (
              <li className="user-item loading">Loading mock users...</li>
            )}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>Created by Antigravity IDE • 2026</p>
      </footer>
    </div>
  );
}
