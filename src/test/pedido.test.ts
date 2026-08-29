import { describe, expect, it } from "vitest";
import { produtos } from "@/data/produtos";
import { camposFaltando, linkWhatsapp, mensagemPedido } from "@/lib/whatsapp";

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
});

describe("campos obrigatórios", () => {
  it("aponta o que falta preencher", () => {
    expect(camposFaltando(bolo, {})).toEqual(["Tamanho", "Sabor", "Decoração"]);
  });

  it("não aponta nada quando está tudo escolhido", () => {
    const faltando = camposFaltando(bolo, {
      tamanho: "Pequeno — serve até 10 pessoas",
      sabor: "Chocolate",
      personalizacao: "Decoração simples",
    });
    expect(faltando).toEqual([]);
  });
});

describe("link do whatsapp", () => {
  it("limpa a formatação do número e codifica a mensagem", () => {
    const link = linkWhatsapp("Oi, Ana!", "+55 (11) 91234-5678");
    expect(link).toBe("https://wa.me/5511915068813?text=Oi%2C%20Ana!");
  });
});
