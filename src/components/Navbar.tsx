import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Início", to: "/" },
  { label: "Produtos", to: "/produtos" },
  { label: "Sobre", to: "/#sobre" },
  { label: "Contato", to: "/#contato" },
];

const Navbar = () => {
  const [aberto, setAberto] = useState(false);
  const { pathname, hash } = useLocation();

  // Fecha o menu ao trocar de página.
  useEffect(() => setAberto(false), [pathname, hash]);

  const ehAtivo = (to: string) =>
    to.includes("#") ? pathname === "/" && hash === to.slice(1) : pathname === to;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          className="font-display text-xl font-semibold tracking-tight text-primary"
        >
          Doce <span className="font-light">&amp;</span> Afeto
        </Link>

        {/* Desktop */}
        <ul className="hidden gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className={`font-body text-sm transition-colors hover:text-primary ${
                  ehAtivo(l.to) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile */}
        <button
          type="button"
          onClick={() => setAberto(!aberto)}
          className="text-foreground md:hidden"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
        >
          {aberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {aberto && (
        <div className="border-b border-border bg-background md:hidden">
          <ul className="flex flex-col gap-4 px-4 py-4">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="font-body text-muted-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
