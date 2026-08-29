import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BotaoWhatsappFlutuante from "@/components/BotaoWhatsappFlutuante";
import ScrollParaHash from "@/components/ScrollParaHash";
import Index from "./pages/Index.tsx";
import Produtos from "./pages/Produtos.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollParaHash />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produtos" element={<Produtos />} />
          {/* ADICIONE ROTAS NOVAS ACIMA DA ROTA CORINGA "*" */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BotaoWhatsappFlutuante />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
