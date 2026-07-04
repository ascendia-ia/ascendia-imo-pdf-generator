import Link from "next/link";

export default function NoAccessPage() {
  return (
    <main className="page-shell access-page">
      <section className="access-card" aria-labelledby="access-title">
        <p className="eyebrow">Ascendia / Acesso privado</p>
        <h1 id="access-title">Sem acesso ao Imo-PDF</h1>
        <p className="lead">
          Esta app nao esta ativa para a tua conta. Podes voltar ao portal para ver as apps
          disponiveis.
        </p>
        <Link className="access-link" href="https://clientes.ascendia.pt">
          Voltar ao portal
        </Link>
      </section>
    </main>
  );
}
