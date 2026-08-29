import { cn } from "@/lib/utils";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface BotaoWhatsappProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Quando true, o botão fica apagado e não abre o link. */
  desabilitado?: boolean;
  tamanho?: "md" | "lg";
}

/**
 * Botão verde padrão do WhatsApp. Sempre abre em uma aba nova.
 */
const BotaoWhatsapp = ({
  href,
  children,
  className,
  desabilitado = false,
  tamanho = "md",
}: BotaoWhatsappProps) => {
  const base = cn(
    "inline-flex w-full items-center justify-center gap-2.5 rounded-lg font-body font-bold tracking-wide text-white shadow-sm transition-all",
    "bg-whatsapp hover:bg-whatsapp-dark active:scale-[0.99]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    tamanho === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm",
    desabilitado && "pointer-events-none cursor-not-allowed opacity-45 shadow-none",
    className,
  );

  if (desabilitado) {
    return (
      <span className={base} aria-disabled="true">
        <WhatsAppIcon className="h-5 w-5 shrink-0" />
        {children}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      {children}
    </a>
  );
};

export default BotaoWhatsapp;
