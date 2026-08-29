import { Heart } from "lucide-react";
import { loja } from "@/config/loja";

/**
 * TROQUE ESTE TEXTO pela história real da Ana — é o que faz o site
 * parecer dela e não um modelo pronto.
 */
const About = () => {
  return (
    <section id="sobre" className="scroll-mt-16 bg-secondary px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Heart className="mx-auto mb-6 h-10 w-10 fill-primary/20 text-primary" />
        <h2 className="mb-8 font-display text-4xl font-bold text-foreground md:text-5xl">
          Quem faz
        </h2>
        <p className="mb-6 font-body text-lg leading-relaxed text-muted-foreground">
          A <span className="font-medium text-primary">{loja.nome}</span> é a confeitaria da{" "}
          <span className="font-medium text-foreground">{loja.confeiteira}</span>. Cada
          receita sai da cozinha dela, feita à mão, com ingrediente bom e sem pressa.
        </p>
        <p className="font-body text-lg leading-relaxed text-muted-foreground">
          Aniversário, casamento, chá de bebê, formatura ou só aquela vontade de doce no meio
          da semana: é só chamar no WhatsApp que ela monta a encomenda junto com você.
        </p>
      </div>
    </section>
  );
};

export default About;
