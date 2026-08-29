import { useState } from "react";
import ProductDialog from "@/components/ProductDialog";
import { categorias, produtos, type Categoria, type Produto } from "@/data/produtos";

const Products = () => {
  const [selecionado, setSelecionado] = useState<Produto | null>(null);
  const [filtro, setFiltro] = useState<Categoria>("Todos");

  const visiveis =
    filtro === "Todos" ? produtos : produtos.filter((p) => p.categoria === filtro);

  return (
    <section id="produtos" className="bg-background px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 font-body text-sm uppercase tracking-[0.3em] text-primary">
            Nossos doces
          </p>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Feitos com amor
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-body leading-relaxed text-muted-foreground">
            Escolha um doce para ver os sabores e montar sua encomenda. No final, o pedido
            vai direto pro WhatsApp da Ana.
          </p>
        </div>

        {/* Filtro por categoria */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setFiltro(categoria)}
              aria-pressed={filtro === categoria}
              className={`rounded-full px-4 py-2 font-body text-sm transition-colors ${
                filtro === categoria
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiveis.map((produto) => (
            <button
              key={produto.id}
              type="button"
              onClick={() => setSelecionado(produto)}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-shadow duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={produto.imagens[0]}
                  alt={produto.nome}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                  {produto.nome}
                </h3>
                <p className="flex-1 font-body text-sm leading-relaxed text-muted-foreground">
                  {produto.descricao}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {produto.preco && (
                    <span className="font-body text-sm text-muted-foreground">
                      {produto.preco}
                    </span>
                  )}
                  <span className="font-body text-sm font-semibold text-primary group-hover:underline">
                    Montar pedido
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ProductDialog produto={selecionado} onClose={() => setSelecionado(null)} />
    </section>
  );
};

export default Products;
