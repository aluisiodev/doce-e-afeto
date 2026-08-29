import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import RedesSociais from "@/components/RedesSociais";
import { loja } from "@/config/loja";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <Link to="/" className="font-display text-lg font-semibold text-primary">
          Doce <span className="font-light">&amp;</span> Afeto
        </Link>

        <nav className="flex flex-wrap justify-center gap-6 font-body text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">
            Início
          </Link>
          <Link to="/produtos" className="transition-colors hover:text-primary">
            Produtos
          </Link>
          <Link to="/#sobre" className="transition-colors hover:text-primary">
            Sobre
          </Link>
          <Link to="/#contato" className="transition-colors hover:text-primary">
            Contato
          </Link>
        </nav>

        <RedesSociais variante="icones" />

        <p className="flex items-center justify-center gap-1 font-body text-sm text-muted-foreground">
          © {new Date().getFullYear()} {loja.nome} — feito com
          <Heart className="h-4 w-4 fill-primary text-primary" />e muito açúcar
        </p>
      </div>
    </footer>
  );
};

export default Footer;
