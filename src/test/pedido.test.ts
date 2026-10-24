import { describe, expect, it } from "vitest";
import { produtos } from "@/data/produtos";
import {
  OPCOES_ENTREGA,
  camposFaltando,
  linkWhatsapp,
  mensagemPedido,
  mensagemCarrinho,
  type ItemCarrinho,
} from "@/lib/whatsapp";

const bolo = produtos.find((p) => p.id === "bolos")!;
const trufas = produtos.find((p) => p.id === "trufas")!;

describe("mensagem do pedido", () => {
  it("lista as escolhas do cliente", () => {
    const texto = mensagemPedido(bolo, {
      tamanho: "Médio — serve até 20 pessoas",
      sabor: "Red velvet",
      quantidade: 2,
      personalizacao: "Decoração simples",
    });

    expect(texto).toContain("*Bolos*");
    expect(texto).toContain("Sabor: Red velvet");
    expect(texto).toContain("Quantidade: 2 bolos");
  });

  it("usa o singular quando a quantidade é 1", () => {
    const texto = mensagemPedido(bolo, { quantidade: 1 });
    expect(texto).toContain("1 bolo");
    expect(texto).not.toContain("1 bolos");
  });

  it("junta os sabores escolhidos em campos de múltipla escolha", () => {
    const texto = mensagemPedido(trufas, {
      quantidade: 12,
      sabores: ["Maracujá", "Pistache"],
    });
    expect(texto).toContain("Sabores: Maracujá, Pistache");
  });

  it("ignora campos que ficaram em branco", () => {
    const texto = mensagemPedido(bolo, { sabor: "Chocolate", tema: "" });
    expect(texto).not.toContain("Tema");
  });

  it("inclui a forma de recebimento e a observação quando informadas", () => {
    const texto = mensagemPedido(
      bolo,
      { sabor: "Chocolate" },
      {
        formaRecebimento: OPCOES_ENTREGA[0],
        observacao: "Pagar no Pix na entrega, sem açúcar na cobertura",
      }
    );
    expect(texto).toContain(`• Como prefere receber: ${OPCOES_ENTREGA[0]}`);
    expect(texto).toContain("• *Observação:* Pagar no Pix na entrega, sem açúcar na cobertura");
  });

  it("não inclui observação se estiver vazia ou com espaços", () => {
    const texto = mensagemPedido(bolo, { sabor: "Chocolate" }, "   ");
    expect(texto).not.toContain("Observação");
  });
});

describe("mensagem do carrinho (múltiplos itens)", () => {
  it("formata múltiplos itens com suas observações e detalhes", () => {
    const carrinho: ItemCarrinho[] = [
      {
        produto: bolo,
        respostas: {
          tamanho: "Pequeno — serve até 10 pessoas",
          sabor: "Chocolate",
        },
        observacao: "Entregar até as 15h, pagamento via Pix",
      },
      {
        produto: trufas,
        respostas: {
          quantidade: 12,
          sabores: ["Morango", "Maracujá"],
        },
      },
    ];

    const texto = mensagemCarrinho(carrinho, OPCOES_ENTREGA[1]);
    expect(texto).toContain("*1. Bolos*");
    expect(texto).toContain("• Tamanho: Pequeno — serve até 10 pessoas");
    expect(texto).toContain("• *Obs:* Entregar até as 15h, pagamento via Pix");
    expect(texto).toContain("*2. Trufas*");
    expect(texto).toContain("• Quantidade: 12 trufas");
    expect(texto).toContain(`• *Como prefere receber:* ${OPCOES_ENTREGA[1]}`);
  });
});

describe("campos obrigatórios", () => {
  it("aponta o que falta preencher incluindo forma de recebimento", () => {
    expect(camposFaltando(bolo, {}, { formaRecebimento: "" })).toEqual([
      "Tamanho",
      "Sabor",
      "Decoração",
      "Como prefere receber",
    ]);
  });

  it("não aponta nada quando está tudo escolhido", () => {
    const faltando = camposFaltando(
      bolo,
      {
        tamanho: "Pequeno — serve até 10 pessoas",
        sabor: "Chocolate",
        personalizacao: "Decoração simples",
      },
      { formaRecebimento: OPCOES_ENTREGA[0] }
    );
    expect(faltando).toEqual([]);
  });
});

describe("link do whatsapp", () => {
  it("limpa a formatação do número e codifica a mensagem", () => {
    const link = linkWhatsapp("Oi, Ana!", "+55 (11) 91234-5678");
    expect(link).toBe("https://wa.me/5511912345678?text=Oi%2C%20Ana!");
  });
});
