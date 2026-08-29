import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
    <div className="text-center">
      <p className="mb-3 font-body text-sm uppercase tracking-[0.3em] text-primary">
        Página não encontrada
      </p>
      <h1 className="mb-4 font-display text-5xl font-bold text-foreground">
        Essa receita não existe
      </h1>
      <p className="mb-8 font-body text-muted-foreground">
        O link que você abriu não leva a lugar nenhum. Que tal ver o cardápio?
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/produtos"
          className="rounded-lg bg-primary px-6 py-3 font-body font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ver cardápio
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-border px-6 py-3 font-body font-bold text-foreground transition-colors hover:bg-muted"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
