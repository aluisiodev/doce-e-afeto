import { Clock, MapPin, Truck } from "lucide-react";
import BotaoWhatsapp from "@/components/BotaoWhatsapp";
import RedesSociais from "@/components/RedesSociais";
import { loja } from "@/config/loja";
import { linkWhatsapp } from "@/lib/whatsapp";

const Contact = () => {
  return (
    <section id="contato" className="bg-background px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 font-body text-sm uppercase tracking-[0.3em] text-primary">
          Encomendas
        </p>
        <h2 className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl">
          Faça seu pedido
        </h2>
        <BotaoWhatsapp
          href={linkWhatsapp(loja.saudacaoWhatsapp)}
          tamanho="lg"
          className="mx-auto w-auto"
        >
          Falar no WhatsApp
        </BotaoWhatsapp>

        <p className="mb-4 mt-10 font-body text-sm text-muted-foreground">
          Nos acompanhe por aqui:
        </p>
        <RedesSociais />

        <div className="mt-12 flex flex-col items-center justify-center gap-4 font-body text-sm text-muted-foreground sm:flex-row sm:gap-8">
          {loja.cidade && (
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {loja.cidade}
            </span>
            )}
            {/**
            {loja.antecedencia && (
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {loja.antecedencia}
            </span>
          )}
            */}
          {loja.entrega && (
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              {loja.entrega}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
