import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-sweets.jpg";
import BotaoWhatsapp from "@/components/BotaoWhatsapp";
import { loja } from "@/config/loja";
import { linkWhatsapp } from "@/lib/whatsapp";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Mesa com doces artesanais da Doce & Afeto"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl animate-fade-in-up px-4 text-center motion-reduce:animate-none">
        <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-primary-foreground/80">
          Confeitaria artesanal
        </p>
        <h1 className="mb-6 font-display text-5xl font-semibold leading-tight tracking-tight text-primary-foreground md:text-7xl lg:text-8xl">
          Doce <span className="mx-1 font-light">&amp;</span> Afeto
        </h1>
        <p className="mx-auto mb-10 max-w-xl font-body text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
          Bolos, trufas e docinhos feitos à mão pela {loja.confeiteira}. Escolha o seu, monte
          o pedido e finalize no WhatsApp.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/produtos"
            className="inline-block rounded-lg bg-primary px-8 py-4 font-body text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Ver cardápio
          </Link>
          <BotaoWhatsapp
            href={linkWhatsapp(loja.saudacaoWhatsapp)}
            tamanho="lg"
            className="w-auto uppercase"
          >
            Encomendar
          </BotaoWhatsapp>
        </div>
      </div>
    </section>
  );
};

export default Hero;
