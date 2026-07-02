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
      <section className="generator-panel login-card">
        <p className="eyebrow">Ascendia</p>
        <h1>Entrar no gerador de PDFs</h1>
        <p className="lead">
          Usa a mesma conta do portal para carregar o branding do cliente.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={busy}>
            {busy ? "A entrar" : "Entrar"}
          </button>
        </form>

        {error ? <p className="status-message error">{error}</p> : null}
      </section>
    </main>
  );
}
