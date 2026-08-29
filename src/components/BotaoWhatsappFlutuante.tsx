import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { loja } from "@/config/loja";
import { linkWhatsapp } from "@/lib/whatsapp";

/** Botão fixo no canto da tela, presente em todas as páginas. */
const BotaoWhatsappFlutuante = () => (
  <a
    href={linkWhatsapp(loja.saudacaoWhatsapp)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar com a Ana no WhatsApp"
    className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-105 hover:bg-whatsapp-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 motion-reduce:transition-none"
  >
    <WhatsAppIcon className="h-7 w-7" />
  </a>
);

export default BotaoWhatsappFlutuante;
