import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { produtos } from "@/data/produtos";

/** Prévia de 3 produtos na home, levando para o cardápio completo. */
const Destaques = () => {
  const amostra = produtos.slice(0, 3);

  return (
    <section className="bg-background px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 font-body text-sm uppercase tracking-[0.3em] text-primary">
            Cardápio
          </p>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            O que sai da cozinha
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {amostra.map((produto) => (
            <Link
              key={produto.id}
              to="/produtos"
              className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={produto.imagens[0]}
                  alt={produto.nome}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-1 font-display text-lg font-semibold text-foreground">
                  {produto.nome}
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {produto.descricao}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 font-body font-semibold text-primary hover:underline"
          >
            Ver o cardápio completo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Destaques;
