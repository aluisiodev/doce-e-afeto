import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BotaoWhatsapp from "@/components/BotaoWhatsapp";
import { loja } from "@/config/loja";
import type { Campo, Produto } from "@/data/produtos";
import {
  camposFaltando,
  linkWhatsapp,
  mensagemPedido,
  type Respostas,
} from "@/lib/whatsapp";

interface ProductDialogProps {
  produto: Produto | null;
  onClose: () => void;
}

function respostasIniciais(produto: Produto): Respostas {
  const iniciais: Respostas = {};
  for (const campo of produto.campos) {
    if (campo.tipo === "quantidade") {
      iniciais[campo.id] = campo.padrao ?? campo.min;
    } else if (campo.tipo === "multi") {
      iniciais[campo.id] = [];
    } else {
      iniciais[campo.id] = "";
    }
  }
  return iniciais;
}

const ProductDialog = ({ produto, onClose }: ProductDialogProps) => {
  const [respostas, setRespostas] = useState<Respostas>({});
  const [imagemAtual, setImagemAtual] = useState(0);

  useEffect(() => {
    if (produto) {
      setRespostas(respostasIniciais(produto));
      setImagemAtual(0);
    }
  }, [produto]);

  const faltando = useMemo(
    () => (produto ? camposFaltando(produto, respostas) : []),
    [produto, respostas],
  );

  if (!produto) return null;

  const definir = (id: string, valor: Respostas[string]) =>
    setRespostas((atual) => ({ ...atual, [id]: valor }));

  const alternarMulti = (campo: Extract<Campo, { tipo: "multi" }>, opcao: string) => {
    const atuais = (respostas[campo.id] as string[]) ?? [];
    const jaTem = atuais.includes(opcao);
    if (!jaTem && campo.max && atuais.length >= campo.max) return;
    definir(campo.id, jaTem ? atuais.filter((o) => o !== opcao) : [...atuais, opcao]);
  };

  const totalImagens = produto.imagens.length;
  const anterior = () => setImagemAtual((i) => (i - 1 + totalImagens) % totalImagens);
  const proxima = () => setImagemAtual((i) => (i + 1) % totalImagens);

  const pronto = faltando.length === 0;
  const link = linkWhatsapp(mensagemPedido(produto, respostas));

  return (
    <Dialog open onOpenChange={(aberto) => !aberto && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl">{produto.nome}</DialogTitle>
          <DialogDescription>
            {produto.descricaoLonga ?? produto.descricao}
          </DialogDescription>
        </DialogHeader>

        {/* Galeria */}
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            <img
              src={produto.imagens[imagemAtual]}
              alt={`${produto.nome} — foto ${imagemAtual + 1} de ${totalImagens}`}
              className="h-full w-full object-cover"
            />
          </div>

          {totalImagens > 1 && (
            <>
              <button
                type="button"
                onClick={anterior}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/85 p-2 shadow transition-colors hover:bg-background"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={proxima}
                aria-label="Próxima foto"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/85 p-2 shadow transition-colors hover:bg-background"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="mt-3 flex justify-center gap-2">
                {produto.imagens.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImagemAtual(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === imagemAtual ? "w-5 bg-primary" : "w-2 bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {produto.preco && (
          <p className="font-body text-sm text-muted-foreground">
            Valor <span className="font-semibold text-foreground">{produto.preco}</span>. O
            preço final depende do tamanho e da decoração — a Ana confirma tudo no WhatsApp.
          </p>
        )}

        {/* Opções */}
        <div className="grid gap-5">
          {produto.campos.map((campo) => {
            const idCampo = `campo-${produto.id}-${campo.id}`;

            if (campo.tipo === "quantidade") {
              const valor = Number(respostas[campo.id] ?? campo.min);
              const passo = campo.passo ?? 1;
              return (
                <div key={campo.id} className="grid gap-2">
                  <Label htmlFor={idCampo}>{campo.rotulo}</Label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => definir(campo.id, Math.max(campo.min, valor - passo))}
                      disabled={valor <= campo.min}
                      aria-label="Diminuir quantidade"
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-input transition-colors hover:bg-muted disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <output
                      id={idCampo}
                      className="min-w-[7rem] text-center font-body font-semibold"
                    >
                      {valor} {valor === 1 ? campo.unidade[0] : campo.unidade[1]}
                    </output>
                    <button
                      type="button"
                      onClick={() => definir(campo.id, Math.min(campo.max, valor + passo))}
                      disabled={valor >= campo.max}
                      aria-label="Aumentar quantidade"
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-input transition-colors hover:bg-muted disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            }

            if (campo.tipo === "select") {
              return (
                <div key={campo.id} className="grid gap-2">
                  <Label htmlFor={idCampo}>
                    {campo.rotulo}
                    {campo.obrigatorio && <span className="ml-1 text-primary">*</span>}
                  </Label>
                  <Select
                    value={(respostas[campo.id] as string) || undefined}
                    onValueChange={(v) => definir(campo.id, v)}
                  >
                    <SelectTrigger id={idCampo}>
                      <SelectValue placeholder={campo.placeholder ?? "Selecione"} />
                    </SelectTrigger>
                    <SelectContent>
                      {campo.opcoes.map((opcao) => (
                        <SelectItem key={opcao} value={opcao}>
                          {opcao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {campo.ajuda && (
                    <p className="font-body text-xs text-muted-foreground">{campo.ajuda}</p>
                  )}
                </div>
              );
            }

            if (campo.tipo === "multi") {
              const marcados = (respostas[campo.id] as string[]) ?? [];
              const noLimite = campo.max ? marcados.length >= campo.max : false;
              return (
                <fieldset key={campo.id} className="grid gap-2">
                  <legend className="mb-2 font-body text-sm font-medium leading-none">
                    {campo.rotulo}
                    {campo.obrigatorio && <span className="ml-1 text-primary">*</span>}
                  </legend>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {campo.opcoes.map((opcao) => {
                      const marcado = marcados.includes(opcao);
                      const idOpcao = `${idCampo}-${opcao}`;
                      return (
                        <div key={opcao} className="flex items-center gap-2.5">
                          <Checkbox
                            id={idOpcao}
                            checked={marcado}
                            disabled={!marcado && noLimite}
                            onCheckedChange={() => alternarMulti(campo, opcao)}
                          />
                          <Label
                            htmlFor={idOpcao}
                            className={`cursor-pointer font-normal ${
                              !marcado && noLimite ? "text-muted-foreground/50" : ""
                            }`}
                          >
                            {opcao}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                  {campo.ajuda && (
                    <p className="font-body text-xs text-muted-foreground">
                      {campo.ajuda}
                      {campo.max && ` (${marcados.length}/${campo.max})`}
                    </p>
                  )}
                </fieldset>
              );
            }

            return (
              <div key={campo.id} className="grid gap-2">
                <Label htmlFor={idCampo}>
                  {campo.rotulo}
                  {campo.obrigatorio && <span className="ml-1 text-primary">*</span>}
                </Label>
                <Input
                  id={idCampo}
                  value={(respostas[campo.id] as string) ?? ""}
                  placeholder={campo.placeholder}
                  onChange={(e) => definir(campo.id, e.target.value)}
                />
                {campo.ajuda && (
                  <p className="font-body text-xs text-muted-foreground">{campo.ajuda}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Ação */}
        <div className="sticky bottom-0 -mx-6 mt-1 border-t border-border bg-background px-6 pb-1 pt-4">
          <BotaoWhatsapp href={link} desabilitado={!pronto} tamanho="lg">
            Encomendar
          </BotaoWhatsapp>
          <p className="mt-3 text-center font-body text-xs text-muted-foreground">
            {pronto
              ? "Abre o WhatsApp da Ana com o seu pedido já escrito. Nada é cobrado agora."
              : `Falta escolher: ${faltando.join(", ")}.`}
          </p>
          {loja.antecedencia && (
            <p className="mt-1 text-center font-body text-xs text-muted-foreground/80">
              {loja.antecedencia}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
