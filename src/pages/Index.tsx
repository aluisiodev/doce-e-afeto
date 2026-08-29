import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Destaques from "@/components/Destaques";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Destaques />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
