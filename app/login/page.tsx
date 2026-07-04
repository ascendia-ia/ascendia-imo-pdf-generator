"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="page-shell login-page">
      <section className="login-visual" aria-hidden="true">
        <div className="login-preview">
          <span className="preview-pill" />
          <span className="preview-line short" />
          <span className="preview-line" />
          <span className="preview-line" />
          <div className="preview-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="login-card" aria-labelledby="login-title">
        <p className="eyebrow">Ascendia / Acesso privado</p>
        <h1 id="login-title">Entrar no gerador de PDFs</h1>
        <p className="lead">Acede para preparar dossiers comerciais com o branding certo.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={busy}>
            {busy ? "A entrar" : "Entrar"}
          </button>
        </form>

        {error ? <p className="status-message error">{error}</p> : null}
      </section>
    </main>
  );
}
