import Navbar from "@/components/Navbar";
import Products from "@/components/Products";
import Footer from "@/components/Footer";

const Produtos = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Products />
      </main>
      <Footer />
    </div>
  );
};

export default Produtos;
