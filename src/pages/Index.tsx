import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Process from "@/components/Process";
import Gallery from "@/components/Gallery";
import Formations from "@/components/Formations";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <About />
      <Process />
      <Gallery />
      <Formations />
      <Team />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Contact />
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Index;
