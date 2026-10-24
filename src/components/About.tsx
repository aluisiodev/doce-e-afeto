import { Heart } from "lucide-react";
import { loja } from "@/config/loja";

/** 
 * {" "} <span className="font-medium text-foreground">{loja.confeiteira}</span>.
*/ 
          

const About = () => {
  return (
    <section id="sobre" className="scroll-mt-16 bg-secondary px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Heart className="mx-auto mb-6 h-10 w-10 fill-primary/20 text-primary" />
        <h2 className="mb-8 font-display text-4xl font-bold text-foreground md:text-5xl">
          Por trás da Doce & Afeto
        </h2>
        <p className="mb-6 font-body text-lg leading-relaxed text-muted-foreground">
          À frente da confeitaria está {" "} <span className="font-medium text-foreground">{loja.confeiteira}</span>,
           quem criou a <span className="font-medium text-primary">{loja.nome}</span> com o propósito de ajudar as pessoas a
           demonstrarem afeto nas pequenas coisas: em um presente, em uma mesa preparada com carinho, em um bolo escolhido pensando
           em alguém ou em um doce compartilhado.
          Por meio de bolos, doces e lembrancinhas, a Doce & Afeto transforma sentimentos em gestos concretos de carinho,
           criando oportunidades para celebrar, presentear e compartilhar momentos especiais.

        </p>
        <p className="font-body text-lg leading-relaxed text-muted-foreground">
          Bolos, doces e lembrancinhas para demonstrar afeto, celebrar conquistas e tornar momentos especiais ainda mais marcantes. 💛
        </p>
      </div>
    </section>
  );
};

export default About;
