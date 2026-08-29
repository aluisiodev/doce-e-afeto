import { Instagram, Mail, UtensilsCrossed } from "lucide-react";
import TikTokIcon from "@/components/icons/TikTokIcon";
import { cn } from "@/lib/utils";
import { loja } from "@/config/loja";

type Rede = {
  nome: string;
  href: string;
  Icone: React.ComponentType<{ className?: string }>;
};

/** Monta a lista só com as redes preenchidas em `src/config/loja.ts`. */
function redesAtivas(): Rede[] {
  const lista: Rede[] = [];
  if (loja.redes.instagram)
    lista.push({ nome: "Instagram", href: loja.redes.instagram, Icone: Instagram });
  if (loja.redes.tiktok)
    lista.push({ nome: "TikTok", href: loja.redes.tiktok, Icone: TikTokIcon });
  if (loja.redes.ifood)
    lista.push({ nome: "iFood", href: loja.redes.ifood, Icone: UtensilsCrossed });
  if (loja.email)
    lista.push({ nome: "E-mail", href: `mailto:${loja.email}`, Icone: Mail });
  return lista;
}

interface RedesSociaisProps {
  variante?: "botoes" | "icones";
  className?: string;
}

const RedesSociais = ({ variante = "botoes", className }: RedesSociaisProps) => {
  const redes = redesAtivas();
  if (redes.length === 0) return null;

  if (variante === "icones") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        {redes.map(({ nome, href, Icone }) => (
          <a
            key={nome}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={nome}
            title={nome}
            className="rounded-full border border-border p-2.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Icone className="h-4 w-4" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap justify-center gap-3", className)}>
      {redes.map(({ nome, href, Icone }) => (
        <a
          key={nome}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 rounded-lg border border-border bg-secondary px-6 py-3 font-body font-semibold text-secondary-foreground transition-colors hover:bg-muted"
        >
          <Icone className="h-5 w-5" />
          {nome}
        </a>
      ))}
    </div>
  );
};

export default RedesSociais;
